/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we extract the header and all list items dynamically
  const headerRow = ['Table (tableNoHeader26)'];

  // Get the heading element (h3)
  const heading = element.querySelector('h3');
  // Use the heading element reference directly; if missing, place empty string
  const subheaderRow = [heading ? heading : '', ''];

  // Get all list items (li) under the ul
  const lis = Array.from(element.querySelectorAll('ul > li'));

  // Split the list into two columns, matching the screenshot (first 6 / last 6)
  // Handles edge cases: if fewer than 12 items, will fill right column with empty strings
  const leftCol = lis.slice(0, 6);
  const rightCol = lis.slice(6, 12);

  const dataRows = [];
  const maxRows = Math.max(leftCol.length, rightCol.length);
  for (let i = 0; i < maxRows; i++) {
    const leftCell = leftCol[i] ? leftCol[i] : '';
    const rightCell = rightCol[i] ? rightCol[i] : '';
    dataRows.push([leftCell, rightCell]);
  }

  // Compose table block
  const cells = [headerRow, subheaderRow, ...dataRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with new table block
  element.replaceWith(block);
}
