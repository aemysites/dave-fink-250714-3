/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Safely get the relevant wrapper for the hero block
  const banner = element.querySelector('.full-width-text-banner');
  if (!banner) return;

  // 2. Find the .container inside the banner
  const container = banner.querySelector('.container');
  if (!container) return;

  // 3. Find left side (text/buttons) and right side (image)
  const left = container.querySelector('.left');
  const pictureBg = container.querySelector('.picture-bg');

  // 4. Table header: Must match exactly
  const headerRow = ['Hero (hero47)'];

  // 5. Background image row: must be the image element if present, otherwise empty string
  let bgImgRow = [''];
  if (pictureBg) {
    const img = pictureBg.querySelector('img');
    if (img) bgImgRow = [img];
  }

  // 6. Content row: should preserve heading, subheading, CTAs, and buttons
  //    Reference the existing left div if present, otherwise empty string
  let contentRow = [''];
  if (left) {
    contentRow = [left];
  }

  // 7. Compose the table as per the example (1 col, 3 rows)
  const cells = [headerRow, bgImgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 8. Replace the original element with the block table
  element.replaceWith(table);
}
