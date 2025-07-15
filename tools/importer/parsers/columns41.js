/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the two main columns inside .two-columns-nav
  const columnsNav = element.querySelector('.two-columns-nav');
  if (!columnsNav) return;

  // The left column content
  const leftCol = columnsNav.querySelector('.left-text.larger-larger-width');
  // The right column: navigation links
  const rightCol = columnsNav.querySelector('.anchor-links.where-to-start');

  // If both columns are missing, do not proceed
  if (!leftCol && !rightCol) return;

  // Prepare the header row as a single cell (one column)
  const headerRow = ["Columns (columns41)"];
  // Prepare the content row with two columns (cells)
  const contentRow = [leftCol || '', rightCol || ''];
  const cells = [headerRow, contentRow];

  // The createTable helper will create the correct colspan for the header row
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
