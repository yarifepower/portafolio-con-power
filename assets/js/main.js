/* Yarife Power · Portafolio — interacciones (sin dependencias) */
(() => {
  'use strict';

  // ---- Configuración de contacto ----
  const CONTACT = {
    whatsapp: '584242429016',
    email: 'yarifepower@gmail.com',
  };

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Año del pie de página ----
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // ---- Menú móvil ----
  const toggle = $('.nav__toggle');
  const menu = $('#menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr').textContent = open ? 'Cerrar menú' : 'Abrir menú';
    menu.hidden = !open;
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });

  // ---- Nav: se esconde al bajar, aparece al subir ----
  const nav = $('#nav');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && menu.hidden);
    lastY = y;
  }, { passive: true });

  // ---- Aparición al hacer scroll (con pequeño escalonado por grupo) ----
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealIO.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('[data-reveal]').forEach((el) => {
    const siblings = $$(':scope > [data-reveal]', el.parentElement);
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--d', `${Math.min(i, 6) * 0.07}s`);
    revealIO.observe(el);
  });

  // ---- Medidor de Power + enlace activo del menú ----
  const sections = $$('main > section');
  const cases = $$('.case');
  const meter = $('.meter');
  const meterNum = $('.meter__num');
  const meterName = $('.meter__name');
  const navLinks = $$('.nav__links a');

  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const sec = entry.target;
      const id = sec.classList.contains('case') ? 'proyectos' : sec.id;
      navLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === `#${id}`)));
      if (sec.classList.contains('case')) {
        meterNum.textContent = `${sec.dataset.num}/${String(cases.length).padStart(2, '0')}`;
        meterName.textContent = sec.dataset.name;
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  sections.forEach((s) => sectionIO.observe(s));

  const updateMeter = () => {
    if (!cases.length) return;
    const first = cases[0].getBoundingClientRect();
    const last = cases[cases.length - 1].getBoundingClientRect();
    const mid = innerHeight / 2;
    const inside = first.top < mid && last.bottom > mid;
    meter.classList.toggle('is-on', inside);
    if (inside) {
      const total = last.bottom - first.top;
      meter.style.setProperty('--p', Math.min(1, Math.max(0, (mid - first.top) / total)).toFixed(3));
    }
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateMeter(); ticking = false; });
  }, { passive: true });
  updateMeter();

  // ---- Vista previa flotante en el índice de proyectos ----
  const preview = $('.preview');
  const previewImg = preview && $('img', preview);
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (preview && finePointer && !reduced) {
    let px = 0, py = 0, raf = 0;
    const move = () => { preview.style.left = `${px}px`; preview.style.top = `${py}px`; raf = 0; };
    $$('.index__list a').forEach((a) => {
      const pre = new Image();
      a.addEventListener('mouseenter', () => {
        if (!pre.src) pre.src = a.dataset.preview;
        previewImg.src = a.dataset.preview;
        preview.classList.add('is-on');
      });
      a.addEventListener('mouseleave', () => preview.classList.remove('is-on'));
      a.addEventListener('mousemove', (e) => {
        px = e.clientX + 170; py = e.clientY;
        if (!raf) raf = requestAnimationFrame(move);
      });
    });
  }

  // ---- Visor de imágenes ----
  const lb = $('.lightbox');
  const lbImg = $('img', lb);
  const lbCap = $('figcaption', lb);
  let group = [];
  let current = 0;
  let lastFocus = null;

  const show = (i) => {
    current = (i + group.length) % group.length;
    const link = group[current];
    const img = $('img', link);
    lbImg.src = link.href;
    lbImg.alt = img.alt;
    const cap = link.closest('figure')?.querySelector('figcaption');
    lbCap.textContent = cap ? cap.textContent.trim() : img.alt;
  };
  const open = (link) => {
    const scope = link.closest('.case') || document;
    group = $$('.zoom', scope);
    lastFocus = link;
    show(group.indexOf(link));
    lb.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    $('.lightbox__close', lb).focus();
  };
  const close = () => {
    lb.hidden = true;
    lbImg.removeAttribute('src');
    document.documentElement.style.overflow = '';
    lastFocus?.focus();
  };
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a.zoom');
    if (!link) return;
    e.preventDefault();
    open(link);
  });
  $('.lightbox__close', lb).addEventListener('click', close);
  $('.lightbox__prev', lb).addEventListener('click', () => show(current - 1));
  $('.lightbox__next', lb).addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'Tab') { // mantener el foco dentro del visor
      const f = $$('button', lb);
      const idx = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  // ---- Notificación «Postergar / Empezar» ----
  const notif = $('.notif');
  const notifMsg = $('.notif__msg');
  const laterLines = [
    'Tu Power no se posterga. ¿Empezamos?',
    'Mmm… «algún día» no está en el calendario.',
    'Ok, ok. Pero el botón de la derecha te está esperando.',
  ];
  let later = 0;
  notif.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'later') {
      notifMsg.textContent = laterLines[later++ % laterLines.length];
      notif.classList.remove('is-shake');
      void notif.offsetWidth;
      notif.classList.add('is-shake');
    } else {
      notifMsg.textContent = '¡Eso! Cuéntame de tu marca en el formulario.';
      $('#form').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      setTimeout(() => $('#form [name="nombre"]').focus({ preventScroll: true }), reduced ? 0 : 600);
    }
  });

  // ---- Copiar correo ----
  $$('.copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = '¡Copiado!';
        btn.classList.add('is-done');
        setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('is-done'); }, 2200);
      } catch {
        location.href = `mailto:${btn.dataset.copy}`;
      }
    });
  });

  // ---- Formulario: arma el mensaje y lo abre en WhatsApp o en el correo ----
  const form = $('#form');
  const error = $('.form__error', form);
  let via = 'whatsapp';
  $$('button[type="submit"]', form).forEach((b) => b.addEventListener('click', () => { via = b.dataset.via; }));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nombre = (data.get('nombre') || '').trim();
    const marca = (data.get('marca') || '').trim();
    const mensaje = (data.get('mensaje') || '').trim();
    const servicios = data.getAll('servicio');

    $$('.is-invalid', form).forEach((el) => el.classList.remove('is-invalid'));
    const missing = [];
    if (!nombre) missing.push(form.elements.nombre);
    if (!mensaje) missing.push(form.elements.mensaje);
    if (missing.length) {
      missing.forEach((el) => el.classList.add('is-invalid'));
      error.textContent = !nombre && !mensaje
        ? 'Me falta tu nombre y un poquito de contexto para poder ayudarte.'
        : !nombre
          ? 'Me falta tu nombre para saludarte como se debe.'
          : 'Cuéntame un poquito de tu proyecto para poder ayudarte.';
      error.hidden = false;
      missing[0].focus();
      return;
    }
    error.hidden = true;

    const lines = [
      `¡Hola, Yarife! Soy ${nombre}${marca ? `, de ${marca}` : ''}.`,
      servicios.length ? `Me interesa: ${servicios.join(', ')}.` : '',
      '',
      mensaje,
    ].filter((l, i) => l || i === 2);
    const text = lines.join('\n');

    if (via === 'email') {
      const subject = `Quiero desatar el Power de ${marca || 'mi marca'}`;
      location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    } else {
      window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    }
  });
})();
