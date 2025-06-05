// Projektek adatai
const projects = [
  {
    title: "Antique Shop",
    description: "Modern bemutatkozó oldal egy régiségeket árusító vállalkozáshoz.",
    technologies: ["HTML", "CSS", "JavaScript"],
    origin: ["Saját Design"],
    link: "https://regisegekjocitol.netlify.app",
    image: "imgs/antique-preview.png"
  },
  {
    title: "Monte Bistro",
    description: "Egy elegáns étterem bemutatkozó oldala, menüvel és galériával.",
    technologies: ["HTML", "CSS", "JavaScript"],
    origin: ["Design: Klaudia Székelyföldi"],
    link: "https://montebistro.netlify.app",
    image: "imgs/monteBistro-preview.png"
  },
];

// Modal HTML létrehozása
function createModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <img class="modal-image" src="" alt="Project Preview">
      <h2 class="modal-title"></h2>
      <p class="modal-description"></p>
      <div class="modal-tags"></div>
      <div class="modal-origin-tags"></div>
      <a href="#" class="modal-cta-button" target="_blank" rel="noopener noreferrer">Megtekintés</a>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

// Modal megnyitása
function openModal(project) {
  const modal = document.querySelector('.modal') || createModal();
  const modalImage = modal.querySelector('.modal-image');
  const modalTitle = modal.querySelector('.modal-title');
  const modalDesc = modal.querySelector('.modal-description');
  const modalTags = modal.querySelector('.modal-tags');
  const modalOrigin = modal.querySelector('.modal-origin-tags');
  const modalCta = modal.querySelector('.modal-cta-button');

  modalImage.src = project.image;
  modalTitle.textContent = project.title;
  modalDesc.textContent = project.description;
  modalTags.innerHTML = project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('');
  modalOrigin.innerHTML = project.origin.map(origin => `<span class="tag">${origin}</span>`).join('');
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
  console.log('renderProjects called');
  const container = document.getElementById('project-container');
  console.log('container:', container);
  
  if (!container) {
    console.log('Project container not found!');
    return;
  }

  container.innerHTML = '';

  projects.forEach((project, index) => {
    console.log('Creating project card:', project.title);
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    projectCard.setAttribute('data-project-id', index);
    
    projectCard.innerHTML = `
      <div class="project-image" style="background-image: url('${project.image}')">
        <div class="overlay">
          <button class="view-btn">Megtekintés</button>
        </div>
      </div>
      <div class="project-info">
        <h3>${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <p class="project-origin">${project.origin.join(', ')}</p>
        <p class="tech-stack">${project.technologies.join(' • ')}</p>
      </div>
    `;

    // Event listener a projekt kártyára
    projectCard.querySelector('.view-btn').addEventListener('click', () => {
      openModal(project);
    });

    container.appendChild(projectCard);
    console.log('Project card added:', project.title);

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
  window.addEventListener('hashchange', renderProjects);
});

// Exportálás
export { projects, renderProjects };