/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare the table rows
  const rows = [];
  // Header row
  rows.push(['Cards']);

  // Select all .list-item direct children
  const cardEls = element.querySelectorAll(':scope > .list-item');
  cardEls.forEach(card => {
    // Find stage title
    const hd = card.querySelector('.hd');
    let stageTitle = null;
    if (hd && hd.textContent.trim()) {
      stageTitle = hd.textContent.trim();
    }
    // Find description area and paragraph nodes
    const desc = card.querySelector('.desc');
    let firstPara = null;
    let secondPara = null;
    if (desc) {
      const ps = desc.querySelectorAll('p');
      if (ps.length > 0) firstPara = ps[0];
      if (ps.length > 1) secondPara = ps[1];
    }
    // Compose the card content
    const cardContent = document.createElement('div');

    // Heading as bold (in the screenshots, heading is styled as bold in the card)
    if (stageTitle) {
      const heading = document.createElement('strong');
      heading.textContent = stageTitle;
      cardContent.appendChild(heading);
      cardContent.appendChild(document.createElement('br'));
    }

    // First paragraph (subtitle/lead)
    if (firstPara) {
      cardContent.appendChild(firstPara);
      cardContent.appendChild(document.createElement('br'));
    }
    // Second paragraph (description)
    if (secondPara) {
      cardContent.appendChild(secondPara);
    }

    rows.push([cardContent]);
  });
  // Create table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
