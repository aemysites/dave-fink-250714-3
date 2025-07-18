/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all cards in a resource-wrapper
  function getCards(wrapper) {
    return Array.from(wrapper.querySelectorAll(':scope > .download-pdf.views-row'));
  }

  // Find all resource-wrapper containers in order
  const wrappers = element.querySelectorAll('.resource-wrapper');

  // Collect all card rows
  let cardRows = [];
  wrappers.forEach(wrapper => {
    const cards = getCards(wrapper);
    cards.forEach(card => {
      // Left: image
      let imageEl = null;
      const picture = card.querySelector('.left-image picture');
      if (picture) {
        imageEl = picture.querySelector('img');
      }

      // Right: collect text content: title, desc, language select, CTA(s)
      const textEls = [];
      const right = card.querySelector('.right-text');
      // Title
      if (right) {
        const title = right.querySelector('h3.title');
        if (title) {
          // Create a new h3 for proper semantic structure, but reference text
          const h3 = document.createElement('h3');
          h3.textContent = title.textContent.trim();
          textEls.push(h3);
        }
        // Description
        const desc = right.querySelector('.desc');
        if (desc) {
          textEls.push(desc);
        }
      }
      // Language select (insert before CTAs)
      const langSel = card.querySelector('select.resource-lang-switch');
      if (langSel && langSel.options.length > 1) {
        textEls.push(langSel);
      }
      // CTAs: all download links
      const ctas = Array.from(card.querySelectorAll('.download-wrapper a.btn.resource-file'));
      ctas.forEach(cta => textEls.push(cta));
      
      cardRows.push([
        imageEl,
        textEls
      ]);
    });
  });

  // Build the table
  const cells = [
    ['Cards (cards17)'],
    ...cardRows
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
