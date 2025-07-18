/* global WebImporter */
export default function parse(element, { document }) {
  // Get all <li> elements directly under element
  const tabItems = Array.from(element.querySelectorAll(':scope > li'));

  // Build columns from the visible tab names (from spans inside li)
  const columns = tabItems.map(li => {
    const span = li.querySelector('span');
    return span ? span.textContent.trim() : '';
  });

  // Table block header must match component/block name exactly
  const headerRow = ['Table (table50)'];

  // Compose table rows as required: header row, then tab label row
  const cells = [
    headerRow,
    columns
  ];

  // Create table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
