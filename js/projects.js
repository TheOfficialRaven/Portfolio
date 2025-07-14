// Projektek adatai
const projects = [
  {
    title: {
      hu: "Antique Shop",
      en: "Antique Shop",
      de: "Antiquitätenladen"
    },
    description: {
      hu: "Komplex e-commerce weboldal régiségeket árusító vállalkozás számára, saját admin felülettel és valós idejű adatbázis-kezeléssel. Az ügyfél a custom admin panelen keresztül könnyedén feltöltheti az új termékeket, amelyek automatikusan megjelennek a weboldalon professzionális kártyás formátumban. A kezdőlapon a legutóbb feltöltött 6 termék real-time frissül Firebase adatbázisból. A projekt magában foglalja a CRUD műveleteket, reszponzív design-t, smooth scroll navigációt és interaktív galériát.",
      en: "Complex e-commerce website for an antique business featuring custom admin interface and real-time database management. The client can easily upload new products through the custom admin panel, which automatically appear on the website in professional card format. The homepage displays the latest 6 uploaded products with real-time updates from Firebase database. The project includes CRUD operations, responsive design, smooth scroll navigation, and interactive gallery.",
      de: "Komplexe E-Commerce-Website für ein Antiquitätengeschäft mit individueller Admin-Oberfläche und Echtzeit-Datenbankmanagement. Der Kunde kann neue Produkte einfach über das maßgeschneiderte Admin-Panel hochladen, die automatisch in professionellem Kartenformat auf der Website erscheinen. Die Startseite zeigt die neuesten 6 hochgeladenen Produkte mit Echtzeit-Updates aus der Firebase-Datenbank. Das Projekt umfasst CRUD-Operationen, responsives Design, sanfte Scroll-Navigation und interaktive Galerie."
    },
    technologies: ["HTML", "CSS", "JavaScript"],
    origin: {
      hu: ["Saját Design"],
      en: ["Own Design"],
      de: ["Eigenes Design"]
    },
    link: "https://regisegekjocitol.netlify.app",
    image: "imgs/antique-preview.png",
    category: "professional"
  },
  {
    title: {
      hu: "Monte Bistro",
      en: "Monte Bistro",
      de: "Monte Bistro"
    },
    description: {
      hu: "Elegáns éttermi weboldal professzionális kivitelezésben, amely bemutatja a modern webfejlesztési technikákat. A projekt tartalmaz dinamikus menü rendszert, interaktív galériát és foglalási űrlapot. A design a fine dining élményét tükrözi, kifinomult tipográfiával és színpalettával. Reszponzív kialakítás biztosítja a tökéletes megjelenést minden eszközön, míg a CSS animációk elegáns felhasználói élményt nyújtanak.",
      en: "Elegant restaurant website with professional execution, showcasing modern web development techniques. The project includes dynamic menu system, interactive gallery, and reservation forms. The design reflects the fine dining experience with sophisticated typography and color palette. Responsive design ensures perfect display across all devices, while CSS animations provide an elegant user experience.",
      de: "Elegante Restaurant-Website mit professioneller Umsetzung, die moderne Webentwicklungstechniken zeigt. Das Projekt umfasst ein dynamisches Menüsystem, interaktive Galerie und Reservierungsformulare. Das Design spiegelt das Fine-Dining-Erlebnis mit anspruchsvoller Typografie und Farbpalette wider. Responsives Design gewährleistet perfekte Darstellung auf allen Geräten, während CSS-Animationen ein elegantes Benutzererlebnis bieten."
    },
    technologies: ["HTML", "CSS", "JavaScript"],
    origin: {
      hu: ["Design: Klaudia Székelyföldi"],
      en: ["Design: Klaudia Székelyföldi"],
      de: ["Design: Klaudia Székelyföldi"]
    },
    link: "https://montebistro.netlify.app",
    image: "imgs/monteBistro-preview.png",
    category: "professional"
  },

];

// Nyelvspecifikus szövegek
function getProjectTexts() {
  const lang = localStorage.getItem('lang') || 'hu';
  const texts = {
    hu: {
      viewProject: 'Projekt megtekintése',
      viewBtn: 'Megtekintés',
      readMore: 'Kattints a részletekért...'
    },
    en: {
      viewProject: 'View Project',
      viewBtn: 'View',
      readMore: 'Click for details...'
    },
    de: {
      viewProject: 'Projekt ansehen',
      viewBtn: 'Ansehen',
      readMore: 'Klicken für Details...'
    }
  };
  return texts[lang] || texts.hu;
}

// Modal HTML létrehozása
function createModal() {
  const texts = getProjectTexts();
  const modal = document.createElement('div');
  modal.className = 'modal professional-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <img class="modal-image" src="" alt="Project Preview">
      <h2 class="modal-title"></h2>
      <p class="modal-description"></p>
      <div class="modal-tags"></div>
      <div class="modal-origin-tags"></div>
      <a href="#" class="modal-cta-button" target="_blank" rel="noopener noreferrer">${texts.viewProject}</a>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

// Modal megnyitása
function openModal(project) {
  const modal = document.querySelector('.professional-modal') || createModal();
  const modalImage = modal.querySelector('.modal-image');
  const modalTitle = modal.querySelector('.modal-title');
  const modalDesc = modal.querySelector('.modal-description');
  const modalTags = modal.querySelector('.modal-tags');
  const modalOrigin = modal.querySelector('.modal-origin-tags');
  const modalCta = modal.querySelector('.modal-cta-button');

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
  modalCta.href = project.link;

  modal.classList.add('show');

  // Event listeners
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');

  const closeModal = () => modal.classList.remove('show');
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
}

// Projektek megjelenítése
function renderProjects() {
  const container = document.getElementById('project-container');
  
  if (!container) {
    return;
  }

  container.innerHTML = '';
  const texts = getProjectTexts();
  const currentLang = localStorage.getItem('lang') || 'hu';

  projects.forEach((project, index) => {
    // Aktuális nyelv szerinti szövegek lekérése
    const title = project.title[currentLang] || project.title.hu;
    const description = project.description[currentLang] || project.description.hu;
    const origin = project.origin[currentLang] || project.origin.hu;
    
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.setAttribute('data-project-id', index);
    
    projectCard.innerHTML = `
      <div class="project-image" style="background-image: url('${project.image}')">
        <div class="overlay">
          <a href="${project.link}" target="_blank" class="view-btn">${texts.viewBtn}</a>
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

    // Event listener a projekt kártyára (kivéve a gomb)
    projectCard.addEventListener('click', (e) => {
      // Ha nem a gombon kattintottunk, nyissuk meg a modal-t
      if (!e.target.classList.contains('view-btn')) {
        e.preventDefault();
        openModal(project);
      }
    });

    container.appendChild(projectCard);

    // Azonnal hozzáadjuk a show osztályt egy kis késleltetéssel
    setTimeout(() => {
      projectCard.classList.add('show');
    }, index * 200);
  });
}



// Projektek betöltése amikor a DOM betöltődött
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  
  // Újra meghívjuk a renderProjects-et, ha a hash változik
  // Eltávolítva:
  // window.addEventListener('hashchange', renderProjects);
});

// Exportálás
export { projects, renderProjects };