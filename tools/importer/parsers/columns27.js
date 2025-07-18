/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate child .item elements
  const items = Array.from(element.querySelectorAll(':scope > .item'));
  if (!items.length) return;

  // Build the content row with the columns
  const contentRow = [];
  // First column: image (the .pic div if it exists, or the .item otherwise)
  if (items[0]) {
    const pic = items[0].querySelector(':scope > .pic');
    contentRow.push(pic ? pic : items[0]);
  } else {
    contentRow.push('');
  }
  // Second column: paragraph/text
  if (items[1]) {
    // All children, or fallback to the item
    const children = Array.from(items[1].childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    if (children.length === 1) {
      contentRow.push(children[0]);
    } else if (children.length > 1) {
      contentRow.push(children);
    } else {
      contentRow.push(items[1]);
    }
  } else {
    contentRow.push('');
  }

  // The header row must be a single cell spanning all columns, per the example
  const headerRow = ['Columns (columns27)'];

  // Compose the block table structure: header (1 col), then content (N cols)
  const cells = [
    headerRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
