/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name must match exactly
  const headerRow = ['Cards (cards42)'];

  // Defensive: Find main card image (first cell)
  let imageEl = null;
  const drawerTop = element.querySelector('.drawer-top');
  if (drawerTop) {
    const imgWrap = drawerTop.querySelector('.img-wrap');
    if (imgWrap) {
      const img = imgWrap.querySelector('img');
      if (img) imageEl = img;
    }
  }

  // Collect all content for the text column (second cell)
  const textFragments = [];

  // Title (Heading)
  if (drawerTop) {
    const h3 = drawerTop.querySelector('.text-wrap .text-wrapper h3');
    if (h3) textFragments.push(h3);

    // Desktop description (optional)
    const desktopP = drawerTop.querySelector('.text-wrap .text-wrapper p.hide-on-mobile');
    if (desktopP) textFragments.push(desktopP);
  }

  // Read more / details (optional)
  const readMoreWrap = element.querySelector('.read-more-wrap');
  if (readMoreWrap) {
    // Only add content if expanded text present
    const readMoreText = readMoreWrap.querySelector('.read-more-text');
    if (readMoreText) {
      Array.from(readMoreText.children).forEach(child => {
        textFragments.push(child);
      });
    }
  }

  // Compose the table: header row, then [image, text] row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [imageEl, textFragments]
  ], document);

  element.replaceWith(table);
}
