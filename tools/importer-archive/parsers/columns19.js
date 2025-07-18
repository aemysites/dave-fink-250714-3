/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row: one cell containing the block name
  const headerRow = ['Columns (columns19)'];

  // Gather all <li> children directly under the input element
  const listItems = Array.from(element.querySelectorAll(':scope > li'));

  // Edge case: if there are no <li> children, output an empty row
  if (listItems.length === 0) {
    const cells = [headerRow, ['']];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
    return;
  }

  // Create two <ul> columns as evenly as possible
  const mid = Math.ceil(listItems.length / 2);
  const leftUl = document.createElement('ul');
  const rightUl = document.createElement('ul');
  listItems.forEach((li, i) => {
    if (i < mid) {
      leftUl.appendChild(li);
    } else {
      rightUl.appendChild(li);
    }
  });

  // Create the cells array: header is a single-cell array, content row is an array of two columns
  const cells = [
    headerRow,
    [leftUl, rightUl]
  ];

  // Create and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
