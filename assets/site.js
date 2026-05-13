
document.querySelectorAll('[data-year]').forEach(el => el.textContent = String(new Date().getFullYear()));

// Open all external and mailto links in a new tab
document.querySelectorAll('a[href]').forEach(a => {
  const h = a.getAttribute('href');
  if (h && (h.startsWith('http') || h.startsWith('mailto'))) {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  }
});

// Footprint map
const mapEl = document.getElementById('footprint-map');
if (mapEl && typeof L !== 'undefined') {
  const map = L.map('footprint-map', { zoomControl: true, scrollWheelZoom: false }).setView([30, 20], 2);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    maxZoom: 18
  }).addTo(map);

  const institutionIcon = L.divIcon({ className: '', html: '<div style="width:12px;height:12px;border-radius:50%;background:#2f5d7c;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>', iconSize: [12, 12], iconAnchor: [6, 6] });
  const conferenceIcon = L.divIcon({ className: '', html: '<div style="width:10px;height:10px;border-radius:2px;background:#e07b39;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>', iconSize: [10, 10], iconAnchor: [5, 5] });

  const institutions = [
    { latlng: [30.628, -96.334], label: 'Texas A&M University', sub: 'College Station, TX · 2024–present' },
    { latlng: [1.296, 103.776], label: 'National University of Singapore', sub: 'Singapore · 2023–2024' },
    { latlng: [23.043, 113.404], label: 'Hong Kong Univ. of Science and Technology', sub: 'Guangzhou, China · 2024' },
    { latlng: [30.593, 114.305], label: 'Central China Normal University', sub: 'Wuhan, China · 2019–2023' },
    { latlng: [40.001, 116.322], label: 'Aerospace Information Research Institute, CAS', sub: 'Beijing, China · 2022 (Internship)' }
  ];
  const conferences = [
    { latlng: [37.779, -122.419], label: 'AAG Annual Meeting 2026', sub: 'San Francisco, CA' },
    { latlng: [49.283, -123.121], label: 'International Cartographic Conference 2025', sub: 'Vancouver, BC' },
    { latlng: [42.331, -83.046], label: 'AAG Annual Meeting 2025', sub: 'Detroit, MI' },
    { latlng: [38.879, -77.107], label: 'Symposium on Spatiotemporal Data Science', sub: 'Arlington, VA' }
  ];

  institutions.forEach(({ latlng, label, sub }) => {
    L.marker(latlng, { icon: institutionIcon }).addTo(map)
      .bindPopup(`<strong>${label}</strong><br><span style="font-size:.82rem;color:#666">${sub}</span>`);
  });
  conferences.forEach(({ latlng, label, sub }) => {
    L.marker(latlng, { icon: conferenceIcon }).addTo(map)
      .bindPopup(`<strong>${label}</strong><br><span style="font-size:.82rem;color:#666">${sub}</span>`);
  });
}

// Pub figure carousels
document.querySelectorAll('.pub-carousel').forEach(el => {
  const track = el.querySelector('.pub-carousel-track');
  const imgs = [...track.querySelectorAll('img')];
  const dotsWrap = el.querySelector('.pub-carousel-dots-wrap');
  let idx = 0;
  const dots = imgs.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'pub-carousel-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => go(i));
    dotsWrap.appendChild(d);
    return d;
  });
  function go(n) {
    idx = (n + imgs.length) % imgs.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }
  el.querySelector('.pub-carousel-prev')?.addEventListener('click', () => go(idx - 1));
  el.querySelector('.pub-carousel-next')?.addEventListener('click', () => go(idx + 1));
});

// Quote carousel
const carousel = document.querySelector('.quote-carousel');
if (carousel) {
  const quotes = [...carousel.querySelectorAll('.eval-quote')];
  const dotsEl = carousel.querySelector('.quote-dots');
  let current = 0;

  const dots = quotes.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'quote-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Quote ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
    return d;
  });

  function goTo(n) {
    quotes[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + quotes.length) % quotes.length;
    quotes[current].classList.add('active');
    dots[current].classList.add('active');
  }

  setInterval(() => goTo(current + 1), 4000);
}

// Back to top button
(function () {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Mobile nav toggle
(function () {
  const toggle = document.querySelector('.mnav-toggle');
  const links = document.querySelector('.mnav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });
})();

// Highlight active section in sidebar nav as user scrolls
const navLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
if (navLinks.length) {
  const ids = [...navLinks].map(a => a.getAttribute('href').slice(1));
  const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
      }
    });
  }, { rootMargin: '-15% 0px -80% 0px' });
  sections.forEach(s => observer.observe(s));
}
