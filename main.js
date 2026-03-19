(function(){
  'use strict';

  // ── Nav scroll state ──
  const nav = document.querySelector('.nav');
  if(nav){
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), {passive:true});
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }

  // ── Mobile hamburger ──
  // Inject hamburger button if not already present
  const navLinks = document.querySelector('.nav-links');
  if(navLinks && !document.querySelector('.nav-hamburger')){
    const burger = document.createElement('button');
    burger.className = 'nav-hamburger';
    burger.setAttribute('aria-label', 'Menu');
    burger.innerHTML = `<span></span><span></span><span></span>`;
    burger.style.cssText = `
      display: none;
      flex-direction: column; justify-content: center; gap: 5px;
      width: 36px; height: 36px; padding: 6px;
      background: transparent; border: 1px solid rgba(255,255,255,0.12);
      border-radius: 6px; cursor: pointer;
    `;
    Array.from(burger.querySelectorAll('span')).forEach(s => {
      s.style.cssText = 'display:block;height:1px;background:#fff;transition:transform 0.3s,opacity 0.3s;';
    });

    // Show on mobile
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @media (max-width: 640px) {
        .nav-hamburger { display: flex !important; }
        .nav-links-mobile-open .nav-links a:not(.nav-pill) { display: flex !important; }
        .nav-links.mobile-open {
          position: fixed; top: 72px; left: 0; right: 0;
          background: rgba(8,8,8,0.97); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-direction: column; align-items: flex-start;
          padding: 1.25rem 1.5rem 1.75rem; gap: 0.25rem;
          z-index: 490;
        }
        .nav-links.mobile-open a {
          display: block !important;
          font-size: 1.1rem; padding: 0.6rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          width: 100%;
        }
        .nav-links.mobile-open .nav-pill {
          margin-left: 0; margin-top: 0.5rem;
          display: inline-flex !important; width: auto;
          border-bottom: none;
        }
      }
    `;
    document.head.appendChild(styleEl);

    const navInner = document.querySelector('.nav-inner');
    if(navInner) navInner.appendChild(burger);

    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('mobile-open');
      const spans = burger.querySelectorAll('span');
      if(open){
        spans[0].style.transform = 'translateY(6px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        const spans = burger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // ── Ticker ──
  const t = document.querySelector('.ticker-track');
  if(t) t.innerHTML += t.innerHTML;

  // ── Reveal on scroll ──
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('show'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // ── Roster filter tabs ──
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.roster-card[data-category]');
  if(tabs.length){
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.filter;
      cards.forEach(c => {
        const show = cat === 'all' || c.dataset.category === cat;
        c.style.transition = 'opacity 0.35s, transform 0.35s';
        c.style.opacity = show ? '1' : '0.1';
        c.style.transform = show ? 'scale(1)' : 'scale(0.97)';
        c.style.pointerEvents = show ? 'auto' : 'none';
      });
    }));
  }

  // ── Form feedback ──
  const btn = document.querySelector('.f-submit');
  if(btn) btn.addEventListener('click', () => {
    btn.textContent = 'Sent ✓';
    btn.style.background = 'rgba(255,255,255,0.15)';
    btn.style.color = '#fff';
    setTimeout(() => { btn.textContent = 'Send Inquiry'; btn.style.background = ''; btn.style.color = ''; }, 2800);
  });

  // ── Page transitions ──
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:#000;z-index:9000;transform:scaleX(0);transform-origin:left center;transition:transform 0.22s cubic-bezier(0.16,1,0.3,1)';
      document.body.appendChild(overlay);
      requestAnimationFrame(() => { overlay.style.transform = 'scaleX(1)'; });
      setTimeout(() => { window.location.href = href; }, 240);
    });
  });
})();
