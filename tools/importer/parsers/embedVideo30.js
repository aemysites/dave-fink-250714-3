/* global WebImporter */
export default function parse(element, { document }) {
  // This HTML does not contain any video, image poster, iframe, or video embed link
  // The original markdown example expects ONLY an Embed (embedVideo30) block for video embeds
  // Therefore, per instructions, DO NOT create an Embed (embedVideo30) block here
  // and DO NOT replace the element with a block table at all.
  // We simply do nothing, leaving the original element as is.
  // If the system supports a glossary block, that would be handled elsewhere.
}
