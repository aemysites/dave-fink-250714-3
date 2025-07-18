/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header row
  const headerRow = ['Carousel (carousel25)'];
  const rows = [headerRow];

  // Find the main swiper container for the carousel
  const swiper = element.querySelector('.swiper-container');
  if (swiper) {
    // Get all carousel slides
    const slides = swiper.querySelectorAll('.swiper-slide');
    slides.forEach((slide) => {
      // First cell: the image
      let imgCell = '';
      const pic = slide.querySelector('.pic');
      if (pic) {
        const img = pic.querySelector('img');
        if (img) {
          imgCell = img;
        }
      }
      // Second cell: text content (may be empty)
      let textCell = '';
      const des = slide.querySelector('.des');
      if (des) {
        // Include all children of the .des div in the cell
        // Reference the existing .des element directly if it exists and has content
        if (des.childNodes.length > 0) {
          textCell = Array.from(des.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim() !== ''));
          // If only one child node, just use that node directly
          if (textCell.length === 1) {
            textCell = textCell[0];
          } else if (textCell.length === 0) {
            textCell = '';
          }
        }
      }
      // Add new row only if at least image exists
      if (imgCell) {
        rows.push([imgCell, textCell]);
      }
    });
  }

  // Create the carousel block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
