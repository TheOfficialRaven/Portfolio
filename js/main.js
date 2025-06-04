document.addEventListener('DOMContentLoaded', () => {
  /* ===== Projects Generation & Reveal ===== */
  const projectContainer = document.getElementById('project-container');
  const projectObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px -150px 0px' });

  projects.forEach((project, i) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.setProperty('--dir', i % 2 === 0 ? '-50px' : '50px');
    card.style.transitionDelay = `${0.15 + Math.floor(i/2) * 0.1}s`;
    card.innerHTML = `
      <div class="project-image" style="background-image:url('${project.image}')"></div>
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <p class="project-origin">${project.origin.join(', ')}</p>
        <p class="tech-stack">${project.technologies.join(' / ')}</p>
      </div>
    `;
    ['title','description','origin','technologies','link','image'].forEach(key => {
      card.dataset[key] = Array.isArray(project[key]) ? project[key].join(';') : project[key];
    });
    projectContainer.appendChild(card);
    projectObserver.observe(card);
  });

  /* ===== Modal Logic ===== */
  const modal = document.getElementById('project-modal');
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.dataset.title;
      const desc = card.dataset.description;
      const origins = card.dataset.origin.split(';');
      const tags = card.dataset.technologies.split(',');
      const link = card.dataset.link;
      const imgUrl = card.dataset.image;
      modal.querySelector('.modal-image').src = imgUrl;
      modal.querySelector('.modal-title').textContent = title;
      modal.querySelector('.modal-description').textContent = desc;
      const oC = modal.querySelector('.modal-origin-tags'); oC.innerHTML = '';
      const tC = modal.querySelector('.modal-tags'); tC.innerHTML = '';
      origins.forEach(o => { const s = document.createElement('span'); s.className='tag'; s.textContent=o; oC.appendChild(s); });
      tags.forEach(t => { const s = document.createElement('span'); s.className='tag'; s.textContent=t; tC.appendChild(s); });
      modal.querySelector('.modal-cta-button').href = link;
      modal.classList.add('show');
    });
  });
  closeBtn.addEventListener('click', () => modal.classList.remove('show'));
  overlay.addEventListener('click', () => modal.classList.remove('show'));

  /* ===== Testimonials (Custom Carousel) ===== */
  (function(){
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prev = document.querySelector('.carousel-btn.prev');
    const next = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let idx = 0;

    // Determine how many slides are visible at once
    function getVisibleCount() {
      return window.innerWidth < 768 ? 1 : 2;
    }

    // Create dots dynamically based on total slides/visible
    function setupDots() {
      const visible = getVisibleCount();
      const total = Math.ceil(slides.length / visible);
      dotsContainer.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
      }
      return { visible, total };
    }

    let { visible, total } = setupDots();
    const dots = Array.from(dotsContainer.children);

    function update(i) {
      // slide width + gap
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseInt(getComputedStyle(track).gap) || 0;
      // translate: i * (visible * slideWidth + (visible - 1)*gap)
      const shift = i * (visible * slideWidth + (visible - 1) * gap);
      track.style.transform = `translateX(-${shift}px)`;

      dots.forEach(d => d.classList.remove('active'));
      dots[i].classList.add('active');
      idx = i;
    }

    // Controls and dot events
    prev.addEventListener('click', () => update((idx - 1 + total) % total));
    next.addEventListener('click', () => update((idx + 1) % total));
    dotsContainer.addEventListener('click', e => {
      if (e.target.tagName === 'BUTTON') {
        const i = dots.indexOf(e.target);
        update(i);
      }
    });

    // Recalculate on window resize
    window.addEventListener('resize', () => {
      ({ visible, total } = setupDots());
      update(0);
    });

    // Auto-slide
    setInterval(() => update((idx + 1) % total), 7000);

    // Initial position
    update(0);
  })();
});