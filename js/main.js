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

// Téma betöltése (alapértelmezés: dark)
let currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);
updateImages(currentTheme);

// Téma váltás esemény
toggleBtn.addEventListener('click', () => {
  const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateImages(newTheme);
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

// 2. Projektkártyák generálása
const projectContainer = document.getElementById("project-container");

projects.forEach((project, index) => {
  const card = document.createElement("div");
  card.classList.add("project-card", "fade-in-up");
  card.style.transitionDelay = `${index * 0.1}s`;

  card.innerHTML = `
    <div class="project-image">
      <img src="${project.image}" alt="${project.title} előnézet">
      <div class="image-overlay"></div>
    </div>
    <div class="content">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tech-tags">
        ${project.technologies.map(tech => `<span>${tech}</span>`).join("")}
      </div>
      <a href="${project.link}" target="_blank">Megtekintés</a>
    </div>
  `;

  projectContainer.appendChild(card);
  observer.observe(card); // ✅ Itt már biztosan létezik
});

document.querySelectorAll('.fade-in-up, .service-card, .step-card').forEach((el, index) => {
  el.style.transitionDelay = `${index * 0.01}s`;
  observer.observe(el);
});

// Set current year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

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

