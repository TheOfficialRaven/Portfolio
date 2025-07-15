// Animációs konstansok - optimalizált sebességek
export const ANIMATION_SETTINGS = {
  duration: 0.8,  // másodperc - gyorsabb, dinamikusabb
  staggerDelay: 0.15,  // másodperc - gyorsabb
  threshold: 0.1, // alacsonyabb küszöb = korábban indul
  baseDelay: 0.3,  // másodperc - gyorsabb
  typewriterSpeed: 25, // milliszekundum per karakter - még gyorsabb
  typewriterStartDelay: 150, // milliszekundum - gyorsabb
  parallaxIntensity: 0.5 // új: parallax hatás intenzitása
};

// Observer instances
let revealObserver = null;
let heroObserver = null;
let parallaxElements = [];

// Parallax scroll handler
function handleParallaxScroll() {
  const scrollY = window.pageYOffset;
  
  parallaxElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const speed = element.dataset.parallaxSpeed || ANIMATION_SETTINGS.parallaxIntensity;
    
    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
      const yPos = -(scrollY * speed);
      // element.style.transform = `translate3d(0, ${yPos}px, 0)`; // Törölve
    }
  });
}

// Nyelvváltás animáció kezelése
export function playLanguageTransition(newLang) {
  return new Promise((resolve) => {
    const transitionOverlay = document.querySelector('.language-transition');
    
    // Animáció indítása
    transitionOverlay.classList.add('active');
    
    // Animáció végének figyelése
    setTimeout(() => {
      transitionOverlay.classList.remove('active');
      resolve();
    }, 800); // Rövidebb időtartam (0.8s)
  });
}

// Elem-alapú reveal animáció beállítása
export function setupRevealObserver() {
  if (revealObserver) revealObserver.disconnect();
  
  revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Fokozatos animáció indítás stagger effekttel
        setTimeout(() => {
          entry.target.classList.add('reveal');
          
          // Speciális effektek különböző elemtípusokhoz
          if (entry.target.classList.contains('section-title')) {
            setupTypewriterEffect(entry.target);
          }
          
          if (entry.target.classList.contains('service-card') || 
              entry.target.classList.contains('project-card')) {
            // Kártyák esetén további micro-interakciók
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
          }
        }, Math.random() * 200); // Véletlenszerű késleltetés dinamikus hatáshoz
        
        obs.unobserve(entry.target);
      }
    });
  }, { 
    threshold: window.innerWidth <= 768 ? 0.05 : ANIMATION_SETTINGS.threshold,
    rootMargin: window.innerWidth <= 768 ? '0px' : '0px 0px -150px 0px'
  });

  // Minden animálandó elem megfigyelése
  const elementsToAnimate = [
    '.section-title',
    '.category-title',
    '.service-card',
    '.project-card', 
    '.career-step',
    '.career-course-card',
    '.skills-category',
    '.skill-item',
    '.contact-form',
    '.contact-info',
    '.about-img',
    '.about-content',
    '.workflow .step',
    '.animate-on-scroll'
  ];

  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      revealObserver.observe(element);
    });
  });

  return revealObserver;
}

