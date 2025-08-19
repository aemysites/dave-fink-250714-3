import { fetchPlaceholders } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  const isVariant25 = block.classList.contains('carousel25');
  const slides = block.querySelectorAll('.carousel-slide');

  if (isVariant25) {
    const smallMedia = window.matchMedia('(width <= 768px)');
    const pageSize = smallMedia.matches ? 1 : 3;
    const groupStart = Math.floor(slideIndex / pageSize) * pageSize;
    block.dataset.activeSlide = groupStart;

    slides.forEach((aSlide, idx) => {
      const isInGroup = idx >= groupStart && idx < groupStart + pageSize;
      aSlide.setAttribute('aria-hidden', isInGroup ? 'false' : 'true');
      aSlide.querySelectorAll('a').forEach((link) => {
        if (!isInGroup) {
          link.setAttribute('tabindex', '-1');
        } else {
          link.removeAttribute('tabindex');
        }
      });
    });

    const indicators = block.querySelectorAll('.carousel-slide-indicator');
    indicators.forEach((indicator, idx) => {
      const indicatorButton = indicator.querySelector('button');
      // Desktop: only every 3rd indicator is visible via CSS; Mobile: all are visible
      const isCurrent = pageSize === 1
        ? idx === slideIndex
        : (
          Math.floor(idx / pageSize) === Math.floor(groupStart / pageSize)
          && (idx % pageSize === pageSize - 1)
        );
      if (isCurrent) {
        indicatorButton.setAttribute('disabled', 'true');
      } else {
        indicatorButton.removeAttribute('disabled');
      }
    });
    return;
  }

  block.dataset.activeSlide = slideIndex;

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

export function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  const isVariant25 = block.classList.contains('carousel25');

  if (isVariant25) {
    const smallMedia = window.matchMedia('(width <= 768px)');
    const pageSize = smallMedia.matches ? 1 : 3;
    // Interpret slideIndex as a slide index; snap to the beginning of its page
    let groupStart = slideIndex < 0 ? slides.length - pageSize : slideIndex;
    if (slideIndex >= slides.length) groupStart = 0;
    groupStart = Math.floor(groupStart / pageSize) * pageSize;
    const targetSlide = slides[groupStart];
    if (targetSlide) {
      // Ensure links are tabbable for the 3 visible cards
      updateActiveSlide(targetSlide);
      block.querySelector('.carousel-slides').scrollTo({
        top: 0,
        left: targetSlide.offsetLeft,
        behavior: 'smooth',
      });
    }
    return;
  }

  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  const isVariant25 = block.classList.contains('carousel25');
  const slides = block.querySelectorAll('.carousel-slide');
  const slidesWrapper = block.querySelector('.carousel-slides');

  if (isVariant25) {
    const smallMedia = window.matchMedia('(width <= 768px)');

    // Initialize active state to the first slide/page
    if (slides[0]) updateActiveSlide(slides[0]);

    const getPageSize = () => (smallMedia.matches ? 1 : 3);
    const getTotalPages = () => Math.max(1, Math.ceil(slides.length / getPageSize()));

    const goToPage = (page) => {
      const pageSize = getPageSize();
      const totalPages = getTotalPages();
      const normalizedPage = (page + totalPages) % totalPages;
      const targetIndex = normalizedPage * pageSize;
      const targetSlide = slides[targetIndex];
      if (targetSlide) {
        updateActiveSlide(targetSlide);
        slidesWrapper.scrollTo({
          top: 0,
          left: targetSlide.offsetLeft,
          behavior: 'smooth',
        });
      }
    };

    // Indicators click (map any indicator to its page)
    slideIndicators.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (e) => {
        const slideIndicator = e.currentTarget.parentElement;
        const rawTarget = parseInt(slideIndicator.dataset.targetSlide, 10);
        const pageSize = getPageSize();
        if (pageSize === 1) {
          // On mobile, indicators represent individual slides
          showSlide(block, rawTarget);
        } else {
          const targetPage = Math.floor(rawTarget / pageSize);
          goToPage(targetPage);
        }
      });
    });

    block.querySelector('.slide-prev').addEventListener('click', () => {
      const pageSize = getPageSize();
      const activeStart = parseInt(block.dataset.activeSlide || '0', 10);
      if (pageSize === 1) {
        showSlide(block, activeStart - 1);
      } else {
        const currentPage = Math.floor(activeStart / pageSize);
        goToPage(currentPage - 1);
      }
    });
    block.querySelector('.slide-next').addEventListener('click', () => {
      const pageSize = getPageSize();
      const activeStart = parseInt(block.dataset.activeSlide || '0', 10);
      if (pageSize === 1) {
        showSlide(block, activeStart + 1);
      } else {
        const currentPage = Math.floor(activeStart / pageSize);
        goToPage(currentPage + 1);
      }
    });
  } else {
    slideIndicators.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', (e) => {
        const slideIndicator = e.currentTarget.parentElement;
        showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
      });
    });

    block.querySelector('.slide-prev').addEventListener('click', () => {
      showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
    });
    block.querySelector('.slide-next').addEventListener('click', () => {
      showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
    });
  }

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { threshold: 0.5 });
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  const placeholders = await fetchPlaceholders();

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', placeholders.carousel || 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  block.prepend(slidesWrapper);

  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute('aria-label', placeholders.carouselSlideControls || 'Carousel Slide Controls');
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);

    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class= "slide-prev" aria-label="${placeholders.previousSlide || 'Previous Slide'}"></button>
      <button type="button" class="slide-next" aria-label="${placeholders.nextSlide || 'Next Slide'}"></button>
    `;

    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);

    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button" aria-label="${placeholders.showSlide || 'Show Slide'} ${idx + 1} ${placeholders.of || 'of'} ${rows.length}"></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    bindEvents(block);
  }
}
