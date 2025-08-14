/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure robust extraction of left/right columns
  const columns = element.querySelectorAll(':scope > div');
  // Prepare header row exactly as required
  const headerRow = ['Columns (columns23)'];
  let cells;
  if (columns.length === 2) {
    // The left and right div contain all presentational content. Reference them directly.
    cells = [
      headerRow,
      [columns[0], columns[1]],
    ];
  } else {
    // Edge case: fallback to reference the whole element in a single cell
    cells = [headerRow, [element]];
  }
  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
