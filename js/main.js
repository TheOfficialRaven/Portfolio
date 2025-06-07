import { initializeAllAnimations, resetAnimations, playLanguageTransition } from './animations.js';
import { renderProjects } from './projects.js';

document.addEventListener('DOMContentLoaded', () => {
  // Render professional projects on main page
  renderProjects();

  // Initialize all animations (includes hero animations)
  initializeAllAnimations();

  // Language transition event listener
  document.querySelectorAll('.lang-switcher button').forEach(button => {
    button.addEventListener('click', () => {
      playLanguageTransition(() => {
        resetAnimations();
        renderProjects(); // Re-render projects after language change
      });
    });
  });

  const slider = document.querySelector('.slider');
  
  if (slider) {
    const slides = slider.querySelectorAll('.slide');
    const dotsContainer = document.querySelector('.dots');
    let currentSlide = 0;
    let isAnimating = false;

    function getVisibleCount() {
      return window.innerWidth > 768 ? 3 : 1;
    }

    function setupDots() {
      if (!dotsContainer) return;
      
      dotsContainer.innerHTML = '';
      const visibleCount = getVisibleCount();
      const dotCount = Math.ceil(slides.length / visibleCount);
      
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => !isAnimating && update(i));
        dotsContainer.appendChild(dot);
      }
    }

    function update(index) {
      if (!slides.length) return;
      
      isAnimating = true;
      const visibleCount = getVisibleCount();
      currentSlide = index;

      const translateX = -(currentSlide * (100 / visibleCount));
      slider.style.transform = `translateX(${translateX}%)`;

      if (dotsContainer) {
        dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === currentSlide);
        });
      }

      setTimeout(() => {
        isAnimating = false;
      }, 500);
    }

    setupDots();
    window.addEventListener('resize', setupDots);
  }

  /* ===== Testimonials (Custom Carousel) ===== */
  (function(){
    const track = document.querySelector('.carousel-track');
    if (!track) return; // Ha nincs carousel, kilépünk
    
    const slides = Array.from(track.children);
    const prev = document.querySelector('.carousel-btn.prev');
    const next = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let idx = 0;

    // Determine how many slides are visible at once
    function getVisibleCount() {
      return window.innerWidth < 768 ? 1 : 2;
    }

    // Create dots dynamically based on total slides/visible
    function setupDots() {
      const visible = getVisibleCount();
      const total = Math.ceil(slides.length / visible);
      dotsContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
      }
      return { visible, total };
    }

    let { visible, total } = setupDots();
    const dots = Array.from(dotsContainer.children);

    function update(i) {
      // slide width + gap
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseInt(getComputedStyle(track).gap) || 0;
      // translate: i * (visible * slideWidth + (visible - 1)*gap)
      const shift = i * (visible * slideWidth + (visible - 1) * gap);
      track.style.transform = `translateX(-${shift}px)`;

      dots.forEach(d => d.classList.remove('active'));
      dots[i].classList.add('active');
      idx = i;
    }

    // Controls and dot events
    prev.addEventListener('click', () => update((idx - 1 + total) % total));
    next.addEventListener('click', () => update((idx + 1) % total));
    dotsContainer.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON') {
        const i = dots.indexOf(e.target);
        update(i);
      }
    });

    // Recalculate on window resize
    window.addEventListener('resize', () => {
      ({ visible, total } = setupDots());
      update(0);
    });

    // Auto-slide
    setInterval(() => update((idx + 1) % total), 7000);

    // Initial position
    update(0);
  })();
});