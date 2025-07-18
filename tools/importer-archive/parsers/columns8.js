/* global WebImporter */
export default function parse(element, { document }) {
  // Extract left and right columns (prefer classes, fallback to children)
  const left = element.querySelector(':scope > .left-image') || element.children[0];
  const right = element.querySelector(':scope > .right-text') || element.children[1];

  // Build rows: header row must be a single cell, content row has two columns
  const rows = [
    ['Columns (columns8)'],
    [left, right],
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
