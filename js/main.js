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

  //* ============ About Section Scroll-Reveal and Chained Animations ==
document.addEventListener('DOMContentLoaded', () => {
  const aboutSection = document.getElementById('about');
  if (aboutSection) {
    const title = aboutSection.querySelector('.section-title');
    if (title) {
      const chars = title.textContent.trim().length;
      title.style.setProperty('--title-chars', chars);
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutSection.classList.add('reveal');
          obs.unobserve(aboutSection);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(aboutSection);
  }
});

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

  /* ===== Projects Generation & Reveal ===== */
  const projectContainer = document.getElementById('project-container');
  const projectObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -150px 0px' });

  projects.forEach((project, i) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.setProperty('--dir', i % 2 === 0 ? '-50px' : '50px');
    card.style.transitionDelay = `${0.15 + Math.floor(i/2) * 0.1}s`;
    card.innerHTML = `
      <div class="project-image" style="background-image:url('${project.image}')"></div>
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <p class="project-origin">${project.origin.join(', ')}</p>
        <p class="tech-stack">${project.technologies.join(' / ')}</p>
      </div>
    `;
    ['title','description','origin','technologies','link','image'].forEach(key => {
      card.dataset[key] = Array.isArray(project[key]) ? project[key].join(';') : project[key];
    });
    projectContainer.appendChild(card);
    projectObserver.observe(card);
  });

  /* ===== Modal Logic ===== */
  const modal = document.getElementById('project-modal');
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.dataset.title;
      const desc = card.dataset.description;
      const origins = card.dataset.origin.split(';');
      const tags = card.dataset.technologies.split(',');
      const link = card.dataset.link;
      const imgUrl = card.dataset.image;
      modal.querySelector('.modal-image').src = imgUrl;
      modal.querySelector('.modal-title').textContent = title;
      modal.querySelector('.modal-description').textContent = desc;
      const oC = modal.querySelector('.modal-origin-tags'); oC.innerHTML = '';
      const tC = modal.querySelector('.modal-tags'); tC.innerHTML = '';
      origins.forEach(o => { const s = document.createElement('span'); s.className='tag'; s.textContent=o; oC.appendChild(s); });
      tags.forEach(t=>{ const s = document.createElement('span'); s.className='tag'; s.textContent=t; tC.appendChild(s); });
      modal.querySelector('.modal-cta-button').href = link;
      modal.classList.add('show');
    });
  });
  closeBtn.addEventListener('click', ()=>modal.classList.remove('show'));
  overlay.addEventListener('click', ()=>modal.classList.remove('show'));

  /* ===== Testimonials (Custom Carousel) ===== */
(function(){
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  const dotsContainer = document.querySelector('.carousel-dots');
  let idx = 0;

  // Meghatározza, hogy egyszerre hány slide látszik
  function getVisibleCount() {
    return window.innerWidth < 768 ? 1 : 2;
  }

  // Létrehozza a pöttyöket újraszámolással
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
    // slide szélesség + gap
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseInt(getComputedStyle(track).gap) || 0;
    // eltolás: i * (visible * slideWidth + (visible - 1)*gap )
    const shift = i * (visible * slideWidth + (visible - 1) * gap);
    track.style.transform = `translateX(-${shift}px)`;

    dots.forEach(d => d.classList.remove('active'));
    dots[i].classList.add('active');
    idx = i;
  }

  // Gombok, pöttyök eseménykezelése
  prev.addEventListener('click', () => update((idx - 1 + total) % total));
  next.addEventListener('click', () => update((idx + 1) % total));
  dotsContainer.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const i = dots.indexOf(e.target);
      update(i);
    }
  });

  // Responsive újraszámolás resize esetén
  window.addEventListener('resize', () => {
    ({ visible, total } = setupDots());
    update(0);
  });

  // Automatikus slide
  setInterval(() => update((idx + 1) % total), 7000);

  // Kezdő pozíció
  update(0);
})();

  /* ===== Testimonials (Swiper.js Fallback) ===== */
 if (window.Swiper) {
    new Swiper('.carousel-track', {
      // mivel kártyás flexboxot használsz, slidesPerView: 'auto'
      slidesPerView: 'auto',
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: '.carousel-dots',
        clickable: true
      },
      navigation: {
        nextEl: '.carousel-btn.next',
        prevEl: '.carousel-btn.prev'
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      breakpoints: {
        0: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 2
        }
      }
    });
  }

  /* ===== Footer Year ===== */
  const yearSpan=document.getElementById('year'); if(yearSpan) yearSpan.textContent=new Date().getFullYear();

  /* ===== Back to Top Button ===== */
  (function(){
    const btn=document.getElementById('backToTop'); const footer=document.querySelector('footer');
    if(!btn||!footer) return;
    const obs=new IntersectionObserver(es=>es.forEach(e=>btn.classList.toggle('show',e.isIntersecting)),{threshold:0.3});
    obs.observe(footer);
    btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  })();

});