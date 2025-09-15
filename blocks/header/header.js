import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Cache for query index data
let queryIndexCache = null;

/**
 * Fetches the query index data for breadcrumbs
 * @returns {Promise<Array>} Array of page data with path and title
 */
async function fetchQueryIndex() {
  if (queryIndexCache) {
    return queryIndexCache;
  }

  try {
    const response = await fetch('/query-index.json');
    if (response.ok) {
      const data = await response.json();
      queryIndexCache = data.data || [];
      return queryIndexCache;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Failed to fetch query index for breadcrumbs:', error);
  }

  return [];
}

/**
 * Generates breadcrumb trail based on current URL and query index
 * @param {string} currentPath Current page path
 * @param {Array} queryData Query index data
 * @returns {Array} Array of breadcrumb items
 */
function generateBreadcrumbs(currentPath, queryData) {
  const breadcrumbs = [];

  // Always start with Home
  breadcrumbs.push({
    title: 'Home',
    path: '/',
    isActive: currentPath === '/',
  });

  // If we're not on home page, build the breadcrumb trail
  if (currentPath !== '/') {
    const pathSegments = currentPath.split('/').filter((segment) => segment);
    let currentSegmentPath = '';

    pathSegments.forEach((segment) => {
      currentSegmentPath += `/${segment}`;

      // Find matching page in query data
      const pageData = queryData.find((item) => {
        const itemPath = new URL(item.path).pathname;
        return itemPath === currentSegmentPath;
      });

      const isActive = currentSegmentPath === currentPath;

      breadcrumbs.push({
        title: pageData ? pageData.title.replace(' | IBRANCE (palbociclib) NZ', '') : segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        path: currentSegmentPath,
        isActive,
      });
    });
  }

  return breadcrumbs;
}

/**
 * Creates and renders breadcrumbs navigation
 * @param {Array} breadcrumbs Array of breadcrumb items
 * @returns {HTMLElement} Breadcrumbs navigation element
 */
function createBreadcrumbsNav(breadcrumbs) {
  // Create the wrapper div first
  const div = document.createElement('div');

  const nav = document.createElement('nav');
  nav.className = 'breadcrumbs';
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.className = 'breadcrumbs-list';

  breadcrumbs.forEach((crumb) => {
    const li = document.createElement('li');
    li.className = 'breadcrumbs-item';

    if (crumb.isActive) {
      li.classList.add('active');
      li.setAttribute('aria-current', 'page');

      // Add content for breadcrumb
      if (crumb.title === 'Home') {
        li.classList.add('home-breadcrumb');
        const contentSpan = document.createElement('span');
        contentSpan.className = 'breadcrumb-content';
        contentSpan.textContent = 'Home';
        li.appendChild(contentSpan);
      } else {
        const textSpan = document.createElement('span');
        textSpan.textContent = crumb.title;
        li.appendChild(textSpan);
      }
    } else {
      const link = document.createElement('a');
      link.href = crumb.path;

      // Add content for breadcrumb
      if (crumb.title === 'Home') {
        li.classList.add('home-breadcrumb');
        const contentSpan = document.createElement('span');
        contentSpan.className = 'breadcrumb-content';
        contentSpan.textContent = 'Home';
        link.appendChild(contentSpan);
      } else {
        const textSpan = document.createElement('span');
        textSpan.textContent = crumb.title;
        link.appendChild(textSpan);
      }

      li.appendChild(link);
    }

    ol.appendChild(li);
  });

  // Append ol to nav, then nav to div
  nav.appendChild(ol);
  div.appendChild(nav);
  return div;
}

/**
 * Creates and adds the header progress bar
 * @param {Element} headerBlock The header block element
 */
function createHeaderBar(headerBlock) {
  const headerBar = document.createElement('div');
  headerBar.className = 'header-bar';

  const progressBar = document.createElement('div');
  progressBar.className = 'header-bar-green';

  headerBar.appendChild(progressBar);

  // Insert header bar after the nav wrapper
  const navWrapper = headerBlock.querySelector('.nav-wrapper');
  if (navWrapper) {
    navWrapper.insertAdjacentElement('afterend', headerBar);
  }

  return { headerBar, progressBar };
}

/**
 * Updates the progress bar based on scroll position
 * @param {Element} progressBar The progress bar element
 * @param {number} bannerThreshold The scroll position where banner reaches nav-wrapper
 */
function updateProgressBar(progressBar, bannerThreshold) {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

  // Calculate progress starting from when banner reaches nav-wrapper
  const adjustedScrollTop = Math.max(0, scrollTop - bannerThreshold);
  const adjustedDocHeight = docHeight - bannerThreshold;
  const scrollPercent = adjustedDocHeight > 0 ? (adjustedScrollTop / adjustedDocHeight) * 100 : 0;

  progressBar.style.width = `${Math.min(Math.max(scrollPercent, 0), 100)}%`;
}

/**
 * Calculates the scroll position where the banner reaches the nav-wrapper
 * @returns {number} The threshold scroll position
 */
function calculateBannerThreshold() {
  // Find the main content area (usually after header)
  const header = document.querySelector('header.header-wrapper');
  if (!header) return 0;

  // Get the first main content element after header
  let mainContent = header.nextElementSibling;
  while (mainContent && (mainContent.tagName === 'NAV' || mainContent.classList.contains('breadcrumbs') || mainContent.classList.contains('header-bar'))) {
    mainContent = mainContent.nextElementSibling;
  }

  if (!mainContent) {
    // Fallback: use viewport height minus nav height
    const navHeight = getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '70px';
    return window.innerHeight - parseInt(navHeight, 10);
  }

  // Calculate when the main content reaches the nav-wrapper
  const mainContentRect = mainContent.getBoundingClientRect();
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const mainContentTop = mainContentRect.top + currentScrollTop;

  // The threshold is when main content top reaches the nav height
  const navHeight = getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '70px';
  return Math.max(0, mainContentTop - parseInt(navHeight, 10));
}

/**
 * Calculates when breadcrumbs start getting cut off
 * @returns {number} The scroll position where breadcrumbs should be hidden
 */
function calculateBreadcrumbsThreshold() {
  // Get the nav height
  const navHeight = getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '70px';
  const navHeightPx = parseInt(navHeight, 10);

  // Breadcrumbs are positioned at top: var(--nav-height), so they start getting cut off
  // as soon as any scrolling begins that would push them above the viewport
  // We want to hide them when they start getting cut off, which is very early in the scroll
  return navHeightPx * 0.1; // Hide when scrolled just 10% of nav height
}

/**
 * Handles scroll behavior for breadcrumbs and progress bar
 * @param {Element} breadcrumbs The breadcrumbs element (can be null)
 * @param {Element} headerBar The header bar element
 * @param {Element} progressBar The progress bar element
 */
function handleScroll(breadcrumbs, headerBar, progressBar) {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const breadcrumbsThreshold = calculateBreadcrumbsThreshold();
  const bannerThreshold = calculateBannerThreshold();

  if (scrollTop >= breadcrumbsThreshold && scrollTop < bannerThreshold) {
    // Hide breadcrumbs and automatically scroll to show progress bar
    if (breadcrumbs && breadcrumbs.style.display !== 'none') {
      breadcrumbs.style.display = 'none';

      // Automatically scroll to the banner threshold to show progress bar immediately
      // Use smooth scrolling for better UX
      window.scrollTo({
        top: bannerThreshold,
        behavior: 'smooth',
      });
      return; // Exit early to prevent conflicting scroll handling
    }
  } else if (scrollTop < breadcrumbsThreshold) {
    // Show breadcrumbs when at the top
    if (breadcrumbs) {
      breadcrumbs.style.display = 'flex';
    }
  }

  if (scrollTop >= bannerThreshold) {
    // Show progress bar when banner reaches nav-wrapper
    headerBar.style.display = 'block';
    updateProgressBar(progressBar, bannerThreshold);

    // Ensure breadcrumbs are hidden when progress bar is shown
    if (breadcrumbs) {
      breadcrumbs.style.display = 'none';
    }
  } else if (scrollTop < bannerThreshold) {
    // When scrolling up and leaving the progress bar area
    // Immediately push to top to show breadcrumbs fully
    if (headerBar.style.display === 'block') {
      headerBar.style.display = 'none';

      // Push all the way to top immediately when entering breadcrumbs zone
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      return; // Exit early to prevent conflicting scroll handling
    }
    // Hide progress bar when above threshold
    headerBar.style.display = 'none';
  }
}

/**
 * Adds breadcrumbs to the header if enabled
 * @param {Element} headerBlock The header block element
 */
async function addBreadcrumbs(headerBlock) {
  // Check if breadcrumbs are enabled via metadata
  const breadcrumbsEnabled = getMetadata('breadcrumbs');
  if (breadcrumbsEnabled !== 'true') {
    return null;
  }

  const currentPath = window.location.pathname;
  const queryData = await fetchQueryIndex();
  const breadcrumbs = generateBreadcrumbs(currentPath, queryData);

  // Only show breadcrumbs if we have more than just "Home"
  if (breadcrumbs.length > 1) {
    const breadcrumbsNav = createBreadcrumbsNav(breadcrumbs);

    // Insert breadcrumbs after the nav wrapper
    const navWrapper = headerBlock.querySelector('.nav-wrapper');
    if (navWrapper) {
      navWrapper.insertAdjacentElement('afterend', breadcrumbsNav);
    }

    return breadcrumbsNav;
  }

  return null;
}

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1024px)');

