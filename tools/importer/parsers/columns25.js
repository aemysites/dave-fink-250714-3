/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must have a single cell with 'Columns (columns25)'.
  const headerRow = ['Columns (columns25)'];
  
  // Get all immediate div children to represent columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, gather its children as an array (to preserve all structure and content)
  function getColumnContent(col) {
    const nodes = Array.from(col.childNodes).filter(n => {
      return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
    });
    return nodes.length === 1 ? nodes[0] : nodes;
  }
  const contentRow = columns.map(getColumnContent);

  // Build the table data: header row (one cell), then content row (N columns for N divs)
  const tableData = [
    headerRow,
    contentRow
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
