/* global WebImporter */
export default function parse(element, { document }) {
  // Get .left-wrap and .right-wrap blocks
  const leftWrap = element.querySelector('.left-wrap');
  const rightWrap = element.querySelector('.right-wrap');

  // Prepare image: use the first .pc image if present, else the first image in rightWrap
  let image = null;
  if (rightWrap) {
    image = rightWrap.querySelector('img.pc') || rightWrap.querySelector('img');
  }

  // Compose a div containing the inner content (headings and paragraphs)
  const textContainer = document.createElement('div');
  if (leftWrap) {
    // Title (likely h2)
    const title = leftWrap.querySelector('h1, h2, h3, h4, h5, h6');
    if (title) textContainer.appendChild(title);
    // Subheading (subtitle)
    const sub = leftWrap.querySelector('.sub-title');
    if (sub) textContainer.appendChild(sub);
    // Section text (paragraph)
    const body = leftWrap.querySelector('.section-text');
    if (body) textContainer.appendChild(body);
  }

  // Construct block table structure
  const cells = [
    ['Hero (hero33)'], // block header
    [image ? image : ''], // background image row, or empty
    [textContainer], // content row
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
