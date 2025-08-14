/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match exactly
  const headerRow = ['Cards (cards44)'];
  const cards = [];

  // Find all card containers
  const cardArticles = element.querySelectorAll('article.node--type-resource');

  cardArticles.forEach((article) => {
    // IMAGE CELL: Find the first <img> inside the article
    let imageCell = '';
    const img = article.querySelector('img');
    if (img) imageCell = img;

    // TEXT CELL: Combine all elements that represent the text content, include button if present
    const textParts = [];
    // The right-text area typically has title (h2) and desc
    const rightText = article.querySelector('.right-text');
    if (rightText) {
      // Push all direct children of rightText (to preserve formatting, semantics)
      Array.from(rightText.children).forEach((el) => textParts.push(el));
    }
    // Download button is outside right-text in source HTML
    const downloadBtn = article.querySelector('.download-wrapper a.resource-file');
    if (downloadBtn) textParts.push(downloadBtn);
    // If textParts is still empty (edge case), use all text content as fallback
    if (textParts.length === 0) {
      textParts.push(document.createTextNode(article.textContent.trim()));
    }

    cards.push([imageCell, textParts]);
  });

  // Compose table data: header row first, then all cards
  const tableData = [headerRow, ...cards];
  const blockTable = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(blockTable);
}
