/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per example
  const headerRow = ['Cards (cards44)'];
  const rows = [headerRow];

  // Select all card elements
  const cardItems = element.querySelectorAll('.field--name-field-resource > .field__item');

  cardItems.forEach(cardItem => {
    // IMAGE CELL: use <a> wrapping <img> if present, else just <img>
    let imgCell = null;
    const picLink = cardItem.querySelector('picture a');
    if (picLink) {
      imgCell = picLink;
    } else {
      const picImg = cardItem.querySelector('picture img');
      if (picImg) {
        imgCell = picImg;
      }
    }

    // TEXT CELL: gather all actual content, referencing existing elements
    const textCell = document.createElement('div');

    // Title (h2) in .right-text
    const rightText = cardItem.querySelector('.right-text');
    if (rightText) {
      // Heading
      const heading = rightText.querySelector('h2');
      if (heading) textCell.appendChild(heading);
      // Description
      const desc = rightText.querySelector('.desc');
      if (desc) textCell.appendChild(desc);
    }
    // CTA (button/link) in .resource-bottom .download-wrapper a
    const cta = cardItem.querySelector('.resource-bottom .download-wrapper a');
    if (cta) textCell.appendChild(cta);

    // If for some reason textCell is empty, fallback to all text content
    if (!textCell.hasChildNodes()) {
      textCell.textContent = cardItem.textContent.trim();
    }

    rows.push([imgCell, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
