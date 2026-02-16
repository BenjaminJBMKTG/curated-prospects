// FatLeads UI interactions (mobile nav, sticky shadow, FAQs, modal)
(() => {
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const bottomCta = document.getElementById('bottomCta');

  // Mobile nav toggle
  if (navToggle && navLinks){
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when clicking a link (mobile)
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Sticky nav shadow
  const onScroll = () => {
    if (!nav) return;
    const y = window.scrollY || 0;
    nav.classList.toggle('is-stuck', y > 6);

    // Bottom CTA appears after a little scroll (mobile)
    if (bottomCta){
      bottomCta.style.opacity = y > 500 ? '1' : '0';
      bottomCta.style.pointerEvents = y > 500 ? 'auto' : 'none';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // FAQs accordion
  document.querySelectorAll('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close others
      document.querySelectorAll('.faq__q').forEach(b => b.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Calendly modal (optional)
  const modal = document.getElementById('calendlyModal');
  const widget = document.getElementById('calendlyWidget');
  const openers = document.querySelectorAll('[data-calendly-open]');
  const closers = document.querySelectorAll('[data-modal-close]');
  let scriptLoaded = false;

  const openModal = () => {
    if (!modal) return;

    modal.classList.add('is-open');
    document.body.classList.add('modal-open');

    // Lazy load Calendly script + embed
    const url = modal.getAttribute('data-calendly-url');
    if (!url || !widget) return;

    const mount = () => {
      // eslint-disable-next-line no-undef
      Calendly.initInlineWidget({ url, parentElement: widget });
    };

    if (!scriptLoaded){
      const s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      s.onload = () => { scriptLoaded = true; mount(); };
      document.head.appendChild(s);
    } else {
      mount();
    }
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
    // Optionally clear widget contents to avoid duplicate embeds
    if (widget) widget.innerHTML = '';
  };

  openers.forEach(el => el.addEventListener('click', (e) => {
    // Prevent # links from jumping
    const href = el.getAttribute('href') || '';
    if (href === '#' || href.startsWith('#')) e.preventDefault();
    openModal();
  }));

  closers.forEach(el => el.addEventListener('click', closeModal));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();
