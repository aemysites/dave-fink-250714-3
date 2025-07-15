/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match spec exactly
  const headerRow = ['Columns (columns11)'];

  // Get the direct children of the element: these are the columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  
  // Defensive: Ensure there are at least two columns for a two-column layout
  if (columns.length < 2) return;

  // For each column, we reference the existing element as the cell
  const tableRow = [columns[0], columns[1]];

  // Create the block table as specified
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    tableRow
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
