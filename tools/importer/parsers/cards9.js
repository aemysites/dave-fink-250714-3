/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header matches exactly
  const rows = [['Cards (cards9)']];

  // 2. Get all direct card items
  const cardItems = element.querySelectorAll('.field--name-field-block-items > .field__item');

  cardItems.forEach((item) => {
    const card = item.querySelector('.paragraph--type--pfib-paragraph-block-item');
    if (!card) return;

    // First cell: icon image at the top (if present)
    let iconImg = null;
    const iconImgCandidate = card.querySelector('.item-top img');
    if (iconImgCandidate) iconImg = iconImgCandidate;

    // Second cell: build as array of existing elements
    const secondCellContent = [];
    // Title (as <strong>)
    const title = card.querySelector('.item-top .title');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent;
      secondCellContent.push(strong);
    }
    // Description (all <p> in .item-top, except title)
    const descPs = Array.from(card.querySelectorAll('.item-top p')).filter(p => !p.classList.contains('title'));
    descPs.forEach(p => {
      secondCellContent.push(document.createElement('br'));
      secondCellContent.push(p);
    });
    // CTA (link at bottom)
    const ctaLink = card.querySelector('.field--name-field-link a');
    if (ctaLink) {
      secondCellContent.push(document.createElement('br'));
      secondCellContent.push(ctaLink);
    }
    // Main image (block image at the bottom)
    const blockImg = card.querySelector('.field--name-field-block-image img');
    if (blockImg) {
      secondCellContent.push(document.createElement('br'));
      secondCellContent.push(blockImg);
    }

    rows.push([
      iconImg,
      secondCellContent
    ]);
  });

  // Only create table if there are cards present
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
