/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(el => el.classList && el.classList.contains(className));
  }

  // 1. Get the actual content block (the .tips-taking-ibrance block inside rich text)
  const tipsBlock = element.querySelector('.tips-taking-ibrance');
  if (!tipsBlock) return;

  // 2. Extract heading (h2). Must keep existing element to retain heading level and superscript.
  const heading = tipsBlock.querySelector('h2');

  // 3. Extract all '.swiper-slide' elements (each is a tip column)
  const swiper = tipsBlock.querySelector('.swiper-container');
  const slides = swiper ? Array.from(swiper.querySelectorAll('.swiper-slide')) : [];
  
  // 4. For each slide, combine the image and description into a single fragment for the cell
  const slideColumns = slides.map(slide => {
    const frag = document.createElement('div');
    // Image
    const imgDiv = slide.querySelector('.pic img');
    if (imgDiv) frag.appendChild(imgDiv);
    // Description (just the <p> inside .des)
    const desDiv = slide.querySelector('.des');
    if (desDiv) {
      // If the description is only a <p>, just append the <p>, else the .des div
      if (desDiv.children.length === 1 && desDiv.children[0].tagName === 'P') {
        frag.appendChild(desDiv.children[0]);
      } else {
        frag.appendChild(desDiv);
      }
    }
    return frag;
  });

  // 5. Find the informational/safety <p> that comes after the swiper (not inside any slide)
  // It should be a direct child of .tips-taking-ibrance after the swiper
  let afterSwiper = false;
  let safetyParagraph = null;
  for (const child of tipsBlock.children) {
    if (child === swiper) {
      afterSwiper = true;
      continue;
    }
    if (afterSwiper && child.tagName === 'P') {
      safetyParagraph = child;
      break;
    }
  }

  // 6. Compose the table
  // The example renders columns in rows of 3 (see screenshot)
  const headerRow = ['Columns (columns26)'];
  const columnsPerRow = 3;

  // Heading row: put heading in first cell, rest empty for col span
  const firstRow = new Array(columnsPerRow).fill('');
  firstRow[0] = heading;

  // Content rows: group slideColumns into sets of columnsPerRow
  const contentRows = [];
  for (let i = 0; i < slideColumns.length; i += columnsPerRow) {
    contentRows.push(slideColumns.slice(i, i + columnsPerRow));
  }

  // If the last row has fewer than columnsPerRow, fill with empty
  if (contentRows.length && contentRows[contentRows.length - 1].length < columnsPerRow) {
    const last = contentRows[contentRows.length - 1];
    while (last.length < columnsPerRow) last.push('');
  }

  // Optionally add the safety paragraph in a final row, first cell only
  let cells = [headerRow, firstRow, ...contentRows];
  if (safetyParagraph) {
    const safetyRow = new Array(columnsPerRow).fill('');
    safetyRow[0] = safetyParagraph;
    cells.push(safetyRow);
  }

  // 7. Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
