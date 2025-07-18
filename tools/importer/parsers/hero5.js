/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate child by selector
  function getDirectChild(el, sel) {
    return Array.from(el.children).find(child => child.matches(sel));
  }

  // 1. Header row
  const headerRow = ['Hero (hero5)'];

  // 2. Image row: Find background image inside swiper
  let imageEl = '';
  const swiper = element.querySelector('.swiper-container');
  if (swiper) {
    const img = swiper.querySelector('img');
    if (img) imageEl = img;
  }
  
  const imageRow = [imageEl];

  // 3. Content row: Get heading
  let content = '';
  const bannerContent = element.querySelector('.banner-content');
  if (bannerContent) {
    const container = bannerContent.querySelector('.container');
    if (container) {
      const headerContent = container.querySelector('.header-content');
      if (headerContent && headerContent.children.length > 0) {
        // If there are multiple heading/subheading items, include all
        if (headerContent.children.length === 1) {
          content = headerContent.firstElementChild;
        } else {
          // Fragment for multiple elements
          const frag = document.createDocumentFragment();
          Array.from(headerContent.children).forEach(child => frag.appendChild(child));
          content = frag;
        }
      }
    }
  }
  const contentRow = [content];

  // Compose table
  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the element
  element.replaceWith(table);
}
