/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content for the columns
  const footerContent = element.querySelector('.footer-content');
  if (!footerContent) return;
  // Look for possible columns
  const left = footerContent.querySelector('.footer-left');
  const right = footerContent.querySelector('.footer-right');

  // Defensive - if both columns missing, do nothing
  if (!left && !right) return;

  // Prepare header row: exactly one cell
  const headerRow = ['Columns (columns7)'];
  // Prepare columns row: two cells
  const columnsRow = [left || '', right || ''];

  // Compose cells: headerRow (1 col), columnsRow (2 cols)
  const cells = [
    headerRow,
    columnsRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
