import { initializeAllAnimations, resetAnimations, playLanguageTransition } from './animations.js';
import { initNavigation, updateActiveMenuItem } from './navigation.js';
import { renderProjects } from './projects.js';

// Observer változók már az animations.js-ben vannak kezelve

// Téma kezelés
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Átmenetek letiltása az oldal betöltésekor
document.documentElement.classList.add('no-transition');

// Téma inicializálás már a DOM betöltése előtt
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  
  // Update images based on theme
  const images = document.querySelectorAll('img[data-image-dark][data-image-light]');
  images.forEach(img => {
    const src = theme === 'dark' ? img.dataset.imageDark : img.dataset.imageLight;
    if (src) img.src = src;
  });
};

// Téma inicializálás azonnal
initTheme();

// Átmenetek visszaállítása kis késleltetéssel
window.addEventListener('load', () => {
  setTimeout(() => {
    document.documentElement.classList.remove('no-transition');
  }, 100);
});

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initVanta();
  initializeAllAnimations();
  
  // Aktív navigációs elem beállítása
  setTimeout(() => {
    updateActiveMenuItem();
  }, 100);



  /* ===== Scroll Progress Bar ===== */
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
  });

  /* ===== Theme Toggle & Vanta Background ===== */
  const themeToggle = document.querySelector('.theme-toggle');
  let vantaEffect = null;
  const heroImg = document.getElementById('hero-img') || document.getElementById('career-img');
  const aboutImg = document.getElementById('about-img');

  function initVanta() {
    if (typeof VANTA !== 'undefined') {
      VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x00c9a7,
        backgroundColor: 0x0a0a0a,
        points: 15.00,
        maxDistance: 25.00,
        spacing: 17.00,
        showDots: false
      });
    }
  }

  // DOM betöltése után további téma-függő elemek kezelése
  const updateThemeSpecificElements = (theme) => {
    // Képek frissítése
    const themeImages = document.querySelectorAll('[data-image-dark]');
    themeImages.forEach(img => {
      const darkSrc = img.getAttribute('data-image-dark');
      const lightSrc = img.getAttribute('data-image-light');
      img.src = theme === 'dark' ? darkSrc : lightSrc;
    });
  }

  // Kezdeti állapot beállítása
  const initialTheme = document.documentElement.getAttribute('data-theme');
  updateThemeSpecificElements(initialTheme);
  initVanta();

  // Kezdeti témaikon beállítása
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    if (initialTheme === 'dark') {
      themeIcon.innerHTML = `
        <circle class="sun-core" cx="12" cy="12" r="5"/>
        <g class="sun-rays">
          <line x1="12" y1="3" x2="12" y2="1"/>
          <line x1="12" y1="23" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="1" y2="12"/>
          <line x1="23" y1="12" x2="21" y2="12"/>
          <line x1="5.64" y1="5.64" x2="4.22" y2="4.22"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="5.64" y1="18.36" x2="4.22" y2="19.78"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </g>
        <path class="moon" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
      `;
    } else {
      themeIcon.innerHTML = `
        <circle class="sun-core" cx="12" cy="12" r="5"/>
        <g class="sun-rays">
          <line x1="12" y1="3" x2="12" y2="1"/>
          <line x1="12" y1="23" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="1" y2="12"/>
          <line x1="23" y1="12" x2="21" y2="12"/>
          <line x1="5.64" y1="5.64" x2="4.22" y2="4.22"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="5.64" y1="18.36" x2="4.22" y2="19.78"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </g>
        <path class="moon" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
      `;
    }
  }

  // Témaváltás eseménykezelő
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Update images based on new theme
      const images = document.querySelectorAll('img[data-image-dark][data-image-light]');
      images.forEach(img => {
        const src = newTheme === 'dark' ? img.dataset.imageDark : img.dataset.imageLight;
        if (src) img.src = src;
      });
      
      initVanta();
    });
  }

  // Témaváltó gomb HTML struktúra beállítása
  if (themeToggle) {
    themeToggle.innerHTML = `
      <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2m0 16v2M4 12H2m20 0h-2m-2.828-6.172l-1.414 1.414M6.242 17.758l-1.414 1.414M6.242 6.242L4.828 4.828m12.93 12.93l1.414 1.414"/>
      </svg>
      <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>
    `;
  }

  // Rendszer téma változás figyelése
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateImages(newTheme);
      initVanta();
    }
  });

  /* ============ Language Change ================ */
  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      let value = translations;
      const keys = key.split('.');
      
      // Végigmegyünk a kulcsokon és megkeressük az értéket
      for (const k of keys) {
        if (value === undefined || value === null) {
          console.warn(`Translation path broken at key "${k}" in path "${key}"`);
          break;
        }
        value = value[k];
      }
      
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          el.innerHTML = value.map(word => `<span>${word}</span>`).join(' ');
        } else {
          // Ha az elem egy link és van href attribútuma, akkor csak a szöveget cseréljük
          if (el.tagName === 'A' && el.hasAttribute('href')) {
            el.textContent = value;
          } else {
            el.innerHTML = value;
          }
        }
      } else {
        console.warn(`No translation found for key: ${key} in current language`);
        // Próbáljuk meg a fallback nyelvet (magyar)
        if (translations !== fallbackTranslations) {
          let fallbackValue = fallbackTranslations;
          for (const k of keys) {
            if (fallbackValue === undefined || fallbackValue === null) break;
            fallbackValue = fallbackValue[k];
          }
          if (fallbackValue !== undefined && fallbackValue !== null) {
            if (el.tagName === 'A' && el.hasAttribute('href')) {
              el.textContent = fallbackValue;
            } else {
              el.innerHTML = fallbackValue;
            }
          }
        }
      }
    });
    
    // data-translate attribútumok fordítása (navigációhoz)
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      let value = translations;
      const keys = key.split('.');
      
      for (const k of keys) {
        if (value === undefined || value === null) {
          console.warn(`Translation path broken at key "${k}" in path "${key}"`);
          break;
        }
        value = value[k];
      }
      
      if (value !== undefined && value !== null) {
        el.textContent = value;
      } else {
        console.warn(`No data-translate translation found for key: ${key}`);
        // Próbáljuk meg a fallback nyelvet (magyar)
        if (translations !== fallbackTranslations) {
          let fallbackValue = fallbackTranslations;
          for (const k of keys) {
            if (fallbackValue === undefined || fallbackValue === null) break;
            fallbackValue = fallbackValue[k];
          }
          if (fallbackValue !== undefined && fallbackValue !== null) {
            el.textContent = fallbackValue;
          }
        }
      }
    });

    // Placeholderek beállítása
    document.querySelectorAll('[data-ph]').forEach(el => {
      const key = el.getAttribute('data-ph');
      let value = translations;
      const keys = key.split('.');
      
      for (const k of keys) {
        if (value === undefined || value === null) {
          console.warn(`Placeholder translation path broken at key "${k}" in path "${key}"`);
          break;
        }
        value = value[k];
      }
      
      if (value !== undefined && value !== null) {
        el.placeholder = value;
      } else {
        console.warn(`No placeholder translation found for key: ${key}`);
      }
    });

    // Reset és újrainicializálás
    resetAnimations();
    initializeAllAnimations();
  }

  // Fallback translations tárolása
  let fallbackTranslations = null;

  // Módosított loadLocale függvény
  async function loadLocale(lang) {
    try {
      const res = await fetch(`./${lang}.json`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const translations = await res.json();
      
      // Ha magyar nyelv, mentsük el fallback-nek
      if (lang === 'hu' && !fallbackTranslations) {
        fallbackTranslations = translations;
      }
      
      return translations;
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to default translations if available
      if (!fallbackTranslations) {
        try {
          const fallbackRes = await fetch(`./hu.json`);
          if (!fallbackRes.ok) throw new Error(`HTTP error! status: ${fallbackRes.status}`);
          fallbackTranslations = await fallbackRes.json();
          return fallbackTranslations;
        } catch (fallbackError) {
          console.error('Error loading fallback translations:', fallbackError);
          return {};
        }
      }
      return fallbackTranslations || {};
    }
  }

  // 1) Determine language (use localStorage or default 'hu')
  const lang = localStorage.getItem('lang') || 'hu';
  // 2) Load JSON for that language
  loadLocale(lang).then(translations => {
    // 3) Apply translations
    applyTranslations(translations);
  });

  /* Language Switcher buttons */
  document.querySelectorAll('.lang-switcher button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const newLang = btn.getAttribute('data-lang');
      
      // Remove active class from all buttons and add to clicked one
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      localStorage.setItem('lang', newLang);
      
      // Aktuális nyelv beállítása az overlay-ben
      const currentLangSpan = document.querySelector('.current-lang');
      if (currentLangSpan) {
        currentLangSpan.textContent = newLang.toUpperCase();
      }
      
      // Fordítások betöltése
      const translations = await loadLocale(newLang);
      
      // Nyelvváltás animáció lejátszása
      await playLanguageTransition(newLang);
      
      // Fordítások alkalmazása
      applyTranslations(translations);
    });
  });

  // Set initial active language button
  const currentLang = localStorage.getItem('lang') || 'hu';
  const currentLangBtn = document.querySelector(`[data-lang="${currentLang}"]`);
  if (currentLangBtn) {
    currentLangBtn.classList.add('active');
  }

  /* ===== Animációk inicializálása ===== */
  initializeAllAnimations();

  /* ===== Main.js funkcionalitás hozzáadása ===== */
  // Render professional projects on main page
  renderProjects();

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

  /* ===== Parallax on Hero Container ===== */
  const heroContainer = document.querySelector('.hero-container');
  let lastScroll = 0;
  const header = document.querySelector('.header');

  // Combined scroll event handler
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Hero parallax effect
    if (heroContainer) {
      heroContainer.style.transform = `translateY(${currentScroll * 0.3}px)`;
    }

    // Close mobile menu when scrolling down (but keep header visible)
    if (currentScroll > lastScroll) {
      const mobileNav = document.querySelector('.mobile-nav');
      if (mobileNav && mobileNav.classList.contains('active')) {
        // Close mobile menu
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
          hamburger.classList.remove('active');
          mobileNav.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
      }
    }

    lastScroll = currentScroll;
  });

  /* ===== Back to Top Button ===== */
  {
    const btn = document.getElementById('backToTop');
    const footer = document.querySelector('footer');
    if (btn && footer) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          btn.classList.toggle('show', entry.isIntersecting);
        });
      }, { threshold: 0.3 });
      obs.observe(footer);
      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ===== Footer évszám frissítése ===== */
  {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }

  // Az animációkat az initializeAllAnimations() fogja kezelni
});