/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child <li> elements (representing columns)
  const columns = Array.from(element.querySelectorAll(':scope > li'));
  // For each column, get the main display content
  const columnContents = columns.map((li) => {
    const div = li.querySelector('span > div');
    if (div) return div;
    const span = li.querySelector('span');
    if (span) return span;
    return li;
  });
  // Build the table manually to set colspan on header
  const table = document.createElement('table');
  // Header row: one th with correct text, colspan set to number of columns
  const headerRow = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns19)';
  if (columnContents.length > 1) {
    th.colSpan = columnContents.length;
  }
  headerRow.appendChild(th);
  table.appendChild(headerRow);
  // Data row: one cell per column
  const dataRow = document.createElement('tr');
  columnContents.forEach((content) => {
    const td = document.createElement('td');
    td.append(content);
    dataRow.appendChild(td);
  });
  table.appendChild(dataRow);
  element.replaceWith(table);
}
