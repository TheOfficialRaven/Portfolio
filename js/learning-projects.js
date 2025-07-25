// Tanulási projektek adatai - csak a karrier oldalon
const learningProjects = [
  {
    title: {
      hu: "Todo List Alkalmazás",
      en: "Todo List Application", 
      de: "Todo-Listen Anwendung"
    },
    description: {
      hu: "Komplex feladatkezelő alkalmazás JavaScript-ben, amely demonstrálja a modern webfejlesztési gyakorlatokat. Tartalmazza a CRUD műveleteket (létrehozás, olvasás, frissítés, törlés), localStorage-t az adatok megőrzésére, valamint responsive design-t. A projekt során megtanultam a DOM manipulációt, eseménykezelést és a helyi adattárolás implementálását.",
      en: "Complex task management application built with JavaScript, demonstrating modern web development practices. Features CRUD operations (create, read, update, delete), localStorage for data persistence, and responsive design. Through this project, I learned DOM manipulation, event handling, and local storage implementation.",
      de: "Komplexe Aufgabenverwaltungsanwendung mit JavaScript, die moderne Webentwicklungspraktiken demonstriert. Enthält CRUD-Operationen (Erstellen, Lesen, Aktualisieren, Löschen), localStorage für Datenpersistierung und responsives Design. Durch dieses Projekt lernte ich DOM-Manipulation, Event-Handling und die Implementierung von lokalem Speicher."
    },
    technologies: ["HTML", "CSS", "JavaScript", "LocalStorage"],
    origin: {
      hu: ["Scrimba kurzus projekt"],
      en: ["Scrimba course project"],
      de: ["Scrimba Kursprojekt"]
    },
    githubLink: "https://github.com/TheOfficialRaven/to-do-listank",
    liveLink: "https://to-do-listank.netlify.app",
    image: "imgs/to-do-list.png"
  },
  {
    title: {
      hu: "Mark's Scoreboard",
      en: "Mark's Scoreboard",
      de: "Mark's Anzeigetafel"
    },
    description: {
      hu: "Interaktív pontszámoló alkalmazás sportesemények és játékok követésére, amely JavaScript alapú állapotkezelést és eseménykezelést használ. A projekt célja a JavaScript alapok gyakorlása volt, beleértve a számológépszerű funkcionalitást, a DOM frissítést valós időben, valamint a tiszta, felhasználóbarát interfész kialakítását.",
      en: "Interactive scoreboard application for tracking sports events and games, utilizing JavaScript-based state management and event handling. The project's goal was to practice JavaScript fundamentals, including calculator-like functionality, real-time DOM updates, and creating a clean, user-friendly interface.",
      de: "Interaktive Anzeigetafel-Anwendung zur Verfolgung von Sportereignissen und Spielen, die JavaScript-basiertes Zustandsmanagement und Event-Handling verwendet. Das Projektziel war es, JavaScript-Grundlagen zu üben, einschließlich rechnerähnlicher Funktionalität, Echtzeit-DOM-Updates und der Erstellung einer sauberen, benutzerfreundlichen Oberfläche."
    },
    technologies: ["HTML", "CSS", "JavaScript"],
    origin: {
      hu: ["Scrimba kurzus projekt"],
      en: ["Scrimba course project"],
      de: ["Scrimba Kursprojekt"]
    },
    githubLink: "https://github.com/TheOfficialRaven/markscoreboard",
    liveLink: "https://markscoreboard.netlify.app",
    image: "imgs/score-board.png"
  },
  {
    title: {
      hu: "Donezy - Feladatkezelő Alkalmazás",
      en: "Donezy - Task Management App",
      de: "Donezy - Aufgabenverwaltungs-App"
    },
    description: {
      hu: "Fejlett feladatkezelő Progressive Web App (PWA) iteratív fejlesztési módszertannal. Az alkalmazás Firebase real-time adatbázissal és Tailwind CSS utility-first megközelítéssel épült. Egyedi funkciók: drag & drop task management (HTML5 Drag API), offline-first architecture (Service Workers), cloud-local hibrid szinkronizáció, dark/light theme toggle (CSS custom properties), és push notification rendszer. Kódolt megoldások: ES6 modules struktura, async/await aszinkron műveletek, localStorage + Firestore adatperzisztencia, responsive breakpoint rendszer, és component-alapú JavaScript architektúra. A fejlesztés agilis sprint-ekben történik kontinuus deployment pipeline-nal.",
      en: "Advanced task management Progressive Web App (PWA) built with iterative development methodology. The application features Firebase real-time database and Tailwind CSS utility-first approach. Unique features: drag & drop task management (HTML5 Drag API), offline-first architecture (Service Workers), cloud-local hybrid synchronization, dark/light theme toggle (CSS custom properties), and push notification system. Coded solutions: ES6 modules structure, async/await asynchronous operations, localStorage + Firestore data persistence, responsive breakpoint system, and component-based JavaScript architecture. Development follows agile sprints with continuous deployment pipeline.",
      de: "Fortgeschrittene Aufgabenverwaltungs Progressive Web App (PWA) mit iterativer Entwicklungsmethodik erstellt. Die Anwendung nutzt Firebase Echtzeit-Datenbank und Tailwind CSS Utility-First-Ansatz. Einzigartige Funktionen: Drag & Drop Aufgabenverwaltung (HTML5 Drag API), Offline-First-Architektur (Service Workers), Cloud-Local-Hybrid-Synchronisation, Dark/Light-Theme-Umschalter (CSS Custom Properties) und Push-Benachrichtigungssystem. Codierte Lösungen: ES6-Module-Struktur, async/await asynchrone Operationen, localStorage + Firestore Datenpersistierung, responsives Breakpoint-System und komponentenbasierte JavaScript-Architektur. Die Entwicklung folgt agilen Sprints mit kontinuierlicher Deployment-Pipeline."
    },
    technologies: ["HTML", "CSS", "JavaScript", "Responsive Design", "Firebase", "tailwindCSS"],
    origin: {
      hu: ["Folyamatban lévő saját projekt"],
      en: ["Ongoing personal project"],
      de: ["Laufendes persönliches Projekt"]
    },
    githubLink: "", 
    liveLink: "https://donezy.netlify.app",
    image: "imgs/donezy-preview.png" 
  }
];

