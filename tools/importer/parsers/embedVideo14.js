/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all tab items, preserving structure and text
  // Retain semantics: use a new <ul> with the tab names as <li> to preserve list structure.
  const tabList = document.createElement('ul');
  tabList.className = 'imported-tabs'; // optional, to mark as imported
  Array.from(element.children).forEach((li) => {
    if (li && li.textContent && li.textContent.trim()) {
      // clone li structure but clean extraneous classes
      const newLi = document.createElement('li');
      newLi.textContent = li.textContent.trim();
      tabList.appendChild(newLi);
    }
  });
  // If no tab items, fallback to full text content
  let cellContent;
  if (tabList.children.length > 0) {
    cellContent = tabList;
  } else {
    cellContent = element.textContent.trim();
  }
  const headerRow = ['Embed (embedVideo14)'];
  const cells = [
    headerRow,
    [cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}