/* global WebImporter */
export default function parse(element, { document }) {
  // Table header, exactly as per instructions
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Select all cards: each <li>
  const cardItems = Array.from(element.querySelectorAll(':scope > li'));

  cardItems.forEach((li) => {
    // First cell: image/icon (mandatory)
    let imgCell = null;
    const picDiv = li.querySelector(':scope > .pic');
    if (picDiv) {
      // Reference the <img> element directly if present
      const img = picDiv.querySelector('img');
      imgCell = img ? img : picDiv;
    }
    // If no image, set cell to empty string
    if (!imgCell) imgCell = '';

    // Second cell: text content (mandatory)
    // Title: <p class="light-purple">
    // Description: following <p>
    const textContent = [];
    const titleEl = li.querySelector(':scope > p.light-purple');
    if (titleEl) {
      // Preserve semantic meaning: use <strong> for heading
      const strong = document.createElement('strong');
      strong.textContent = titleEl.textContent;
      textContent.push(strong);
    }
    // Description(s): all <p> except .light-purple
    const descEls = Array.from(li.querySelectorAll(':scope > p:not(.light-purple)'));
    descEls.forEach((descEl) => {
      textContent.push(descEl);
    });
    // If nothing found, cell is empty string
    const textCell = textContent.length > 0 ? textContent : '';

    rows.push([imgCell, textCell]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}