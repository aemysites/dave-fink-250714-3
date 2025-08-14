/* global WebImporter */
export default function parse(element, { document }) {
  // Table header - must match example exactly
  const headerRow = ['Cards (cards4)'];

  // Identify the card source structure
  const article = element.querySelector('article.node');
  if (!article) return;

  // --- Image Cell (first column) ---
  // Use the entire .left-image div to ensure robustness and reference to original node
  let imageCell = article.querySelector('.left-image');
  if (!imageCell) {
    // Fallback: use first image in article if .left-image unavailable
    imageCell = article.querySelector('img');
  }

  // --- Text Cell (second column) ---
  // Gather all text-associated nodes and CTA from right-text and resource-bottom
  const textCellNodes = [];
  // Reference entire .right-text block for semantic meaning and completeness
  const rightText = article.querySelector('.right-text');
  if (rightText) {
    textCellNodes.push(rightText);
  }
  // Find CTA (download button) inside resource-bottom
  const resourceBottom = article.querySelector('.resource-bottom');
  if (resourceBottom) {
    const downloadBtn = resourceBottom.querySelector('a.btn.resource-file');
    if (downloadBtn) {
      textCellNodes.push(document.createElement('br'));
      textCellNodes.push(downloadBtn);
    }
  }
  // If no .right-text, fallback to any paragraph or description inside article
  if (textCellNodes.length === 0) {
    const desc = article.querySelector('.desc');
    if (desc) textCellNodes.push(desc);
    // As a final fallback, grab all direct child text nodes
    Array.from(article.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textCellNodes.push(span);
      }
    });
  }

  // Compose table rows
  const cells = [
    [headerRow[0]],
    [imageCell, textCellNodes]
  ];

  // Create block and replace element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
