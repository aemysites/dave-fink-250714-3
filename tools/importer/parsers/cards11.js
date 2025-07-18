/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row (block name)
  const cells = [
    ['Cards (cards11)'],
  ];

  // Extract the card image (first column)
  const img = element.querySelector('.img-wrap img');

  // Extract title (h3 in text-wrap)
  const heading = element.querySelector('.text-wrap h3');

  // Short description, prefer desktop, fallback to mobile
  let shortDesc = element.querySelector('.text-wrap .hide-on-mobile') || element.querySelector('.read-more-wrap .hide-on-desktop');

  // Compose content for text cell
  const textCellContent = [];
  if (heading) textCellContent.push(heading);
  if (shortDesc) textCellContent.push(shortDesc);

  // Check for read-more section (for expanded body/cta)
  const readMoreWrap = element.querySelector('.read-more-wrap');
  if (readMoreWrap) {
    // CTA (Read More)
    const readMoreTitle = readMoreWrap.querySelector('.read-more-title');
    if (readMoreTitle) {
      // Use the span child if present, else the node itself
      textCellContent.push(readMoreTitle);
    }
    // Extended description
    const readMoreCon = readMoreWrap.querySelector('.read-more-text');
    if (readMoreCon) {
      Array.from(readMoreCon.children).forEach(child => textCellContent.push(child));
    }
  }

  // Add the card row: [ image , text cell ]
  cells.push([
    img,
    textCellContent,
  ]);

  // Create block table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
