/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as in the example
  const headerRow = ['Hero (hero40)'];

  // Get the banner root element
  const banner = element.querySelector('#banner');

  // --- Background Image ---
  // Look for the first .swiper-slide img
  let bgImgEl = null;
  if (banner) {
    const img = banner.querySelector('.swiper-slide img');
    if (img) bgImgEl = img;
  }

  // --- Content (headline, subheads, paragraphs, CTA) ---
  // Get .header-content and .indication-copy .container
  let contentEls = [];
  if (banner) {
    const headerContent = banner.querySelector('.header-content');
    if (headerContent) {
      // Get all its children (h1, p, etc.) in order
      contentEls = contentEls.concat(Array.from(headerContent.children));
    }
    // Add the .indication-copy .container's children (paragraphs)
    const indicationCopy = banner.querySelector('.indication-copy .container');
    if (indicationCopy) {
      contentEls = contentEls.concat(Array.from(indicationCopy.children));
    }
  }

  // Fallback if no content found
  if (contentEls.length === 0) contentEls = [''];

  // Create the block table rows
  const cells = [
    headerRow, // Header (row 1)
    [bgImgEl ? bgImgEl : ''], // Background image (row 2)
    [contentEls] // Content (row 3)
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
