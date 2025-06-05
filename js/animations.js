// Animációs konstansok
export const ANIMATION_SETTINGS = {
  duration: 0.8,  // másodperc
  staggerDelay: 0.1,  // másodperc
  threshold: 0.15,
  baseDelay: 0.3,  // másodperc
  typewriterSpeed: 30, // milliszekundum per karakter
  typewriterStartDelay: 500 // milliszekundum
};

// Observer instances
let revealObserver = null;
let heroObserver = null;

// Nyelvváltás animáció kezelése
export function playLanguageTransition(newLang) {
  return new Promise((resolve) => {
    const transitionOverlay = document.querySelector('.language-transition');
    const transitionText = transitionOverlay.querySelector('.transition-text');
    
    // Szöveg beállítása a célnyelv alapján
    const transitionTexts = {
      'hu': 'Váltás magyarra...',
      'en': 'Switching to English...',
      'de': 'Wechsel zu Deutsch...'
    };
    transitionText.textContent = transitionTexts[newLang] || 'Nyelvváltás...';
    
    // Animáció indítása
    transitionOverlay.classList.add('active');
    
    // Animáció végének figyelése
    setTimeout(() => {
      transitionOverlay.classList.remove('active');
      resolve();
    }, 800); // Rövidebb időtartam (0.8s)
  });
}

// Általános reveal animáció beállítása
export function setupRevealObserver() {
  if (revealObserver) revealObserver.disconnect();
  
  revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        obs.unobserve(entry.target);
      }
    });
  }, { 
    threshold: ANIMATION_SETTINGS.threshold,
    rootMargin: '0px 0px -100px 0px'
  });

  // Minden animálandó elem megfigyelése
  document.querySelectorAll('.animate-on-scroll').forEach(element => {
    revealObserver.observe(element);
  });

  return revealObserver;
}

// Hero szekció animációinak beállítása
export function setupHeroAnimations() {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  const titleSpans = heroSection.querySelectorAll('.hero-title span');
  const subtitle = heroSection.querySelector('.hero-subtitle');
  const buttons = heroSection.querySelectorAll('.hero-buttons a');
  const heroImage = heroSection.querySelector('.home-image');
  const heroSocials = heroSection.querySelector('.hero-socials');
  const socialLinks = heroSection.querySelectorAll('.hero-socials a');

  // Késleltetések beállítása és azonnali animáció indítása
  setTimeout(() => {
    titleSpans.forEach((span, i) => {
      span.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + (i * ANIMATION_SETTINGS.staggerDelay)}s`;
      span.classList.add('reveal');
    });

    if (subtitle) {
      subtitle.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + (titleSpans.length * ANIMATION_SETTINGS.staggerDelay)}s`;
      subtitle.classList.add('reveal');
    }

    buttons.forEach((btn, i) => {
      btn.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + i + 1) * ANIMATION_SETTINGS.staggerDelay)}s`;
      btn.classList.add('reveal');
    });

    if (heroImage) {
      heroImage.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + buttons.length + 1) * ANIMATION_SETTINGS.staggerDelay)}s`;
      heroImage.classList.add('reveal');
    }

    // Közösségi média ikonok animációja
    if (heroSocials) {
      heroSocials.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + buttons.length + 2) * ANIMATION_SETTINGS.staggerDelay)}s`;
      heroSocials.classList.add('reveal');

      socialLinks.forEach((link, i) => {
        link.style.transitionDelay = `${ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + buttons.length + 3 + i) * ANIMATION_SETTINGS.staggerDelay)}s`;
        link.classList.add('reveal');
      });
    }

    // Késleltetések visszaállítása az animáció után
    const totalDelay = ANIMATION_SETTINGS.baseDelay + ((titleSpans.length + buttons.length + socialLinks.length + 3) * ANIMATION_SETTINGS.staggerDelay);
    setTimeout(() => {
      titleSpans.forEach(span => span.style.transitionDelay = '0s');
      if (subtitle) subtitle.style.transitionDelay = '0s';
      buttons.forEach(btn => btn.style.transitionDelay = '0s');
      if (heroImage) heroImage.style.transitionDelay = '0s';
      if (heroSocials) {
        heroSocials.style.transitionDelay = '0s';
        socialLinks.forEach(link => link.style.transitionDelay = '0s');
      }
    }, totalDelay * 1000);
  }, 100); // Kis késleltetés, hogy biztosan betöltődjenek az elemek
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
  }, { threshold: 0.5 });

  skillBars.forEach(bar => observer.observe(bar));
}

// Typewriter animáció beállítása
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
      // Animáció végén visszaállítjuk az eredeti HTML-t
      element.innerHTML = originalContent;
      element.classList.add('typewriter-done');
      element.style.borderRight = 'none';
    }
  };

  // Kurzor effekt hozzáadása
  element.style.borderRight = '0.15em solid var(--main-color)';
  
  // Késleltetett indítás
  setTimeout(typeChar, ANIMATION_SETTINGS.typewriterStartDelay);
}

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

function initializeSkillsAnimations() {
  const skillsSection = document.querySelector('.career-skills-section');
  if (!skillsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate skill categories
        entry.target.querySelectorAll('.skills-category').forEach((category, i) => {
          setTimeout(() => {
            category.classList.add('reveal');
            
            // Animate skill items within the category
            category.querySelectorAll('.skill-item').forEach((item, j) => {
              setTimeout(() => {
                item.classList.add('reveal');
                
                // Animate progress bars
                const progressBar = item.querySelector('.skill-progress');
                if (progressBar) {
                  const progress = progressBar.getAttribute('data-progress');
                  progressBar.style.setProperty('--progress', `${progress}%`);
                  progressBar.classList.add('animate');
                }
              }, j * 100);
            });
          }, i * 200);
        });
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  observer.observe(skillsSection);
}

// Minden animáció inicializálása
export function initializeAllAnimations() {
  console.log('Initializing all animations...');
  
  // Reset any existing animations
  document.querySelectorAll('.typewriter-active').forEach(el => {
    el.classList.remove('typewriter-active', 'typewriter-done');
  });
  
  setupRevealObserver();
  setupHeroAnimations();
  setupSectionAnimations();
  setupTimelineAnimations();
  setupSkillCardAnimations();
  setupCourseCardAnimations();
  initSkillBars();
  initializeSkillsAnimations();
}

// Reset animációk
export async function resetAnimations() {
  console.log('Resetting animations...');
  
  // Remove all animation classes
  document.querySelectorAll('.reveal, .typewriter-active, .typewriter-done').forEach(el => {
    el.classList.remove('reveal', 'typewriter-active', 'typewriter-done');
  });
  
  // Reset styles
  document.querySelectorAll('.section-title').forEach(el => {
    el.style.borderRight = '';
    el.style.width = '';
  });
  
  // Reset transition delays
  document.querySelectorAll('[style*="transition-delay"]').forEach(el => {
    el.style.transitionDelay = '';
  });
  
  // Kis késleltetés az új animációk indítása előtt
  await new Promise(resolve => setTimeout(resolve, 100));
  initializeAllAnimations();
} 