/* global WebImporter */
export default function parse(element, { document }) {
  // Define the block header row
  const headerRow = ['Table (no header, tableNoHeader26)'];

  // Find the <ul> containing the list items
  const ul = element.querySelector('ul');
  if (!ul) return;

  // Get all the direct <li> children
  const liElements = Array.from(ul.children).filter(child => child.tagName === 'LI');

  // Arrange into two-column rows as shown in the screenshot
  const rows = [];
  for (let i = 0; i < liElements.length; i += 2) {
    // Reference the existing <li> elements directly
    const row = [liElements[i]];
    if (liElements[i + 1]) {
      row.push(liElements[i + 1]);
    } else {
      row.push(''); // If odd, add empty string for 2nd column
    }
    rows.push(row);
  }

  // Build the table data
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original block with the new table
  element.replaceWith(table);
}
