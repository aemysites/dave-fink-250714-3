/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: as per requirements, must match exactly
  const headerRow = ['Accordion (accordion2)'];

  // Get all direct accordion items (each .field__item contains one Q/A pair)
  const items = Array.from(element.querySelectorAll(':scope > .field__item'));

  // For each item, extract the question and answer elements
  const rows = items.map(item => {
    // Get the question (title cell)
    const titleEl = item.querySelector('.field--name-field-qa-question');
    // Get the answer (content cell)
    const contentEl = item.querySelector('.field--name-field-qa-answer');
    // Defensive: fallbacks in case of missing data
    return [titleEl || document.createTextNode(''), contentEl || document.createTextNode('')];
  });

  // Compose the final table data
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
