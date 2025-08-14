/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare table rows: first row is header
  const rows = [['Cards']];

  // Get all direct children with class list-item
  const items = element.querySelectorAll(':scope > .list-item');
  items.forEach((item) => {
    const card = [];
    // Title from .hd span
    const hd = item.querySelector('.hd span');
    if (hd) {
      // Use <strong> for the heading, as in the visual style
      const strong = document.createElement('strong');
      strong.textContent = hd.textContent.trim();
      card.push(strong);
    }
    // Content from .desc
    const desc = item.querySelector('.desc');
    if (desc && desc.children.length > 0) {
      // We want to preserve each paragraph as-is inside the cell
      Array.from(desc.children).forEach((child) => {
        card.push(child);
      });
    }
    // Defensive: if no hd or desc, the card only
    rows.push([card]);
  });

  // Create block table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
