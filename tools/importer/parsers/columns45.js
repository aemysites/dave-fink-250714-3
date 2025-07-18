/* global WebImporter */
export default function parse(element, { document }) {
  // Find the rich text wrapper for flexibility
  const formatted = element.querySelector('.text-formatted') || element;

  // Find the two-column structure
  const twoCol = formatted.querySelector('.two-columns-images-right') || formatted;

  // Get direct children of the two-column wrapper
  let colDivs = twoCol.querySelectorAll(':scope > div');

  // If classes are present, assign columns by class
  let leftCol = null;
  let rightCol = null;
  for (const div of colDivs) {
    if (div.classList.contains('left-text')) leftCol = div;
    else if (div.classList.contains('right-image')) rightCol = div;
  }
  // If not found by class, fallback to first and second
  if (!leftCol) leftCol = colDivs[0];
  if (!rightCol) rightCol = colDivs[1];

  // Defensive: If not both columns present, don't proceed
  if (!leftCol || !rightCol) return;

  // Build the table: header is one cell, second row has both columns
  const cells = [
    ['Columns (columns45)'],
    [leftCol, rightCol],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
