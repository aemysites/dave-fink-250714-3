/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as in the example
  const headerRow = ['Cards (cards23)'];
  const rows = [];
  // Each <li> is a card
  const cards = element.querySelectorAll(':scope > li');
  cards.forEach((li) => {
    // First cell: the image/icon
    let imageEl = null;
    const picDiv = li.querySelector('.pic');
    if (picDiv) {
      imageEl = picDiv.querySelector('img');
    }
    // Second cell: text content
    // Title: <p class="light-purple">
    const titleP = li.querySelector('p.light-purple');
    let titleEl = null;
    if (titleP) {
      // Use <strong> for the title (matches bolded heading style in example)
      const strong = document.createElement('strong');
      strong.textContent = titleP.textContent;
      titleEl = strong;
    }
    // Description: the next <p> after the title
    let descEl = null;
    const ps = li.querySelectorAll('p');
    ps.forEach((p) => {
      if (p !== titleP && !descEl) descEl = p;
    });
    // Compose text cell
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) {
      if (titleEl) textCell.push(document.createElement('br'));
      textCell.push(descEl);
    }
    rows.push([
      imageEl,
      textCell
    ]);
  });
  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
