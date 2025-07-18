/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Hero (hero37)'];

  // ----- Background Image Row -----
  // Find the .full-width-banner (contains images and text)
  const banner = element.querySelector('.full-width-banner');

  // Collect all <img> under .full-width-banner (desktop & mobile)
  let bgImgs = [];
  if (banner) {
    bgImgs = Array.from(banner.querySelectorAll('img'));
  }
  const bgRow = [bgImgs.length ? bgImgs : ''];

  // ----- Content Row -----
  // Prefer the desktop content block if present
  let contentBlocks = [];
  if (banner) {
    const desktop = banner.querySelector('.full-width-banner-des');
    if (desktop) contentBlocks.push(desktop);
  }
  // Also include the mobile version (may have different structure/text)
  const mobile = element.querySelector('.mobile.breast-cancer-content');
  if (mobile) contentBlocks.push(mobile);

  // If no content blocks were found, fallback to grabbing all p/h* inside main element
  let contentCell;
  if (contentBlocks.length) {
    contentCell = contentBlocks;
  } else {
    const fallback = Array.from(element.querySelectorAll('h1,h2,h3,h4,h5,h6,p'));
    contentCell = fallback.length ? fallback : '';
  }
  const contentRow = [contentCell];

  // Build the table with structure that matches the block definition
  const cells = [headerRow, bgRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
