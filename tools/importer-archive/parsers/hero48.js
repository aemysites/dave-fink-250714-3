/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to promote a given element selector to an h1 if needed
  function promoteToH1(container, sel) {
    const el = container.querySelector(sel);
    if (el && el.tagName.toLowerCase() !== 'h1') {
      const h1 = document.createElement('h1');
      h1.innerHTML = el.innerHTML;
      el.replaceWith(h1);
    }
  }

  // 1. Extract background image (prefer pc, fallback to mobile, fallback to any img)
  let imageEl = null;
  const banner = element.querySelector('.full-width-banner');
  if (banner) {
    imageEl = banner.querySelector('img.pc') || banner.querySelector('img.mobile') || banner.querySelector('img');
  } else {
    imageEl = element.querySelector('img');
  }

  // 2. Extract text content (prefer .full-width-banner-des, fallback to .breast-cancer-content)
  let textContentElements = [];
  if (banner) {
    const bannerDes = banner.querySelector('.full-width-banner-des');
    if (bannerDes) {
      promoteToH1(bannerDes, 'p.title');
      // Collect all elements (including text nodes with actual content)
      textContentElements = Array.from(bannerDes.childNodes).filter(n =>
        (n.nodeType === Node.ELEMENT_NODE) || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      );
    }
  }
  if (textContentElements.length === 0) {
    // fallback: mobile content
    const mobileContent = element.querySelector('.breast-cancer-content');
    if (mobileContent) {
      promoteToH1(mobileContent, 'h3');
      textContentElements = Array.from(mobileContent.childNodes).filter(n =>
        (n.nodeType === Node.ELEMENT_NODE) || (n.nodeType === Node.TEXT_NODE && n.textContent.trim())
      );
    }
  }

  // 3. Compose the block table
  const headerRow = ['Hero (hero48)'];
  const imageRow = [imageEl ? imageEl : ''];
  const textRow = [textContentElements.length ? textContentElements : ''];
  const table = WebImporter.DOMUtils.createTable([headerRow, imageRow, textRow], document);

  // 4. Replace the original element
  element.replaceWith(table);
}
