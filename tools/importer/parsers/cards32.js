/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example exactly
  const rows = [['Cards (cards32)']];

  // Each card: .paragraph--type--video-item
  const cards = Array.from(element.querySelectorAll('.paragraph--type--video-item'));

  cards.forEach(card => {
    // Get the image
    let image = card.querySelector('img');

    // Collect all required text content
    let textCell = [];
    // Title (strong)
    const title = card.querySelector('.field--name-field-video-title');
    if (title && title.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textCell.push(strong);
    }
    // Description (preserve paragraphs/markup)
    const desc = card.querySelector('.field--name-field-video-description');
    if (desc) {
      // Take all block-level children, or fallback to text
      if (desc.children.length > 0) {
        // If multiple paragraphs, add all
        for (const child of desc.children) {
          textCell.push(child);
        }
      } else if (desc.textContent.trim()) {
        // Fallback to textContent
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
    }
    // Only add if image and some text content
    if (image && textCell.length > 0) {
      rows.push([image, textCell]);
    }
  });

  // Only replace if we have at least one card row
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
