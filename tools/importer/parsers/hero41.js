/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header must match the example exactly
  const headerRow = ['Hero (hero41)'];

  // 2. Find the background image (from .swiper-container img)
  let imgEl = null;
  const swiperImg = element.querySelector('.swiper-container img');
  if (swiperImg) {
    imgEl = swiperImg;
  }
  const imageRow = [imgEl ? imgEl : ''];

  // 3. Compose the main content (title, subheading, paragraphs)
  //    - headerContent: contains h1, and paragraphs
  //    - indicationCopy: contains additional paragraphs (all are needed)
  const headerContent = element.querySelector('.header-content');
  const indicationCopy = element.querySelector('.indication-copy .container');

  // Create an array to combine content blocks for the table cell
  const contentParts = [];
  if (headerContent) contentParts.push(headerContent);
  if (indicationCopy) contentParts.push(indicationCopy);

  // If nothing found, put an empty string for robustness
  const contentRow = [contentParts.length ? contentParts : ''];

  // 4. Build the table structure
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  // 5. Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
