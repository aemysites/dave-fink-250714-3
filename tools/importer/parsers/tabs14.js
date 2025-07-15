/* global WebImporter */
export default function parse(element, { document }) {
  // Get tab labels from <ul> (always present)
  const nav = element.querySelector('ul.nav-tabs, ul.fancyTabs');
  const tabLabelEls = nav ? nav.querySelectorAll('li span') : [];
  const tabLabels = Array.from(tabLabelEls).map(span => span.textContent.trim());

  // Get tab-content wrapper
  const contentWrapper = element.querySelector('.tab-content');
  // Each .tab-pane is a content panel for one tab, in the same order as the tab-labels
  const tabPaneEls = contentWrapper ? contentWrapper.querySelectorAll('.tab-pane') : [];
  // Defensive: if number of labels and panes don't match, fall back to tab-title order
  const tabTitleEls = contentWrapper ? contentWrapper.querySelectorAll('.tab-title') : [];

  const numTabs = Math.max(tabLabels.length, tabPaneEls.length);
  const rows = [];
  for (let i = 0; i < numTabs; i++) {
    // Prefer label from list, else from .tab-title, else 'Tab'
    let label = tabLabels[i];
    if (!label && tabTitleEls[i]) label = tabTitleEls[i].textContent.trim();
    if (!label) label = 'Tab';
    const contentEl = tabPaneEls[i];
    if (contentEl) {
      rows.push([label, contentEl]);
    }
  }

  // Build the cells array: header row as a single cell, then two-cell rows
  const cells = [['Tabs (tabs14)'], ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Set header cell colspan to match columns below (2 columns)
  const headerRow = table.querySelector('tr:first-child');
  if (headerRow && headerRow.children.length === 1 && rows.length > 0 && rows[0].length === 2) {
    headerRow.children[0].setAttribute('colspan', '2');
  }

  // Replace the original element with the block table
  element.replaceWith(table);
}
