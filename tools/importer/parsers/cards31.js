/* global WebImporter */
export default function parse(element, { document }) {
  // Ensure we reference existing elements, not clones or strings
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Get all top-level patient item wrappers (cards)
  const cardNodes = element.querySelectorAll(':scope > .paragraph--type--pfib-paragraph-patient-items > .field__item.patient-item, :scope > .field__item.patient-item');
  // Fallback: handle alternative markup (for robustness)
  const fallbackNodes = element.querySelectorAll(':scope > .paragraph--type--pfib-paragraph-patient-items > .paragraph--type--pfib-paragraph-patient-item, :scope > .paragraph--type--pfib-paragraph-patient-item');
  const allCards = cardNodes.length ? cardNodes : fallbackNodes;
  
  allCards.forEach(card => {
    // Compose image cell: banner image, then icon (both are required by design)
    const bannerImg = card.querySelector('.talking-block-banner img');
    const iconImg = card.querySelector('.icon img');
    const imgCellContent = [];
    if (bannerImg) imgCellContent.push(bannerImg);
    if (iconImg) imgCellContent.push(iconImg);
    let imgCell = '';
    if (imgCellContent.length === 2) {
      // Both images: stack in a div
      const wrap = document.createElement('div');
      imgCellContent.forEach(el => { wrap.appendChild(el); wrap.appendChild(document.createElement('br')); });
      imgCell = wrap;
    } else if (imgCellContent.length === 1) {
      imgCell = imgCellContent[0];
    }
    // Compose text cell: heading, description, CTA
    const blockContent = card.querySelector('.block-content');
    const textCellContent = [];
    if (blockContent) {
      // Title: purple p
      const title = blockContent.querySelector('p.purple');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCellContent.push(strong);
        textCellContent.push(document.createElement('br'));
      }
      // Description: first p NOT .purple
      const desc = Array.from(blockContent.querySelectorAll('p')).find(p => !p.classList.contains('purple'));
      if (desc) {
        textCellContent.push(document.createTextNode(desc.textContent.trim()));
        textCellContent.push(document.createElement('br'));
      }
      // CTA: a.button
      const cta = blockContent.querySelector('a.button');
      if (cta) {
        textCellContent.push(cta);
      }
    }
    rows.push([
      imgCell || '',
      textCellContent.length === 1 ? textCellContent[0] : textCellContent
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
