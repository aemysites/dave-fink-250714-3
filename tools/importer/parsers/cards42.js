/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const headerRow = ['Cards (cards42)'];

  // Get the image (mandatory)
  const image = element.querySelector('.drawer-top .img-wrap img');

  // Compose text cell
  // Start with the heading and summary
  const textCellNodes = [];
  const h3 = element.querySelector('.drawer-top .text-wrap .text-wrapper h3');
  if (h3) textCellNodes.push(h3);

  // Prefer to use the expanded content (read more), falling back to summary if needed
  const readMoreTextDiv = element.querySelector('.read-more-con .read-more-text');
  if (readMoreTextDiv) {
    // Add any <p> and <ul> in order, but avoid duplicating the summary
    const summaryText = element.querySelector('.drawer-top .text-wrapper p')?.textContent?.trim() || '';
    const readMoreParas = readMoreTextDiv.querySelectorAll('p');
    readMoreParas.forEach((p) => {
      if (p.textContent.trim() !== summaryText) {
        textCellNodes.push(p);
      }
    });
    const ul = readMoreTextDiv.querySelector('ul');
    if (ul) textCellNodes.push(ul);
  } else {
    // No read-more: just summary if present
    const summary = element.querySelector('.drawer-top .text-wrapper p');
    if (summary) textCellNodes.push(summary);
  }

  // Create rows
  const rows = [
    headerRow,
    [image, textCellNodes]
  ];

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
