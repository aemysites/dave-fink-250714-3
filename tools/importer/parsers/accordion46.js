/* global WebImporter */
export default function parse(element, { document }) {
  // Define block table header row
  const headerRow = ['Accordion (accordion46)'];

  // Find the accordion items container
  const itemsContainer = element.querySelector('.field--name-field-qa-sub-items');
  const rows = [];

  if (itemsContainer) {
    // Each direct .field__item > .paragraph is an accordion item
    const items = itemsContainer.querySelectorAll(':scope > .field__item > .paragraph');
    items.forEach((item) => {
      // Title cell - the question
      const question = item.querySelector('.field--name-field-qa-question');
      // Content cell - the answer
      const answer = item.querySelector('.field--name-field-qa-answer');
      // Only add non-empty rows
      if (question && answer) {
        rows.push([question, answer]);
      }
    });
  }

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the accordion block table
  element.replaceWith(table);
}
