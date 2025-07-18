/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion21)'];
  const rows = [headerRow];

  // Find the top-level container for FAQ accordion items
  // Nested structure: .field--name-field-qa-items > .field__item > ... > .field--name-field-qa-sub-items
  const qaItemsContainer = element.querySelector('.field--name-field-qa-items');
  if (!qaItemsContainer) return;

  // Select all QA sub-item paragraphs (these are the accordion items)
  const qaItems = qaItemsContainer.querySelectorAll('.paragraph--type--pfib-paragraph-qa-sub-items');

  qaItems.forEach((qaItem) => {
    // The title for the accordion (the question)
    const question = qaItem.querySelector('.field--name-field-qa-question');
    // The content for the accordion (the answer)
    const answer = qaItem.querySelector('.field--name-field-qa-answer');
    if (question && answer) {
      // Use the existing elements directly (not clones)
      rows.push([question, answer]);
    }
  });

  // Create and insert the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
