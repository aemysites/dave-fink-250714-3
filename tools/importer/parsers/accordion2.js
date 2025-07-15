/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as shown in the example
  const headerRow = ['Accordion (accordion2)'];
  const rows = [headerRow];

  // Find all top-level field__item elements (accordion items)
  const itemElements = element.querySelectorAll(':scope > .field__item');

  itemElements.forEach(item => {
    // Each item contains a paragraph
    const para = item.querySelector(':scope > .paragraph');
    if (!para) return;

    // Extract accordion title and content
    const question = para.querySelector('.field--name-field-qa-question');
    const answer = para.querySelector('.field--name-field-qa-answer');
    // Only create a row if both are present
    if (question && answer) {
      rows.push([question, answer]);
    }
  });

  // Create the block table using the provided helper
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}