// Nyelvspecifikus szövegek
function getModalTexts() {
  const lang = localStorage.getItem('lang') || 'hu';
  const texts = {
    hu: {
      viewWebsite: 'Weboldal megtekintése',
      viewGithub: 'GitHub repository',
      websiteBtn: 'Weboldal',
      githubBtn: 'GitHub',
      readMore: 'Kattints a részletekért...'
    },
    en: {
      viewWebsite: 'View Website',
      viewGithub: 'GitHub Repository',
      websiteBtn: 'Website',
      githubBtn: 'GitHub',
      readMore: 'Click for details...'
    },
    de: {
      viewWebsite: 'Website ansehen',
      viewGithub: 'GitHub Repository',
      websiteBtn: 'Website',
      githubBtn: 'GitHub',
      readMore: 'Klicken für Details...'
    }
  };
  return texts[lang] || texts.hu;
}

// Modal HTML létrehozása
function createLearningModal() {
  const texts = getModalTexts();
  const modal = document.createElement('div');
  modal.className = 'modal learning-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <img class="modal-image" src="" alt="Project Preview">
      <h2 class="modal-title"></h2>
      <p class="modal-description"></p>
      <div class="modal-tags"></div>
      <div class="modal-origin-tags"></div>
      <div class="modal-buttons">
        <a href="#" class="modal-cta-button live-link" target="_blank" rel="noopener noreferrer">
          <i class="fas fa-external-link-alt"></i> ${texts.viewWebsite}
        </a>
        <a href="#" class="modal-cta-button github-link" target="_blank" rel="noopener noreferrer">
          <i class="fab fa-github"></i> ${texts.viewGithub}
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

// Modal megnyitása tanulási projekthez
function openLearningModal(project) {
  const modal = document.querySelector('.learning-modal') || createLearningModal();
  const modalImage = modal.querySelector('.modal-image');
  const modalTitle = modal.querySelector('.modal-title');
  const modalDesc = modal.querySelector('.modal-description');
  const modalTags = modal.querySelector('.modal-tags');
  const modalOrigin = modal.querySelector('.modal-origin-tags');
  const liveLink = modal.querySelector('.live-link');
  const githubLink = modal.querySelector('.github-link');

  // Aktuális nyelv szerinti szövegek lekérése
  const currentLang = localStorage.getItem('lang') || 'hu';
  const title = project.title[currentLang] || project.title.hu;
  const description = project.description[currentLang] || project.description.hu;
  const origin = project.origin[currentLang] || project.origin.hu;

  modalImage.src = project.image;
  modalTitle.textContent = title;
  modalDesc.textContent = description;
  modalTags.innerHTML = project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('');
  modalOrigin.innerHTML = origin.map(originItem => `<span class="tag">${originItem}</span>`).join('');
  liveLink.href = project.liveLink;
  
  // GitHub link kezelése
  if (project.githubLink && project.githubLink.trim() !== '') {
    githubLink.href = project.githubLink;
    githubLink.style.display = '';
  } else {
    githubLink.style.display = 'none';
  }

  modal.classList.add('show');

  // Event listeners
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');

  const closeModal = () => modal.classList.remove('show');
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}

// Tanulási projektek megjelenítése
function renderLearningProjects() {
  const container = document.getElementById('learning-project-container');
  if (!container) return;

  container.innerHTML = '';
  const texts = getModalTexts();
  const currentLang = localStorage.getItem('lang') || 'hu';

  learningProjects.forEach((project, index) => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card learning-project';
    
    // Aktuális nyelv szerinti szövegek lekérése
    const title = project.title[currentLang] || project.title.hu;
    const description = project.description[currentLang] || project.description.hu;
    const origin = project.origin[currentLang] || project.origin.hu;
    
    // GitHub gomb HTML feltételesen
    const githubButtonHTML = (project.githubLink && project.githubLink.trim() !== '') 
      ? `<button class="view-btn github-btn" data-link="${project.githubLink}">
           <i class="fab fa-github"></i> ${texts.githubBtn}
         </button>` 
      : '';

    projectCard.innerHTML = `
      <div class="project-image" style="background-image: url('${project.image}')">
        <div class="overlay">
          <div class="project-buttons">
            <button class="view-btn live-btn" data-link="${project.liveLink}">
              <i class="fas fa-external-link-alt"></i> ${texts.websiteBtn}
            </button>
            ${githubButtonHTML}
          </div>
        </div>
      </div>
      <div class="project-info">
        <h3>${title}</h3>
        <p class="project-description truncated">${description}</p>
        <p class="project-description-hint">${texts.readMore}</p>
        <p class="project-origin">${origin.join(', ')}</p>
        <p class="tech-stack">${project.technologies.join(' • ')}</p>
      </div>
    `;

    // Event listener-ek a gombokra
    projectCard.querySelector('.live-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      window.open(project.liveLink, '_blank');
    });

    // GitHub gomb event listener csak ha létezik a gomb
    const githubBtn = projectCard.querySelector('.github-btn');
    if (githubBtn) {
      githubBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(project.githubLink, '_blank');
      });
    }

    // Event listener a teljes kártyára - modal megnyitása (kivéve gombokat)
    projectCard.addEventListener('click', (e) => {
      // Ha nem a gombokon kattintottunk, nyissuk meg a modal-t
      if (!e.target.classList.contains('view-btn') && !e.target.closest('.project-buttons')) {
        openLearningModal(project);
      }
    });

    container.appendChild(projectCard);

    // Animáció
    setTimeout(() => {
      projectCard.classList.add('show');
    }, index * 150);
  });
}

// Exportálás
export { learningProjects, renderLearningProjects }; 