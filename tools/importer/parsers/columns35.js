/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure the header row matches the requirement - single cell, block name, exactly as in the sample
  const headerRow = ['Columns (columns35)'];

  // Get left and right columns
  const left = element.querySelector('.left-wrap');
  const right = element.querySelector('.right-wrap');

  // Defensive: fallback to empty divs if missing
  const leftContent = left || document.createElement('div');
  let rightImg = null;
  if(right) {
    rightImg = right.querySelector('img.pc') || right.querySelector('img');
  }
  const rightContent = rightImg || document.createElement('div');

  // Table structure: first row header, second row as many columns as needed (here: two)
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
