/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main swiper container inside the element
  const swiper = element.querySelector('.swiper-container');
  if (!swiper) return;

  // Get all slides
  const slides = swiper.querySelectorAll('.swiper-slide');

  // Prepare table rows
  const rows = [];
  // Header row as in the example
  rows.push(['Carousel (carousel25)']);

  slides.forEach(slide => {
    // First cell: image (mandatory)
    let img = slide.querySelector('img');
    let imgCell = img ? img : '';

    // Second cell: text content (optional)
    let desDiv = slide.querySelector('.des');
    let contentCell = '';
    if (desDiv) {
      // Prefer using all contents of desDiv so links or formatting are preserved
      const nodes = Array.from(desDiv.childNodes).filter(node => {
        // Remove whitespace-only text nodes
        return !(node.nodeType === 3 && !/\S/.test(node.textContent));
      });
      if (nodes.length === 1) {
        contentCell = nodes[0];
      } else if (nodes.length > 1) {
        contentCell = nodes;
      }
    }
    rows.push([imgCell, contentCell]);
  });

  // Create the carousel table block using referenced elements
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
