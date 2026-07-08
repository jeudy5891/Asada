/* =============================================
   ASADA — Main JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. HEADER scroll shadow ── */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── 2. HAMBURGER mobile menu ── */
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    // close menu when clicking a non-dropdown link
    navMenu.querySelectorAll('.nav-link:not(.drop-toggle)').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  /* ── 3. DROPDOWN toggle (mobile tap) ── */
  document.querySelectorAll('.nav-dropdown').forEach(dd => {
    const toggle = dd.querySelector('.drop-toggle');
    if (toggle) {
      toggle.addEventListener('click', e => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dd.classList.toggle('open');
        }
      });
    }
  });

  /* ── 4. SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 5. SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ── 6. LEAFLET MAP (Contacto) ── */
  const mapEl = document.getElementById('map');
  if (mapEl && typeof L !== 'undefined') {
    const lat = 9.9333, lng = -84.0833;
    const map = L.map('map', { zoomControl: true, scrollWheelZoom: false })
                 .setView([lat, lng], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);

    const icon = L.divIcon({
      className: '',
      html: `<div style="
        background:#0369a1;
        width:38px;height:38px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:3px solid #fff;
        box-shadow:0 4px 12px rgba(0,0,0,.35);
        display:flex;align-items:center;justify-content:center;
      ">
        <span style="transform:rotate(45deg);color:#fff;font-size:16px;">💧</span>
      </div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 38]
    });

    L.marker([lat, lng], { icon })
      .addTo(map)
      .bindPopup(`
        <div style="text-align:center;padding:.375rem .125rem;min-width:180px">
          <strong style="color:#0c2d48;font-size:.9375rem;display:block;margin-bottom:.25rem">
            ASADA
          </strong>
          <span style="color:#475569;font-size:.8125rem">
            Avenida Central, San José<br>Costa Rica
          </span>
        </div>
      `, { maxWidth: 220 })
      .openPopup();
  }

  /* ── 7. NOSOTROS sidebar active state ── */
  const nosSections = document.querySelectorAll('.nos-section[id]');
  const nosNavItems = document.querySelectorAll('.nos-nav-item');
  if (nosSections.length && nosNavItems.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          nosNavItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    nosSections.forEach(s => sectionObserver.observe(s));
  }

  /* ── 8. NOSOTROS mobile accordion sidebar ── */
  nosNavItems.forEach(item => {
    item.addEventListener('click', () => {
      nosNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  /* ── 9. RECIBOS form — redirect to consulta ── */
  const recibosForm = document.getElementById('recibosForm');
  if (recibosForm) {
    recibosForm.addEventListener('submit', e => {
      e.preventDefault();
      window.open('https://asada.or.cr/consulta.html', '_blank', 'noopener');
    });
  }

  /* ── 10. CONTACTO form ── */
  const contactoForm = document.getElementById('contactoForm');
  if (contactoForm) {
    contactoForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactoForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Mensaje enviado';
      btn.disabled = true;
      btn.style.background = '#16a34a';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        btn.style.background = '';
        contactoForm.reset();
      }, 3500);
    });
  }

  /* ── 11. COUNTER ANIMATION (stats bar) ── */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      const dur = 1400;
      const step = end / (dur / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= end) { current = end; clearInterval(timer); }
        el.textContent = Math.floor(current).toLocaleString('es-CR');
      }, 16);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ── 12. NAV active link on scroll (index) ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[data-section]');
  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === entry.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => navObserver.observe(s));
  }

});

/* ── FAQ ACORDEÓN (Trámites) ── */
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  item.parentElement.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}
