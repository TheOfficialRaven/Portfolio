// Navigation state
let isMenuOpen = false;

// DOM elements
let hamburger;
let mobileNav;
let body;

// Initialize DOM elements
function initElements() {
  hamburger = document.querySelector('.hamburger');
  mobileNav = document.querySelector('.mobile-nav');
  body = document.body;
}

let isMenuAnimating = false;

// Toggle menu function
export function toggleMenu(show) {
  if (!hamburger || !mobileNav) initElements();
  if (isMenuAnimating) return;
  
  if (show === undefined) {
    show = !mobileNav.classList.contains('active');
  }

  isMenuAnimating = true;
  isMenuOpen = show;

  if (show) {
    hamburger.classList.add('active');
    mobileNav.classList.add('active');
    body.classList.add('menu-open');
    
    // Add active class with slight delay for the overlay animation
    setTimeout(() => {
      body.classList.add('active');
    }, 50);

    // Add transition delay to menu items
    mobileNav.querySelectorAll('a').forEach((link, index) => {
      link.style.transitionDelay = `${0.1 + index * 0.05}s`;
    });

  } else {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    body.classList.remove('active');
    
    // Remove menu-open class after animation
    setTimeout(() => {
      body.classList.remove('menu-open');
    }, 300);

    // Reset transition delays
    mobileNav.querySelectorAll('a').forEach(link => {
      link.style.transitionDelay = '';
    });
  }
  
  // Reset animation flag
  setTimeout(() => {
    isMenuAnimating = false;
  }, 350);
}

// Close menu when clicking outside
export function setupCloseOnClickOutside() {
  if (!hamburger || !mobileNav) initElements();
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('active') && 
        !mobileNav.contains(e.target) && 
        !hamburger.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close menu when clicking on links
  mobileNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      toggleMenu(false);
    }
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      toggleMenu(false);
    }
  });

  // Close menu on resize if screen becomes larger than mobile breakpoint
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
        toggleMenu(false);
      }
    }, 250);
  });
}

// Robustusabb oldal détection Netlify-hoz
function getCurrentPageType() {
  const currentPath = window.location.pathname;
  const currentHref = window.location.href;
  
  // Normalizáljuk az útvonalat
  const normalizedPath = currentPath.toLowerCase().replace(/\\/g, '/');
  
  // Különböző ellenőrzési módszerek
  const isKarrierPage = (
    normalizedPath.includes('karrier.html') ||
    normalizedPath.includes('karrier') ||
    currentHref.includes('karrier.html') ||
    currentHref.includes('karrier') ||
    document.title.toLowerCase().includes('karrier') ||
    document.querySelector('meta[name="description"]')?.content?.toLowerCase()?.includes('karrier') ||
    document.body.classList.contains('karrier-page') ||
    document.querySelector('#career-about, #career-timeline, #career-contact') !== null
  );
  
  const isIndexPage = (
    normalizedPath === '/' ||
    normalizedPath === '' ||
    normalizedPath.includes('index.html') ||
    normalizedPath.includes('index') ||
    currentHref.includes('index.html') ||
    (!isKarrierPage && (normalizedPath === '/' || normalizedPath.endsWith('/')))
  );
  
  console.log('Page detection:', {
    currentPath,
    normalizedPath,
    currentHref,
    isKarrierPage,
    isIndexPage,
    documentTitle: document.title,
    hasCareerElements: document.querySelector('#career-about, #career-timeline, #career-contact') !== null
  });
  
  return { isKarrierPage, isIndexPage };
}

