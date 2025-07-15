/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content columns
  // Left content: Tips & Support heading and intro paragraph
  const leftCol = element.querySelector('.left-text');
  // Right content: Resource card (image, title, description, download button)
  const rightCol = element.querySelector('.right-resource');

  // Defensive: If either is missing, substitute an empty div
  const leftCell = leftCol || document.createElement('div');
  const rightCell = rightCol || document.createElement('div');

  // Table header: must match block name exactly as per the guidelines
  const headerRow = ['Columns (columns37)'];
  const row = [leftCell, rightCell];
  const tableCells = [headerRow, row];

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}