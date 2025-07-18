/* global WebImporter */
export default function parse(element, { document }) {
  // Find all direct helpful-group-item children (each is a column)
  const items = Array.from(element.querySelectorAll(':scope > .helpful-group-item'));
  if (!items.length) return;

  // Build a single row with each column's content
  const columnsRow = items.map((item) => {
    // Reference (do not clone) both left-image and right-text
    const left = item.querySelector(':scope > .left-image');
    const right = item.querySelector(':scope > .right-text');
    const wrapper = document.createElement('div');
    if (left) wrapper.append(left);
    if (right) wrapper.append(right);
    return wrapper.childNodes.length === 1 ? wrapper.firstChild : wrapper;
  });

  // Build the table rows: header is one column, second row is all columns
  const rows = [];
  rows.push(['Columns (columns35)']); // Header row: one cell only, per spec
  rows.push(columnsRow); // Second row: one cell per column

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
