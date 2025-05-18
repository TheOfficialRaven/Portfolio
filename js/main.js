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

const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const heroImg = document.getElementById('hero-img');
const aboutImg = document.getElementById('about-img');
const heroSection = document.getElementById('hero');
const vantaOverlay = document.getElementById('vanta-bg');
const themeIcon = document.getElementById('theme-icon');

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

// Téma színváltás Vanta overlaynél
function updateVantaBackground(theme) {
  if (vantaOverlay) {
    vantaOverlay.style.backgroundColor = theme === 'dark' ? '#00c9a7' : '#f7a072';
  }
}

// Téma betöltése (alapértelmezés: dark)
let currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);
updateImages(currentTheme);
updateVantaBackground(currentTheme);

// Téma váltás esemény
toggleBtn.addEventListener('click', () => {
  const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateImages(newTheme);
  updateVantaBackground(newTheme);
});

// ======== Projects ========= //

// 1. Observer létrehozása még a projects feldolgozása előtt

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.01,
  rootMargin: "0px 0px -150px 0px"
});

const projectContainer = document.getElementById("project-container");

projects.forEach((project, index) => {
  const card = document.createElement("div");
  card.classList.add("project-card", "fade-in-up");
  card.style.transitionDelay = `${index * 0.1}s`;

  card.innerHTML = `
    <div class="project-image" style="background-image: url('${project.image}')">
      <div class="overlay">
        <a href="${project.link}" target="_blank" class="view-btn">Megtekintés</a>
      </div>
    </div>
    <div class="project-info">
      <h3>${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <p class="project-origin">${project.origin}</p>
      <p class="tech-stack">${project.technologies.join(" / ")}</p>
    </div>
  `;

  projectContainer.appendChild(card);
  observer.observe(card);
});

[...document.querySelectorAll('.fade-in-up, .service-card, .step-card')].forEach((el, index) => {
  el.style.transitionDelay = `${index * 0.01}s`;
  observer.observe(el);
});



// === Web-like background canvas ===
function initVantaBackground() {
  if (typeof VANTA !== "undefined" && document.getElementById("vanta-bg")) {
    VANTA.NET({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 100.00,
      minWidth: 100.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x00c9a7,
      backgroundColor: 0x0d0d0d,
      points: 14.00,
      maxDistance: 20.00,
      spacing: 18.00,
      showDots: false
    });
    console.log("✅ VANTA elindult");
  } else {
    console.log("⏳ Várakozás VANTA / elem betöltésére...");
    setTimeout(initVantaBackground, 200);
  }
}

initVantaBackground();

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

