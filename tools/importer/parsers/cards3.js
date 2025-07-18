/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly one column
  const rows = [['Cards (cards3)']];

  // Build the card row (two columns)
  const textCell = document.createElement('div');

  // Lead-in paragraph
  const lead = element.querySelector('p.hide-on-desktop');
  if (lead) textCell.appendChild(lead);

  // Title as <h3>
  const titleSpan = element.querySelector('.read-more-title span');
  if (titleSpan) {
    const h3 = document.createElement('h3');
    h3.textContent = titleSpan.textContent;
    textCell.appendChild(h3);
  }

  // All content under .read-more-text
  const moreText = element.querySelector('.read-more-text');
  if (moreText) {
    Array.from(moreText.childNodes).forEach(node => {
      textCell.appendChild(node);
    });
  }

  // Add the card row: two columns (image cell, text cell)
  rows.push(['', textCell]);

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
