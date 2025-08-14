/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Hero (hero40)'];

  // 2nd row: Background image (optional)
  let imageEl = null;
  const swiperContainer = element.querySelector('.swiper-container');
  if (swiperContainer) {
    // Find the first image inside the swiper slide
    const img = swiperContainer.querySelector('img');
    if (img) {
      imageEl = img;
    }
  }

  // 3rd row: Headline, subheading, call-to-action, and body text
  // Compose this from the banner-content and indication-copy
  const contentBlocks = [];
  // .banner-content > .container > .header-content
  const bannerContent = element.querySelector('.banner-content');
  if (bannerContent) {
    const headerContent = bannerContent.querySelector('.header-content');
    if (headerContent) {
      // Reference all direct children (h1, p's)
      Array.from(headerContent.children).forEach(child => {
        contentBlocks.push(child);
      });
    }
  }

  // .indication-copy > .container
  const indicationCopy = element.querySelector('.indication-copy');
  if (indicationCopy) {
    const indicationContainer = indicationCopy.querySelector('.container');
    if (indicationContainer) {
      Array.from(indicationContainer.children).forEach(child => {
        contentBlocks.push(child);
      });
    }
  }

  // Table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentBlocks.length > 0 ? contentBlocks : '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
