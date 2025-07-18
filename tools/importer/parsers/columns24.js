/* global WebImporter */
export default function parse(element, { document }) {
  // Find the left and right column containers
  const left = element.querySelector('.l');
  const right = element.querySelector('.r');

  // Defensive: if left/right not found, substitute an empty div
  const leftCell = left || document.createElement('div');
  const rightCell = right || document.createElement('div');

  // Build the table structure:
  // Header row: one column with the block name
  // Data row: two columns with left and right content
  const cells = [
    ['Columns (columns24)'], // header row: one cell only
    [leftCell, rightCell]    // content row: two cells
  ];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
