/* global WebImporter */
export default function parse(element, { document }) {
  // Table header must match example exactly
  const headerRow = ['Cards (cards17)'];
  const cells = [headerRow];

  // Find all resource wrappers (each contains a group of cards)
  const wrappers = element.querySelectorAll('.resource-wrapper');
  wrappers.forEach(wrapper => {
    const cards = wrapper.querySelectorAll('.download-pdf.views-row');
    cards.forEach(card => {
      // ----- First column: Image -----
      let imageEl = null;
      const leftImgDiv = card.querySelector('.left-image');
      if (leftImgDiv) {
        const img = leftImgDiv.querySelector('img');
        if (img) imageEl = img;
      }

      // ----- Second column: Text & CTA -----
      const cardContent = [];
      const rightText = card.querySelector('.right-text');
      if (rightText) {
        // Use heading and description as-is, reference existing elements
        const title = rightText.querySelector('h3.title');
        if (title) cardContent.push(title);
        const desc = rightText.querySelector('.desc');
        if (desc) cardContent.push(desc);
      }
      // If there's a language select (for multi-language docs), include it
      const langField = card.querySelector('.views-field-field-resource-file');
      if (langField) {
        const select = langField.querySelector('select.resource-lang-switch');
        if (select && select.options.length > 1) {
          cardContent.push(select);
        }
      }
      // Add the DOWNLOAD CTA button if present
      const ctaWrapper = card.querySelector('.download-wrapper');
      if (ctaWrapper) {
        const dlLink = ctaWrapper.querySelector('a.resource-file');
        if (dlLink) cardContent.push(dlLink);
      }
      // Add this row: always 2 columns, image and text/cta
      cells.push([
        imageEl ?? '',
        cardContent.length > 0 ? cardContent : ''
      ]);
    });
  });

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
