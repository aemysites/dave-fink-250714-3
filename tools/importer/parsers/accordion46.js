/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as requested
  const headerRow = ['Accordion (accordion46)'];
  const rows = [];

  // Find the QA block root
  let qaRoot = element;
  if (!element.classList.contains('pfib-paragraph-qa-items')) {
    qaRoot = element.querySelector('.pfib-paragraph-qa-items') || element;
  }

  // Find all sub-items (accordion entries)
  const itemsWrapper = qaRoot.querySelector('.field--name-field-qa-sub-items');
  if (itemsWrapper) {
    const itemDivs = itemsWrapper.querySelectorAll(':scope > .field__item');
    itemDivs.forEach((itemDiv) => {
      // Each itemDiv contains a .pfib-paragraph-qa-sub-items
      const qaSubItem = itemDiv.querySelector('.pfib-paragraph-qa-sub-items') || itemDiv;
      const questionElem = qaSubItem.querySelector('.field--name-field-qa-question');
      const answerElem = qaSubItem.querySelector('.field--name-field-qa-answer');

      // Only add rows if both question and answer exist
      if (questionElem && answerElem) {
        rows.push([
          questionElem,
          answerElem
        ]);
      }
    });
  }

  const tableCells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
