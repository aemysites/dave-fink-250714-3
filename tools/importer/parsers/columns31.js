/* global WebImporter */
export default function parse(element, { document }) {
  // Define header row as per block name
  const headerRow = ['Columns (columns31)'];

  // Get all direct .item children (columns)
  const items = Array.from(element.querySelectorAll(':scope > .item'));

  // For each item, if it has only one child, reference it, else reference the item itself
  // This ensures we don't lose any content, and we properly account for both images and text
  const columns = items.map(item => {
    if (item.children.length === 1) {
      return item.children[0];
    }
    // If .item contains more than one child, include the entire item
    return item;
  });

  // Construct the block table
  const tableArr = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(tableArr, document);

  // Replace the original element
  element.replaceWith(block);
}