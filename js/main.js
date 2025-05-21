// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
});

// Mobile Menu Bezárás linkre kattintva
const mobileLinks = mobileNav.querySelectorAll('a');

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('active');
  });
});

// Scroll Progress Bar
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (scrollTop / docHeight) * 100;
  progressBar.style.width = `${scrolled}%`;
});

// ============ Theme Toggle IMG ============ //

let vantaEffect = null;

const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const heroImg = document.getElementById('hero-img');
const aboutImg = document.getElementById('about-img');
const vantaOverlay = document.getElementById('vanta-bg');

// Képváltás funkció
function updateImages(theme) {
  if (heroImg) {
    const newHeroSrc = heroImg.getAttribute(`data-image-${theme}`);
    if (newHeroSrc) heroImg.src = newHeroSrc;
  }
  if (aboutImg) {
    const newAboutSrc = aboutImg.getAttribute(`data-image-${theme}`);
    if (newAboutSrc) aboutImg.src = newAboutSrc;
  }
}

// Vanta háttér inicializáló
function initVantaBackground(theme) {
  const el = document.getElementById('vanta-bg');
  if (typeof VANTA !== 'undefined' && el) {
    if (vantaEffect && typeof vantaEffect.destroy === 'function') {
      vantaEffect.destroy();
    }
    vantaEffect = VANTA.NET({
      el: el,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 100.00,
      minWidth: 100.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: theme === 'dark'   ? 0x00c9a7
                             : 0xf7a072,
      backgroundColor: theme === 'dark'   ? 0x0d0d0d
                                         : 0xf5f5f5,
      points: 14.00,
      maxDistance: 20.00,
      spacing: 18.00,
      showDots: false
    });
  }
}

// ————————————————————————————————
// Téma betöltése (indításkor)
// ————————————————————————————————
let currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);
updateImages(currentTheme);
initVantaBackground(currentTheme);

// ————————————————————————————————
// Téma váltás gombra kattintva
// ————————————————————————————————
toggleBtn.addEventListener('click', () => {
  const newTheme = body.getAttribute('data-theme') === 'dark'
                     ? 'light'
                     : 'dark';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateImages(newTheme);
  initVantaBackground(newTheme);
});

// ======== Projects ========= //

document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -150px 0px' });

  const projectContainer = document.getElementById('project-container');
  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.classList.add('project-card', 'fade-in-up');
    card.style.transitionDelay = `${index * 0.1}s`;
    card.innerHTML = `
      <div class="project-image" style="background-image: url('${project.image}')">
        <div class="overlay">
        </div>
      </div>
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <p class="project-origin">${project.origin.join(', ')}</p>
        <p class="tech-stack">${project.technologies.join(' / ')}</p>
      </div>
    `;
    card.dataset.title = project.title;
    card.dataset.description = project.description;
    card.dataset.origin = project.origin.join(';');
    card.dataset.technologies = project.technologies.join(',');
    card.dataset.link = project.link;
    card.dataset.image = project.image;
    projectContainer.appendChild(card);
    observer.observe(card);
  });

  [...document.querySelectorAll('.fade-in-up, .service-card, .step-card')].forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.01}s`;
    observer.observe(el);
  });

  const modal = document.getElementById('project-modal');
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.dataset.title;
      const desc = card.dataset.description;
      const origin = card.dataset.origin.split(';');
      const tags = card.dataset.technologies.split(',');
      const link = card.dataset.link;
      const imageUrl = card.dataset.image;

      modal.querySelector('.modal-image').src = imageUrl;
      modal.querySelector('.modal-image').alt = title;
      modal.querySelector('.modal-title').textContent = title;
      modal.querySelector('.modal-description').textContent = desc;

      const originContainer = modal.querySelector('.modal-origin-tags');
      const techContainer = modal.querySelector('.modal-tags');
      originContainer.innerHTML = '';
      techContainer.innerHTML = '';
      origin.forEach(o => { const span = document.createElement('span'); span.className = 'tag'; span.textContent = o.trim(); originContainer.appendChild(span); });
      tags.forEach(t => { const span = document.createElement('span'); span.className = 'tag'; span.textContent = t.trim(); techContainer.appendChild(span); });

      modal.querySelector('.modal-cta-button').href = link;
      modal.classList.add('show');
    });
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  overlay.addEventListener('click', () => modal.classList.remove('show'));
});




// Close handlers
const modal = document.getElementById('project-modal');
modal.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('show'));
modal.querySelector('.modal-overlay').addEventListener('click', () => modal.classList.remove('show'));




// ========= Vélemények ===============

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const testimonials = Array.from(track.children);
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const dotsContainer = document.querySelector(".carousel-dots");

  let currentIndex = 0;
  const visibleCount = window.innerWidth < 768 ? 1 : 2;
  const totalSlides = Math.ceil(testimonials.length / visibleCount);

  // Generate dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  }

  const dots = Array.from(dotsContainer.children);

  function updateCarousel(index) {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
    currentIndex = index;
  }

  prevBtn.addEventListener("click", () => {
    const newIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel(newIndex);
  });

  nextBtn.addEventListener("click", () => {
    const newIndex = (currentIndex + 1) % totalSlides;
    updateCarousel(newIndex);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => updateCarousel(index));
  });

  // Auto slide
  setInterval(() => {
    const newIndex = (currentIndex + 1) % totalSlides;
    updateCarousel(newIndex);
  }, 7000); // 7 másodpercenként
});

// =========== Footer Year

document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// ================= Back to top btn

document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("backToTop");
  const footer = document.querySelector("footer");

  if (footer && backToTopBtn) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            backToTopBtn.classList.add("show");
          } else {
            backToTopBtn.classList.remove("show");
          }
        });
      },
      {
        root: null,
        threshold: 0.3, // Akkor aktiválódik, ha a footer legalább 30%-ban látszik
      }
    );

    observer.observe(footer);
  }

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

