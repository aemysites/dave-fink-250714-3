/* global WebImporter */
export default function parse(element, { document }) {
  // Compose header row as per requirements
  const headerRow = ['Embed (embedVideo36)'];

  // --- Find the best poster image ---
  let posterImg = null;
  // Try to find a poster image, prioritize .vjs-poster img but fallback to any <img>
  const posterImgCandidate = element.querySelector('.vjs-poster img') || element.querySelector('img');
  if (posterImgCandidate) {
    posterImg = posterImgCandidate;
  }

  // --- Find the video embed URL (Brightcove or iframe/video) ---
  let embedUrl = null;
  const videoJs = element.querySelector('video-js');
  if (videoJs) {
    const bcAccount = videoJs.getAttribute('data-account');
    const bcPlayer = videoJs.getAttribute('data-player');
    const bcVideoId = videoJs.getAttribute('data-video-id');
    if (bcAccount && bcPlayer && bcVideoId) {
      embedUrl = `https://players.brightcove.net/${bcAccount}/${bcPlayer}_default/index.html?videoId=${bcVideoId}`;
    }
  }
  if (!embedUrl) {
    const iframe = element.querySelector('iframe[src]');
    if (iframe) {
      embedUrl = iframe.src;
    } else {
      const video = element.querySelector('video[src]');
      if (video && video.src && !video.src.startsWith('blob:')) {
        embedUrl = video.src;
      }
    }
  }

  // --- Find all visible text content that appears outside the video area ---
  // Prefer .video-text if it exists, otherwise collect all <p> and block-level text not inside video wrapper
  let textContentNode = null;
  const videoText = element.querySelector('.video-text');
  if (videoText) {
    textContentNode = videoText;
  } else {
    // gather all <p> and <div> that are not inside .moa-video-wrap
    const ps = Array.from(element.querySelectorAll('p, div')).filter(
      n => !n.closest('.moa-video-wrap') && n.textContent.trim().length > 0
    );
    if (ps.length) {
      const wrapper = document.createElement('div');
      ps.forEach(n => wrapper.appendChild(n));
      textContentNode = wrapper;
    }
  }

  // --- Compose cell content in required order: image, link, text ---
  const cellContent = [];
  if (posterImg) {
    cellContent.push(posterImg);
  }
  if (embedUrl) {
    if (cellContent.length) cellContent.push(document.createElement('br'));
    const link = document.createElement('a');
    link.href = embedUrl;
    link.textContent = embedUrl;
    cellContent.push(link);
  }
  if (textContentNode && textContentNode.textContent.trim().length > 0) {
    if (cellContent.length) cellContent.push(document.createElement('br'));
    cellContent.push(textContentNode);
  }

  // If no content, remove block
  if (cellContent.length === 0) {
    element.remove();
    return;
  }

  const cells = [
    headerRow,
    [cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
