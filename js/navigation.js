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

// Update active menu item based on current page and section
export function updateActiveMenuItem() {
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  
  // Get all menu items
  const navbarItems = document.querySelectorAll('.navbar a');
  const mobileNavItems = document.querySelectorAll('.mobile-nav a.nav-secondary');
  const pageSwitcherItems = document.querySelectorAll('.page-switcher a, .mobile-page-link');
  const allMenuItems = [...navbarItems, ...mobileNavItems];
  
  // Clear all active states first
  allMenuItems.forEach(item => item.classList.remove('active'));
  pageSwitcherItems.forEach(item => item.classList.remove('active'));
  
  // Check if we're on index page or karrier page
  const isIndexPage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
  const isKarrierPage = currentPath.includes('karrier.html');
  
  console.log('Current path:', currentPath, 'Is index:', isIndexPage, 'Is karrier:', isKarrierPage);
  
  // Handle page switcher navigation
  pageSwitcherItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href === 'index.html' && isIndexPage) {
      item.classList.add('active');
      console.log('Set active: index page switcher');
    } else if (href === 'karrier.html' && isKarrierPage) {
      item.classList.add('active');
      console.log('Set active: karrier page switcher');
    }
  });
  
  // Update page switcher background position
  const pageSwitcher = document.getElementById('pageSwitcher');
  if (pageSwitcher) {
    if (isKarrierPage) {
      pageSwitcher.classList.add('karrier');
    } else {
      pageSwitcher.classList.remove('karrier');
    }
  }
  
  // Handle section-level navigation (hash links) - NAV-SECONDARY elemek
  allMenuItems.forEach(item => {
    const href = item.getAttribute('href');
    
    if (item.classList.contains('nav-secondary') && currentHash && href === currentHash) {
      item.classList.add('active');
      console.log('Set active section:', currentHash);
    }
    
    // Special case for karrier page internal navigation
    if (isKarrierPage && item.classList.contains('nav-secondary') && href.startsWith('#') && !currentHash && href === '#hero') {
      item.classList.add('active');
    }
  });
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
    
    // Update active menu item initially
    updateActiveMenuItem();
    
    // Setup scroll-based section highlighting
    setupSectionHighlighting();
    
    // Update active menu item on hash change
    window.addEventListener('hashchange', updateActiveMenuItem);
    
    // Update active menu item on page load (delayed to ensure DOM is ready)
    window.addEventListener('load', () => {
      setTimeout(updateActiveMenuItem, 100);
    });
    
    // Update on scroll (throttled for performance)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveMenuItem, 50);
    });
  }
} 