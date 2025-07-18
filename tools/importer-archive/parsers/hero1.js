/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the full-width text banner (main content block)
  const fullWidthBanner = element.querySelector('.full-width-text-banner');
  if (!fullWidthBanner) return;

  // Find the innermost container that holds the content
  const container = fullWidthBanner.querySelector('.container') || fullWidthBanner;

  // Extract the picture/image if present
  let imageEl = null;
  const pictureBg = fullWidthBanner.querySelector('.picture-bg');
  if (pictureBg) {
    const img = pictureBg.querySelector('img');
    if (img) {
      imageEl = img;
    }
  }

  // Extract heading (title)
  let heading = null;
  // Accept most probable heading tags, prefer h1-h3
  for (let i = 1; i <= 6; i++) {
    const h = container.querySelector('h' + i);
    if (h) {
      heading = h;
      break;
    }
  }

  // Extract subheading: the first paragraph after heading (if any)
  let subheading = null;
  let ctaElements = [];
  let textParas = [];

  // Collect all paragraphs in order
  const paragraphs = Array.from(container.querySelectorAll('p'));
  if (paragraphs.length > 0) {
    // If the first p is immediately after the heading, treat as subheading
    if (paragraphs[0]) {
      subheading = paragraphs[0];
    }
    // Add all paragraphs as text except the one used as subheading
    textParas = paragraphs.slice(1);
  }

  // Extract call-to-action links (buttons). In the .btn-picture div, take all <a> tags
  const btnPictureDiv = container.querySelector('.btn-picture');
  if (btnPictureDiv) {
    ctaElements = Array.from(btnPictureDiv.querySelectorAll('a'));
  }

  // Also, sometimes there is an additional link in a paragraph (as in the example)
  // We already collected all paragraphs in textParas, so they will be included below

  // Compose the content block in the correct order
  const contentBlock = [];
  if (heading) contentBlock.push(heading);
  if (subheading) contentBlock.push(subheading);
  if (ctaElements.length > 0) contentBlock.push(...ctaElements);
  if (textParas.length > 0) contentBlock.push(...textParas);

  // Prepare the block rows
  const rows = [];
  rows.push(['Hero (hero1)']); // Header row, exactly as in the example
  // Background image row (row 2)
  rows.push([imageEl ? imageEl : '']);
  // Content row (row 3). If there is nothing, insert empty string
  rows.push([contentBlock.length > 0 ? contentBlock : '']);

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
