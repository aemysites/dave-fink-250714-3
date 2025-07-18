/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all card containers
  const wrappers = [];
  element.querySelectorAll('.resource-wrapper').forEach(wrapper => {
    wrapper.querySelectorAll('.download-pdf.views-row').forEach(card => {
      wrappers.push(card);
    });
  });

  // Build card rows: [image, content]
  const rows = wrappers.map(card => {
    // --- Image cell ---
    let imgEl = null;
    const picture = card.querySelector('.left-image picture');
    if (picture) {
      imgEl = picture.querySelector('img');
    }
    const imageCell = imgEl || '';

    // --- Text content ---
    const textCellElements = [];
    // Title (h3.title)
    const title = card.querySelector('.right-text h3.title');
    if (title && title.textContent) {
      const titleEl = document.createElement('strong');
      titleEl.textContent = title.textContent.trim();
      textCellElements.push(titleEl);
      textCellElements.push(document.createElement('br'));
    }
    // Description (desc)
    const desc = card.querySelector('.right-text .desc');
    if (desc && desc.textContent) {
      const descEl = document.createElement('span');
      descEl.textContent = desc.textContent.trim();
      textCellElements.push(descEl);
      textCellElements.push(document.createElement('br'));
    }
    // Language dropdown (optional, >1 option)
    const langSelect = card.querySelector('select.resource-lang-switch');
    if (langSelect && langSelect.options.length > 1) {
      textCellElements.push(langSelect);
      textCellElements.push(document.createElement('br'));
    }
    // Download button (always present)
    const downloadBtn = card.querySelector('.download-wrapper a.resource-file');
    if (downloadBtn) {
      textCellElements.push(downloadBtn);
    }

    // Clean up trailing <br>
    while (textCellElements.length && textCellElements[textCellElements.length-1].tagName === 'BR') {
      textCellElements.pop();
    }

    return [imageCell, textCellElements];
  });

  // Table header per spec
  const cells = [
    ['Cards (cards18)'],
    ...rows,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
