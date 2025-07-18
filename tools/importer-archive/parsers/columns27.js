/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, single cell
  const headerRow = ['Columns (columns27)'];

  // Extract columns as before
  const items = Array.from(element.querySelectorAll(':scope > .item'));
  let firstCell = null;
  let secondCell = null;

  if (items.length >= 2) {
    // First column: image in first item
    const pic = items[0].querySelector('.pic');
    const img = pic ? pic.querySelector('img') : null;
    if (img) firstCell = img;
    // Second column: text in second item
    const p = items[1].querySelector('p');
    if (p) {
      secondCell = p;
    } else {
      secondCell = items[1];
    }
  } else {
    if (items[0]) firstCell = items[0];
    if (items[1]) secondCell = items[1];
  }

  // Ensure both columns are present
  const columnsRow = [];
  if (firstCell) columnsRow.push(firstCell);
  if (secondCell) columnsRow.push(secondCell);

  // Final table: first row is 1 cell, second row is 2 cells
  const cells = [headerRow, columnsRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
