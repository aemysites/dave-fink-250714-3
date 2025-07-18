/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name
  const headerRow = ['Cards (cards12)'];

  // Extract image (first img in block)
  const img = element.querySelector('img');

  // Extract text content
  const textCellContent = [];

  // Title (h3 inside .text-wrap)
  const h3 = element.querySelector('.drawer-top .text-wrap h3');
  if (h3) textCellContent.push(h3);

  // Short description (p inside .drawer-top .text-wrap)
  const shortDesc = element.querySelector('.drawer-top .text-wrap p');
  if (shortDesc) textCellContent.push(shortDesc);

  // "Read More" link (as an <a> if present)
  const readMoreTitle = element.querySelector('.read-more-title');
  if (readMoreTitle && readMoreTitle.textContent.trim()) {
    const a = document.createElement('a');
    a.href = '#'; // No href in source, use placeholder
    a.textContent = readMoreTitle.textContent.trim();
    textCellContent.push(a);
  }

  // Full content from .read-more-text (all child elements)
  const readMoreText = element.querySelector('.read-more-con .read-more-text');
  if (readMoreText) {
    Array.from(readMoreText.children).forEach((child) => {
      textCellContent.push(child);
    });
  }

  // Compose rows for the cards block
  const cells = [
    headerRow,
    [img, textCellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