// Hero szekció animációinak beállítása
export function setupHeroAnimations() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  // Először eltávolítjuk az összes reveal osztályt és elrejtjük az elemeket
  heroSection.querySelectorAll('.reveal').forEach(el => el.classList.remove('reveal'));
  
  // Elrejtjük az összes animálandó elemet
  const elementsToHide = [
    '.hero-title span',
    '.hero-subtitle',
    '.hero-buttons a',
    '.home-image',
    '.hero-socials',
    '.hero-socials a',
    '.hero-tech-skills',
    '.tech-ribbon-content'
  ];
  
  elementsToHide.forEach(selector => {
    heroSection.querySelectorAll(selector).forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
    });
  });

  // Elemek kiválasztása
  const subtitle = heroSection.querySelector('.hero-subtitle');
  const buttons = heroSection.querySelectorAll('.hero-buttons a');
  const heroImage = heroSection.querySelector('.home-image');
  const heroSocials = heroSection.querySelector('.hero-socials');
  const socialLinks = heroSection.querySelectorAll('.hero-socials a');
  const techSkills = heroSection.querySelector('.hero-tech-skills');

  // Ha a hero title még nincs span-ekre bontva, akkor felbontjuk
  const heroTitle = heroSection.querySelector('.hero-title');
  if (heroTitle) {
    const titleSpans = heroTitle.querySelectorAll('span');
    if (titleSpans.length === 0) {
      const words = heroTitle.textContent.trim().split(/\s+/);
      heroTitle.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
    }
  }

  // Késleltetések beállítása és animációk indítása
  requestAnimationFrame(() => {
    // Title spans animációk
    const titleSpans = heroSection.querySelectorAll('.hero-title span');
    titleSpans.forEach((span, i) => {
      span.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + (i * ANIMATION_SETTINGS.staggerDelay)}s`;
      span.style.opacity = '1';
      span.style.transform = 'translateY(0)';
      span.classList.add('reveal');
    });

    // Subtitle animáció
    if (subtitle) {
      subtitle.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + (titleSpans.length * ANIMATION_SETTINGS.staggerDelay)}s`;
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
      subtitle.classList.add('reveal');
    }

    // Button animációk
    buttons.forEach((btn, i) => {
      btn.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + i + 1) * ANIMATION_SETTINGS.staggerDelay)}s`;
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
      btn.classList.add('reveal');
    });

    // Hero image animáció
    if (heroImage) {
      heroImage.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + buttons.length + 1) * ANIMATION_SETTINGS.staggerDelay)}s`;
      heroImage.style.opacity = '1';
      heroImage.style.transform = 'translateY(0)';
      heroImage.classList.add('reveal');
    }

    // Közösségi média ikonok animációja
    if (heroSocials) {
      heroSocials.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + buttons.length + 2) * ANIMATION_SETTINGS.staggerDelay)}s`;
      heroSocials.style.opacity = '1';
      heroSocials.style.transform = 'translateY(0)';
      heroSocials.classList.add('reveal');

      socialLinks.forEach((link, i) => {
        link.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + buttons.length + 3 + i) * ANIMATION_SETTINGS.staggerDelay)}s`;
        link.style.opacity = '1';
        link.style.transform = 'translateY(0)';
        link.classList.add('reveal');
      });
    }

    // Tech skills ikonok animációja
    if (techSkills) {
      techSkills.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + buttons.length + socialLinks.length + 3) * ANIMATION_SETTINGS.staggerDelay)}s`;
      techSkills.style.opacity = '1';
      techSkills.style.transform = 'translateY(0)';
      techSkills.classList.add('reveal');
    }

    // Tech ribbon animációja
    const techRibbon = heroSection.querySelector('.tech-ribbon-content');
    if (techRibbon) {
      techRibbon.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + buttons.length + socialLinks.length + 4) * ANIMATION_SETTINGS.staggerDelay)}s`;
      techRibbon.style.opacity = '1';
      techRibbon.style.transform = 'translateY(0)';
      techRibbon.classList.add('reveal');
      
      // Tech ribbon icons individual animation - használjuk a transition-delay rendszert
      const techIcons = techRibbon.querySelectorAll('.tech-ribbon-icon');
      techIcons.forEach((icon, index) => {
        const iconDelay = ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + buttons.length + socialLinks.length + 5 + index) * ANIMATION_SETTINGS.staggerDelay);
        icon.style.transitionDelay = `${iconDelay}s`;
        icon.style.opacity = '1';
        icon.style.transform = 'scale(1) translateY(0)';
        icon.classList.add('reveal');
      });
    }

    // Késleltetések visszaállítása az animáció után
    const techSkillsDelay = techSkills ? 1 : 0;
    const totalDelay = ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + buttons.length + socialLinks.length + 3 + techSkillsDelay) * ANIMATION_SETTINGS.staggerDelay);
    setTimeout(() => {
      heroSection.querySelectorAll('[style*="transition-delay"]').forEach(el => {
        el.style.transitionDelay = '0s';
      });
    }, totalDelay * 1000);
  });
}

// Timeline animációk beállítása
export function setupTimelineAnimations() {
  const timelineSteps = document.querySelectorAll('.career-step');
  if (!timelineSteps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-50px'
  });

  timelineSteps.forEach(step => {
    observer.observe(step);
  });
}

// Skill kártyák animációinak beállítása
export function setupSkillCardAnimations() {
  const skillCards = document.querySelectorAll('.career-skill-card');
  if (!skillCards.length) return;

  skillCards.forEach((card, index) => {
    card.classList.add('animate-on-scroll', 'stagger-item');
    card.style.setProperty('--stagger-delay', `${index * ANIMATION_SETTINGS.staggerDelay}s`);
  });
}

// Kurzus kártyák animációinak beállítása
export function setupCourseCardAnimations() {
  const courseCards = document.querySelectorAll('.career-course-card');
  if (!courseCards.length) return;

  courseCards.forEach((card) => {
    card.classList.add('animate-on-scroll');
  });
}

// Skill progress bar animációk
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progress = entry.target.getAttribute('data-progress');
        entry.target.style.setProperty('--progress', `${progress}%`);
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.3 }); // Alacsonyabb threshold a jobb mobil kompatibilitásért

  skillBars.forEach(bar => observer.observe(bar));
}

