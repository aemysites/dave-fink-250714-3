/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row exactly as per example
  const cells = [['Cards (cards16)']];
  // Find all cards: top-level containers for each card
  const cardWrappers = element.querySelectorAll('.paragraph--type--video-item');

  cardWrappers.forEach(card => {
    // Left cell: image (first <img> inside this card)
    let leftCell = '';
    const img = card.querySelector('img');
    if (img) leftCell = img;

    // Right cell: title & description (reference source elements, not clones)
    const rightParts = [];
    // Title
    const titleEl = card.querySelector('.field--name-field-video-title');
    if (titleEl && titleEl.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent.trim();
      rightParts.push(strong);
    }
    // Description (all child nodes)
    const descEl = card.querySelector('.field--name-field-video-description');
    if (descEl) {
      // For each child, append as-is (preserve <p> and text nodes)
      Array.from(descEl.childNodes).forEach(node => {
        // If it's an element, reference the source element
        if (node.nodeType === Node.ELEMENT_NODE) {
          rightParts.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Wrap non-empty text in <p> for semantic/visual consistency
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          rightParts.push(p);
        }
      });
    }
    cells.push([leftCell, rightParts]);
  });

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
