/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as required
  const headerRow = ['Cards (cards11)'];

  // Defensive image extraction
  const imgWrap = element.querySelector('.img-wrap');
  const img = imgWrap ? imgWrap.querySelector('img') : null;

  // Defensive text extraction for title and desktop description
  const textWrap = element.querySelector('.text-wrap');
  let heading = null;
  let excerpt = null;
  if (textWrap) {
    const textWrapper = textWrap.querySelector('.text-wrapper');
    if (textWrapper) {
      heading = textWrapper.querySelector('h3');
      excerpt = textWrapper.querySelector('p.hide-on-mobile');
    }
  }

  // Expanded content (Read More area)
  let expandedContent = [];
  const readMoreText = element.querySelector('.read-more-con .read-more-text');
  if (readMoreText) {
    // Only include non-empty paragraphs
    expandedContent = Array.from(readMoreText.children).filter(
      child => child.textContent && child.textContent.trim()
    );
  }

  // Compose right cell content, respecting order from source HTML
  const textCellContent = [];
  if (heading) textCellContent.push(heading);
  if (excerpt) textCellContent.push(excerpt);
  if (expandedContent.length) textCellContent.push(...expandedContent);

  // Ensure at least some content is present
  if (!img && textCellContent.length === 0) return;

  // Build table
  const cells = [
    headerRow,
    [img, textCellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
