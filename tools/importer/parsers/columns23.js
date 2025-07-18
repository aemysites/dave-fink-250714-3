/* global WebImporter */
export default function parse(element, { document }) {
  // Get immediate children: left and right column wrappers
  const children = element.querySelectorAll(':scope > div');
  // Defensive: ensure exactly two columns for columns23
  const left = children[0] || document.createElement('div');
  const right = children[1] || document.createElement('div');

  // Header row should be a single cell/column
  const headerRow = ['Columns (columns23)'];
  // Content row should match the number of columns: two columns for columns23
  const contentRow = [left, right];
  
  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
