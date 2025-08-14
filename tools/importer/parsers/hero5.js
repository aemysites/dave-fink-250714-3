/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header (exact match, single cell)
  const headerRow = ['Hero (hero5)'];

  // 2. Background image row
  let bgImg = '';
  const swiperSlide = element.querySelector('.swiper-slide');
  if (swiperSlide) {
    const img = swiperSlide.querySelector('img');
    if (img) {
      bgImg = img;
    }
  }

  // 3. Headline row (extract heading inside header-content)
  let headline = '';
  const bannerContent = element.querySelector('.banner-content');
  if (bannerContent) {
    const headerContent = bannerContent.querySelector('.header-content');
    if (headerContent) {
      // Prefer h1, else h2/h3, else all text inside headerContent
      const heading = headerContent.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        headline = heading;
      } else if (headerContent.textContent.trim()) {
        // If there's only text, create a paragraph element
        const p = document.createElement('p');
        p.textContent = headerContent.textContent.trim();
        headline = p;
      }
    }
  }

  // Compose block table
  const cells = [
    headerRow,
    [bgImg],
    [headline]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
