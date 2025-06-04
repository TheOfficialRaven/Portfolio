/**
 * js/karrier.js
 *
 * A Karrier oldalon használt JavaScript:
 *   - Mobil menü kezelés
 *   - Scroll‐progress bar
 *   - Sötét/világos téma váltó & Vanta.js háttér
 *   - Nyelvváltás (JSON-alapú)
 *   - Hero szekció animáció (cím, alcím, gombok, kép)
 *   - Scroll‐alapú reveal animációk (Timeline, Courses, Skills, Contact)
 *   - Parallax effekt a hero-container-en
 *   - Back-to-Top gomb
 */

let revealObserver, heroObserver;

document.addEventListener('DOMContentLoaded', () => {
  /* ===== 1) Mobil Menü Toggle ===== */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('active');
    });
  });

  /* ===== 2) Scroll Progress Bar ===== */
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
    }
  });

  /* ===== 3) Theme Toggle & Vanta.js Background ===== */
  let vantaEffect = null;
  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle');
  const heroImg = document.getElementById('career-img');
  const aboutImg = document.getElementById('about-img'); // opcionális, ha van

  function updateImages(theme) {
    if (heroImg) {
      const src = heroImg.getAttribute(`data-image-${theme}`);
      if (src) heroImg.src = src;
    }
    if (aboutImg) {
      const src = aboutImg.getAttribute(`data-image-${theme}`);
      if (src) aboutImg.src = src;
    }
  }

  function initVanta(theme) {
    const el = document.getElementById('vanta-bg');
    if (vantaEffect && vantaEffect.destroy) {
      vantaEffect.destroy();
      vantaEffect = null;
    }
    if (window.VANTA && el) {
      vantaEffect = VANTA.NET({
        el,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        color: theme === 'dark' ? 0x00c9a7 : 0xf7a072,
        backgroundColor: theme === 'dark' ? 0x0d0d0d : 0xf7f5f5,
        points: 14, maxDistance: 20, spacing: 18, showDots: false
      });
    }
  }

  // Betöltött téma lekérdezése, alapértelmezett: 'dark'
  const savedTheme = localStorage.getItem('theme') || 'dark';
  body.setAttribute('data-theme', savedTheme);
  updateImages(savedTheme);
  initVanta(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateImages(newTheme);
    initVanta(newTheme);
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
    // Minden .reveal eltávolítása (új nyelvnél újra animál)
    document.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal'));
    // Újraindítjuk az observer-eket
    setupObservers();
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
      const newTranslations = await loadLocale(newLang);
      applyTranslations(newTranslations);
    });
  });

  /* ===== 5) Hero szekció animáció ===== */
  function setupObservers() {
    // 1. Szekciók observere (általános reveal)
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    // Minden szekció
    document.querySelectorAll('section').forEach(sec => revealObserver.observe(sec));
    // Timeline lépések
    document.querySelectorAll('#career-timeline .step').forEach(el => revealObserver.observe(el));
    // Kurzus kártyák
    document.querySelectorAll('#career-courses .course-card').forEach(el => revealObserver.observe(el));
    // Skill kártyák
    document.querySelectorAll('#career-skills .skill-card').forEach(el => revealObserver.observe(el));
    // Contact szekció tartalma
    const contactContainer = document.querySelector('#career-contact .container');
    if (contactContainer) revealObserver.observe(contactContainer);

    // 2. Hero szekció animáció (csak ha látható)
    const heroSection = document.getElementById('career-hero');
    const titleSpans = document.querySelectorAll('.hero-title span');
    const subtitle = document.querySelector('.hero-subtitle');
    const buttons = document.querySelectorAll('.hero-buttons a');
    const heroImgContainer = document.querySelector('.home-image');

    // Staggered delay
    titleSpans.forEach((span, i) => {
      span.style.transitionDelay = `${i * 0.1 + 0.3}s`;
    });
    if (subtitle) {
      subtitle.style.transitionDelay = `${titleSpans.length * 0.1 + 0.3}s`;
    }
    buttons.forEach((btn, i) => {
      btn.style.transitionDelay = `${titleSpans.length * 0.1 + 0.3 + (i + 1) * 0.1}s`;
    });
    if (heroImgContainer) {
      heroImgContainer.style.transitionDelay =
        `${titleSpans.length * 0.1 + 0.3 + buttons.length * 0.1 + 0.2}s`;
    }

    if (heroObserver) heroObserver.disconnect();
    heroObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          titleSpans.forEach(span => span.classList.add('reveal'));
          if (subtitle) subtitle.classList.add('reveal');
          buttons.forEach((btn, i) => {
            btn.style.transitionDelay = `${titleSpans.length * 0.1 + 0.3 + (i + 1) * 0.1}s`;
            btn.classList.add('reveal');
          });
          if (heroImgContainer) {
            heroImgContainer.style.transitionDelay =
              `${titleSpans.length * 0.1 + 0.3 + buttons.length * 0.1 + 0.2}s`;
            heroImgContainer.classList.add('reveal');
          }
          obs.unobserve(entry.target);
          // Reset button transition-delay after animation
          const totalDelay = titleSpans.length * 0.1 + 0.3 + buttons.length * 0.1;
          setTimeout(() => {
            buttons.forEach(btn => btn.style.transitionDelay = '0s');
          }, totalDelay * 1000 + 50);
        }
      });
    }, { threshold: 0.2 });
    if (heroSection) heroObserver.observe(heroSection);
  }

  // Első betöltéskor observerek indítása
  setupObservers();

  /* ===== 7) Parallax a Hero-container-en ===== */
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

  /* ===== 8) Back to Top gomb ===== */
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

  /* ===== 9) Footer évszám frissítése ===== */
  {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }
});