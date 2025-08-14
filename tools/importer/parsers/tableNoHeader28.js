/* global WebImporter */
export default function parse(element, { document }) {
  // Get left and right columns
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length !== 2) return;
  const leftCol = columns[0];
  const rightCol = columns[1];

  // Helper to build array of term/definition pairs for a column
  function extractRows(col) {
    const out = [];
    const children = Array.from(col.children);
    for (let i = 0; i < children.length - 1; i++) {
      const term = children[i];
      const def = children[i + 1];
      if (
        term.tagName === 'P' && term.classList.contains('purple') &&
        def.tagName === 'P' && !def.classList.contains('purple')
      ) {
        // Both <p> elements appear in DOM, reference them directly
        out.push([term, def]);
        i++; // move to the next pair
      }
    }
    return out;
  }

  const leftPairs = extractRows(leftCol);
  const rightPairs = extractRows(rightCol);
  const maxRows = Math.max(leftPairs.length, rightPairs.length);

  // Table header row from requirements
  const cells = [['Table (no header, tableNoHeader28)']];
  // Build rows: one row per pair, two columns per row
  for (let i = 0; i < maxRows; i++) {
    const leftCell = leftPairs[i] ? leftPairs[i] : ['', ''];
    const rightCell = rightPairs[i] ? rightPairs[i] : ['', ''];
    // Each cell: both term and def in one cell (as in the semantic meaning in HTML)
    cells.push([
      leftCell[0] && leftCell[1] ? [leftCell[0], leftCell[1]] : '',
      rightCell[0] && rightCell[1] ? [rightCell[0], rightCell[1]] : ''
    ]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
