/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the two columns container
  const twoColumns = element.querySelector('.two-columns-nav');
  if (!twoColumns) return;

  // Get column elements: should be direct children, left and right
  const columns = Array.from(twoColumns.children);
  if (columns.length < 2) return; // Defensive: need at least two columns

  const leftCol = columns[0];
  const rightCol = columns[1];

  // Table header must match exactly as in the spec
  const headerRow = ['Columns (columns39)'];
  // Columns row: reference the actual column elements (not clones)
  const columnsRow = [leftCol, rightCol];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
