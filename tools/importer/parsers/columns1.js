/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two-columns-nav container
  const twoCols = element.querySelector('.two-columns-nav');
  if (!twoCols) return;

  // Get the left and right column content
  const left = twoCols.querySelector('.left-text') || document.createTextNode('');
  const right = twoCols.querySelector('.anchor-links') || document.createTextNode('');

  // The header row must have exactly one column (one cell)
  const headerRow = ['Columns (columns1)'];
  const colsRow = [left, right];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    colsRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
