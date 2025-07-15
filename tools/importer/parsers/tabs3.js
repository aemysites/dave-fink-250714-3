/* global WebImporter */
export default function parse(element, { document }) {
  // Build the table rows
  // Header: single column, exactly 'Tabs (tabs3)'
  const headerRow = ['Tabs (tabs3)'];

  // Each data row: two columns: [tab label, tab content (empty)]
  // Get all immediate li children as tabs
  const tabLis = Array.from(element.querySelectorAll(':scope > li'));
  const rows = tabLis.map(li => {
    // The tab label is the <div> inside <span>
    let labelDiv = li.querySelector('span > div');
    // Fallback to li text if div missing
    let labelCell = labelDiv ? labelDiv : document.createTextNode(li.textContent.trim());
    // Content cell is empty (no corresponding content in source)
    return [labelCell, ''];
  });

  // The table must start with a single-cell header row, then all data rows must have 2 cells
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}