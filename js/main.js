import { initializeAllAnimations, resetAnimations, playLanguageTransition } from './animations.js';
import { renderProjects } from './projects.js';

document.addEventListener('DOMContentLoaded', () => {
  // Render projects
  renderProjects();

  // Initialize animations
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