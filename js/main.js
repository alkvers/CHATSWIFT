/* ============================================================
   ChatSwift — "Butter" build
   Vanilla JS. No dependencies, no build step.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     CONFIG — EmailJS (sends the support form straight to SUPPORT_EMAIL,
     no backend, no page redirect, no mail app popup)
     --------------------------------------------------------- */
  var SUPPORT_EMAIL          = 'alkvers@gmail.com';
  var EMAILJS_PUBLIC_KEY     = 'SE32tjlnyyAC6r0GF';
  var EMAILJS_SERVICE_ID     = 'service_ait3kyd';
  var EMAILJS_TEMPLATE_ID    = 'template_uh267In';

  if (window.emailjs) { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); }

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* the word-rise animation only exists for JS visitors — without this class
     the headings render as plain static text instead of hiding themselves */
  document.documentElement.classList.add('js');

  /* =========================================================
     1. sticky nav + back to top
     ========================================================= */
  var nav = $('#nav');
  var toTop = $('#toTop');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 24);
    toTop.classList.toggle('is-on', y > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =========================================================
     2. mobile menu
     ========================================================= */
  var burger = $('#burger');
  var links = $('#navLinks');

  function setMenu(open) {
    links.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  $$('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* =========================================================
     3. split headings into words
     Walks text nodes only, so inline tags like <mark> survive
     and keep their highlight.
     ========================================================= */
  function splitWords(root) {
    var kids = Array.prototype.slice.call(root.childNodes);
    kids.forEach(function (node) {
      if (node.nodeType === 1) { splitWords(node); return; }
      if (node.nodeType !== 3 || !node.nodeValue.trim()) return;

      var frag = document.createDocumentFragment();
      /* keep the separators so spacing between words is untouched */
      node.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var w = document.createElement('span');
        w.className = 'w';
        var inner = document.createElement('i');
        inner.textContent = part;
        w.appendChild(inner);
        frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  var headings = $$('.words');
  headings.forEach(splitWords);

  /* stagger each word off its own index */
  headings.forEach(function (h) {
    $$('.w i', h).forEach(function (i, idx) {
      i.style.transitionDelay = (idx * 0.045).toFixed(3) + 's';
    });
  });

  /* =========================================================
     4. scroll reveal (cards + headings)
     ========================================================= */
  var revealables = $$('.reveal').concat(headings);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* =========================================================
     5. count-up stats
     ========================================================= */
  function countUp(el) {
    var to = parseFloat(el.dataset.to);
    var suffix = el.dataset.suffix || '';
    var dur = 1250;
    var t0 = null;
    if (to === 0) { el.textContent = '0' + suffix; return; }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = $$('.count');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(countUp);
  }

  /* =========================================================
     6. design switcher (the 5 app designs)
     ========================================================= */
  var DESIGNS = {
    aurora: {
      name: 'Aurora Glass',
      style: 'Frosted glass',
      desc: 'Soft aurora lighting and floating surfaces. Translucent panels let colour bleed through every layer of the interface.',
      exp: 'Soft aurora lighting, floating surfaces',
      best: 'Neon Purple · Cyber Neon'
    },
    social: {
      name: 'Social Classic',
      style: 'Familiar messenger',
      desc: 'Clean tabs and a comfortable classic layout. Everything sits exactly where your thumb already expects it.',
      exp: 'Clean tabs, comfortable classic layout',
      best: 'Ocean Blue · Pearl Light'
    },
    neon: {
      name: 'Neon Nights',
      style: 'Cyberpunk',
      desc: 'Dark surfaces with glowing futuristic details. Built for late nights and low light.',
      exp: 'Dark surfaces, glowing futuristic detail',
      best: 'Cyber Neon · Neon Purple'
    },
    paper: {
      name: 'Paper 2.0',
      style: 'Warm & tactile',
      desc: 'Notebook-inspired visuals and gentle surfaces. Conversations read like handwriting on a page.',
      exp: 'Notebook-inspired visuals, gentle surfaces',
      best: 'Emerald Mint · Sunset Ember'
    },
    hyper: {
      name: 'Hyper 3D',
      style: 'Playful & bold',
      desc: 'Depth, gradients and game-inspired energy. Every bubble has weight and every tap has bounce.',
      exp: 'Depth, gradients, game-inspired energy',
      best: 'Neon Purple · Sunset Ember'
    }
  };

  var dImg = $('#designImg');
  var dWrap = $('.switcher__phone');
  var tabs = $$('.tab');

  function pickDesign(key, tab) {
    var d = DESIGNS[key];
    if (!d || !dImg) return;

    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', String(on));
    });

    dWrap.classList.add('is-swapping');
    var next = new Image();
    next.src = 'assets/design-' + key + '.svg';

    var swap = function () {
      dImg.src = 'assets/design-' + key + '.svg';
      dImg.alt = d.name + ' design preview';
      $('#dName').textContent = d.name;
      $('#dStyle').textContent = d.style;
      $('#dDesc').textContent = d.desc;
      $('#dK1').textContent = d.style;
      $('#dK2').textContent = d.exp;
      $('#dK3').textContent = d.best;
      dWrap.classList.remove('is-swapping');
    };

    if (next.complete) setTimeout(swap, 160);
    else { next.onload = function () { setTimeout(swap, 160); }; next.onerror = swap; }
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { pickDesign(t.dataset.design, t); });
    t.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(t);
      /* the tab strip is horizontal here, but both axes are wired up so the
         keyboard behaves the same whichever arrows a visitor reaches for */
      var n = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? i + 1
            : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? i - 1 : -1;
      if (n < 0 || n >= tabs.length) return;
      e.preventDefault();
      tabs[n].focus();
      pickDesign(tabs[n].dataset.design, tabs[n]);
    });
  });

  /* preload the other four previews so switching feels instant */
  Object.keys(DESIGNS).forEach(function (k) {
    var pre = new Image(); pre.src = 'assets/design-' + k + '.svg';
  });

  /* =========================================================
     7. live theme recolour (6 color themes)
     ========================================================= */
  function lum(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    var c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }

  var themeBtns = $$('.theme');
  themeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      themeBtns.forEach(function (x) {
        x.classList.remove('is-on');
        x.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('is-on');
      b.setAttribute('aria-pressed', 'true');

      var c1 = b.dataset.c1;
      var c2 = b.dataset.c2;
      /* accents here sit on white paper and behind dark ink text, so a
         near-white theme colour would disappear — Pearl Light keeps its
         swatch but drives a readable slate accent instead */
      if (lum(c1) > 0.62) { c1 = '#9fb3c8'; c2 = '#64748b'; }

      var r = document.documentElement;
      r.style.setProperty('--acc', c1);
      r.style.setProperty('--acc2', c2);
    });
  });

  /* =========================================================
     8. voice-note player with live waveform
     ========================================================= */
  var audio = $('#vnAudio');
  var wave = $('#vnWave');
  var playBtn = $('#vnPlay');
  var timeEl = $('#vnTime');
  var BARS = 42;

  if (wave) {
    for (var i = 0; i < BARS; i++) {
      var b = document.createElement('b');
      /* deterministic pseudo-waveform so it looks like real audio */
      var h = 6 + Math.abs(Math.sin(i * 0.62) * Math.cos(i * 0.21)) * 26;
      b.style.height = h.toFixed(1) + 'px';
      wave.appendChild(b);
    }
  }
  var bars = wave ? $$('b', wave) : [];

  function fmt(s) {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  if (playBtn && audio) {
    playBtn.addEventListener('click', function () {
      if (audio.paused) { audio.play().catch(function () {}); }
      else { audio.pause(); }
    });

    audio.addEventListener('timeupdate', function () {
      var p = audio.duration ? audio.currentTime / audio.duration : 0;
      var upto = Math.floor(p * BARS);
      bars.forEach(function (bar, idx) { bar.classList.toggle('on', idx <= upto); });
      timeEl.textContent = fmt(audio.currentTime);
    });

    audio.addEventListener('ended', function () {
      bars.forEach(function (bar) { bar.classList.remove('on'); });
      timeEl.textContent = '0:00';
    });
  }

  /* =========================================================
     9. notification sound preview
     ========================================================= */
  var ding = $('#dingAudio');
  var dingBtn = $('#dingBtn');
  if (dingBtn && ding) {
    dingBtn.addEventListener('click', function () {
      ding.currentTime = 0;
      ding.play().catch(function () {});
    });
  }

  /* =========================================================
     10. text-size control demo
     ========================================================= */
  var sizeBtns = $$('.size-btn');
  var sizeDemo = $('#sizeDemo');
  sizeBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      sizeBtns.forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      if (sizeDemo) sizeDemo.dataset.size = b.dataset.size;
    });
  });

  /* =========================================================
     11. support form
     ========================================================= */
  var form = $('#supportForm');
  var note = $('#formNote');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;

      $$('.field', form).forEach(function (f) {
        var input = $('input, select, textarea', f);
        if (!input) return;
        var bad = !input.value.trim() ||
                  (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value));
        f.classList.toggle('is-bad', bad);
        if (bad && ok) { input.focus(); ok = false; }
      });

      if (!ok) {
        note.textContent = 'Please fill every field with a valid value.';
        note.classList.add('is-bad');
        return;
      }

      note.classList.remove('is-bad');
      var data = {
        name: $('#fName').value.trim(),
        email: $('#fMail').value.trim(),
        subject: $('#fSubject').value,
        message: $('#fMsg').value.trim()
      };

      if (window.emailjs) {
        note.textContent = 'Sending…';
        var submitBtn = $('button[type="submit"]', form);
        if (submitBtn) submitBtn.disabled = true;

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          title: '[ChatSwift] ' + data.subject,
          name: data.name,
          email: data.email,
          message: data.message,
          to_email: SUPPORT_EMAIL
        }).then(function () {
          form.reset();
          note.textContent = 'Thanks — your message is on its way.';
        }).catch(function () {
          note.textContent = 'Could not send right now. Please email ' + SUPPORT_EMAIL + '.';
          note.classList.add('is-bad');
        }).finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
        return;
      }

      /* EmailJS not loaded (e.g. blocked script) → hand off to the visitor's mail app */
      var body = 'Name: ' + data.name + '\nEmail: ' + data.email + '\n\n' + data.message;
      window.location.href = 'mailto:' + SUPPORT_EMAIL +
        '?subject=' + encodeURIComponent('[ChatSwift] ' + data.subject) +
        '&body=' + encodeURIComponent(body);
      note.textContent = 'Opening your mail app…';
    });

    $$('.field input, .field select, .field textarea', form).forEach(function (el) {
      el.addEventListener('input', function () {
        el.closest('.field').classList.remove('is-bad');
      });
    });
  }

  /* =========================================================
     12. footer year
     ========================================================= */
  var yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
