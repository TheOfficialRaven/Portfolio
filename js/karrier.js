/**
 * js/karrier.js
 *
 * A Karrier oldalon használt JavaScript:
 *   - Mobil menü kezelés
 *   - Scroll progress bar
 *   - Nyelvváltás (JSON-alapú)
 *   - Hero szekció animáció (cím, alcím, gombok, kép, social ikonok)
 *   - Scroll-alapú reveal animációk (Timeline, Courses, Skills, Contact)
 *   - Parallax effekt a hero-container-en
 *   - Back-to-Top gomb
 */

import { initNavigation } from './navigation.js';
import { initializeAllAnimations, resetAnimations, playLanguageTransition } from './animations.js';
import { projects, renderProjects } from './projects.js';
import { renderLearningProjects } from './learning-projects.js';

let revealObserver, heroObserver;

// Update images based on theme
function updateImages(theme) {
  const images = document.querySelectorAll('img[data-image-dark][data-image-light]');
  images.forEach(img => {
    const src = theme === 'dark' ? img.dataset.imageDark : img.dataset.imageLight;
    if (src) img.src = src;
  });
}

// Initialize vanta.js
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

// Theme toggle handler
function setupThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateImages(newTheme);
    initVanta();
  });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initVanta();
  setupThemeToggle();
  // Render projects
  renderProjects();
  renderLearningProjects();

  /* ===== 1) Hero Animációk ===== */
  function initHeroAnimations() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // Először eltávolítjuk az összes reveal osztályt
    heroSection.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal'));

    // Hero title kezelése
    const heroTitle = heroSection.querySelector('.hero-title');
    if (heroTitle) {
      // Ha már span-ekben van a szöveg, ne módosítsuk
      if (!heroTitle.querySelector('span')) {
        // Szöveg felbontása szavakra az aktuális tartalomból
        const titleText = heroTitle.textContent.trim();
        const words = titleText.split(' ');
        heroTitle.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
      }
    }

    // Elemek kiválasztása
    const titleSpans = heroSection.querySelectorAll('.hero-title span');
    const subtitle = heroSection.querySelector('.hero-subtitle');
    const buttons = heroSection.querySelectorAll('.hero-buttons a');
    const heroImage = heroSection.querySelector('.home-image');
    const heroSocials = heroSection.querySelector('.hero-socials');
    const socialLinks = heroSection.querySelectorAll('.hero-socials a');

    // Animációk időzítése - mobil optimalizált
    requestAnimationFrame(() => {
      // Mobil detektálás
      const isMobile = window.innerWidth <= 768;
      const baseDelay = isMobile ? 0.1 : 0.3;
      const stepDelay = isMobile ? 0.05 : 0.1;

      // Title spans animációk
      titleSpans.forEach((span, i) => {
        span.style.transitionDelay = `${baseDelay + (i * stepDelay)}s`;
        span.classList.add('reveal');
      });

      // Subtitle animáció
      if (subtitle) {
        subtitle.style.transitionDelay = `${baseDelay + (titleSpans.length * stepDelay)}s`;
        subtitle.classList.add('reveal');
      }

      // Button animációk
      buttons.forEach((btn, i) => {
        btn.style.transitionDelay = `${baseDelay + ((titleSpans.length + i + 1) * stepDelay)}s`;
        btn.classList.add('reveal');
      });

      // Hero image animáció
      if (heroImage) {
        heroImage.style.transitionDelay = `${baseDelay + ((titleSpans.length + buttons.length + 1) * stepDelay)}s`;
        heroImage.classList.add('reveal');
      }

      // Közösségi média ikonok animációja
      if (heroSocials) {
        heroSocials.style.transitionDelay = `${baseDelay + ((titleSpans.length + buttons.length + 2) * stepDelay)}s`;
        heroSocials.classList.add('reveal');

        socialLinks.forEach((link, i) => {
          link.style.transitionDelay = `${baseDelay + ((titleSpans.length + buttons.length + 3 + i) * stepDelay)}s`;
          link.classList.add('reveal');
        });
      }

      // Késleltetések visszaállítása az animáció után
      const totalDelay = baseDelay + ((titleSpans.length + buttons.length + socialLinks.length + 3) * stepDelay);
      setTimeout(() => {
        heroSection.querySelectorAll('[style*="transition-delay"]').forEach(el => {
          el.style.transitionDelay = '0s';
        });
      }, totalDelay * 1000);
    });
  }

  function resetHeroAnimations() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      // Eltávolítjuk az összes reveal osztályt és transition delay-t
      heroSection.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('reveal');
        el.style.transitionDelay = '';
      });
    }
  }



  /* ===== 3) Scroll Progress Bar ===== */
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && docHeight > 0) {
      progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
    }
  });

  /* ===== 4) Nyelvváltás (i18n) ===== */
  async function loadLocale(lang) {
    try {
      const res = await fetch(`./${lang}.json`);  // Relatív elérési út
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(`Hiba a ${lang}.json betöltésénél:`, err);
      // Fallback az alapértelmezett nyelvre
      try {
        const fallbackRes = await fetch(`./hu.json`);
        if (!fallbackRes.ok) throw new Error(`HTTP error! status: ${fallbackRes.status}`);
        return await fallbackRes.json();
      } catch (fallbackErr) {
        console.error('Hiba az alapértelmezett nyelvi fájl betöltésénél:', fallbackErr);
        return {};
      }
    }
  }

  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = key.split('.').reduce((obj, k) => obj?.[k], translations);
      
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Array típusú értékek (pl. hero title) span-ekké alakítása
          el.innerHTML = value.map(word => `<span>${word}</span>`).join(' ');
        } else if (el.classList.contains('hero-title')) {
          // Hero title speciális kezelése string esetén
          const words = value.split(' ');
          el.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
        } else if (el.hasAttribute('data-ph')) {
          // Placeholder kezelése
          el.placeholder = value;
        } else if (el.hasAttribute('content')) {
          // Meta tag content kezelése
          el.setAttribute('content', value);
        } else {
          // Alap szöveg kezelése - HTML támogatással
          if (el.tagName === 'A' && el.hasAttribute('href')) {
            el.textContent = value;
          } else {
            el.innerHTML = value;
          }
        }
      }
    });
    
    // Placeholderek beállítása külön
    document.querySelectorAll('[data-ph]').forEach(el => {
      const key = el.getAttribute('data-ph');
      const value = key.split('.').reduce((obj, k) => obj?.[k], translations);
      if (value) {
        el.placeholder = value;
      }
    });
    
    // Reset és újrainicializálás
    resetHeroAnimations();
    setTimeout(() => {
      initHeroAnimations();
    }, 100); // Kis késleltetés a DOM frissítés miatt
  }

  // Alapértelmezett nyelv betöltése és fordítás alkalmazása
  (async () => {
    const defaultLang = localStorage.getItem('lang') || 'hu';
    const translations = await loadLocale(defaultLang);
    applyTranslations(translations);
  })();

  // Nyelvváltó gombok
  document.querySelectorAll('.lang-switcher button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const newLang = btn.getAttribute('data-lang');
      
      // Remove active class from all buttons and add to clicked one
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      localStorage.setItem('lang', newLang);
      
      // Nyelvváltás animáció lejátszása
      await playLanguageTransition(newLang);
      
      // Fordítások betöltése és alkalmazása
      const newTranslations = await loadLocale(newLang);
      applyTranslations(newTranslations);
      
      // Projektek újrarenderelése a nyelvváltás után
      renderProjects();
      renderLearningProjects();
    });
  });

  // Set initial active language button
  const currentLang = localStorage.getItem('lang') || 'hu';
  const currentLangBtn = document.querySelector(`[data-lang="${currentLang}"]`);
  if (currentLangBtn) {
    currentLangBtn.classList.add('active');
  }

  /* ===== 5) Animációk inicializálása ===== */
  initializeAllAnimations();
  initHeroAnimations();

  /* ===== 6) Parallax a Hero-container-en ===== */
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

  /* ===== 7) Back to Top gomb ===== */
  {
    const btn = document.getElementById('backToTop');
    const footer = document.querySelector('footer');
    if (btn && footer) {
      const obsBT = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          btn.classList.toggle('show', entry.isIntersecting);
        });
      }, { threshold: 0.3 });
      obsBT.observe(footer);

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ===== 8) Footer évszám frissítése ===== */
  {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }
});