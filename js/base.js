import { initializeAllAnimations, resetAnimations, playLanguageTransition } from './animations.js';

// --- Observer változók globálisan ---
let revealObserver, heroObserver, aboutObs;

// Téma kezelés
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Átmenetek letiltása az oldal betöltésekor
document.documentElement.classList.add('no-transition');

// Téma inicializálás már a DOM betöltése előtt
const initTheme = () => {
  // Téma beállítása még a DOM betöltése előtt
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || (prefersDarkScheme.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);
  
  // Stílus hozzáadása a head-hez a villanás elkerülésére
  const style = document.createElement('style');
  style.textContent = `
    :root[data-theme="light"] {
      background-color: #ffffff;
    }
    :root[data-theme="dark"] {
      background-color: #0a0a0a;
    }
  `;
  document.head.appendChild(style);
}

// Téma inicializálás azonnal
initTheme();

// Átmenetek visszaállítása kis késleltetéssel
window.addEventListener('load', () => {
  setTimeout(() => {
    document.documentElement.classList.remove('no-transition');
  }, 100);
});

document.addEventListener('DOMContentLoaded', () => {
  /* ===== Mobile Menu Toggle ===== */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const body = document.body;

  if (hamburger && mobileNav) {
    let isAnimating = false;

    const toggleMenu = (show) => {
      if (isAnimating) return;
      isAnimating = true;

      const isCurrentlyActive = mobileNav.classList.contains('active');
      const shouldShow = show !== undefined ? show : !isCurrentlyActive;

      if (shouldShow) {
        hamburger.classList.add('active');
        mobileNav.classList.add('active');
        body.classList.add('menu-open');
        
        // Add transition delay to menu items
        mobileNav.querySelectorAll('a').forEach((link, index) => {
          link.style.transitionDelay = `${0.1 + index * 0.05}s`;
        });
      } else {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Remove transition delays
        mobileNav.querySelectorAll('a').forEach(link => {
          link.style.transitionDelay = '';
        });
      }

      // Reset animation flag after transition
      setTimeout(() => {
        isAnimating = false;
      }, 300);
    };

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
      toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('active') && 
          !hamburger.contains(e.target) && 
          !mobileNav.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close menu when clicking on mobile nav links
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(false);
      });
    });

    // Close menu on resize if screen becomes larger than mobile breakpoint
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
          toggleMenu(false);
        }
      }, 250);
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  }

  /* ===== Scroll Progress Bar ===== */
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
  });

  /* ===== Theme Toggle & Vanta Background ===== */
  let vantaEffect = null;
  const heroImg = document.getElementById('hero-img') || document.getElementById('career-img');
  const aboutImg = document.getElementById('about-img');

  function updateImages(theme) {
    if (heroImg) {
      const newHero = heroImg.getAttribute(`data-image-${theme}`);
      if (newHero) heroImg.src = newHero;
    }
    if (aboutImg) {
      const newAbout = aboutImg.getAttribute(`data-image-${theme}`);
      if (newAbout) aboutImg.src = newAbout;
    }
  }

  function initVanta(theme) {
    const el = document.getElementById('vanta-bg');
    if (vantaEffect && vantaEffect.destroy) vantaEffect.destroy();
    if (window.VANTA && el) {
      vantaEffect = VANTA.NET({
        el,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        color: theme === 'dark' ? 0x00c9a7 : 0x00b396,
        backgroundColor: theme === 'dark' ? 0x0a0a0a : 0xffffff,
        points: 14,
        maxDistance: 20,
        spacing: 18,
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
  initVanta(initialTheme);

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
  themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeSpecificElements(newTheme);
    initVanta(newTheme);
  });

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
      updateThemeSpecificElements(newTheme);
      initVanta(newTheme);
    }
  });

  /* ============ Language Change ================ */
  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      let value = translations;
      const keys = key.split('.');
      
      // Debug log
      console.log('Translating element:', el);
      console.log('Translation key:', key);
      console.log('Initial value:', value);
      
      // Végigmegyünk a kulcsokon és megkeressük az értéket
      for (const k of keys) {
        if (value === undefined || value === null) {
          console.warn(`Translation path broken at key "${k}" in path "${key}"`);
          break;
        }
        value = value[k];
        console.log(`After key "${k}":`, value); // Debug log
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
        console.log('Successfully set translation for', key, 'to:', value);
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
            console.log('Used fallback translation for', key, ':', fallbackValue);
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
        console.log('Successfully set placeholder for', key, 'to:', value);
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

  /* ===== Animációk inicializálása ===== */
  initializeAllAnimations();

  /* ===== Parallax on Hero Container ===== */
  const heroContainer = document.querySelector('.hero-container');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    lastScroll = window.pageYOffset;
  });
  function rafParallax() {
    if (heroContainer) {
      heroContainer.style.transform = `translateY(${lastScroll * 0.3}px)`;
    }
    requestAnimationFrame(rafParallax);
  }
  requestAnimationFrame(rafParallax);

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

  // Minden .reveal osztály eltávolítása
  document.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal'));

  // --- Újra példányosítjuk az összes observer-t ---
  // 1. Global Scroll-Reveal
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('section').forEach(sec => revealObserver.observe(sec));

  // 2. Hero Section
  const heroSection = document.getElementById('hero');
  const titleSpans = document.querySelectorAll('.hero-title span');
  const subtitle = document.querySelector('.hero-subtitle');
  const heroButtons = document.querySelectorAll('.hero-buttons a');
  const heroImgContainer = document.querySelector('.home-image');

  titleSpans.forEach((span, i) => {
    span.style.transitionDelay = `${i * 0.1 + 0.3}s`;
  });
  if (subtitle) {
    subtitle.style.transitionDelay = `${titleSpans.length * 0.1 + 0.3}s`;
  }
  
  // Hero elemek animálása
  setTimeout(() => {
    titleSpans.forEach(span => span.classList.add('reveal'));
    if (subtitle) subtitle.classList.add('reveal');
    heroButtons.forEach((btn, i) => {
      btn.style.transitionDelay = `${(titleSpans.length + 1) * 0.1 + 0.3 + (i * 0.1)}s`;
      btn.classList.add('reveal');
    });
    if (heroImgContainer) {
      heroImgContainer.style.transitionDelay = `${(titleSpans.length + 3) * 0.1 + 0.3}s`;
      heroImgContainer.classList.add('reveal');
    }
  }, 100);

  // 3. About Section
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const title = aboutSection.querySelector('.section-title');
    if (title) {
      const chars = title.textContent.trim().length;
      title.style.setProperty('--title-chars', chars);
    }
    if (aboutObs) aboutObs.disconnect();
    aboutObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutSection.classList.add('reveal');
          obs.unobserve(aboutSection);
        }
      });
    }, { threshold: 0.2 });
    aboutObs.observe(aboutSection);
  }
});