/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the column divs
  const columns = element.querySelectorAll(':scope > div');
  // Defensive: always provide two columns for this block
  const col1 = columns[0] || document.createElement('div');
  const col2 = columns[1] || document.createElement('div');

  // The header row must contain exactly one cell (the block name), per spec
  // The second row must contain as many columns as the block (here: 2)
  const cells = [
    ['Columns (columns43)'],
    [col1, col2]
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
