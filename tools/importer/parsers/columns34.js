/* global WebImporter */
export default function parse(element, { document }) {
  // Gather all direct helpful-group-item children
  const items = Array.from(element.querySelectorAll(':scope > .helpful-group-item'));
  if (!items.length) return;

  // The header row is a single cell: ['Columns (columns34)']
  const headerRow = ['Columns (columns34)'];

  // Each cell in the next row is one column
  const contentRow = items.map(item => {
    const left = item.querySelector(':scope > .left-image, :scope > .left-image.large');
    const right = item.querySelector(':scope > .right-text');
    const wrapper = document.createElement('div');
    if (left) wrapper.appendChild(left);
    if (right) wrapper.appendChild(right);
    return wrapper;
  });

  // The table should have the header row (1 column), and then a row with N columns (as per requirements and markdown example)
  const tableRows = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
