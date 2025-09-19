import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Creates a custom language selector dropdown for cards17 variant
 * @param {Object} languages - Object with language codes as keys and display names as values
 * @param {string} defaultLang - Default language code
 * @returns {HTMLElement} The custom dropdown element
 */
function createLanguageSelector(languages, defaultLang = 'en') {
  // Create main dropdown container
  const dropdown = document.createElement('div');
  dropdown.className = 'custom-language-selector';
  dropdown.setAttribute('tabindex', '0');
  dropdown.setAttribute('role', 'combobox');
  dropdown.setAttribute('aria-expanded', 'false');
  dropdown.setAttribute('aria-label', 'Select language');

  // Create selected value display
  const selected = document.createElement('div');
  selected.className = 'selector-selected';
  const defaultName = languages[defaultLang] || Object.values(languages)[0];
  selected.textContent = defaultName;

  // Create dropdown arrow
  const arrow = document.createElement('div');
  arrow.className = 'selector-arrow';

  // Create options container
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'selector-options';
  optionsContainer.setAttribute('role', 'listbox');

  // Create options
  Object.entries(languages).forEach(([code, name]) => {
    const option = document.createElement('div');
    option.className = 'selector-option';
    option.setAttribute('role', 'option');
    option.setAttribute('data-value', code);

    // Mark selected option (no checkmark needed)
    if (code === defaultLang) {
      option.classList.add('selected');
    }

    const text = document.createElement('span');
    text.textContent = name;
    option.appendChild(text);

    optionsContainer.appendChild(option);
  });

  // Assemble dropdown
  dropdown.appendChild(selected);
  dropdown.appendChild(arrow);
  dropdown.appendChild(optionsContainer);

  // Add click handlers
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('open');

    // Close all other dropdowns
    document.querySelectorAll('.custom-language-selector.open').forEach((el) => {
      if (el !== dropdown) {
        el.classList.remove('open');
        el.setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle this dropdown
    if (!isOpen) {
      // Temporarily disable transitions to prevent animation from off-screen
      optionsContainer.classList.add('no-transition');

      // Calculate position and set CSS custom properties
      const rect = selected.getBoundingClientRect();
      const gapValue = getComputedStyle(dropdown).getPropertyValue('--dropdown-positioning-gap').trim() || '4px';
      const gap = parseInt(gapValue, 10);
      dropdown.style.setProperty('--dropdown-top', `${rect.bottom + gap}px`);
      dropdown.style.setProperty('--dropdown-left', `${rect.left}px`);
      dropdown.style.setProperty('--dropdown-width', `${rect.width}px`);

      // Re-enable transitions after positioning
      setTimeout(() => {
        optionsContainer.classList.remove('no-transition');
        optionsContainer.classList.add('positioned');
      }, 10);
    }

    dropdown.classList.toggle('open');
    dropdown.setAttribute('aria-expanded', !isOpen);
  });

  // Handle option selection
  optionsContainer.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    const option = e.target.closest('.selector-option');
    if (option) {
      const value = option.getAttribute('data-value');
      const name = option.querySelector('span').textContent;

      // Update selected display
      selected.textContent = name;

      // Update selected option styling
      optionsContainer.querySelectorAll('.selector-option').forEach((opt) => {
        opt.classList.remove('selected');
      });

      option.classList.add('selected');

      // Close dropdown immediately
      dropdown.classList.remove('open');
      dropdown.setAttribute('aria-expanded', 'false');

      // Store selected value
      dropdown.setAttribute('data-selected', value);

      // Trigger change event
      const changeEvent = new CustomEvent('change', {
        detail: { value, name },
        bubbles: true,
      });
      dropdown.dispatchEvent(changeEvent);
    }
  });

  // Close dropdown when clicking outside, scrolling, or resizing
  const closeDropdown = () => {
    dropdown.classList.remove('open');
    dropdown.setAttribute('aria-expanded', 'false');
  };

  document.addEventListener('click', closeDropdown);
  window.addEventListener('scroll', closeDropdown);
  window.addEventListener('resize', closeDropdown);

  // Store initial value
  dropdown.setAttribute('data-selected', defaultLang);

  return dropdown;
}

/**
 * Parses multiple download links within card content
 * Creates selector options from any multiple links found
 * @param {Element} cardBody - The card body element
 * @returns {Object|null} Options data object or null if less than 2 links found
 */
function parseMultipleLinks(cardBody) {
  const links = cardBody.querySelectorAll('a[href]');
  if (links.length < 2) return null;

  const options = {};

  links.forEach((link, index) => {
    const optionText = link.textContent.trim();
    const optionCode = `option-${index + 1}`;

    options[optionCode] = {
      name: optionText,
      url: link.href,
    };
  });

  return options;
}

/**
 * Sets up language selector functionality for cards17 variant
 * Only creates selector if multiple languages are available
 * @param {Element} card - The card element
 */
