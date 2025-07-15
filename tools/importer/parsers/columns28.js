/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match the block name exactly
  const headerRow = ['Columns (columns28)'];

  // 2. Get all direct column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // 3. If there are no columns, do not proceed (edge case)
  if (!columns.length) {
    // Optionally, you could remove the element or just skip this block
    element.remove();
    return;
  }

  // 4. Each column div is used as a direct cell reference (no cloning)
  const row = columns;

  const cells = [
    headerRow,
    row
  ];

  // 5. Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
