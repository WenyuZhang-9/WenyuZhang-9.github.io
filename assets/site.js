
document.querySelectorAll('[data-year]').forEach(el => el.textContent = String(new Date().getFullYear()));

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
