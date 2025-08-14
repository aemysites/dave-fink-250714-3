/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be exactly one cell, and the body row must have two cells as per the example
  // Header row: single column
  const headerRow = ['Columns (columns43)'];

  // Get immediate child divs of the block for the two columns
  const columns = element.querySelectorAll(':scope > div');
  // Defensive: always provide two cells, even if one is missing
  const leftCol = columns[0] || document.createElement('div');
  const rightCol = columns[1] || document.createElement('div');
  const bodyRow = [leftCol, rightCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    bodyRow
  ], document);

  // Replace the original block
  element.replaceWith(table);
}
