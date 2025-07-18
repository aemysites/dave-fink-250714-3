/* global WebImporter */
export default function parse(element, { document }) {
  // Create the header row as in the example
  const headerRow = ['Cards (cards17)'];
  const cells = [headerRow];

  // Find the grid containing all cards
  const grid = element.querySelector('.views-view-grid');
  if (!grid) return;
  // Each row in the grid
  const rows = grid.querySelectorAll(':scope > .views-row');
  rows.forEach((row) => {
    // Each card is in a .views-col
    const cols = row.querySelectorAll(':scope > .views-col');
    cols.forEach((col) => {
      // First cell: image (existing element)
      let img = col.querySelector('.views-field-field-image img');

      // Second cell: text content
      const textContainer = document.createElement('div');

      // Title (bold, as in the example)
      const titleEl = col.querySelector('.views-field-title');
      if (titleEl) {
        const titleStrong = document.createElement('strong');
        titleStrong.textContent = titleEl.textContent.trim();
        textContainer.appendChild(titleStrong);
        textContainer.appendChild(document.createElement('br'));
      }
      // Description
      const descEl = col.querySelector('.views-field-field-description');
      if (descEl) {
        const descDiv = document.createElement('div');
        descDiv.textContent = descEl.textContent.trim();
        textContainer.appendChild(descDiv);
      }
      // CTA (download link)
      const fileLink = col.querySelector('.views-field-field-file a');
      if (fileLink) {
        const ctaDiv = document.createElement('div');
        ctaDiv.style.marginTop = '0.5em';
        ctaDiv.appendChild(fileLink); // Use existing anchor element
        textContainer.appendChild(ctaDiv);
      }

      // Add the card as a row, referencing elements
      cells.push([
        img || '',
        textContainer
      ]);
    });
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
