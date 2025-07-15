/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in example
  const cells = [ ['Cards (cards9)'] ];

  // Find all card wrappers: direct children of .field--name-field-block-items > .field__item
  const cardsRoot = element.querySelector('.field--name-field-block-items');
  if (!cardsRoot) return;
  const cardItems = Array.from(cardsRoot.querySelectorAll(':scope > .field__item'));

  cardItems.forEach(cardWrapper => {
    const card = cardWrapper.querySelector('.pfib-paragraph-block-item');
    if (!card) return;

    // --- First cell: Icon from .item-top (always present)
    let iconImg = card.querySelector('.item-top img');
    // --- Second image cell: main card image at the bottom (optional)
    const mainImg = card.querySelector('.field--name-field-block-image img');
    let leftCell;
    // If both images are present and different, stack icon and main image vertically (icon above, image below)
    if (iconImg && mainImg && iconImg !== mainImg) {
      leftCell = [iconImg, document.createElement('br'), mainImg];
    } else if (mainImg) {
      leftCell = mainImg;
    } else if (iconImg) {
      leftCell = iconImg;
    } else {
      leftCell = '';
    }

    // --- Text cell: title, description, CTA
    // Title: .item-top > .title (wrap in <strong> per example)
    // Description: next <p> after .title
    // CTA: .field--name-field-link a
    const itemTop = card.querySelector('.item-top');
    let title, desc;
    if (itemTop) {
      title = itemTop.querySelector('.title');
      // Find the first <p> that's not the .title
      desc = Array.from(itemTop.querySelectorAll('p')).find(p => p !== title);
    }
    const cta = card.querySelector('.field--name-field-link a');

    const rightCellContent = [];
    if (title) {
      const strong = document.createElement('strong');
      strong.innerHTML = title.textContent;
      rightCellContent.push(strong);
    }
    if (desc) {
      rightCellContent.push(document.createElement('br'));
      rightCellContent.push(desc);
    }
    if (cta) {
      rightCellContent.push(document.createElement('br'));
      rightCellContent.push(cta);
    }

    cells.push([
      leftCell,
      rightCellContent
    ]);
  });

  // Build block table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
