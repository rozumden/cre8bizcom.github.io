/* Creative Business Communications — site interactions */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-img');
  if (revealEls.length) {
    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- Hero slideshow ---------- */
  var hero = document.querySelector('.hero-slides');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dotsWrap = document.querySelector('.hero-dots');
    var i = 0, timer = null, DELAY = 5200;

    // build dots
    var dots = [];
    if (dotsWrap) {
      slides.forEach(function (_, idx) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
        b.addEventListener('click', function () { go(idx, true); });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }

    // lazy-load slide backgrounds: only slide 1 ships in the HTML; the rest
    // are assigned just-in-time (and their neighbours preloaded) so first paint
    // downloads a single hero image instead of all of them.
    function ensureBg(idx) {
      var s = slides[(idx + slides.length) % slides.length];
      if (s && s.dataset.bg) {
        s.style.backgroundImage = "url('" + s.dataset.bg + "')";
        s.removeAttribute('data-bg');
      }
    }
    function render() {
      ensureBg(i); ensureBg(i + 1); ensureBg(i - 1);
      slides.forEach(function (s, idx) { s.classList.toggle('is-active', idx === i); });
      dots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === i); });
    }
    // after the page has loaded, quietly fill in any remaining slides so
    // manual/keyboard navigation is instant.
    window.addEventListener('load', function () {
      setTimeout(function () { slides.forEach(function (_, idx) { ensureBg(idx); }); }, 1200);
    });
    function go(n, manual) {
      i = (n + slides.length) % slides.length;
      render();
      if (manual) restart();
    }
    function next() { go(i + 1); }
    function prev() { go(i - 1); }
    function start() { if (!reduceMotion && slides.length > 1) timer = setInterval(next, DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    var pn = document.querySelector('.hero-arrow.next');
    var pp = document.querySelector('.hero-arrow.prev');
    if (pn) pn.addEventListener('click', function () { go(i + 1, true); });
    if (pp) pp.addEventListener('click', function () { go(i - 1, true); });

    hero.closest('.hero').addEventListener('mouseenter', stop);
    hero.closest('.hero').addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') go(i + 1, true);
      else if (e.key === 'ArrowLeft') go(i - 1, true);
    });

    render();
    start();
  }

  /* ---------- Lightbox gallery ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  if (items.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">✕</button>' +
      '<div class="lb-count"></div>' +
      '<button class="lb-nav prev" aria-label="Previous">‹</button>' +
      '<img alt="">' +
      '<button class="lb-nav next" aria-label="Next">›</button>' +
      '<div class="lb-cap"></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img'),
        lbCap = lb.querySelector('.lb-cap'),
        lbCount = lb.querySelector('.lb-count');
    var cur = 0;

    function open(idx) {
      cur = idx;
      show();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }
    function show() {
      var el = items[cur];
      var full = el.getAttribute('data-full') || el.querySelector('img').src;
      var cap = el.getAttribute('data-cap') || (el.querySelector('img') ? el.querySelector('img').alt : '');
      lbImg.src = full;
      lbImg.alt = cap;
      lbCap.textContent = cap;
      lbCount.textContent = (cur + 1) + ' / ' + items.length;
    }
    function step(d) { cur = (cur + d + items.length) % items.length; show(); }

    items.forEach(function (el, idx) {
      el.addEventListener('click', function () { open(idx); });
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(idx); }
      });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-nav.next').addEventListener('click', function () { step(1); });
    lb.querySelector('.lb-nav.prev').addEventListener('click', function () { step(-1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    });
  }

  /* ---------- Contact form (mailto compose) ---------- */
  var form = document.querySelector('form.cform');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name=name]') || {}).value || '';
      var email = (form.querySelector('[name=email]') || {}).value || '';
      var subject = (form.querySelector('[name=subject]') || {}).value || 'Website enquiry';
      var msg = (form.querySelector('[name=message]') || {}).value || '';
      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + msg;
      window.location.href = 'mailto:info@cre8bizcom.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var note = form.querySelector('.form-status');
      if (note) note.textContent = 'Opening your email app… if nothing happens, email us directly at info@cre8bizcom.com';
    });
  }
})();
