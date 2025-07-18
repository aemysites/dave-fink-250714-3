/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get direct child by class
  function getChildByClass(parent, className) {
    const children = parent.children;
    for (let i = 0; i < children.length; i += 1) {
      if (children[i].classList.contains(className)) {
        return children[i];
      }
    }
    return null;
  }

  // Find the main content area of the hero block
  // Path: .full-width-text-banner > .container
  const banner = element.querySelector('.full-width-text-banner');
  if (!banner) return;
  const bannerContainer = getChildByClass(banner, 'container');
  if (!bannerContainer) return;

  // The left column (text, heading, CTAs)
  const left = getChildByClass(bannerContainer, 'left');
  // The right column (background image)
  const pictureBg = getChildByClass(bannerContainer, 'picture-bg');

  // ----- Extract background image (row 2) -----
  let bgImg = '';
  if (pictureBg) {
    const bgImgEl = pictureBg.querySelector('img');
    if (bgImgEl) {
      bgImg = bgImgEl;
    }
  }

  // ----- Extract content (row 3) -----
  // Gather all left-side content in order:
  // h1, p, p, .btn-picture (in the example HTML)
  let contentCellNodes = [];
  if (left) {
    // Get all direct children in order
    Array.from(left.childNodes).forEach((node) => {
      // Only include elements (skip text nodes with whitespace)
      if (node.nodeType === 1) {
        contentCellNodes.push(node);
      }
    });
  }

  // Edge case: If nothing found, ensure at least an empty string in the cell
  if (contentCellNodes.length === 0) contentCellNodes = [''];

  // ----- Compose and replace -----
  const rows = [
    ['Hero (hero47)'],
    [bgImg || ''],
    [contentCellNodes]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
