/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content columns: left-text and right-resource
  const tipsSupport = element.querySelector('.tips-support');
  if (!tipsSupport) return;
  
  // Get the left and right column content
  const left = tipsSupport.querySelector('.left-text');
  const right = tipsSupport.querySelector('.right-resource');
  
  // Defensive: ensure columns exist, use empty div if missing
  const leftCell = left || document.createElement('div');
  const rightCell = right || document.createElement('div');
  
  // Table structure: header and a single row with two columns
  const cells = [
    ['Columns (columns34)'],
    [leftCell, rightCell],
  ];

  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
