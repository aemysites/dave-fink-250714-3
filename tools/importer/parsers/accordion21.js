/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table Header: EXACT match
  const headerRow = ['Accordion (accordion21)'];
  const rows = [headerRow];

  // 2. Find the container with all FAQ items
  let faqItemsContainer = element.querySelector('.field--name-field-qa-items.field__items');
  if (!faqItemsContainer) faqItemsContainer = element;

  // 3. Get each accordion item (each .field__item in the container)
  const faqItems = faqItemsContainer.querySelectorAll(':scope > .field__item');

  faqItems.forEach((item) => {
    // Each item should have a question and answer
    // The direct child or nested .paragraph--type--pfib-paragraph-qa-sub-items
    let qaParagraph = item.querySelector('.paragraph--type--pfib-paragraph-qa-sub-items');
    if (!qaParagraph) qaParagraph = item;

    // Find question and answer by class
    const question = qaParagraph.querySelector('.field--name-field-qa-question');
    const answer = qaParagraph.querySelector('.field--name-field-qa-answer');

    // Edge case: if question or answer is missing, skip this item
    if (question && answer) {
      rows.push([question, answer]); // Reference EXISTING elements
    }
  });

  // 4. Create block table ONLY (no Section Metadata, no <hr>, no markdown)
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
