/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for columns block - must be a single cell
  const headerRow = ['Columns (columns15)'];

  // Find the two columns: left-image and right-text (immediate children divs)
  const children = element.querySelectorAll(':scope > div');
  let leftCol = null;
  let rightCol = null;
  children.forEach((child) => {
    if (child.classList.contains('left-image')) {
      leftCol = child;
    } else if (child.classList.contains('right-text')) {
      rightCol = child;
    }
  });

  // Defensive: if either column is missing, fill in with empty div to maintain table structure
  if (!leftCol) leftCol = document.createElement('div');
  if (!rightCol) rightCol = document.createElement('div');

  // Remove the columns from the original to avoid duplication
  if (leftCol.parentElement === element) element.removeChild(leftCol);
  if (rightCol.parentElement === element) element.removeChild(rightCol);

  // Second row: each column as a separate cell
  const secondRow = [leftCol, rightCol];

  // Build block table: header row (1 cell), then row with 2 columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    secondRow
  ], document);

  element.replaceWith(table);
}
