/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must be exactly 'Cards (cards3)'
  const headerRow = ['Cards (cards3)'];

  // The summary paragraph is optional and comes first
  const summaryPara = element.querySelector('p.hide-on-desktop');

  // The main title ("Read More") from .read-more-title span, rendered bold as in the example
  const titleSpan = element.querySelector('.read-more-title span');
  let titleEl = null;
  if (titleSpan) {
    titleEl = document.createElement('strong');
    titleEl.textContent = titleSpan.textContent.trim();
  }

  // All content inside .read-more-text (paragraphs and lists)
  const readMoreText = element.querySelector('.read-more-text');
  // Defensive: may be undefined
  const mainContent = [];
  if (titleEl) mainContent.push(titleEl);
  if (readMoreText) {
    // Only direct children: allow for paragraphs and lists
    Array.from(readMoreText.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        mainContent.push(node);
      }
    });
  }

  // Compose final card cell: summary (if present), then title, then main content
  const cellContent = [];
  if (summaryPara) cellContent.push(summaryPara);
  cellContent.push(...mainContent);

  // Table: header row, then card row
  const rows = [
    headerRow,
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