function closeOnMouseLeave(e) {
  // Only work on desktop
  if (!isDesktop.matches) return;
  const navDrop = e.currentTarget;
  const isNavDrop = navDrop.classList.contains('nav-drop');
  if (isNavDrop) {
    // Close this dropdown
    navDrop.setAttribute('aria-expanded', 'false');
  }
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Click handler for the "+" indicator (div.menu-item-expanded) that lives
 * inside `.nav-drop > a`. Toggles the immediate submenu UL visibility.
 */
function toggleSubmenuOnPlusClick(event) {
  // Only work on mobile/tablet (below 1024px)
  if (isDesktop.matches) return;

  // prevent navigation and bubbling
  event.preventDefault();
  event.stopPropagation();

  const indicator = event.currentTarget;
  const anchor = indicator.closest('a');
  if (!anchor) return;

  // Find the very next UL contained in that .nav-drop
  let submenu = anchor.nextElementSibling;
  if (!submenu || submenu.tagName !== 'UL') {
    submenu = anchor.parentElement?.querySelector(':scope > ul');
  }
  if (!submenu) return;

  // Calculate the exact height needed for this submenu
  const isExpanded = submenu.classList.contains('expanded');
  const navDrop = anchor.closest('li.nav-drop');
  if (isExpanded) {
    // Collapsing: set max-height to 0
    submenu.style.maxHeight = '0';
    submenu.classList.remove('expanded');
    // Change indicator text back to '+'
    indicator.textContent = '+';
    // Remove border-bottom: 0 from nav-drop
    if (navDrop) {
      navDrop.style.removeProperty('border-bottom');
    }
  } else {
    // Expanding: temporarily show to measure, then set exact height
    submenu.style.maxHeight = 'none';
    submenu.style.opacity = '0';
    submenu.style.visibility = 'hidden';
    const actualHeight = submenu.scrollHeight;
    submenu.style.maxHeight = '0';
    submenu.style.opacity = '';
    submenu.style.visibility = '';
    // eslint-disable-next-line no-unused-expressions
    submenu.offsetHeight; // Force reflow
    submenu.style.maxHeight = `${actualHeight}px`;
    submenu.classList.add('expanded');
    indicator.textContent = '-';
    if (navDrop) {
      navDrop.style.borderBottom = '0';
    }
  }

  // Reflect via aria-expanded on the li.nav-drop
  if (navDrop) {
    navDrop.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
  }
}

/**
 * Adds a visual "+" indicator next to each top-level `.nav-drop > a` link
 * inside `header nav .nav-sections`.
 * The element created is: <div class="menu-item-expanded">+</div>
 */
function addMenuItemExpandedToggles(navSections) {
  const links = navSections.querySelectorAll(':scope .default-content-wrapper > ul > li.nav-drop > a');
  links.forEach((link) => {
    const nextSibling = link.nextElementSibling;
    if (nextSibling && nextSibling.classList && nextSibling.classList.contains('menu-item-expanded')) {
      // ensure it has a listener
      nextSibling.removeEventListener('click', toggleSubmenuOnPlusClick);
      nextSibling.addEventListener('click', toggleSubmenuOnPlusClick);
      return;
    }
    const indicator = document.createElement('div');
    indicator.className = 'menu-item-expanded';
    indicator.textContent = '+';
    indicator.addEventListener('click', toggleSubmenuOnPlusClick);
    link.insertAdjacentElement('beforeend', indicator);
  });
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function openOnHover(e) {
  // Only work on desktop
  if (!isDesktop.matches) return;
  const navDrop = e.currentTarget;
  const isNavDrop = navDrop.classList.contains('nav-drop');
  if (isNavDrop) {
    // Close all other dropdowns first
    toggleAllNavSections(navDrop.closest('.nav-sections'));
    // Open this dropdown
    navDrop.setAttribute('aria-expanded', 'true');
  }
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Capture clicks to detect taps on the "< BACK" (::before) area and close
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });

    // Close navigation when clicking paragraph inside nav sections header
    const closeParas = nav.querySelectorAll('.section.nav-sections > .default-content-wrapper > p');
    closeParas.forEach((pEl) => {
      pEl.addEventListener('click', () => {
        // Force-close the nav for consistent behavior
        toggleMenu(nav, navSections, false);
      });
    });
  }

  // Add "+" indicators next to dropdown anchors
  addMenuItemExpandedToggles(navSections);
  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      MENU
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);

  // Mark active link
  const currentPath = window.location.pathname;
  const links = nav.querySelectorAll('a');
  links.forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  // Handle breakpoint changes without unwanted animations
  isDesktop.addEventListener('change', () => {
    const navSectionsElement = nav.querySelector('.nav-sections');

    // Temporarily disable transitions during breakpoint change
    if (navSectionsElement) {
      navSectionsElement.style.transition = 'none';

      // Force a reflow to apply the no-transition immediately
      // eslint-disable-next-line no-unused-expressions
      navSectionsElement.offsetHeight; // Force reflow

      // Clean up mobile-specific submenu styles when switching to desktop
      if (isDesktop.matches) {
        const submenus = navSectionsElement.querySelectorAll('ul > li > ul');
        submenus.forEach((submenu) => {
          // Remove mobile-specific inline styles
          submenu.style.removeProperty('max-height');
          submenu.classList.remove('expanded');

          // Reset indicator text to '+' and border-bottom when cleaning up
          const parentNavDrop = submenu.closest('.nav-drop');
          if (parentNavDrop) {
            const indicator = parentNavDrop.querySelector('.menu-item-expanded');
            if (indicator) {
              indicator.textContent = '+';
            }
            // Reset border-bottom style
            parentNavDrop.style.removeProperty('border-bottom');
          }
        });
      }

      // Re-enable transitions after the toggleMenu call
      setTimeout(() => {
        if (navSectionsElement) {
          navSectionsElement.style.removeProperty('transition');
        }
      }, 100);
    }

    // Let toggleMenu handle all the positioning logic
    toggleMenu(nav, navSectionsElement, isDesktop.matches);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Add breadcrumbs if enabled
  const breadcrumbsNav = await addBreadcrumbs(block);

  // Create header progress bar
  const { headerBar, progressBar } = createHeaderBar(block);

  // Set up scroll event listener for breadcrumbs/progress bar toggle
  let ticking = false;
  const scrollHandler = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll(breadcrumbsNav, headerBar, progressBar);
        ticking = false;
      });
      ticking = true;
    }
  };

  // Recalculate threshold on resize
  const resizeHandler = () => {
    // Force recalculation on resize
  };

  window.addEventListener('scroll', scrollHandler);
  window.addEventListener('resize', resizeHandler);

  // Initial call to set correct state (with a small delay to ensure layout is complete)
  setTimeout(() => {
    handleScroll(breadcrumbsNav, headerBar, progressBar);
  }, 100);

  // add hover event listeners to .nav-drop
  const navDrops = nav.querySelectorAll('.nav-drop');
  navDrops.forEach((drop) => {
    drop.addEventListener('mouseenter', openOnHover);
    drop.addEventListener('mouseleave', closeOnMouseLeave);
  });
}
