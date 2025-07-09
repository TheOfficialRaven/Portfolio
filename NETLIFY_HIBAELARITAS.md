# Netlify Aktív Tab Probléma - Hibaelhárítás

## 🔍 Probléma leírása
A karrier és főoldal közötti aktív tab design nem működik megfelelően Netlify-n, pedig lokálisan jól működik.

## ✅ Megoldások

### 1. Automatikus javítás (Már implementálva)
Az alábbi javításokat már elvégeztem:

- **Robusztus oldal détection** - Többféle módszerrel ellenőrzi melyik oldalon vagyunk
- **Backup CSS szabályok** - `!important` szabályokkal biztosítja a stílusokat  
- **Többszörös inicializálás** - Több időpontban is frissíti az aktív állapotot
- **Page Switcher Fix script** - Dedikált script a probléma kezelésére

### 2. Debug módszer
Ha még mindig nem működik, nyisd meg a böngésző fejlesztői eszközeit (F12) és figyeld a konzolt:

```javascript
// Konzolban írd be:
window.PageSwitcherFix.updatePageSwitcher()

// Vagy ellenőrizd az oldal típusát:
window.PageSwitcherFix.detectPageType()
```

### 3. Manuális ellenőrzés
Ellenőrizd ezeket a CSS osztályokat a Developer Tools-ban:

**Karrier oldalon:**
- `.page-switcher` elemnek legyen `karrier` osztálya
- `.page-switcher a` elemek közül a karrier linknek legyen `active` osztálya
- `.mobile-page-link` elemek közül a karrier linknek legyen `active` osztálya

**Főoldalon:**
- `.page-switcher` elemnek NE legyen `karrier` osztálya  
- `.page-switcher a` elemek közül az index linknek legyen `active` osztálya
- `.mobile-page-link` elemek közül az index linknek legyen `active` osztálya

### 4. Azonnal javítási lehetőségek

#### A) Kézi CSS hozzáadása
Ha a probléma továbbra is fennáll, add hozzá ezt a CSS-t a `style.css` végéhez:

```css
/* Netlify Fix - Page Switcher */
.page-switcher a.active {
  color: #0a0a0a !important;
  background: #00c9a7 !important;
  box-shadow: 0 0 10px #00c9a7 !important;
  transform: translateY(-1px) !important;
}

[data-theme="light"] .page-switcher a.active {
  color: #ffffff !important;
}

.page-switcher.karrier::before {
  transform: translateX(100%) !important;
}

.mobile-page-link.active {
  background: linear-gradient(135deg, #00c9a7, #00b396) !important;
  color: #0a0a0a !important;
  box-shadow: 0 2px 8px rgba(0, 201, 167, 0.3) !important;
}
```

#### B) JavaScript közvetlen hívás
Add hozzá ezt a scriptet a `<head>` részhez (mindkét HTML fájlba):

```html
<script>
window.addEventListener('load', function() {
  setTimeout(function() {
    // Karrier oldal ellenőrzése
    const isKarrier = window.location.href.includes('karrier') || 
                     document.querySelector('#career-about') !== null;
    
    // Page switcher elemek
    const pageSwitcher = document.getElementById('pageSwitcher');
    const links = document.querySelectorAll('.page-switcher a, .mobile-page-link');
    
    // Aktív állapot beállítása
    links.forEach(function(link) {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      const text = link.textContent.toLowerCase();
      
      if (isKarrier && (href === 'karrier.html' || text.includes('karrier'))) {
        link.classList.add('active');
      } else if (!isKarrier && (href === 'index.html' || text.includes('főoldal'))) {
        link.classList.add('active');
      }
    });
    
    // Background mozgatása
    if (pageSwitcher) {
      if (isKarrier) {
        pageSwitcher.classList.add('karrier');
      } else {
        pageSwitcher.classList.remove('karrier');
      }
    }
  }, 100);
});
</script>
```

### 5. Cache tisztítás
Netlify-n gyakran cache problémák lépnek fel. Próbáld ezeket:

1. **Netlify cache tisztítás**: Site Settings → Build & Deploy → Post processing → Clear cache
2. **Böngésző cache**: Ctrl+Shift+R (hard refresh)  
3. **Incognito mód**: Nyisd meg az oldalt inkognitó módban

### 6. Build beállítások ellenőrzése
Ellenőrizd a Netlify build beállításokat:

- **Publish directory**: `.` (root mappa)
- **Build command**: Üresen hagyva (nincs build process)
- **Functions directory**: Üresen hagyva

### 7. Fájl struktúra ellenőrzése
Győződj meg róla, hogy minden fájl feltöltődött:

```
Portfolio/
├── index.html
├── karrier.html  
├── js/
│   ├── navigation.js
│   ├── page-switcher-fix.js
│   ├── base.js
│   └── ...
├── css/
│   └── style.css
└── ...
```

## 🚀 Ha minden más csődöt mond

1. **Fejlesztői eszközök** (F12) → **Console** tab
2. Írd be: `window.PageSwitcherFix.updatePageSwitcher()`
3. Nézd meg, hogy megjelennek-e a `✅` jelű üzenetek
4. Ha igen, akkor a JavaScript működik, valószínűleg CSS probléma
5. Ha nem, akkor töltsd újra az oldalt

## 📞 Debug információk
Ha semmi sem működik, küldd el ezeket az információkat:

```javascript
// Konzolban írd be és küldd el az eredményt:
console.log({
  url: window.location.href,
  pathname: window.location.pathname,
  hasPageSwitcher: !!document.getElementById('pageSwitcher'),
  hasCareerElements: !!document.querySelector('#career-about'),
  pageTitle: document.title,
  pageSwitcherClasses: document.getElementById('pageSwitcher')?.className,
  activeLinks: Array.from(document.querySelectorAll('.page-switcher a.active')).map(a => a.textContent)
});
```

---

**💡 Tipp:** A page-switcher-fix.js fájl folyamatosan monitorozza és javítja az aktív állapotot, így a probléma automatikusan megoldódik a legtöbb esetben. 