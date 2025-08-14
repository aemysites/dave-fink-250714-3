/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row exactly matching the block name
  const headerRow = ['Cards (cards42)'];

  // Find image for card (first cell)
  const img = element.querySelector('.drawer-top .img-wrap img');

  // Compose text for card (second cell)
  // We'll gather heading, description, and read more content all in one div
  const textCell = document.createElement('div');

  // Heading (preserve heading level and keep direct reference)
  const heading = element.querySelector('.drawer-top .text-wrap h3');
  if (heading) textCell.appendChild(heading);

  // Description (desktop paragraph, if present)
  const descDesktop = element.querySelector('.drawer-top .text-wrap p');
  if (descDesktop) textCell.appendChild(descDesktop);

  // Hide-on-desktop paragraph (mobile description), only add if different from desktop
  const descMobile = element.querySelector('.read-more-wrap p.hide-on-desktop');
  if (descMobile && (!descDesktop || descMobile.textContent.trim() !== descDesktop.textContent.trim())) {
    textCell.appendChild(descMobile);
  }

  // Read more section: title and details
  const readMoreWrap = element.querySelector('.read-more-wrap');
  if (readMoreWrap) {
    // Read more title: often 'Read More'
    const readMoreTitle = readMoreWrap.querySelector('.read-more-title');
    if (readMoreTitle) {
      textCell.appendChild(readMoreTitle);
    }
    // Read more content: paragraphs and lists
    const readMoreCon = readMoreWrap.querySelector('.read-more-con .read-more-text');
    if (readMoreCon) {
      Array.from(readMoreCon.children).forEach(child => {
        textCell.appendChild(child);
      });
    }
  }

  // Compose final table: two columns, header first row, card second row
  const cells = [
    headerRow,
    [img, textCell]
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
