/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header (exact match)
  const headerRow = ['Hero (hero41)'];

  // 2. Background image extraction (first image in .swiper-wrapper)
  let bgImg = null;
  const swiperWrapper = element.querySelector('.swiper-wrapper');
  if (swiperWrapper) {
    bgImg = swiperWrapper.querySelector('img');
  }
  // If no image, put empty string (edge-case)
  const imageRow = [bgImg ? bgImg : ''];

  // 3. Content row: includes headline, text, and indication copy
  const contentParts = [];
  // Get the header area from banner-content
  const headerContent = element.querySelector('.header-content');
  if (headerContent) {
    contentParts.push(headerContent);
  }
  // Get the indication copy area from indication-copy
  const indicationCopy = element.querySelector('.indication-copy .container');
  if (indicationCopy) {
    contentParts.push(indicationCopy);
  }

  const contentRow = [contentParts.length ? contentParts : ''];

  // 4. Compose block table with 1 column, 3 rows
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element with the new block table
  element.replaceWith(block);
}
