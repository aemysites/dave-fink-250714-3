/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the innermost .full-width-text-banner > .container
  let contentContainer = null;
  const fullBanner = element.querySelector('.full-width-text-banner');
  if (fullBanner) {
    contentContainer = fullBanner.querySelector('.container');
  }

  // Try to find the image for the hero
  let img = null;
  if (fullBanner) {
    const pictureBg = fullBanner.querySelector('.picture-bg');
    if (pictureBg) {
      img = pictureBg.querySelector('img');
    }
  }
  // Fallback: look for any image in the element if not found in picture-bg
  if (!img) {
    img = element.querySelector('img');
  }

  // Table rows: [header], [image], [content]
  const headerRow = ['Hero (hero8)'];
  const imageRow = [img ? img : '']; // If no image, cell is empty

  // The content row: all text/buttons block, direct reference if possible
  const contentRow = [contentContainer ? contentContainer : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
