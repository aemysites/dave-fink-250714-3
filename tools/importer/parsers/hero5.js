/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image <img>
  function findBannerImage(el) {
    const swiper = el.querySelector('.swiper-container');
    if (swiper) {
      const img = swiper.querySelector('img');
      if (img) return img;
    }
    return '';
  }
  // Helper to find the heading (h1/h2/h3)
  function findHeading(el) {
    const headerContent = el.querySelector('.banner-content .header-content');
    if (headerContent) {
      // Prefer h1, then h2, then h3
      for (const tag of ['h1','h2','h3']) {
        const h = headerContent.querySelector(tag);
        if (h) return h;
      }
    }
    return '';
  }
  // Locate the block root (in case structure changes)
  let banner = element.querySelector('#banner');
  if (!banner) banner = element;
  const img = findBannerImage(banner);
  const heading = findHeading(banner);
  // Build the block table as per spec
  const cells = [
    ['Hero (hero5)'],
    [img],
    [heading],
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
