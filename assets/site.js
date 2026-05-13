
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
    { latlng: [22.337, 114.176], label: 'Hong Kong Univ. of Science and Technology', sub: 'Hong Kong · 2024' },
    { latlng: [30.593, 114.305], label: 'Central China Normal University', sub: 'Wuhan, China · 2019–2023' }
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
