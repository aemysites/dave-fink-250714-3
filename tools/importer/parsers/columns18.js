/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matches example exactly
  const headerRow = ['Columns (columns18)'];

  // Get direct <li> children from the provided <ul>
  const items = Array.from(element.querySelectorAll(':scope > li'));
  // Edge case: if no <li> found, just output empty columns
  let col1Items = [], col2Items = [];
  if (items.length) {
    // Split into two columns as evenly as possible
    const mid = Math.ceil(items.length / 2);
    col1Items = items.slice(0, mid);
    col2Items = items.slice(mid);
  }

  // Create new <ul> for each column, referencing original <li>
  const ul1 = document.createElement('ul');
  col1Items.forEach(li => ul1.appendChild(li));
  const ul2 = document.createElement('ul');
  col2Items.forEach(li => ul2.appendChild(li));

  // Build table structure
  const rows = [
    headerRow,
    [ul1, ul2]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
