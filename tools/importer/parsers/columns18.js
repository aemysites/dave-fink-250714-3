/* global WebImporter */
export default function parse(element, { document }) {
  // Always create a single-cell header row
  const headerRow = ['Columns (columns18)'];

  // Extract all top-level list items
  const lis = Array.from(element.querySelectorAll(':scope > li'));

  // Edge case: no list items, place element as is in a single column
  if (lis.length === 0) {
    const block = WebImporter.DOMUtils.createTable([
      headerRow,
      [element],
    ], document);
    element.replaceWith(block);
    return;
  }

  // For columns block: split list items into two columns as evenly as possible
  const numCols = 2;
  const itemsPerCol = Math.ceil(lis.length / numCols);
  const columns = [];
  for (let i = 0; i < numCols; i++) {
    const ul = document.createElement('ul');
    lis.slice(i * itemsPerCol, (i + 1) * itemsPerCol).forEach(li => ul.appendChild(li));
    columns.push(ul);
  }

  // Proper two-dimensional array: header is single cell, next row contains columns
  const cells = [
    headerRow, // Header row: one cell
    columns    // Second row: N columns (as per columns block spec)
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
