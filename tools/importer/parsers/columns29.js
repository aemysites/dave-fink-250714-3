/* global WebImporter */
export default function parse(element, { document }) {
  // Header must match example exactly
  const headerRow = ['Columns (columns29)'];

  // Get all immediate child columns
  const columnEls = Array.from(element.querySelectorAll(':scope > .item'));

  // Compose the second row with each column's direct main content
  // In this HTML, column 1: img; column 2: paragraph.
  // Reference the actual child element, not clone
  const cellsRow = columnEls.map((col) => {
    // Find the first element child (img or p)
    let firstEl = null;
    for (const node of col.childNodes) {
      if (node.nodeType === 1) { // element node
        firstEl = node;
        break;
      }
    }
    // If no element node, fallback to text content if present
    if (firstEl) {
      return firstEl;
    }
    const textContent = col.textContent.trim();
    if (textContent) {
      return document.createTextNode(textContent);
    }
    // Empty cell fallback
    return '';
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cellsRow
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
