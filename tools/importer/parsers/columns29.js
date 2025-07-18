/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row as specified
  const headerRow = ['Columns (columns29)'];

  // Get all direct children with class 'item'
  const items = Array.from(element.querySelectorAll(':scope > .item'));

  // If there are no items, fallback to using direct children
  let columnsRow;
  if (items.length === 0) {
    const children = Array.from(element.children);
    columnsRow = children.length > 0 ? children : [element];
  } else {
    columnsRow = items;
  }

  // Build the cells array for the block table
  const cells = [
    headerRow,
    columnsRow
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
