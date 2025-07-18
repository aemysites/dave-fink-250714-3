/* global WebImporter */
export default function parse(element, { document }) {
  // Find the container with main content
  let banner = element.querySelector('.full-width-text-banner');
  if (!banner) {
    // Fallback: maybe just container
    banner = element.querySelector('.container');
  }
  if (!banner) {
    // fallback to element itself
    banner = element;
  }

  // The inner .container inside the full-width-text-banner
  let contentContainer = banner.querySelector('.container') || banner;

  // 1. Extract the background/image (optional)
  let img = null;
  const pictureBg = contentContainer.querySelector('.picture-bg img');
  if (pictureBg) {
    img = pictureBg;
  }

  // 2. Extract text elements: headings, paragraphs, buttons, and links
  const textNodes = [];

  // Headline (h2)
  const headline = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
  if (headline) textNodes.push(headline);

  // All paragraphs, but avoid button parents, and avoid duplication
  const pElems = Array.from(contentContainer.querySelectorAll('p'));
  pElems.forEach(p => textNodes.push(p));

  // Buttons (inside .btn-picture)
  const btnPicture = contentContainer.querySelector('.btn-picture');
  if (btnPicture) {
    // Add all links inside btnPicture
    const btnLinks = Array.from(btnPicture.querySelectorAll('a'));
    btnLinks.forEach(link => {
      // Only add if not already present
      if (!textNodes.includes(link)) textNodes.push(link);
    });
  }

  // Remove duplicate nodes (in case of mis-nesting)
  const uniqueNodes = [];
  textNodes.forEach(node => {
    if (node && !uniqueNodes.includes(node)) uniqueNodes.push(node);
  });

  // Build the table as per the spec
  const headerRow = ['Hero (hero8)'];
  const imageRow = [img ? img : ''];
  const contentRow = [uniqueNodes];

  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
