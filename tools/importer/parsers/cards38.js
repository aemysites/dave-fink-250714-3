/* global WebImporter */
export default function parse(element, { document }) {
  // Build table header
  const headerRow = ['Cards (cards38)'];

  // Find card wrapper
  const container = element.querySelector('.container-wrap');
  // Defensive: fallback to element if container not found
  const card = container || element;

  // Get the immediate children (image-wrap, callout-wrap)
  const children = card.querySelectorAll(':scope > div');

  // First column: image (from .image-wrap > img)
  let imageEl = null;
  for (const child of children) {
    if (child.classList.contains('image-wrap')) {
      imageEl = child.querySelector('img');
      break;
    }
  }
  // Defensive: fallback if not found
  if (!imageEl) {
    imageEl = document.createElement('span');
    imageEl.textContent = '[Image missing]';
  }

  // Second column: text (from .callout-wrap)
  let textParts = [];
  let calloutWrap = null;
  for (const child of children) {
    if (child.classList.contains('callout-wrap')) {
      calloutWrap = child;
      break;
    }
  }
  if (calloutWrap) {
    // Heading (h3, keep as h3 and strong if present)
    const heading = calloutWrap.querySelector('h3');
    if (heading) textParts.push(heading);
    // Description (p)
    const desc = calloutWrap.querySelector('p');
    if (desc) textParts.push(desc);
    // CTA (a.button)
    const cta = calloutWrap.querySelector('a');
    if (cta) textParts.push(cta);
  } else {
    // Defensive: fallback for missing text
    const missingText = document.createElement('span');
    missingText.textContent = '[Text content missing]';
    textParts = [missingText];
  }

  // Compose rows: header, card row
  const rows = [
    headerRow,
    [imageEl, textParts]
  ];

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
