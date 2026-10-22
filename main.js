// Effets du site : apparition au défilement, compteurs, menu actif.
// Sans ce fichier, le site reste complet et lisible.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canObserve = 'IntersectionObserver' in window;

// --- Apparition des blocs au défilement ---
const revealTargets = document.querySelectorAll(
  '.section-title, .section-intro, .timeline-item, .card, .step, .steps-result, ' +
  '.project-grid > div, .destinations, .language, .interests li, .contact-list li'
);
// Éléments qui déclenchent une animation sans apparaître en fondu
const triggerTargets = document.querySelectorAll('.stats, .languages, .map-wrap');

revealTargets.forEach((el) => {
  el.classList.add('reveal');
  // Petit décalage entre éléments voisins (effet « cascade »)
  const index = Array.prototype.indexOf.call(el.parentElement.children, el);
  el.style.setProperty('--d', Math.min(index, 5));
});

function show(el) {
  el.classList.add('is-visible');
  if (el.classList.contains('stats')) animateCounters(el);
  if (el.classList.contains('reveal')) {
    // Une fois apparu, on retire l'animation d'entrée pour laisser place à l'effet 3D au survol
    el.addEventListener('transitionend', function done(e) {
      if (e.target !== el) return;
      el.classList.remove('reveal', 'is-visible');
      el.removeEventListener('transitionend', done);
    });
  }
}

if (reduceMotion || !canObserve) {
  [...revealTargets, ...triggerTargets].forEach(show);
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      show(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
  [...revealTargets, ...triggerTargets].forEach((el) => observer.observe(el));
}

// --- Compteurs des chiffres clés ---
function animateCounters(container) {
  if (reduceMotion) return; // la valeur finale est déjà écrite dans la page
  const format = new Intl.NumberFormat(document.documentElement.lang === 'fr' ? 'fr-FR' : 'en-GB');
  container.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format.format(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// --- Menu : surligne la section en cours de lecture ---
const navLinks = document.querySelectorAll('.nav-list a');
if (canObserve && navLinks.length) {
  const linkFor = new Map([...navLinks].map((a) => [a.getAttribute('href').slice(1), a]));
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => a.classList.remove('is-active'));
      const link = linkFor.get(entry.target.id);
      if (link) link.classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => navObserver.observe(s));
}

// --- Titre animé façon machine à écrire ---
const typed = document.querySelector('.typed[data-typed]');
if (typed && !reduceMotion) {
  const words = JSON.parse(typed.dataset.typed);
  // Les lecteurs d'écran lisent le texte complet, pas l'animation
  const full = document.createElement('span');
  full.className = 'sr-only';
  full.textContent = typed.textContent;
  typed.before(full);
  typed.setAttribute('aria-hidden', 'true');
  typed.classList.add('is-typing');
  typed.textContent = '';

  let word = 0, letter = 0, deleting = false;
  (function step() {
    const current = words[word];
    letter += deleting ? -1 : 1;
    typed.textContent = current.slice(0, letter);
    let delay = deleting ? 28 : 55;
    if (!deleting && letter === current.length) { deleting = true; delay = 1900; }
    else if (deleting && letter === 0) { deleting = false; word = (word + 1) % words.length; delay = 350; }
    setTimeout(step, delay);
  })();
}

// --- Barre de progression de lecture ---
const progress = document.querySelector('.scroll-progress');
if (progress) {
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

// --- Inclinaison 3D au survol (souris uniquement) ---
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt) || 8;
    el.classList.add('tilt');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.transform =
        `perspective(900px) rotateX(${((0.5 - y) * max).toFixed(2)}deg) rotateY(${((x - 0.5) * max).toFixed(2)}deg)`;
      el.style.setProperty('--glare-x', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--glare-y', `${(y * 100).toFixed(1)}%`);
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