function setupLanguageSelector(card) {
  const cardBody = card.querySelector('.cards-card-body');
  if (!cardBody) return;

  // Parse options from multiple download links in the card content
  const optionsData = parseMultipleLinks(cardBody);

  // If no options data found, check for single download link (no selector needed)
  if (!optionsData) {
    const singleLink = cardBody.querySelector('a[href]');
    if (singleLink) {
      // Single link found, no language selector needed
      return;
    }
    // No download links found at all
    return;
  }

  // Check if we have multiple options (selector only needed for multiple options)
  const optionKeys = Object.keys(optionsData);
  if (optionKeys.length < 2) {
    // Only one option available, no selector needed
    return;
  }

  // Find or create the download link
  let downloadLink = cardBody.querySelector('a[href]');
  if (!downloadLink) {
    // Create a download button if none exists
    downloadLink = document.createElement('a');
    downloadLink.textContent = 'DOWNLOAD';
    downloadLink.className = 'button';
    downloadLink.setAttribute('download', '');
    downloadLink.setAttribute('target', '_blank');
    downloadLink.setAttribute('rel', 'noopener noreferrer');

    const buttonContainer = cardBody.querySelector('.button-container')
                           || (() => {
                             const container = document.createElement('p');
                             container.className = 'button-container';
                             cardBody.appendChild(container);
                             return container;
                           })();
    buttonContainer.appendChild(downloadLink);
  } else {
    // Change the text of existing link to "DOWNLOAD" since we're using it as the main button
    downloadLink.textContent = 'DOWNLOAD';
    // Ensure it has the button class for proper styling
    if (!downloadLink.classList.contains('button')) {
      downloadLink.classList.add('button');
    }
    // Clear any existing title/alt attributes that might show language names
    downloadLink.removeAttribute('title');
    downloadLink.removeAttribute('alt');
    // Set proper attributes for download behavior
    downloadLink.setAttribute('download', '');
    downloadLink.setAttribute('target', '_blank');
    downloadLink.setAttribute('rel', 'noopener noreferrer');
  }

  // Remove additional download links and their containers since we'll use the selector
  const allLinks = cardBody.querySelectorAll('a[href]');
  allLinks.forEach((link, index) => {
    if (index > 0) { // Keep first link, remove others
      const parent = link.parentElement;
      // If the parent only contains this link (and maybe whitespace/text nodes), remove the parent
      if (parent && parent.tagName === 'P') {
        const hasOnlyThisLink = Array.from(parent.childNodes).every((node) => node === link
          || (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()));
        if (hasOnlyThisLink) {
          parent.remove();
        } else {
          // Otherwise just remove the link
          link.remove();
        }
      } else {
        // Otherwise just remove the link
        link.remove();
      }
    }
  });

  // Create language options for selector
  const selectorOptions = {};
  Object.entries(optionsData).forEach(([code, data]) => {
    selectorOptions[code] = data.name;
  });

  // Create and insert selector
  const selector = createLanguageSelector(selectorOptions, optionKeys[0]);

  // Wrap selector in a paragraph for consistent styling
  const selectorWrapper = document.createElement('p');
  selectorWrapper.className = 'language-selector-wrapper';
  selectorWrapper.appendChild(selector);

  // Create or find bottom section container
  let bottomSection = cardBody.querySelector('.bottom-section');
  if (!bottomSection) {
    bottomSection = document.createElement('div');
    bottomSection.className = 'bottom-section';

    // Move existing button container into bottom section
    const buttonContainer = cardBody.querySelector('.button-container');
    if (buttonContainer) {
      cardBody.removeChild(buttonContainer);
      bottomSection.appendChild(selectorWrapper);
      bottomSection.appendChild(buttonContainer);
    } else {
      bottomSection.appendChild(selectorWrapper);
    }

    cardBody.appendChild(bottomSection);
  } else {
    // If bottom section already exists, just add selector before button
    const buttonContainer = bottomSection.querySelector('.button-container');
    if (buttonContainer) {
      bottomSection.insertBefore(selectorWrapper, buttonContainer);
    } else {
      bottomSection.appendChild(selectorWrapper);
    }
  }

  // Set up event listener with options data
  selector.addEventListener('change', (e) => {
    const selectedOption = e.detail ? e.detail.value : selector.getAttribute('data-selected');
    const selectedData = optionsData[selectedOption];
    if (selectedData) {
      downloadLink.href = selectedData.url;

      // Generate appropriate filename for download
      const urlParts = selectedData.url.split('/');
      const filename = urlParts[urlParts.length - 1];
      if (filename && filename.includes('.')) {
        downloadLink.setAttribute('download', filename);
      } else {
        // Fallback: generate filename from option and assume PDF
        downloadLink.setAttribute('download', `document-${selectedOption}.pdf`);
      }
    }
  });

  // Initialize with first option
  const firstOption = optionKeys[0];
  const firstData = optionsData[firstOption];
  if (firstData) {
    downloadLink.href = firstData.url;

    // Set initial download filename
    const urlParts = firstData.url.split('/');
    const filename = urlParts[urlParts.length - 1];
    if (filename && filename.includes('.')) {
      downloadLink.setAttribute('download', filename);
    } else {
      // Fallback: generate filename from option and assume PDF
      downloadLink.setAttribute('download', `document-${firstOption}.pdf`);
    }
  }
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);

  // Set up language selectors for cards17 variant
  if (block.classList.contains('cards17')) {
    ul.querySelectorAll('li').forEach(setupLanguageSelector);
  }
}
