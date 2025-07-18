/* global WebImporter */
export default function parse(element, { document }) {
  // Extract tab labels from the navigation bar
  const navTabs = element.querySelector('ul.nav-tabs');
  const tabLabelEls = navTabs ? Array.from(navTabs.querySelectorAll('li > span')) : [];

  // Extract tab titles and panes from the tab-content area
  const tabContent = element.querySelector('.tab-content');
  const tabTitles = tabContent ? Array.from(tabContent.querySelectorAll('.tab-title')) : [];
  const tabPanes = tabContent ? Array.from(tabContent.querySelectorAll('.tab-pane')) : [];

  // Determine the number of tabs based on the max of labels, titles, and panes
  const tabCount = Math.max(tabLabelEls.length, tabTitles.length, tabPanes.length);

  // Construct the header row as per block requirements (single column)
  const rows = [['Tabs']];

  // For each tab, add a row: [Tab Label, Tab Content] (always 2 columns from second row onward)
  for (let i = 0; i < tabCount; i++) {
    // Prefer the .tab-title text, fall back to nav label, else empty string
    let label = '';
    if (tabTitles[i] && tabTitles[i].textContent) {
      label = tabTitles[i].textContent.trim();
    } else if (tabLabelEls[i] && tabLabelEls[i].textContent) {
      label = tabLabelEls[i].textContent.trim();
    }
    // Content is the corresponding .tab-pane element, if exists
    const content = tabPanes[i] || '';
    // Each tab row must be an array of two items: [label, content]
    rows.push([label, content]);
  }

  // Create the table and replace the source element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
