/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: exactly as specified
  const headerRow = ['Cards (cards46)'];

  // Get all card items (each .field__item containing a resource card)
  const items = Array.from(element.querySelectorAll('.field__item')).filter(item => item.querySelector('article'));
  const rows = [];

  items.forEach((item) => {
    const article = item.querySelector('article');

    // --- Image cell ---
    // Use the entire .left-image div for maximum flexibility
    let imageCell = '';
    const leftImage = article.querySelector('.left-image');
    if (leftImage) imageCell = leftImage;

    // --- Text cell ---
    // Gather all text: .right-text (title, description, etc.) and the download button (.download-wrapper),
    // to ensure all text and CTA content is present, in correct order.
    const textCellParts = [];
    // 1. Right text content (title, description)
    const rightText = article.querySelector('.right-text');
    if (rightText) textCellParts.push(rightText);
    // 2. Download button (CTA)
    const downloadWrapper = article.querySelector('.download-wrapper');
    if (downloadWrapper) textCellParts.push(downloadWrapper);
    // Edge case: fallback to any remaining text content if neither present
    if (!rightText && !downloadWrapper) {
      // Use all non-image content in .node__content
      const nodeContent = article.querySelector('.node__content');
      if (nodeContent) textCellParts.push(nodeContent);
      else textCellParts.push(article);
    }

    rows.push([imageCell, textCellParts]);
  });

  // Create the table: header row plus one row per card
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  element.replaceWith(table);
}