// Update active menu item based on current page and section
export function updateActiveMenuItem() {
  const currentHash = window.location.hash;
  
  // Get all menu items
  const navbarItems = document.querySelectorAll('.navbar a');
  const mobileNavItems = document.querySelectorAll('.mobile-nav a.nav-secondary');
  const pageSwitcherItems = document.querySelectorAll('.page-switcher a, .mobile-page-link');
  const allMenuItems = [...navbarItems, ...mobileNavItems];
  
  // Clear all active states first
  allMenuItems.forEach(item => item.classList.remove('active'));
  pageSwitcherItems.forEach(item => item.classList.remove('active'));
  
  // Robusztus oldal détection
  const { isKarrierPage, isIndexPage } = getCurrentPageType();
  
  console.log('Updating active menu item:', { isIndexPage, isKarrierPage, currentHash });
  
  // Handle page switcher navigation - KRITIKUS RÉSZ
  pageSwitcherItems.forEach(item => {
    const href = item.getAttribute('href');
    const linkText = item.textContent.toLowerCase().trim();
    
    // Többféle módon ellenőrizzük
    if (isKarrierPage && (
      href === 'karrier.html' || 
      href?.includes('karrier') ||
      linkText.includes('karrier') ||
      linkText.includes('career')
    )) {
      item.classList.add('active');
      console.log('✅ Set active: karrier page switcher', item);
    } else if (isIndexPage && (
      href === 'index.html' || 
      href === '/' ||
      href === './' ||
      href?.includes('index') ||
      linkText.includes('főoldal') ||
      linkText.includes('home') ||
      linkText.includes('startseite')
    )) {
      item.classList.add('active');
      console.log('✅ Set active: index page switcher', item);
    }
  });
  
  // Update page switcher background position - KRITIKUS RÉSZ
  const pageSwitcher = document.getElementById('pageSwitcher');
  const mobilePageSwitcher = document.querySelector('.mobile-page-switcher');
  
  if (pageSwitcher) {
    if (isKarrierPage) {
      pageSwitcher.classList.add('karrier');
      console.log('✅ Added karrier class to page switcher');
    } else {
      pageSwitcher.classList.remove('karrier');
      console.log('✅ Removed karrier class from page switcher');
    }
  }
  
  // Mobil page switcher is frissítjük
  if (mobilePageSwitcher) {
    const mobileLinks = mobilePageSwitcher.querySelectorAll('.mobile-page-link');
    mobileLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      const linkText = link.textContent.toLowerCase().trim();
      
      if (isKarrierPage && (
        href === 'karrier.html' || 
        href?.includes('karrier') ||
        linkText.includes('karrier') ||
        linkText.includes('career')
      )) {
        link.classList.add('active');
        console.log('✅ Set active: mobile karrier link', link);
      } else if (isIndexPage && (
        href === 'index.html' || 
        href === '/' ||
        href === './' ||
        href?.includes('index') ||
        linkText.includes('főoldal') ||
        linkText.includes('home') ||
        linkText.includes('startseite')
      )) {
        link.classList.add('active');
        console.log('✅ Set active: mobile index link', link);
      }
    });
  }
  
  // Handle section-level navigation (hash links) - NAV-SECONDARY elemek
  allMenuItems.forEach(item => {
    const href = item.getAttribute('href');
    
    if (item.classList.contains('nav-secondary') && currentHash && href === currentHash) {
      item.classList.add('active');
      console.log('✅ Set active section:', currentHash);
    }
    
    // Special case for karrier page internal navigation
    if (isKarrierPage && item.classList.contains('nav-secondary') && href?.startsWith('#') && !currentHash && href === '#career-about') {
      item.classList.add('active');
      console.log('✅ Set active: default karrier section');
    }
  });
  
  // Force refresh layout
  setTimeout(() => {
    if (pageSwitcher) {
      pageSwitcher.style.display = 'none';
      pageSwitcher.offsetHeight; // Force reflow
      pageSwitcher.style.display = '';
    }
  }, 50);
}

// Set up scroll-based section highlighting
export function setupSectionHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar a.nav-secondary[href^="#"], .mobile-nav a.nav-secondary[href^="#"]');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        
        // Remove active class ONLY from secondary nav links (not primary)
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to corresponding nav links
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
        
        // Update URL hash without scrolling
        if (window.location.hash !== `#${sectionId}`) {
          history.replaceState(null, null, `#${sectionId}`);
        }
      }
    });
  }, observerOptions);
  
  sections.forEach(section => observer.observe(section));
  
  return observer;
}

// Initialize navigation
export function initNavigation() {
  initElements();
  
  if (hamburger && mobileNav) {
    // Setup hamburger click handler
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
    
    // Setup close on click outside
    setupCloseOnClickOutside();
    
    // Update active menu item initially - TÖBBSZÖRÖS HÍVÁS
    setTimeout(() => updateActiveMenuItem(), 100);
    setTimeout(() => updateActiveMenuItem(), 500);
    setTimeout(() => updateActiveMenuItem(), 1000);
    
    // Setup scroll-based section highlighting
    setupSectionHighlighting();
    
    // Update active menu item on hash change
    window.addEventListener('hashchange', () => {
      setTimeout(updateActiveMenuItem, 100);
    });
    
    // Update active menu item on page load (delayed to ensure DOM is ready)
    window.addEventListener('load', () => {
      setTimeout(updateActiveMenuItem, 200);
      setTimeout(updateActiveMenuItem, 500);
    });
    
    // Update on scroll (throttled for performance)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveMenuItem, 50);
    });
    
    // DOMContentLoaded után is frissítjük
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(updateActiveMenuItem, 200);
      });
    }
    
    // Visibility change esetén is frissítjük (Netlify előnézet miatt)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(updateActiveMenuItem, 100);
      }
    });
  }
} 