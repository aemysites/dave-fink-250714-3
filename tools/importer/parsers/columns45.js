/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main two-column block
  const twoCol = element.querySelector('.two-columns-images-right');
  if (!twoCol) return;

  // Find left and right column content
  const left = twoCol.querySelector('.left-text');
  const right = twoCol.querySelector('.right-image');

  // Defensive: If content is missing, ensure we still provide a cell (empty div)
  const leftContent = left || document.createElement('div');
  let rightContent = document.createElement('div');
  if (right) {
    // Prefer the image inside right-image
    const img = right.querySelector('img');
    if (img) {
      rightContent = img;
    } else {
      // If no image, provide the whole right column
      rightContent = right;
    }
  }

  // Table header matches example exactly
  const headerRow = ['Columns (columns45)'];
  // Second row contains both columns side by side
  const secondRow = [leftContent, rightContent];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
