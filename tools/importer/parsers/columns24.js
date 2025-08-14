/* global WebImporter */
export default function parse(element, { document }) {
  // Get left and right columns
  const left = element.querySelector('.l');
  const right = element.querySelector('.r');

  // Defensive: Only proceed if both columns are present
  if (!left || !right) return;

  // Build the table rows as required by the Columns (columns24) block
  const rows = [
    ['Columns (columns24)'],
    [left, right]
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
