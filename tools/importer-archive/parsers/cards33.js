/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cards33)'];
  const cells = [headerRow];

  // Find each card wrapper
  // Handles .patient-item which is a direct child of the block
  const cardWrappers = element.querySelectorAll(':scope > .paragraph > .patient-item, :scope > .patient-item, :scope > div.patient-item');

  (cardWrappers.length ? cardWrappers : element.querySelectorAll(':scope > div'))
    .forEach(card => {
      // Use the full card block in case of structure variation
      // Get main banner image
      const bannerImg = card.querySelector('.talking-block-banner img');
      // Build image cell
      const imgCell = bannerImg || '';

      // Get block-content
      const blockContent = card.querySelector('.block-content');
      const textCellParts = [];
      if (blockContent) {
        // Title (first <p.purple>) -> strong
        const wrap = blockContent.querySelector('.block-content-wrap');
        let title = '';
        let description = '';
        if (wrap) {
          const ps = wrap.querySelectorAll('p');
          if (ps[0]) {
            const strong = document.createElement('strong');
            strong.innerHTML = ps[0].innerHTML;
            title = strong;
          }
          if (ps[1]) {
            description = ps[1];
          }
        }
        if (title) textCellParts.push(title);
        if (description) {
          if (title) textCellParts.push(document.createElement('br'));
          textCellParts.push(description);
        }
        // CTA button (a.button)
        const cta = blockContent.querySelector('a.button');
        if (cta) {
          textCellParts.push(document.createElement('br'));
          textCellParts.push(cta);
        }
      }
      cells.push([imgCell, textCellParts.length ? textCellParts : '']);
    });

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
