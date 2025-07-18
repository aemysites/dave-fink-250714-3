/* global WebImporter */
export default function parse(element, { document }) {
  // Get direct children for left/right columns
  const children = element.querySelectorAll(':scope > div');
  const left = children[0] || document.createElement('div');
  const right = children[1] || document.createElement('div');

  // The header row must have one column only (for proper spanning)
  const headerRow = ['Columns (columns45)'];
  // The data row contains as many cells as columns required
  const dataRow = [left, right];

  // Create the table using the correct header structure
  const table = document.createElement('table');

  // Header row: single cell, should span all columns
  const trHeader = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = headerRow[0];
  // Span as many columns as needed
  th.colSpan = dataRow.length;
  trHeader.appendChild(th);
  table.appendChild(trHeader);

  // Data row
  const tr = document.createElement('tr');
  dataRow.forEach(cell => {
    const td = document.createElement('td');
    td.append(cell);
    tr.appendChild(td);
  });
  table.appendChild(tr);

  element.replaceWith(table);
}
