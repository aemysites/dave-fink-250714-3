/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must exactly match: 'Columns (columns15)'
  const headerRow = ['Columns (columns15)'];

  // The block is two columns: left (image), right (text/button)
  // Get immediate children: left-image, right-text
  const children = Array.from(element.querySelectorAll(':scope > div'));

  let leftCell = null;
  let rightCell = null;

  // Defensive: assign the correct cells if classes are swapped or absent
  children.forEach((child) => {
    if (child.classList.contains('left-image')) {
      leftCell = child;
    } else if (child.classList.contains('right-text')) {
      rightCell = child;
    }
  });

  // Fallback if classes missing: just assign by position
  if (!leftCell && children[0]) leftCell = children[0];
  if (!rightCell && children[1]) rightCell = children[1];

  // Edge case: If one column missing, still return a row with empty cell
  const row = [leftCell || '', rightCell || ''];

  const cells = [headerRow, row];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
