/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as in the example
  const headerRow = ['Cards (cards31)'];
  // Get all card items (each .patient-item)
  const cardItems = Array.from(element.querySelectorAll('.patient-item'));
  const rows = [headerRow];

  cardItems.forEach((card) => {
    // Get the main banner image (the big background image for the card)
    const bannerImg = card.querySelector('.talking-block-banner img');
    // Get the icon (the purple overlay)
    const iconImg = card.querySelector('.icon img');

    // Compose the image cell; use both if present, icon above banner
    let imageCellContent;
    if (iconImg && bannerImg) {
      const div = document.createElement('div');
      div.appendChild(iconImg);
      div.appendChild(bannerImg);
      imageCellContent = div;
    } else if (bannerImg) {
      imageCellContent = bannerImg;
    } else if (iconImg) {
      imageCellContent = iconImg;
    } else {
      imageCellContent = '';
    }

    // Assemble the text cell
    const blockContent = card.querySelector('.block-content');
    const contentParts = [];
    if (blockContent) {
      // Title in <p class="purple">
      const title = blockContent.querySelector('p.purple');
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        contentParts.push(strong);
      }
      // Description is usually the next p after the purple title
      const desc = Array.from(blockContent.querySelectorAll('p')).find(p => !p.classList.contains('purple'));
      if (desc) {
        contentParts.push(document.createElement('br'));
        contentParts.push(desc);
      }
      // CTA is the button link
      const cta = blockContent.querySelector('a.button');
      if (cta) {
        contentParts.push(document.createElement('br'));
        contentParts.push(cta);
      }
    }

    rows.push([imageCellContent, contentParts]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
