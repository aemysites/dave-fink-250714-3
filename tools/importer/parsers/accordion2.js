/* global WebImporter */
export default function parse(element, { document }) {
  // Build the header row exactly as required
  const rows = [['Accordion (accordion2)']];

  // Select all direct QA item wrappers
  const items = element.querySelectorAll(':scope > .field__item');

  items.forEach(item => {
    // Question element (title cell)
    let question = item.querySelector('.field--name-field-qa-question');
    if (!question) {
      question = document.createElement('div');
    }
    // Answer element (content cell)
    let answer = item.querySelector('.field--name-field-qa-answer');
    if (!answer) {
      answer = document.createElement('div');
    }
    // Each row is [question, answer], referencing the actual DOM nodes
    rows.push([question, answer]);
  });

  // Create and replace with the new table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
