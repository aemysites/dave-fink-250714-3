/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Tabs block
  const headerRow = ['Tabs'];

  // Get all tab labels from the <ul> nav structure
  const tabLabels = Array.from(
    element.querySelectorAll('ul.nav-tabs > li > span')
  ).map((el) => el.textContent.trim());

  // Get tab content panes and their titles
  const tabTitles = Array.from(element.querySelectorAll('div.tab-title'));
  const tabPanes = Array.from(element.querySelectorAll('div.tab-pane'));

  // Prepare the rows for the table
  const rows = [headerRow];

  // For each tab, combine label and its pane content
  const tabCount = Math.min(tabLabels.length, tabTitles.length, tabPanes.length);
  for (let i = 0; i < tabCount; i++) {
    const label = tabLabels[i] || (tabTitles[i] && tabTitles[i].textContent.trim()) || '';
    const content = tabPanes[i];
    if (label && content) {
      rows.push([label, content]);
    }
  }

  // Edge case: fallback if tabTitles is missing or shorter than tabLabels
  if (rows.length === 1 && tabLabels.length && tabPanes.length && tabLabels.length === tabPanes.length) {
    for (let i = 0; i < tabLabels.length; i++) {
      rows.push([tabLabels[i], tabPanes[i]]);
    }
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
