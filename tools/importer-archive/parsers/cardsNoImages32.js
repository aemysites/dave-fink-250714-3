/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block always starts with 'Cards' as header
  const headerRow = ['Cards'];

  // Get all direct card/list-item children
  const cards = Array.from(element.querySelectorAll(':scope > .list-item'));

  const cardRows = cards.map((card) => {
    // Each card may have a .hd (header), a .desc > p.puple (subtitle), and .desc > p (description)
    const hd = card.querySelector('.hd');
    let headingEl;
    if (hd && hd.textContent.trim()) {
      headingEl = document.createElement('strong');
      headingEl.textContent = hd.textContent.trim();
    }
    const puple = card.querySelector('.desc > .puple'); // subtitle
    // The description is the *second* p in .desc (if exists)
    const descPs = card.querySelectorAll('.desc > p');
    let descriptionEl;
    if (descPs.length > 1) {
      descriptionEl = descPs[1];
    }

    // Compose a single cell
    const cellContent = [];
    if (headingEl) cellContent.push(headingEl);
    if (puple) {
      // If there's a heading, ensure linebreak between heading and subtitle
      if (headingEl) cellContent.push(document.createElement('br'));
      cellContent.push(puple);
    }
    if (descriptionEl) {
      // If either of the above exists, add a linebreak before description
      if (headingEl || puple) cellContent.push(document.createElement('br'));
      cellContent.push(descriptionEl);
    }
    // If somehow all are missing, the card is empty; fallback: skip row
    // (But per provided HTML, always at least one p)
    return [cellContent.length ? cellContent : ''];
  });

  // Compose the table rows
  const cells = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
