/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two-columns block
  const twoCol = element.querySelector('.two-columns-images-right');
  if (!twoCol) return;

  // Identify left and right columns
  let leftCol = twoCol.querySelector('.left-text');
  let rightCol = twoCol.querySelector('.right-image');

  // If missing, still output null (cell will be empty)
  const headerRow = ['Columns (columns47)']; // header row is always a single cell
  const contentRow = [leftCol, rightCol];    // second row: two cells (columns)

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
