/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row
  const headerRow = ['Cards (cards12)'];

  // Find the grid which contains the cards
  const grid = element.querySelector('.views-view-grid');
  if (!grid) return;

  // Find all cards (each views-col in each views-row)
  const cards = [];
  const rows = grid.querySelectorAll('.views-row');
  rows.forEach(row => {
    const cols = row.querySelectorAll('.views-col');
    cols.forEach(col => {
      // Image (first column)
      const imgField = col.querySelector('.views-field-field-image .field-content');
      let imgEl = imgField ? imgField.querySelector('img') : null;
      // Use null if missing (edge case)

      // Text (second column)
      // Compose a wrapper div for all text parts
      const textDiv = document.createElement('div');
      // Date (optional)
      const timeEl = col.querySelector('.views-field-created time');
      if (timeEl) {
        const timeDiv = document.createElement('div');
        timeDiv.appendChild(timeEl);
        textDiv.appendChild(timeDiv);
      }
      // Title (optional, use heading)
      const titleDiv = col.querySelector('.views-field-title');
      if (titleDiv) {
        const h3 = document.createElement('h3');
        h3.textContent = titleDiv.textContent;
        textDiv.appendChild(h3);
      }
      // Description (optional)
      const descDiv = col.querySelector('.views-field-field-description');
      if (descDiv) {
        const p = document.createElement('div');
        p.innerHTML = descDiv.innerHTML;
        textDiv.appendChild(p);
      }
      // CTA (optional, download link)
      const fileLink = col.querySelector('.views-field-field-file .field-content a');
      if (fileLink) {
        const ctaDiv = document.createElement('div');
        ctaDiv.appendChild(fileLink);
        textDiv.appendChild(ctaDiv);
      }
      // Push row as [img, textDiv]
      cards.push([imgEl, textDiv]);
    });
  });

  // Compose table data
  const tableData = [headerRow, ...cards];

  // Create block table and replace
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
