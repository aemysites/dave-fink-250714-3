/* global WebImporter */
export default function parse(element, { document }) {
  // Get the .footer-content, which holds the two columns
  const footerContent = element.querySelector('.footer-content');
  if (!footerContent) return;

  // Get the left and right column elements
  const footerLeft = footerContent.querySelector('.footer-left');
  const footerRight = footerContent.querySelector('.footer-right');

  // Only add as many columns as exist (typically two)
  const columnsRow = [];
  if (footerLeft) columnsRow.push(footerLeft);
  if (footerRight) columnsRow.push(footerRight);
  if (!columnsRow.length) return;

  // Header row is always a single cell, per example
  const headerRow = ['Columns (columns29)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);
  element.replaceWith(table);
}
