/* global WebImporter */
export default function parse(element, { document }) {
  // Assumes the structure is two columns, each with p.purple (term) followed by p (description)
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length !== 2) return;
  const left = columns[0];
  const right = columns[1];

  // Helper to collect term/definition pairs
  function extractPairs(col) {
    const ps = Array.from(col.querySelectorAll(':scope > p'));
    const pairs = [];
    for (let i = 0; i < ps.length;) {
      const current = ps[i];
      if (current.classList.contains('purple')) {
        // Next p (if exists and not purple) is the definition
        let next = ps[i+1];
        if (next && !next.classList.contains('purple')) {
          pairs.push([current, next]);
          i += 2;
        } else {
          // Only a term, no definition
          pairs.push([current, document.createElement('span')]);
          i++;
        }
      } else {
        // Orphan definition (shouldn't occur in this HTML, but just in case)
        pairs.push([document.createElement('span'), current]);
        i++;
      }
    }
    return pairs;
  }

  const leftPairs = extractPairs(left);
  const rightPairs = extractPairs(right);

  // Table header exactly as in example
  const headerRow = ['Table (no header, tableNoHeader28)', ''];
  // Build table rows: one per pair, preserve order
  const maxRows = Math.max(leftPairs.length, rightPairs.length);
  const rows = [headerRow];
  for (let i = 0; i < maxRows; i++) {
    const [leftTerm, leftDef] = leftPairs[i] || [document.createElement('span'), document.createElement('span')];
    const [rightTerm, rightDef] = rightPairs[i] || [document.createElement('span'), document.createElement('span')];
    // For each cell, combine term and definition in order
    const leftCell = document.createElement('div');
    leftCell.append(leftTerm, leftDef);
    const rightCell = document.createElement('div');
    rightCell.append(rightTerm, rightDef);
    rows.push([leftCell, rightCell]);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
