/* global WebImporter */
export default function parse(element, { document }) {
  // Make sure we have the main container for the card
  const container = element.querySelector('.container-wrap');
  if (!container) return;

  // Get the image (first column)
  let imageCell = '';
  const imageWrap = container.querySelector('.image-wrap');
  if (imageWrap) {
    const img = imageWrap.querySelector('img');
    if (img) imageCell = img;
  }

  // Get the text content (second column)
  let textCellContent = [];
  const calloutWrap = container.querySelector('.callout-wrap');
  if (calloutWrap) {
    // Include the heading if present
    const heading = calloutWrap.querySelector('h3');
    if (heading) textCellContent.push(heading);
    // Include the description if present
    const desc = calloutWrap.querySelector('p');
    if (desc) textCellContent.push(desc);
    // Include the CTA/link if present
    const cta = calloutWrap.querySelector('a.button');
    if (cta) textCellContent.push(cta);
  }
  const textCell = textCellContent.length === 1 ? textCellContent[0] : textCellContent;

  // Compose the table according to block requirements
  const rows = [
    ['Cards (cards38)'],
    [imageCell, textCell],
  ];

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
