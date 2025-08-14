/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row: must be a single cell (one column)
  const headerRow = ['Cards (cards16)'];

  // Find the main card content
  const body = element.querySelector('.field__item');
  if (!body) return;
  const ctaWrapper = body.querySelector('.ibrance-tablets-cta-wrapper');
  if (!ctaWrapper) return;
  const ctaContainer = ctaWrapper.querySelector('.ibrance-tablets-cta');
  if (!ctaContainer) return;

  // Find the text content for the right cell
  const ctaTextWrap = ctaContainer.querySelector('.cta-text-wrap');
  if (!ctaTextWrap) return;
  const textSpan = ctaTextWrap.querySelector('.text');
  if (!textSpan) return;

  // Find the left cell icon/image (should be empty if not present)
  let leftCell = '';
  const possibleIcon = ctaContainer.querySelector('img, svg');
  if (possibleIcon) {
    leftCell = possibleIcon;
  } else {
    leftCell = document.createElement('span'); // empty element for correct col count
  }

  // Compose rows: header is always a SINGLE cell (not two), then card rows with two cells
  const rows = [
    [headerRow[0]], // header row: one column only
    [leftCell, textSpan] // card row: two columns
  ];

  // Create the table and replace the original element
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
