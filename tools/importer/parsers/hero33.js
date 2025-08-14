/* global WebImporter */
export default function parse(element, { document }) {
  // Block header (must match exactly)
  const headerRow = ['Hero (hero33)'];

  // --- IMAGE CELL (Row 2) ---
  let imageCell = '';
  const rightWrap = element.querySelector('.right-wrap');
  if (rightWrap) {
    // Prefer desktop image if present, otherwise mobile
    const imgPc = rightWrap.querySelector('img.pc');
    const imgMobile = rightWrap.querySelector('img.mobile');
    // Use whichever exists (should always be one)
    imageCell = imgPc ? imgPc : (imgMobile ? imgMobile : '');
  }

  // --- CONTENT CELL (Row 3) ---
  const leftWrap = element.querySelector('.left-wrap');
  const contentCell = [];
  if (leftWrap) {
    // Title (h2)
    const h2 = leftWrap.querySelector('h2');
    if (h2) contentCell.push(h2);
    // Subheading (p.sub-title)
    const subTitle = leftWrap.querySelector('p.sub-title');
    if (subTitle) contentCell.push(subTitle);
    // Paragraph (p.section-text)
    const sectionText = leftWrap.querySelector('p.section-text');
    if (sectionText) contentCell.push(sectionText);
  }
  // Ensure the content cell is not empty
  const finalContentCell = contentCell.length ? contentCell : [''];

  // --- TABLE CONSTRUCTION ---
  const cells = [
    headerRow,              // Row 1: Block Name (Single cell)
    [imageCell],            // Row 2: Image (Single cell)
    [finalContentCell],     // Row 3: Content (Single cell)
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(block);
}
