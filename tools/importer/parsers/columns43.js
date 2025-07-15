/* global WebImporter */
export default function parse(element, { document }) {
  // Find the banner with the columns content
  const banner = element.querySelector('.full-width-text-banner');
  if (!banner) return;

  // The .container inside the banner holds the columns
  const columnsContainer = banner.querySelector('.container');
  if (!columnsContainer) return;

  // Get the left and right column elements
  const left = columnsContainer.querySelector('.left');
  const right = columnsContainer.querySelector('.picture-bg');

  // Each cell should be an array of existing DOM elements (or empty array if not found)
  const leftCell = left ? Array.from(left.children) : [];
  const rightCell = right ? Array.from(right.children) : [];

  // The header row must be a single cell (array of length 1),
  // and the next row must contain as many columns (cells) as needed
  const cells = [
    ['Columns (columns43)'],
    [leftCell, rightCell]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
