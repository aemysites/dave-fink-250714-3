/* global WebImporter */
export default function parse(element, { document }) {
  // Define the header as in the requirements
  const headerRow = ['Accordion (accordion49)'];
  const rows = [headerRow];

  // Get the QA sub-items container
  const qaSubItemsContainer = element.querySelector('.field--name-field-qa-sub-items');
  if (!qaSubItemsContainer) return;

  // Get all QA items (accordion items)
  const qaItems = qaSubItemsContainer.querySelectorAll(':scope > .field__item');

  qaItems.forEach((item) => {
    // For each QA item, get question and answer elements directly
    const question = item.querySelector('.field--name-field-qa-question');
    const answer = item.querySelector('.field--name-field-qa-answer');
    // Only add rows for items that have both question and answer
    if (question && answer) {
      rows.push([
        question,
        answer
      ]);
    }
  });

  // Only create the block if we have at least one QA row (besides the header)
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
