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
  const heroImg = document.getElementById('hero-img');
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
        el, mouseControls: true, touchControls: true, gyroControls: false,
        color: theme === 'dark' ? 0x00c9a7 : 0xf7a072,
        backgroundColor: theme === 'dark' ? 0x0d0d0d : 0xf5f5f5,
        points: 14, maxDistance: 20, spacing: 18, showDots: false
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
  const res = await fetch(`/${lang}.json`);
  return res.json();
}

function applyTranslations(translations) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = translations[key];
    if (Array.isArray(value)) {
      // ha tömb, bejárjuk és span-eket töltünk
      el.innerHTML = value.map(word => `<span>${word}</span>`).join(' ');
    } else {
      el.textContent = value || '';
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // 1) Eldöntjük a nyelvet (localStorage → alapértelmezett 'hu')
  const lang = localStorage.getItem('lang') || 'hu';
  // 2) betöltjük a JSON-t
  const translations = await loadLocale(lang);
  // 3) alkalmazzuk a fordítás
  applyTranslations(translations);
});

/* Language Change buttons */

document.querySelectorAll('.lang-switcher button').forEach(btn => {
  btn.addEventListener('click', async () => {
    const newLang = btn.getAttribute('data-lang');
    localStorage.setItem('lang', newLang);
    const translations = await loadLocale(newLang);
    applyTranslations(translations);
  });
});

  /* ========= Hero Animation ============== */
  const hero = document.getElementById('hero');
  const titleSpans = document.querySelectorAll('.hero-title span');
  const subtitle = document.querySelector('.hero-subtitle');
  const buttons = document.querySelectorAll('.hero-buttons a');
  const heroImgContainer = document.querySelector('.home-image');

  /* ===== Global Scroll-Reveal ===== */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('section').forEach(sec => revealObserver.observe(sec));

  // Hero text staggering
  titleSpans.forEach((span, i) => {
    span.style.transitionDelay = `${i * 0.1 + 0.3}s`;
  });

  // Stagger subtitle
  if (subtitle) {
    subtitle.style.transitionDelay = `${titleSpans.length * 0.1 + 0.3}s`;
  }

  // Observe hero for reveal and chained animations
  const heroObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Reveal title spans
        titleSpans.forEach(span => span.classList.add('reveal'));
        // Reveal subtitle
        if (subtitle) subtitle.classList.add('reveal');
        // Reveal buttons
        buttons.forEach((btn, i) => {
          btn.style.transitionDelay = `${titleSpans.length * 0.1 + 0.3 + (i + 1) * 0.1}s`;
          btn.classList.add('reveal');
        });
        // Reveal hero image
        if (heroImgContainer) {
          heroImgContainer.style.transitionDelay = `${titleSpans.length * 0.1 + 0.3 + buttons.length * 0.1 + 0.2}s`;
          heroImgContainer.classList.add('reveal');
        }
        obs.unobserve(hero);

        // After reveal finishes, reset transition-delay on buttons to 0, so hover-out is immediate
        const buttonRevealTotal = titleSpans.length * 0.1 + 0.3 + buttons.length * 0.1;
        setTimeout(() => {
          buttons.forEach(btn => btn.style.transitionDelay = '0s');
        }, buttonRevealTotal * 1000 + 50);
      }
    });
  }, { threshold: 0.2 });
  if (hero) heroObserver.observe(hero);

          // Parallax on hero-container
const heroContainer = document.querySelector('.hero-container');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  lastScroll = window.pageYOffset;
});
function rafParallax() {
  heroContainer.style.transform = `translateY(${lastScroll * 0.3}px)`;
  requestAnimationFrame(rafParallax);
}
requestAnimationFrame(rafParallax);

//Time-line

const section = document.getElementById('career-timeline');
    const timeline = section.querySelector('.timeline');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.classList.add('reveal');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(section);

});