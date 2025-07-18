/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column container
  const twoCols = element.querySelector('.two-columns-nav');
  // Default left and right columns as empty divs
  let leftCol = document.createElement('div');
  let rightCol = document.createElement('div');

  if (twoCols) {
    // Attempt to find the left and right columns
    const left = twoCols.querySelector('.left-text');
    const right = twoCols.querySelector('.anchor-links');
    if (left) leftCol = left;
    if (right) rightCol = right;
  }

  // Fallback: If structure is different, use the first two child divs
  if ((!leftCol || !rightCol) || (leftCol.childNodes.length === 0 && rightCol.childNodes.length === 0)) {
    const divs = (twoCols || element).querySelectorAll(':scope > div');
    if (divs.length >= 2) {
      leftCol = divs[0];
      rightCol = divs[1];
    }
  }

  // Compose the table cells
  const headerRow = ['Columns (columns6)'];
  const columnsRow = [leftCol, rightCol];
  const cells = [headerRow, columnsRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
