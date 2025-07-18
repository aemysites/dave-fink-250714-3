/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cards4)'];

  // Attempt to find the card root for content extraction
  const cardRoot = element.querySelector('article.node');
  if (!cardRoot) return;

  // FIRST COLUMN: Get the card image or media block
  let imageCell = null;
  const leftImage = cardRoot.querySelector('.left-image');
  if (leftImage) {
    imageCell = leftImage;
  }

  // SECOND COLUMN: Gather all relevant text content, keeping all order/structure
  const textCellContent = [];

  // 1. .right-text: Contains heading and description
  const rightText = cardRoot.querySelector('.right-text');
  if (rightText) {
    // Use all child nodes to ensure text nodes are not lost
    rightText.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        textCellContent.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        textCellContent.push(span);
      }
    });
  }

  // 2. Add download button if present (as CTA)
  const download = cardRoot.querySelector('.download-wrapper a');
  if (download) {
    textCellContent.push(download);
  }

  // 3. Add language dropdown if present (just in case)
  const langSwitch = cardRoot.querySelector('.resource-lang-switch.form-select');
  if (langSwitch) {
    textCellContent.push(langSwitch);
  }

  // Create table rows: header, then card content
  const rows = [headerRow, [imageCell, textCellContent]];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
