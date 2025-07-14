// Page Switcher Fix - Netlify kompatibilitáshoz
// Ez a fájl biztosítja, hogy az aktív tab mindig megfelelően működjön

(function() {
  'use strict';
  
  // Várjuk meg a DOM betöltését
  function waitForDOM(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }
  
  // Page type detection több módszerrel
  function detectPageType() {
    const url = window.location.href.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const title = document.title.toLowerCase();
    
    // Karrier oldal détection
    const isKarrier = (
      url.includes('karrier') ||
      pathname.includes('karrier') ||
      title.includes('karrier') ||
      title.includes('career') ||
      document.querySelector('#career-about, #career-timeline, #career-contact') !== null ||
      document.querySelector('[data-i18n="career.hero.title"]') !== null
    );
    
    // Index oldal détection
    const isIndex = !isKarrier && (
      pathname === '/' ||
      pathname === '' ||
      pathname.includes('index') ||
      url.includes('index') ||
      document.querySelector('#hero .hero-title') !== null
    );
    
    return { isKarrier, isIndex };
  }
  
  // Page switcher frissítése
  function updatePageSwitcher() {
    const { isKarrier, isIndex } = detectPageType();
    
    // Desktop page switcher
    const pageSwitcher = document.getElementById('pageSwitcher');
    const desktopLinks = document.querySelectorAll('.page-switcher a');
    
    // Mobile page switcher
    const mobileLinks = document.querySelectorAll('.mobile-page-link');
    
    // Tisztítjuk az aktív osztályokat
    desktopLinks.forEach(link => link.classList.remove('active'));
    mobileLinks.forEach(link => link.classList.remove('active'));
    
    if (pageSwitcher) {
      pageSwitcher.classList.remove('karrier');
    }
    
    // Beállítjuk az aktív állapotokat
    if (isKarrier) {
      // Karrier oldal aktív
      desktopLinks.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.toLowerCase();
        if (href === 'karrier.html' || text.includes('karrier') || text.includes('career')) {
          link.classList.add('active');
        }
      });
      
      mobileLinks.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.toLowerCase();
        if (href === 'karrier.html' || text.includes('karrier') || text.includes('career')) {
          link.classList.add('active');
        }
      });
      
      if (pageSwitcher) {
        pageSwitcher.classList.add('karrier');
      }
      
    } else if (isIndex) {
      // Index oldal aktív
      desktopLinks.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.toLowerCase();
        if (href === 'index.html' || href === '/' || text.includes('főoldal') || text.includes('home') || text.includes('startseite')) {
          link.classList.add('active');
        }
      });
      
      mobileLinks.forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.toLowerCase();
        if (href === 'index.html' || href === '/' || text.includes('főoldal') || text.includes('home') || text.includes('startseite')) {
          link.classList.add('active');
        }
      });
    }
    
    // Force CSS reflow
    if (pageSwitcher) {
      pageSwitcher.style.transform = 'translateZ(0)';
      setTimeout(() => {
        pageSwitcher.style.transform = '';
      }, 10);
    }
  }
  
  // CSS backup rules hozzáadása
  function addBackupCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Page Switcher Backup Styles */
      .page-switcher a.active {
        color: var(--bg-color) !important;
        background: var(--main-color) !important;
        box-shadow: 0 0 10px var(--main-color) !important;
        transform: translateY(-1px) !important;
      }
      
      .page-switcher::before {
        transition: transform 0.3s ease !important;
      }
      
      .page-switcher.karrier::before {
        transform: translateX(100%) !important;
      }
      
      .mobile-page-link.active {
        background: linear-gradient(135deg, var(--main-color), var(--btn-hover-color)) !important;
        color: var(--bg-color) !important;
        box-shadow: 0 2px 8px rgba(0, 201, 167, 0.3) !important;
      }
      
      /* Backup ha nem működik a CSS változó */
      [data-theme="dark"] .page-switcher a.active {
        color: #0a0a0a !important;
        background: #00c9a7 !important;
      }
      
      [data-theme="light"] .page-switcher a.active {
        color: #ffffff !important;
        background: #00c9a7 !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Inicializálás
  function init() {
    addBackupCSS();
    
    // Azonnal frissítjük
    updatePageSwitcher();
    
    // Időzített frissítések
    setTimeout(updatePageSwitcher, 100);
    setTimeout(updatePageSwitcher, 500);
    setTimeout(updatePageSwitcher, 1000);
    
    // Event listeners
    window.addEventListener('load', updatePageSwitcher);
    window.addEventListener('pageshow', updatePageSwitcher);
    
    // Visibility change (Netlify preview)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setTimeout(updatePageSwitcher, 100);
      }
    });
    
    // Hash change
    window.addEventListener('hashchange', updatePageSwitcher);
    
    // Navigation események
    document.addEventListener('click', (e) => {
      if (e.target.closest('.page-switcher a, .mobile-page-link')) {
        setTimeout(updatePageSwitcher, 100);
      }
    });
  }
  
  // Indítás
  waitForDOM(init);
  
  // Global hozzáférés debug célokra
  window.PageSwitcherFix = {
    updatePageSwitcher,
    detectPageType
  };
  
})(); 