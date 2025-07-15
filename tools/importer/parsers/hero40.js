/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: Block name, exactly as in the example
  const headerRow = ['Hero (hero40)'];

  // 2. Background image row
  // Find the image inside swiper-slide (preferred the biggest one)
  let imgEl = null;
  const swiperSlide = element.querySelector('.swiper-slide');
  if (swiperSlide) {
    const img = swiperSlide.querySelector('img');
    if (img) imgEl = img;
  }

  // 3. Content row: Headline, subheading(s), CTA, etc
  const contentParts = [];
  // Pull headline and paragraphs
  const headerContent = element.querySelector('.header-content');
  if (headerContent) contentParts.push(headerContent);

  // Pull bottom indication copy
  const indicationContainer = element.querySelector('.indication-copy .container');
  if (indicationContainer) contentParts.push(indicationContainer);

  // If nothing found, fallback to entire element (should never happen in this structure)
  const contentCell = contentParts.length ? contentParts : '';

  const cells = [
    headerRow,
    [imgEl],
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}