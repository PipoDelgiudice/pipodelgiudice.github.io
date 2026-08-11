(function () {
  'use strict';

  // --- Forzar arranque desde el Capítulo I ---
  // Sin esto, el browser puede restaurar el scroll anterior y Cami arrancaría
  // en la mitad de la historia. En una propuesta eso no puede pasar.
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // Respeto por quienes prefieren menos movimiento (accesibilidad / mareos)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Fade-in de fotos ---
  // Las fotos arrancan con opacity:0 (CSS) y aparecen suave al terminar de cargar.
  // Así no se ve el "hueco" ni el salto feo cuando entra la imagen.
  function fadeInImages() {
    document.querySelectorAll('img').forEach((img) => {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        // Si una foto falla al cargar, no la dejamos invisible para siempre
        img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
      }
    });
  }
  fadeInImages();
  // Red de seguridad: pase lo que pase, a los 3s toda foto se muestra
  setTimeout(() => {
    document.querySelectorAll('img:not(.loaded)').forEach((img) => img.classList.add('loaded'));
  }, 3000);

  // --- Loading Screen ---
  // El splash espera a que las FUENTES estén listas antes de revelar la primera
  // pantalla — así el título ya aparece en Playfair, sin el "salto" de fuente.
  // Con un piso de 1.2s (para que el splash se aprecie) y un techo de 4s (nunca cuelga).
  const loadingScreen = document.querySelector('.loading-screen');
  let splashDone = false;

  function hideSplash() {
    if (splashDone || !loadingScreen) return;
    splashDone = true;
    window.scrollTo(0, 0);
    loadingScreen.classList.add('hidden');
    setTimeout(() => loadingScreen.remove(), 1000);
  }

  const splashStart = Date.now();
  function tryHideSplash() {
    const elapsed = Date.now() - splashStart;
    const wait = Math.max(0, 1200 - elapsed); // piso de 1.2s
    setTimeout(hideSplash, wait);
  }

  // Esperamos: fuentes listas + window load. Lo que llegue, con techo de 4s.
  const fontsReady = document.fonts && document.fonts.ready
    ? document.fonts.ready
    : Promise.resolve();

  Promise.all([
    fontsReady,
    new Promise((res) => {
      if (document.readyState === 'complete') res();
      else window.addEventListener('load', res, { once: true });
    }),
  ]).then(tryHideSplash);

  // Techo de seguridad: pase lo que pase, el splash se va a los 4s
  setTimeout(hideSplash, 4000);

  // --- Intersection Observer for scroll reveals ---
  const observerOptions = {
    // threshold bajo: con que asome un cachito del capítulo alcanza para revelar.
    // Con 0.2 los capítulos MÁS ALTOS que la pantalla (ej: Las Aventuras) nunca
    // llegaban al 20% visible y quedaban invisibles ("una línea nomás").
    threshold: 0.05,
    rootMargin: '0px 0px -10% 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate children too
        const children = entry.target.querySelectorAll(
          '.chapter-number, .chapter-title, .chapter-subtitle, .chapter-text, ' +
          '.polaroid, .timeline-item, .letter, .proposal-name, .proposal-text, ' +
          '.memory-grid .polaroid'
        );
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('visible'), i * 150);
        });
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('.chapter, .proposal-section').forEach((el) => {
    observer.observe(el);
  });

  // Also observe individual elements that might be outside sections
  document.querySelectorAll(
    '.polaroid, .timeline-item, .letter, .chapter-number, .chapter-title, ' +
    '.chapter-subtitle, .chapter-text, .proposal-name, .proposal-text'
  ).forEach((el) => {
    if (!el.closest('.chapter') && !el.closest('.proposal-section')) {
      observer.observe(el);
    }
  });

  // --- Safety net (reforzado) ---
  // El contenido arranca con opacity:0 y se revela con .visible. Si el observer
  // no dispara para algún capítulo (pasa con capítulos MÁS ALTOS que la pantalla),
  // ese capítulo quedaría invisible ("una línea nomás"). Esto lo evita SIEMPRE.
  function revealAll(scope) {
    (scope || document).querySelectorAll(
      '.chapter, .proposal-section, .chapter-number, .chapter-title, ' +
      '.chapter-subtitle, .chapter-text, .polaroid, .timeline-item, .letter, ' +
      '.proposal-name, .proposal-text'
    ).forEach((el) => el.classList.add('visible'));
  }

  if (!('IntersectionObserver' in window)) {
    revealAll(document);
  } else {
    // Fallback por scroll: cualquier capítulo cuyo TOP ya pasó el borde inferior
    // de la pantalla se revela sí o sí, aunque el observer no lo haya tocado.
    function revealOnScroll() {
      const vh = window.innerHeight;
      document.querySelectorAll('.chapter, .proposal-section').forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < vh * 0.9 && rect.bottom > 0) {
          sec.classList.add('visible');
          sec.querySelectorAll(
            '.chapter-number, .chapter-title, .chapter-subtitle, .chapter-text, ' +
            '.polaroid, .timeline-item, .letter, .proposal-name, .proposal-text'
          ).forEach((el) => el.classList.add('visible'));
        }
      });
    }
    window.addEventListener('scroll', revealOnScroll, { passive: true });
    // Corremos una vez al cargar para revelar lo que ya está en pantalla.
    setTimeout(revealOnScroll, 300);
    // Red final absoluta: a los 4s, todo visible pase lo que pase.
    setTimeout(() => revealAll(document), 4000);
  }

  // --- Parallax effect on backgrounds (solo desktop) ---
  const parallaxBgs = document.querySelectorAll('.chapter-bg');
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!isMobile) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxBgs.forEach((bg) => {
        const speed = 0.3;
        const rect = bg.parentElement.getBoundingClientRect();
        const offset = rect.top * speed;
        bg.style.transform = `translateY(${offset}px) scale(1.1)`;
      });
    });
  }

  // --- Nav dots ---
  const sections = document.querySelectorAll('.chapter, .proposal-section');
  const navDots = document.querySelectorAll('.nav-dot');

  const updateActiveDot = () => {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    let activeIndex = 0;

    sections.forEach((section, i) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        activeIndex = i;
      }
    });

    navDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  };

  window.addEventListener('scroll', updateActiveDot, { passive: true });
  window.addEventListener('resize', updateActiveDot);

  // Nav dot click - smooth scroll
  navDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      sections[index].scrollIntoView({ behavior: 'smooth' });
    });
  });

  // --- Header scroll effect ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 100);
  });

  // --- Progress bar ---
  const progressBar = document.querySelector('.progress-bar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  });

  // --- Floating hearts ---
  function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-float';
    heart.textContent = '♥';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    heart.style.animationDuration = (Math.random() * 6 + 6) + 's';
    heart.style.animationDelay = (Math.random() * 5) + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 15000);
  }

  if (!reduceMotion) {
    for (let i = 0; i < 10; i++) {
      setTimeout(createHeart, i * 2000);
    }
    setInterval(createHeart, 4000);
  }

  // --- Floating hearts (for final proposal section) ---
  let heartsInterval = null;

  function startHearts() {
    if (heartsInterval) return;
    heartsInterval = setInterval(() => {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = Math.random() > 0.5 ? '♥' : '💕';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
      heart.style.opacity = Math.random() * 0.4 + 0.3;
      heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 12000);
    }, 150);
  }

  function stopHearts() {
    if (heartsInterval) {
      clearInterval(heartsInterval);
      heartsInterval = null;
    }
    document.querySelectorAll('.floating-heart').forEach((el) => el.remove());
  }

  // Detect when proposal section is visible
  const proposalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startHearts();
        } else {
          stopHearts();
        }
      });
    },
    { threshold: 0.1 }
  );

  const proposalSection = document.querySelector('.proposal-section');
  if (proposalSection) {
    proposalObserver.observe(proposalSection);
  }

  // --- Reproductor de música (MP3 real) ---
  // La canción vive en assets/audio/cancion.mp3 — reemplazala por la de ustedes.
  const musicToggle = document.querySelector('.music-toggle');
  const bgMusic = document.getElementById('bg-music');
  let isPlaying = false;

  function setMusicUI(playing) {
    isPlaying = playing;
    musicToggle.textContent = playing ? '♫' : '♪';
    musicToggle.style.color = playing ? '#e8a0b4' : '#d4a853';
    musicToggle.setAttribute(
      'aria-label',
      playing ? 'Pausar música' : 'Reproducir música'
    );
  }

  if (bgMusic) {
    bgMusic.volume = 0.6;

    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        bgMusic.pause();
        setMusicUI(false);
      } else {
        // play() devuelve promesa: si el navegador la bloquea, no rompemos nada
        bgMusic.play().then(() => setMusicUI(true)).catch(() => {
          setMusicUI(false);
        });
      }
    });

    // Si el audio termina o se pausa por fuera, sincronizamos el botón
    bgMusic.addEventListener('pause', () => setMusicUI(false));
    bgMusic.addEventListener('play', () => setMusicUI(true));
  }

  // --- Nieve en la propuesta final ---
  // La spec pedía nieve navideña en la sección final. Acá está.
  let snowInterval = null;
  const proposalForSnow = document.querySelector('.proposal-section');

  function createSnowflake() {
    const flake = document.createElement('div');
    flake.className = 'snowflake';
    flake.textContent = Math.random() > 0.5 ? '❄' : '❅';
    flake.style.left = Math.random() * 100 + '%';
    flake.style.fontSize = (Math.random() * 0.8 + 0.6) + 'rem';
    flake.style.opacity = Math.random() * 0.6 + 0.3;
    flake.style.animationDuration = (Math.random() * 6 + 6) + 's';
    document.body.appendChild(flake);
    setTimeout(() => flake.remove(), 12000);
  }

  function startSnow() {
    if (snowInterval || reduceMotion) return;
    snowInterval = setInterval(createSnowflake, 300);
  }

  function stopSnow() {
    if (snowInterval) {
      clearInterval(snowInterval);
      snowInterval = null;
    }
    document.querySelectorAll('.snowflake').forEach((el) => el.remove());
  }

  if (proposalForSnow) {
    const snowObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startSnow();
          else stopSnow();
        });
      },
      { threshold: 0.1 }
    );
    snowObserver.observe(proposalForSnow);
  }

  // --- Momento final: botón "Sí, quiero" ---
  const btnYes = document.querySelector('.btn-yes');
  const celebration = document.querySelector('.celebration');

  function launchConfetti() {
    if (reduceMotion) return;
    const emojis = ['💕', '💖', '🌸', '💍', '✨', '🤍', '💐'];
    const total = 80;
    for (let i = 0; i < total; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      piece.style.left = Math.random() * 100 + '%';
      piece.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
      piece.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
      piece.style.animationDelay = (Math.random() * 0.6) + 's';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  }

  if (btnYes && celebration) {
    btnYes.addEventListener('click', () => {
      // Feedback táctil: un latido de vibración en el momento clave
      if (navigator.vibrate) {
        navigator.vibrate([40, 60, 120]);
      }
      celebration.classList.add('active');
      celebration.setAttribute('aria-hidden', 'false');
      launchConfetti();
      // Otra tanda de confeti para que dure la fiesta
      setTimeout(launchConfetti, 1200);
      setTimeout(launchConfetti, 2400);
    });
  }

  // --- Cartas interactivas: revelar al tocar ---
  // Cada carta empieza "cerrada" y se abre al primer tap, sumando expectativa.
  document.querySelectorAll('.letter').forEach((letter) => {
    letter.classList.add('letter-closed');
    const open = () => {
      letter.classList.remove('letter-closed');
      letter.classList.add('letter-open');
    };
    letter.addEventListener('click', open, { once: true });
    // Si alguien no la toca pero la deja visible un rato, se abre sola
    const letterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (letter.classList.contains('letter-closed')) open();
          }, 2500);
        }
      });
    }, { threshold: 0.5 });
    letterObserver.observe(letter);
  });

  // --- Keyboard navigation ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const active = document.querySelector('.nav-dot.active');
      const next = active?.nextElementSibling;
      if (next) next.click();
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const active = document.querySelector('.nav-dot.active');
      const prev = active?.previousElementSibling;
      if (prev) prev.click();
    }
  });

  // --- Touch swipe (solo en desktop / flicks rápidos sin scroll) ---
  let touchStartY = 0;
  let touchMoved = false;
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchMoved = false;
  }, { passive: true });

  document.addEventListener('touchmove', () => {
    touchMoved = true;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (touchMoved) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    const active = document.querySelector('.nav-dot.active');
    if (Math.abs(diff) > 50) {
      if (diff > 0 && active?.nextElementSibling) {
        active.nextElementSibling.click();
      } else if (diff < 0 && active?.previousElementSibling) {
        active.previousElementSibling.click();
      }
    }
  }, { passive: true });

})();
