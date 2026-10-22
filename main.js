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
