/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all tab labels (text inside each <li><span>)
  const tabs = Array.from(element.children);
  // Collect the text from each tab (span inside li)
  const tabTexts = tabs.map(tab => {
    const span = tab.querySelector('span');
    return span ? span.textContent.trim() : '';
  }).filter(Boolean);
  // Join with a single space as in the screenshot
  const tabTextJoined = tabTexts.join(' ');

  // Table header exactly matching the example
  const headerRow = ['Embed (embedVideo14)'];
  // Content row contains all tab texts
  const contentRow = [tabTextJoined];

  // Create table and replace original element
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}