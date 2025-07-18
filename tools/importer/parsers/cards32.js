/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example
  const headerRow = ['Cards (cards32)'];
  const rows = [headerRow];

  // Find all card nodes (video-item)
  // Be robust: search for all .paragraph--type--video-item elements in the subtree
  const cardNodes = Array.from(element.querySelectorAll('.paragraph--type--video-item'));
  if (!cardNodes.length) return;

  cardNodes.forEach((card) => {
    // Find the first <img> inside a .list-video-preview (the poster/preview image)
    let img = null;
    const previewImgs = Array.from(card.querySelectorAll('.list-video-preview img'));
    if (previewImgs.length > 0) {
      img = previewImgs[0];
    }

    // Gather text content: title and description blocks, in order, as elements
    // Only include those not inside image/preview or video player
    const textBlocks = [];
    const allFieldItems = Array.from(card.querySelectorAll('.field__item'));
    allFieldItems.forEach((item) => {
      // Exclude if inside .list-video-preview or .moa-video-wrap
      if (item.closest('.list-video-preview') || item.closest('.moa-video-wrap')) return;
      // Retain semantic structure by referencing the original element
      textBlocks.push(item);
    });

    if (img && textBlocks.length > 0) {
      rows.push([img, textBlocks]);
    }
  });

  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
