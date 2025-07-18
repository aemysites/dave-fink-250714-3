/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main video wrapper from within the element
  const videoWrap = element.querySelector('.moa-video-wrap');

  // Extract the poster image URL
  let posterUrl = '';
  if (videoWrap) {
    // Check for a <video> tag with a poster attribute
    const videoTag = videoWrap.querySelector('video[poster]');
    if (videoTag && videoTag.getAttribute('poster')) {
      posterUrl = videoTag.getAttribute('poster');
    }
    // Fallback: Check for .vjs-poster > img
    if (!posterUrl) {
      const posterImg = videoWrap.querySelector('.vjs-poster img');
      if (posterImg && posterImg.getAttribute('src')) {
        posterUrl = posterImg.getAttribute('src');
      }
    }
  }

  // Extract Brightcove video URL using data attributes
  let videoUrl = '';
  if (videoWrap) {
    const videoJs = videoWrap.querySelector('video-js');
    if (videoJs) {
      const account = videoJs.getAttribute('data-account');
      const player = videoJs.getAttribute('data-player');
      const videoId = videoJs.getAttribute('data-video-id');
      if (account && player && videoId) {
        videoUrl = `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${videoId}`;
      }
    }
  }

  // Find the full .video-text block, which may include extra elements
  const videoText = element.querySelector('.video-text');

  // Compose the content for the single cell in the content row
  const cellContent = [];

  // Add the poster image if available
  if (posterUrl) {
    const img = document.createElement('img');
    img.src = posterUrl;
    img.alt = '';
    cellContent.push(img);
  }
  // Add the video link
  if (videoUrl) {
    if (cellContent.length > 0) cellContent.push(document.createElement('br'));
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    cellContent.push(a);
  }
  // Add the video text content, as a reference to the existing DOM element
  if (videoText) {
    if (cellContent.length > 0) cellContent.push(document.createElement('br'));
    cellContent.push(videoText);
  }

  // Prepare the table structure: 1 column, 2 rows (header, content)
  const cells = [
    ['Embed (embedVideo36)'],
    [cellContent.length ? cellContent : '']
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
