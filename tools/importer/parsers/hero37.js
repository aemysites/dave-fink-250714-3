/* global WebImporter */
export default function parse(element, { document }) {
  // Header row - matches exactly
  const headerRow = ['Hero (hero37)'];

  // Find the banner element
  const bannerEl = element.querySelector('.full-width-banner');

  // Collect all images (desktop and mobile)
  let images = [];
  if (bannerEl) {
    images = Array.from(bannerEl.querySelectorAll('img'));
  }
  // Prefer desktop (class 'pc'), but fallback to first available image
  let imageCell;
  if (images.length > 0) {
    // If both desktop and mobile present, use only desktop image for desktop rendering
    const desktopImg = images.find(img => img.classList.contains('pc'));
    imageCell = desktopImg || images[0];
  } else {
    imageCell = '';
  }

  // Find text content. Desktop usually in .full-width-banner-des, mobile in .breast-cancer-content.
  // Sometimes both exist, sometimes only one. Always include all unique text blocks.
  const textCells = [];
  if (bannerEl) {
    const desktopText = bannerEl.querySelector('.full-width-banner-des');
    if (desktopText) textCells.push(desktopText);
  }
  const mobileText = element.querySelector('.breast-cancer-content');
  if (mobileText) {
    // Avoid duplicate if mobileText is a direct child of desktopText
    if (!textCells.includes(mobileText)) {
      textCells.push(mobileText);
    }
  }
  // If neither found, fallback to all paragraphs and headings inside .full-width-banner
  if (textCells.length === 0 && bannerEl) {
    const candidates = Array.from(bannerEl.querySelectorAll('h1,h2,h3,h4,h5,h6,p'));
    if (candidates.length) {
      textCells.push(...candidates);
    }
  }
  // If still nothing, fallback to all paragraphs/headings in element
  if (textCells.length === 0) {
    const candidates = Array.from(element.querySelectorAll('h1,h2,h3,h4,h5,h6,p'));
    if (candidates.length) {
      textCells.push(...candidates);
    }
  }

  // Compose rows for the table
  const cells = [
    headerRow,
    [imageCell],
    [textCells.length > 1 ? textCells : (textCells[0] || '')],
  ];

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
