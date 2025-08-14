/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example
  const cells = [['Cards (cards9)']];

  // Get all cards
  const cardItems = element.querySelectorAll('.paragraph--type--pfib-paragraph-block-item');

  cardItems.forEach(card => {
    // --- FIRST CELL (icon image, always present) ---
    const iconImg = card.querySelector('.item-top img');
    // If no icon (edge case), fallback to other img
    let firstCell = iconImg || card.querySelector('.field--name-field-block-image img');

    // --- SECOND CELL (text, CTA, photo image) ---
    // Collect content as array to preserve order, use original nodes
    const textContent = [];
    // Title as <strong>
    const title = card.querySelector('.item-top .title');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      textContent.push(strong);
    }
    // Description(s)
    const descPs = card.querySelectorAll('.item-top > p:not(.title)');
    descPs.forEach(p => textContent.push(p));
    // CTA link (if present)
    const ctaLink = card.querySelector('.field--name-field-link a');
    if (ctaLink) {
      textContent.push(document.createElement('br'));
      textContent.push(ctaLink);
    }
    // Main photo image (if present, always after CTA)
    const photoImg = card.querySelector('.field--name-field-block-image img');
    if (photoImg) {
      textContent.push(document.createElement('br'));
      textContent.push(photoImg);
    }
    // If no text at all (edge case), fallback to empty string
    const cell2 = textContent.length ? textContent : [''];
    cells.push([firstCell, cell2]);
  });

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
