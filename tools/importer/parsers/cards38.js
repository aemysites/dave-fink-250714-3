/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards38)'];

  // Find the image (first cell)
  const imgWrap = element.querySelector('.image-wrap');
  let img = null;
  if (imgWrap) {
    img = imgWrap.querySelector('img');
  }

  // Find the text content (second cell)
  const calloutWrap = element.querySelector('.callout-wrap');
  const textCellElements = [];
  if (calloutWrap) {
    // Title (heading)
    const h3 = calloutWrap.querySelector('h3');
    if (h3) textCellElements.push(h3);
    // Description paragraph
    const p = calloutWrap.querySelector('p');
    if (p) textCellElements.push(p);
    // Call to action link
    const a = calloutWrap.querySelector('a');
    if (a) textCellElements.push(a);
  }

  // Build the row for this card
  const row = [img, textCellElements];
  // Build the table
  const cells = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
