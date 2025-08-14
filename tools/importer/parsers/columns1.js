/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns1)'];

  // Find the columns container
  const columnsContainer = element.querySelector('.two-columns-nav');
  if (!columnsContainer) {
    // fallback: use the whole element as a single column
    const cells = [headerRow, [element]];
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
    return;
  }

  // Get all direct children (the columns)
  const columns = Array.from(columnsContainer.children);

  // Defensive: If columns are missing, fill with empty divs
  while (columns.length < 2) {
    columns.push(document.createElement('div'));
  }

  // Structure: [leftColumn, rightColumn]
  const row = [columns[0], columns[1]];

  const cells = [headerRow, row];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
