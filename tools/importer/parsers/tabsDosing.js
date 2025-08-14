/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by spec
  const headerRow = ['Tabs (dosing)'];

  // Get the immediate <li> children (each represents a tab)
  const tabLis = element.querySelectorAll(':scope > li');

  // For each tab, extract the label as an element referencing the DOM
  const rows = Array.from(tabLis).map((li) => {
    // The label is inside <span><div>...</div></span>
    // We want to reference the label node directly for resilience (not just text)
    let labelDiv = li.querySelector('span > div');
    let labelNode = labelDiv ? labelDiv : document.createTextNode(li.textContent.trim());
    // There is no content in this HTML, so use empty string for content cell
    return [labelNode, ''];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(block);
}