// Tiszta typewriter animáció - csak szöveg, nincs cursor
function setupTypewriterEffect(element) {
  if (!element || element.classList.contains('typewriter-active')) return;
  
  const text = element.textContent.trim();
  const originalContent = element.innerHTML;
  element.classList.add('typewriter-active');
  
  // Először csak a szöveget töröljük, megtartva az eredeti HTML struktúrát
  element.textContent = '';
  
  let charIndex = 0;
  const typeChar = () => {
    if (charIndex < text.length) {
      element.textContent += text.charAt(charIndex);
      charIndex++;
      setTimeout(typeChar, ANIMATION_SETTINGS.typewriterSpeed);
    } else {
      // Animáció végén visszaállítjuk az eredeti HTML-t és jelezzük a befejezést
      element.innerHTML = originalContent;
      element.classList.add('typewriter-done');
      element.classList.remove('typewriter-active');
      
      // Trigger reflow to ensure proper display
      element.style.position = 'relative';
      void element.offsetHeight;
    }
  };

  // Nincs kurzor effekt - tiszta typewriter
  
  // Késleltetett indítás
  setTimeout(typeChar, ANIMATION_SETTINGS.typewriterStartDelay);
}

// Typewriter observer eltávolítva - a reveal observer kezeli

// Szekció animációk egységes beállítása
function setupSectionAnimations() {
  const sections = document.querySelectorAll('section');
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        section.classList.add('reveal');
        
        // Title typewriter effect
        const title = section.querySelector('.section-title');
        if (title) {
          setupTypewriterEffect(title);
        }
        
        // Animate other elements with stagger
        const animatedElements = section.querySelectorAll('.fade-in-left, .fade-in-right, .animate-on-scroll');
        animatedElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('reveal');
          }, ANIMATION_SETTINGS.baseDelay * 1000 + (index * ANIMATION_SETTINGS.staggerDelay * 1000));
        });
        
        sectionObserver.unobserve(section);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-50px'
  });
  
  sections.forEach(section => {
    if (section.id !== 'hero') { // Hero section has its own animation
      sectionObserver.observe(section);
    }
  });
}

// Ez a függvény már nem szükséges, mivel az elem-alapú rendszer kezeli a skills animációkat

// Minden animáció inicializálása - elem-alapú rendszer
export function initializeAllAnimations(skipHeroAnimations = false) {
  
  // Reset any existing animations
  document.querySelectorAll('.typewriter-active, .typewriter-done').forEach(el => {
    el.classList.remove('typewriter-active', 'typewriter-done');
  });
  
  // A section title-ök már CSS-ben alapból rejtettek
  
  // Category title-ök esetén ne rejtsük el és készítsük fel a vonal animációt
  document.querySelectorAll('.category-title').forEach(el => {
    el.style.position = 'relative';
    // Category title-ök vonala alapból látható marad
    void el.offsetHeight;
  });
  
  // Parallax elemek inicializálása
  initParallaxElements();
  
  // Elem-alapú animációs rendszer
  setupRevealObserver();
  
  // Hero animációk késleltetett indítása a DOM teljes betöltése után (csak ha nem kell kihagyni)
  if (!skipHeroAnimations) {
    setTimeout(() => {
      setupHeroAnimations();
    }, 100);
  }
  
  initSkillBars();
}

// Parallax elemek beállítása
function initParallaxElements() {
  // Az about-img eltávolítva a parallax listából
  parallaxElements = Array.from(document.querySelectorAll('.hero-section .vanta-triangle-mask'));
  
  // Parallax scroll listener hozzáadása
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleParallaxScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Reset animációk
export async function resetAnimations() {
  console.log('Resetting animations...');
  
  // Remove all animation classes
  document.querySelectorAll('.reveal, .typewriter-active, .typewriter-done').forEach(el => {
    el.classList.remove('reveal', 'typewriter-active', 'typewriter-done');
  });
  
  // Reset styles - CSS-ben vannak alapból beállítva
  
  // Reset transition delays
  document.querySelectorAll('[style*="transition-delay"]').forEach(el => {
    el.style.transitionDelay = '';
  });
  
  // Elrejtjük a hero elemeket a nyelvváltáskor
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const elementsToHide = [
      '.hero-title span',
      '.hero-subtitle',
      '.hero-buttons a',
      '.home-image',
      '.hero-socials',
      '.hero-socials a',
      '.hero-tech-skills',
      '.tech-ribbon-content'
    ];
    
    elementsToHide.forEach(selector => {
      heroSection.querySelectorAll(selector).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
      });
    });
    
    // Reset tech ribbon icons specifically
    const techIcons = heroSection.querySelectorAll('.tech-ribbon-icon');
    techIcons.forEach(icon => {
      icon.classList.remove('reveal');
      icon.style.transitionDelay = '';
      icon.style.opacity = '0';
      icon.style.transform = 'scale(0.8) translateY(20px)';
    });
  }
  
  // Force reflow to ensure proper display
  document.querySelectorAll('.section-title, .category-title').forEach(el => {
    void el.offsetHeight;
  });
  
  // Kis késleltetés az új animációk indítása előtt
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Hero animációk azonnali újraindítása
  setupHeroAnimations();
  
  // Többi animáció inicializálása (hero animációk nélkül)
  initializeAllAnimations(true);
} 