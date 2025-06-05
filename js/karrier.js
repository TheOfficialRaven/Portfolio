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

import { initializeAllAnimations, resetAnimations, playLanguageTransition } from './animations.js';
import { projects, renderProjects } from './projects.js';

let revealObserver, heroObserver;

document.addEventListener('DOMContentLoaded', () => {
  // Render projects
  renderProjects();

  /* ===== 1) Hero Animációk ===== */
  function initHeroAnimations() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      // Meglévő elemek
      const titleSpans = heroSection.querySelectorAll('.hero-title span');
      const subtitle = heroSection.querySelector('.hero-subtitle');
      const buttons = heroSection.querySelectorAll('.hero-buttons a');
      const heroImage = heroSection.querySelector('.home-image');
      
      // Új: Social media ikonok
      const heroSocials = heroSection.querySelector('.hero-socials');
      const socialLinks = heroSection.querySelectorAll('.hero-socials a');
      
      // Animációk időzítése
      setTimeout(() => {
        titleSpans.forEach((span, i) => {
          setTimeout(() => span.classList.add('reveal'), i * 200);
        });
        
        setTimeout(() => subtitle.classList.add('reveal'), 800);
        
        buttons.forEach((btn, i) => {
          setTimeout(() => btn.classList.add('reveal'), 1000 + i * 200);
        });
        
        setTimeout(() => heroImage.classList.add('reveal'), 1200);
        
        // Új: Social media animációk
        setTimeout(() => {
          heroSocials.classList.add('reveal');
          socialLinks.forEach((link, i) => {
            setTimeout(() => link.classList.add('reveal'), 1200 + i * 200);
          });
        }, 1200);
      }, 100);
    }
  }

  /* ===== 2) Mobil Menü Toggle ===== */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
      });
    });
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
      const res = await fetch(`/${lang}.json`);
      return await res.json();
    } catch (err) {
      console.error(`Hiba a ${lang}.json betöltésénél:`, err);
      return {};
    }
  }

  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = translations[key];
      if (Array.isArray(value)) {
        el.innerHTML = value.map(word => `<span>${word}</span>`).join(' ');
      } else {
        el.textContent = value ?? '';
      }
    });
    
    // Reset és újrainicializálás
    resetAnimations();
    initHeroAnimations();
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
      localStorage.setItem('lang', newLang);
      
      // Nyelvváltás animáció lejátszása
      await playLanguageTransition(newLang);
      
      // Fordítások betöltése és alkalmazása
      const newTranslations = await loadLocale(newLang);
      applyTranslations(newTranslations);
    });
  });

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