/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must match the example exactly
  const headerRow = ['Accordion (accordion7)'];

  // Extract the title: look for .read-more-title, use its full content (including span/text)
  let titleElem = element.querySelector('.read-more-title');
  if (!titleElem) {
    // fallback: use first child that's not content or hidden on desktop
    titleElem = Array.from(element.children).find(el => !el.classList.contains('read-more-con') && !el.classList.contains('hide-on-desktop')) || document.createTextNode('');
  }

  // Extract the content: everything inside .read-more-con (flatten if single child)
  let contentElem;
  const contentContainer = element.querySelector('.read-more-con');
  if (contentContainer) {
    // If .read-more-con has only one child (like .read-more-text), use its children for resilience
    if (contentContainer.children.length === 1) {
      // If the single child is a div, we use its children as array, else use as is
      const onlyChild = contentContainer.children[0];
      if (onlyChild.children && onlyChild.children.length > 0) {
        contentElem = Array.from(onlyChild.children);
      } else {
        contentElem = [onlyChild];
      }
    } else {
      // Otherwise, use all children of .read-more-con as array
      contentElem = Array.from(contentContainer.children);
    }
  } else {
    // fallback: any child that's not the title or hidden
    contentElem = Array.from(element.children).filter(el => el !== titleElem && !el.classList.contains('hide-on-desktop'));
  }
  // If nothing found (should not happen), fallback to empty
  if (!contentElem || (Array.isArray(contentElem) && contentElem.length === 0)) {
    contentElem = document.createTextNode('');
  }

  // Compose table
  const cells = [
    headerRow,
    [titleElem, contentElem],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
