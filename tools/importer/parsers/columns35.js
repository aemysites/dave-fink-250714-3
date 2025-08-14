/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Columns (columns35)'];

  // Get all helpful-group-item children (each column)
  const items = Array.from(element.querySelectorAll(':scope > .helpful-group-item'));

  // Defensive: If there are no items, do nothing
  if (!items.length) return;

  // Compose each column cell
  const firstContentRow = items.map(item => {
    const cellParts = [];
    // Get image from left-image div
    const leftImageDiv = item.querySelector('.left-image');
    if (leftImageDiv) {
      const img = leftImageDiv.querySelector('img');
      if (img) cellParts.push(img);
    }
    // Get all right-text content
    const rightTextDiv = item.querySelector('.right-text');
    if (rightTextDiv) {
      // Reference each child element (usually <p>, <span>, <a>) in order
      Array.from(rightTextDiv.children).forEach(child => {
        cellParts.push(child);
      });
    }
    return cellParts;
  });

  // Assemble the table and replace element
  const cells = [headerRow, firstContentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
