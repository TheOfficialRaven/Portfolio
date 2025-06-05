import { initializeAllAnimations, resetAnimations, playLanguageTransition } from './animations.js';

// --- Observer változók globálisan ---
let revealObserver, heroObserver, aboutObs;

document.addEventListener('DOMContentLoaded', () => {
  /* ===== Mobile Menu Toggle ===== */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => mobileNav.classList.toggle('active'));
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => mobileNav.classList.remove('active')));

  /* ===== Scroll Progress Bar ===== */
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
  });

  /* ===== Theme Toggle & Vanta Background ===== */
  let vantaEffect = null;
  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle');
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
        color: 0x00c9a7,
        backgroundColor: 0x0d0d0d,
        points: 14,
        maxDistance: 20,
        spacing: 18,
        showDots: false
      });
    }
  }

  // Load saved theme
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

  /* ============ Language Change ================ */
  async function loadLocale(lang) {
    try {
      const res = await fetch(`./locales/${lang}.json`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to default translations if available
      try {
        const fallbackRes = await fetch(`./locales/hu.json`);
        if (!fallbackRes.ok) throw new Error(`HTTP error! status: ${fallbackRes.status}`);
        return fallbackRes.json();
      } catch (fallbackError) {
        console.error('Error loading fallback translations:', fallbackError);
        return {};
      }
    }
  }

  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = translations[key];
      if (Array.isArray(value)) {
        el.innerHTML = value.map(word => `<span>${word}</span>`).join(' ');
      } else {
        el.textContent = value || '';
      }
    });
    // Set placeholders
    document.querySelectorAll('[data-ph]').forEach(el => {
      const key = el.getAttribute('data-ph');
      if (translations[key]) {
        el.placeholder = translations[key];
      }
    });

    // Reset és újrainicializálás
    resetAnimations();
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
      
      // Nyelvváltás animáció lejátszása
      await playLanguageTransition(newLang);
      
      // Fordítások betöltése és alkalmazása
      const translations = await loadLocale(newLang);
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
  heroButtons.forEach((btn, i) => {
    btn.style.transitionDelay = `${titleSpans.length * 0.1 + 0.3 + (i + 1) * 0.1}s`;
  });
  if (heroImgContainer) {
    heroImgContainer.style.transitionDelay = `${titleSpans.length * 0.1 + 0.3 + heroButtons.length * 0.1 + 0.2}s`;
  }

  if (heroObserver) heroObserver.disconnect();
  heroObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        titleSpans.forEach(span => span.classList.add('reveal'));
        if (subtitle) subtitle.classList.add('reveal');
        heroButtons.forEach((btn, i) => {
          btn.style.transitionDelay = `${titleSpans.length * 0.1 + 0.3 + (i + 1) * 0.1}s`;
          btn.classList.add('reveal');
        });
        if (heroImgContainer) {
          heroImgContainer.style.transitionDelay = `${titleSpans.length * 0.1 + 0.3 + heroButtons.length * 0.1 + 0.2}s`;
          heroImgContainer.classList.add('reveal');
        }
        obs.unobserve(heroSection);
        const totalDelay = titleSpans.length * 0.1 + 0.3 + heroButtons.length * 0.1;
        setTimeout(() => {
          heroButtons.forEach(btn => btn.style.transitionDelay = '0s');
        }, totalDelay * 1000 + 50);
      }
    });
  }, { threshold: 0.2 });
  if (heroSection) heroObserver.observe(heroSection);

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