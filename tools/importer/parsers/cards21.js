/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required
  const rows = [['Cards (cards21)']];

  // Find the select element containing the language options
  const select = element.querySelector('select');
  if (!select) return;

  // For each option, create a card row
  Array.from(select.options).forEach(option => {
    // First cell: no image/icon, leave empty
    const imageCell = '';

    // Second cell: language (bold) and link
    // Use a single container to ensure all text is included
    const cellDiv = document.createElement('div');
    // Bold language name
    const strong = document.createElement('strong');
    strong.textContent = option.textContent.trim();
    cellDiv.appendChild(strong);
    cellDiv.appendChild(document.createElement('br'));
    // If there is additional context or description in the UI, it would go here. Source only has language.
    // Add the download link with the language as text
    const link = document.createElement('a');
    link.href = option.value;
    link.textContent = option.textContent.trim();
    cellDiv.appendChild(link);
    // Add the row
    rows.push([imageCell, cellDiv]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
