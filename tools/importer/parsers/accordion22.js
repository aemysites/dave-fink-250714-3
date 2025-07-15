/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per the block name
  const headerRow = ['Accordion (accordion22)'];
  const cells = [headerRow];

  // Select all direct descendant question/answer items (accordion items)
  // Each is a .paragraph--type--pfib-paragraph-qa-sub-items
  const accordionItems = element.querySelectorAll('.paragraph--type--pfib-paragraph-qa-sub-items');

  accordionItems.forEach((item) => {
    // Get the question element (title cell)
    const titleElem = item.querySelector('.field--name-field-qa-question');
    // Get the answer/content element (content cell)
    const contentElem = item.querySelector('.field--name-field-qa-answer');

    // Only add row if both title and content exist
    if (titleElem && contentElem) {
      cells.push([
        titleElem, // reference to the original element
        contentElem // reference to the original element
      ]);
    }
  });

  // Create the block table as per instructions
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element with the new block
  element.replaceWith(block);
}
