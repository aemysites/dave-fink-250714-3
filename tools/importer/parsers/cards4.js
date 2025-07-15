/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const cells = [['Cards (cards4)']];

  // Locate all cards (article nodes) within this block
  const articles = element.querySelectorAll('article');
  articles.forEach((article) => {
    // --- Image/Icon cell ---
    let imageEl = null;
    // Find first <img> (if any)
    imageEl = article.querySelector('img') || '';

    // --- Text content cell ---
    // Will collect all relevant right-column content, preserving semantics
    const rightText = article.querySelector('.right-text');
    // We'll reference its element directly if possible
    const textParts = [];

    if (rightText) {
      // Add all children of rightText (including headings, descriptions)
      Array.from(rightText.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
          textParts.push(node);
        }
      });
    }
    // Add CTA (e.g., download button) if present
    const cta = article.querySelector('.download-wrapper a');
    if (cta) {
      textParts.push(document.createElement('br'));
      textParts.push(cta);
    }

    // Insert the row for this card
    cells.push([
      imageEl,
      textParts.length === 1 ? textParts[0] : textParts // Use array if >1 part, else single element
    ]);
  });

  // Create and perform the replacement
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
