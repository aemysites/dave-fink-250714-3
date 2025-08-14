/* global WebImporter */
export default function parse(element, { document }) {
  // Header row should match exactly
  const headerRow = ['Embed (embedVideo36)'];

  // 1. Extract poster image (from <video> poster or .vjs-poster img)
  let posterImgEl = null;
  let posterUrl = '';
  const videoTag = element.querySelector('video[poster]');
  if (videoTag && videoTag.getAttribute('poster')) {
    posterUrl = videoTag.getAttribute('poster');
  }
  if (!posterUrl) {
    const vjsPosterImg = element.querySelector('.vjs-poster img');
    if (vjsPosterImg && vjsPosterImg.src) {
      posterUrl = vjsPosterImg.src;
      posterImgEl = vjsPosterImg;
    }
  }
  if (posterUrl && !posterImgEl) {
    posterImgEl = document.createElement('img');
    posterImgEl.src = posterUrl;
    posterImgEl.alt = '';
    posterImgEl.loading = 'lazy';
  }

  // 2. Extract video URL (Brightcove)
  let videoUrl = '';
  const vjs = element.querySelector('video-js');
  if (vjs) {
    const account = vjs.getAttribute('data-account');
    const player = vjs.getAttribute('data-player');
    const embed = vjs.getAttribute('data-embed') || 'default';
    const videoId = vjs.getAttribute('data-video-id');
    if (account && player && videoId) {
      videoUrl = `https://players.brightcove.net/${account}/${player}_${embed}/index.html?videoId=${videoId}`;
    }
  }
  // Fallback: iframe or video src
  if (!videoUrl) {
    const iframe = element.querySelector('iframe[src]');
    if (iframe) videoUrl = iframe.src;
    if (!videoUrl && videoTag && videoTag.src && !videoTag.src.startsWith('blob:')) {
      videoUrl = videoTag.src;
    }
  }
  // Create the video link
  let linkEl = null;
  if (videoUrl) {
    linkEl = document.createElement('a');
    linkEl.href = videoUrl;
    linkEl.textContent = videoUrl;
  }

  // 3. Extract all text content (flexible, all .video-text or .accordion-content or all <p> tags)
  let textContentEl = null;
  let directTextSource = element.querySelector('.video-text');
  if (!directTextSource) {
    directTextSource = element.querySelector('.accordion-content');
  }
  if (directTextSource) {
    textContentEl = directTextSource;
  } else {
    // Fallback: gather all <p> tags in a div
    const ps = Array.from(element.querySelectorAll('p'));
    if (ps.length) {
      const container = document.createElement('div');
      ps.forEach(p => container.appendChild(p));
      textContentEl = container;
    }
  }

  // Compose content array as in the example (poster, link, then text)
  const cellContent = [];
  if (posterImgEl) cellContent.push(posterImgEl);
  if (linkEl) cellContent.push(linkEl);
  if (textContentEl) cellContent.push(textContentEl);
  // Fallback: include all if cell would be empty
  if (cellContent.length === 0) cellContent.push(element);

  // Create table and replace
  const cells = [headerRow, [cellContent]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
