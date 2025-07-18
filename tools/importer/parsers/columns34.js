/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main tips-support block, which should have two columns
  const tipsSupport = element.querySelector('.tips-support');
  if (!tipsSupport) return;
  const leftCol = tipsSupport.querySelector('.left-text');
  const rightCol = tipsSupport.querySelector('.right-resource');
  if (!leftCol || !rightCol) return;

  // Table header, as specified by block name in requirements
  const headerRow = ['Columns (columns34)'];
  // Table content row: two columns, referencing existing column content elements
  const row = [leftCol, rightCol];
  const cells = [headerRow, row];

  // Create block table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
