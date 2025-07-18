/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main wrapper containing the card content
  const wrapper = element.querySelector('.ibrance-tablets-cta-wrapper');
  if (!wrapper) return;
  // Find the card content block
  const card = wrapper.querySelector('.ibrance-tablets-cta');
  if (!card) return;
  // Remove any close button so it is not included
  const close = card.querySelector('.close');
  if (close) close.remove();
  // Find the actual text content (span.text), which may contain <br> and <a>
  let textCell = '';
  const textWrap = card.querySelector('.cta-text-wrap');
  if (textWrap) {
    const text = textWrap.querySelector('.text');
    if (text) textCell = text;
  }
  // Build table: header row (SINGLE COLUMN!), then one card row with two columns
  const cells = [
    ['Cards (cards16)'],  // header row: single cell only
    ['', textCell]        // data row: image/icon cell (empty), text cell
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
