/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the h3 heading (title of the list)
  const h3 = element.querySelector('h3');
  // Extract the unordered list
  const ul = element.querySelector('ul');
  // Extract all direct li children
  const liNodes = Array.from(ul ? ul.children : []);
  // Ensure we have at least one li
  if (!liNodes.length) {
    // Don't process empty block
    return;
  }

  // Get the text of each li
  const items = liNodes.map(li => li.textContent.trim());

  // Partition into two columns as in the screenshot: first 6, then the rest
  const splitIdx = Math.ceil(items.length / 2);
  const firstCol = items.slice(0, splitIdx);
  const secondCol = items.slice(splitIdx);
  const maxRows = Math.max(firstCol.length, secondCol.length);

  // Compose the rows for the table
  const rows = [];
  for (let i = 0; i < maxRows; i++) {
    rows.push([
      firstCol[i] || '',
      secondCol[i] || ''
    ]);
  }

  // The first row is always the block name exactly:
  const headerRow = ['Table (table13)'];
  // The second row is the heading from the h3, as in the screenshot (all caps)
  const subHeaderRow = [h3 ? h3.textContent.trim().toUpperCase() : '', ''];
  // Compose final table rows
  const cells = [headerRow, subHeaderRow, ...rows];
  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
