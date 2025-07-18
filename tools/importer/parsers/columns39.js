/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns wrapper; start at the provided element
  const columnsNav = element.querySelector('.two-columns-nav');
  if (!columnsNav) return;
  // Get the direct column children
  const columnElements = Array.from(columnsNav.children);
  // Defensive: skip if no columns found
  if (!columnElements.length) return;
  // Header row from requirements and example
  const headerRow = ['Columns (columns39)'];
  // Second row: each column is a cell
  const columnsRow = columnElements;
  // Create the table using the provided helper
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);
  // Replace the original element with the table
  element.replaceWith(table);
}
