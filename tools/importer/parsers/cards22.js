/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per spec
  const headerRow = ['Cards (cards22)'];

  // Get all cards (li elements)
  const lis = element.querySelectorAll(':scope > li');
  const rows = [];

  lis.forEach(li => {
    // Card image/icon: first .pic > img
    let imageCell = null;
    const picDiv = li.querySelector(':scope > .pic');
    if (picDiv) {
      const img = picDiv.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // Textual content
    const textCellContent = [];
    // Title: the first <p> with class 'light-purple'
    const titleP = li.querySelector(':scope > p.light-purple');
    if (titleP) {
      const strong = document.createElement('strong');
      strong.innerHTML = titleP.innerHTML;
      textCellContent.push(strong);
    }
    // Description(s): all <p> siblings without the 'light-purple' class
    li.querySelectorAll(':scope > p:not(.light-purple)').forEach(p => {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(p);
    });
    // Remove initial <br> if present
    if (textCellContent[0] && textCellContent[0].tagName === 'BR') {
      textCellContent.shift();
    }

    rows.push([imageCell, textCellContent]);
  });

  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
