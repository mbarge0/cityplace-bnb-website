/* CityPlace bnb, deal site JS. No dependencies, no external requests. */
(function () {
  'use strict';

  /* Verified constants, sourced from the owner P&L and deal-room documents. */
  var NOI_ACTUALS = 176844;    // T12 NOI through Jun 2026, owner P&L
  var UNITS = 10;
  var LTV = 0.75;              // illustrative debt: 75% LTV
  var RATE = 0.0725;           // illustrative rate
  var AMORT_YEARS = 25;        // illustrative amortization

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var fmtUSD = function (n) {
    var sign = n < 0 ? '−$' : '$';
    return sign + Math.round(Math.abs(n)).toLocaleString('en-US');
  };
  var fmtPct = function (n) { return n.toFixed(2) + '%'; };

  /* ---------- price slider ---------- */
  var priceInput = $('#c-price');
  if (priceInput) {
    var monthlyRate = RATE / 12;
    var n = AMORT_YEARS * 12;

    var renderSide = function (suffix, noi, price, annualDebt, equity) {
      var cap = noi / price * 100;
      var cashFlow = noi - annualDebt;
      var coc = cashFlow / equity * 100;
      $('#o-cap-' + suffix).textContent = fmtPct(cap);
      $('#o-loan-' + suffix).textContent = fmtUSD(price * LTV);
      $('#o-ds-' + suffix).textContent = fmtUSD(annualDebt);
      var cf = $('#o-cf-' + suffix);
      cf.textContent = fmtUSD(cashFlow);
      cf.classList.toggle('neg', cashFlow < 0);
      $('#o-eq-' + suffix).textContent = fmtUSD(equity);
      var cocEl = $('#o-coc-' + suffix);
      cocEl.textContent = fmtPct(coc);
      cocEl.classList.toggle('neg', coc < 0);
    };

    var update = function () {
      var price = +priceInput.value;
      var loan = price * LTV;
      var equity = price - loan;
      var pmt = loan * monthlyRate / (1 - Math.pow(1 + monthlyRate, -n));
      var annualDebt = pmt * 12;

      $('#o-price').textContent = fmtUSD(price);
      $('#o-perdoor').textContent = fmtUSD(price / UNITS) + ' per door';
      renderSide('a', NOI_ACTUALS, price, annualDebt, equity);
    };

    priceInput.addEventListener('input', update);
    update();
  }

  /* ---------- gallery lightbox ---------- */
  var lb = $('#lightbox');
  if (lb) {
    var links = $$('.gallery-grid a');
    var idx = 0;
    var img = $('#lb-img'), cap = $('#lb-cap');

    var show = function (i) {
      idx = (i + links.length) % links.length;
      var a = links[idx];
      img.src = a.getAttribute('href');
      img.alt = a.dataset.caption || '';
      cap.textContent = (idx + 1) + ' / ' + links.length + ', ' + (a.dataset.caption || '');
    };

    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        show(i);
        lb.showModal();
      });
    });
    $('.lb-close', lb).addEventListener('click', function () { lb.close(); });
    $('.lb-prev', lb).addEventListener('click', function () { show(idx - 1); });
    $('.lb-next', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- scroll reveal ---------- */
  if ('IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- preserve UTM params on internal links; carry into form ---------- */
  if (location.search && /utm_|gclid|fbclid/.test(location.search)) {
    $$('a[href^="/"]').forEach(function (a) {
      if (a.host === location.host && a.pathname !== location.pathname) {
        a.search = location.search;
      }
    });
    var src = $('#f-source');
    if (src) src.value = location.search.slice(1);
  }

  /* ---------- funnel events (GA4 placeholder-safe) ---------- */
  var track = function (name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  };
  var form = $('form[name="deal-room-request"]');
  if (form) form.addEventListener('submit', function () { track('lead_form_submit'); });

  /* ---------- deal-room modal ---------- */
  var modal = $('#deal-room-modal');
  if (modal && typeof modal.showModal === 'function') {
    $$('a[href="#deal-room"], a[href="/#deal-room"], a[href$="/buy/#deal-room"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        track('cta_dealroom_click', { location: a.dataset.loc || 'page' });
        modal.showModal();
      });
    });
    $('.modal-close', modal).addEventListener('click', function () { modal.close(); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
  }

  /* ---------- hero micro-form: AJAX capture, no navigation ---------- */
  var micro = $('.micro-form');
  if (micro) {
    micro.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = $('button', micro); btn.disabled = true; btn.textContent = 'Sending…';
      var body = new URLSearchParams(new FormData(micro)).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          track('form_submit_buy', { form_name: 'deal-room-request', variant: 'hero-micro' });
          micro.parentNode.innerHTML = '<p class="hb-done"><b>Sent.</b> The financial package is on its way to your inbox.</p>';
        })
        .catch(function () { micro.removeEventListener && micro.submit(); });
    });
  }
})();
