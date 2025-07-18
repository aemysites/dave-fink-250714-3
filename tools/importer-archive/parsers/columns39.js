/* global WebImporter */
export default function parse(element, { document }) {
  // Find the caremate-section which wraps the content
  const caremateSection = element.querySelector('.caremate-section');
  if (!caremateSection) return;

  // Find the inner .container which has columns
  const colContainer = caremateSection.querySelector('.container');
  if (!colContainer) return;

  // Find the two column divs (col-md-5, col-md-7)
  const col5 = colContainer.querySelector('.col-md-5');
  const col7 = colContainer.querySelector('.col-md-7');

  // Extract content for each column, preserving all non-empty nodes
  let leftContent;
  if (col5) {
    leftContent = Array.from(col5.childNodes).filter(node => {
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim().length > 0;
    });
    if (leftContent.length === 1) leftContent = leftContent[0];
  } else {
    leftContent = '';
  }

  let rightContent;
  if (col7) {
    rightContent = Array.from(col7.childNodes).filter(node => {
      return node.nodeType !== Node.TEXT_NODE || node.textContent.trim().length > 0;
    });
    if (rightContent.length === 1) rightContent = rightContent[0];
  } else {
    rightContent = '';
  }

  // Header row must be a single cell spanning all columns
  const headerRow = ['Columns (columns39)'];
  // Content row: two columns
  const contentRow = [leftContent, rightContent];

  const rows = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
