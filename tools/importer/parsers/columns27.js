/* global WebImporter */
export default function parse(element, { document }) {
  // Get immediate child divs (.item blocks)
  const items = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: Pad with empty divs if less than 2 columns
  while (items.length < 2) {
    items.push(document.createElement('div'));
  }

  // Compose the table rows.
  // Header row: single cell, matches the example and requirement.
  // Content row: array of as many columns as needed for layout.
  const cells = [
    ['Columns (columns27)'], // header row, single cell
    items                   // content row, each cell is a column
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
