/* global WebImporter */
export default function parse(element, { document }) {
  // Block header as per requirements
  const headerRow = ['Hero (hero24)'];

  // This block has no background image in the source HTML, provide an empty row
  const imageRow = [''];

  // Extract the main CTA/text content
  let contentElem = '';
  // Attempt to robustly get the span with text + link
  const ctaTextSpan = element.querySelector('.ibrance-tablets-cta .cta-text-wrap .text');
  if (ctaTextSpan) {
    contentElem = ctaTextSpan;
  }

  // Compose table rows
  const rows = [
    headerRow,
    imageRow,
    [contentElem]
  ];

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
