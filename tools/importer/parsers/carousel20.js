/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must have exactly one column with the header text
  const headerRow = ['Carousel (carousel20)'];

  // Find the <select> element containing language options
  const select = element.querySelector('select');
  const slideRows = [];

  if (select) {
    Array.from(select.options).forEach(opt => {
      // First cell: no image in HTML, so empty string
      // Second cell: Language name as heading, and link to PDF
      const langHeading = document.createElement('h2');
      langHeading.textContent = opt.textContent.trim();
      const link = document.createElement('a');
      link.href = opt.value;
      link.textContent = opt.textContent.trim();
      slideRows.push(['', [langHeading, document.createElement('br'), link]]);
    });
  }

  // Compose the table: header row (1 col), each slide (2 cols)
  // This is allowed by the WebImporter convention and matches the example
  const cells = [headerRow, ...slideRows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
