/* global WebImporter */
export default function parse(element, { document }) {
  // Safety: check for the main content wrapper
  const footerContent = element.querySelector('.footer-content');
  if (!footerContent) return;

  // Find columns content: .footer-left and .footer-right
  const footerLeft = footerContent.querySelector('.footer-left');
  const footerRight = footerContent.querySelector('.footer-right');
  if (!footerLeft && !footerRight) return;

  // Always output two columns: left and right (may be empty if missing)
  // Reference the existing elements directly (do not clone!), or if missing, use empty string
  const leftCell = footerLeft || '';
  const rightCell = footerRight || '';

  // Header must match exactly the block name from the instructions
  const cells = [
    ['Columns (columns7)'],
    [leftCell, rightCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
