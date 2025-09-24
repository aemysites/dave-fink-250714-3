export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Handle the standard EDS pattern: picture + br + a
  block.querySelectorAll('picture + br + a').forEach((link) => {
    const br = link.previousElementSibling;
    const picture = br.previousElementSibling;

    if (picture && picture.tagName === 'PICTURE') {
      // Remove the br element
      br.remove();
      // Clear any text content and move picture inside link
      link.textContent = '';
      link.appendChild(picture);
      // Ensure proper link attributes
      if (!link.target) link.target = '_blank';
      if (!link.rel) link.rel = 'noopener';
    }
  });

  // Simple and safe approach: Just hide app store link text and make images clickable
  const appStoreLinks = block.querySelectorAll('a[href*="play.google.com"], a[href*="apps.apple.com"]');

  appStoreLinks.forEach((link) => {
    // Find the nearest picture in the same paragraph or previous paragraph
    let targetPicture = null;
    const linkParagraph = link.closest('p');

    // First, check if there's a picture in the same paragraph before the link
    if (linkParagraph) {
      const picturesInSameParagraph = linkParagraph.querySelectorAll('picture');
      if (picturesInSameParagraph.length > 0) {
        // Use the last picture in the same paragraph (closest to the link)
        targetPicture = picturesInSameParagraph[picturesInSameParagraph.length - 1];
      }
    }

    // If no picture in same paragraph, look in the immediately previous paragraph
    if (!targetPicture && linkParagraph) {
      const prevParagraph = linkParagraph.previousElementSibling;
      if (prevParagraph && prevParagraph.tagName === 'P') {
        const pictureInPrevParagraph = prevParagraph.querySelector('picture');
        if (pictureInPrevParagraph && !pictureInPrevParagraph.closest('a')) {
          targetPicture = pictureInPrevParagraph;
        }
      }
    }

    // If we found a target picture, make it clickable
    if (targetPicture && !targetPicture.closest('a')) {
      // Create wrapper link
      const wrapper = document.createElement('a');
      wrapper.href = link.href;
      wrapper.target = '_blank';
      wrapper.rel = 'noopener';
      wrapper.style.display = 'inline-block';

      // Safely wrap the picture
      try {
        targetPicture.parentNode.insertBefore(wrapper, targetPicture);
        wrapper.appendChild(targetPicture);

        // Remove the text link and its paragraph if it's empty
        const currentLinkParagraph = link.closest('p');
        if (currentLinkParagraph) {
          // Check if paragraph only contains the link (and maybe whitespace)
          const paragraphText = currentLinkParagraph.textContent.trim();
          const linkText = link.textContent.trim();
          if (paragraphText === linkText || paragraphText === link.href) {
            // Paragraph only contains the link, safe to remove
            currentLinkParagraph.remove();
          } else {
            // Paragraph has other content, just remove the link
            link.remove();
          }
        } else {
          // No paragraph parent, just remove the link
          link.remove();
        }
      } catch (error) {
        // Silently handle any wrapping errors, just hide the link
        link.style.display = 'none';
      }
    }
  });
}
