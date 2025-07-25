import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Toggles the info-floater between closed and open states
 * @param {Element} floaterElement The info-floater element to toggle
 */
function toggleInfoFloater(floaterElement) {
  if (floaterElement.classList.contains('info-floater')) {
    // Switch to open state
    floaterElement.classList.remove('info-floater');
    floaterElement.classList.add('info-floater-open');
  } else if (floaterElement.classList.contains('info-floater-open')) {
    // Switch to closed state
    floaterElement.classList.remove('info-floater-open');
    floaterElement.classList.add('info-floater');
  }
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  // Add click handler for info-floater toggle
  const infoFloater = block.querySelector('.section.info-floater, .section.info-floater-open');
  if (infoFloater) {
    infoFloater.addEventListener('click', () => {
      toggleInfoFloater(infoFloater);
    });
  }
}
