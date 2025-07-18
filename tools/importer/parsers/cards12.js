/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Cards (cards12)'];
  // Find the card grid block
  const viewContent = element.querySelector('.view-content');
  if (!viewContent) return;
  // Get all card columns in order
  const cardCols = viewContent.querySelectorAll('.views-col');
  const rows = [headerRow];
  cardCols.forEach((col) => {
    // --- IMAGE ---
    const imageField = col.querySelector('.views-field-field-image img');
    // Use the existing image element directly
    const imageEl = imageField || '';
    // --- TEXT CELL ---
    const frag = document.createDocumentFragment();

    // Date (optional, as <time>)
    const dateField = col.querySelector('.views-field-created time');
    if (dateField) {
      frag.appendChild(dateField);
      frag.appendChild(document.createElement('br'));
    }
    // Title (optional, styled as heading, use strong for bold)
    const titleField = col.querySelector('.views-field-title');
    if (titleField && titleField.textContent.trim().length > 0) {
      const strong = document.createElement('strong');
      strong.textContent = titleField.textContent.trim();
      frag.appendChild(strong);
      frag.appendChild(document.createElement('br'));
    }
    // Description (optional)
    const descField = col.querySelector('.views-field-field-description');
    if (descField && descField.textContent.trim().length > 0) {
      const descDiv = document.createElement('div');
      descDiv.textContent = descField.textContent.trim();
      frag.appendChild(descDiv);
    }
    // CTA (optional)
    const fileField = col.querySelector('.views-field-field-file a');
    if (fileField) {
      frag.appendChild(fileField);
    }
    rows.push([imageEl, frag]);
  });
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
