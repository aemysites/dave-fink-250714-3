/* global WebImporter */
export default function parse(element, { document }) {
  // This block represents a carousel language switcher, with each option as a slide
  const select = element.querySelector('select');
  if (!select) return;

  // Prepare the header row exactly matching the spec
  const headerRow = ['Carousel (carousel20)'];
  const rows = [headerRow];

  // Each <option> corresponds to a language resource
  Array.from(select.options).forEach(option => {
    const url = option.value;
    const lang = option.textContent.trim();
    // Compose the cell with all text (language name) and the link
    // Use elements (not just strings)
    const container = document.createElement('div');
    if (lang) {
      const heading = document.createElement('h2');
      heading.textContent = lang;
      container.appendChild(heading);
    }
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = url;
      container.appendChild(link);
    }
    // Each row is [image, text]. No image, so blank string in first cell
    rows.push(['', container]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}