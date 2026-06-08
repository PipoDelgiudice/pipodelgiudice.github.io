(function () {
  'use strict';

  // --- Loading Screen ---
  const loadingScreen = document.querySelector('.loading-screen');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => loadingScreen.remove(), 1000);
    }, 1500);
  });

  // --- Intersection Observer for scroll reveals ---
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
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

  // --- Parallax effect on backgrounds ---
  const parallaxBgs = document.querySelectorAll('.chapter-bg');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxBgs.forEach((bg) => {
      const speed = 0.3;
      const rect = bg.parentElement.getBoundingClientRect();
      const offset = rect.top * speed;
      bg.style.transform = `translateY(${offset}px) scale(1.1)`;
    });
  });

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

  for (let i = 0; i < 10; i++) {
    setTimeout(createHeart, i * 2000);
  }
  setInterval(createHeart, 4000);

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

  // --- Music player ---
  const musicToggle = document.querySelector('.music-toggle');
  let audioContext = null;
  let isPlaying = false;

  // We'll use Web Audio API to generate a simple melody
  // This way no external audio file is needed, but user can replace with their own
  function initAudio() {
    if (audioContext) return;
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  musicToggle.addEventListener('click', () => {
    initAudio();
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });

  function playNote(freq, duration, startTime) {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  let musicTimeout = null;
  let musicStartedAt = 0;

  function startMusic() {
    if (isPlaying) return;
    isPlaying = true;
    musicToggle.textContent = '♫';
    musicToggle.style.color = '#e8a0b4';
    musicStartedAt = audioContext.currentTime;

    // Simple melody loop
    function playMelody() {
      if (!isPlaying) return;
      const now = audioContext.currentTime;
      // Canon in D progression simplified
      const notes = [
        { f: 293.66, d: 0.4 }, // D4
        { f: 349.23, d: 0.4 }, // F4
        { f: 440.00, d: 0.4 }, // A4
        { f: 369.99, d: 0.4 }, // F#4
        { f: 293.66, d: 0.4 }, // D4
        { f: 349.23, d: 0.4 }, // F4
        { f: 440.00, d: 0.4 }, // A4
        { f: 369.99, d: 0.4 }, // F#4
        { f: 261.63, d: 0.4 }, // C4
        { f: 329.63, d: 0.4 }, // E4
        { f: 392.00, d: 0.4 }, // G4
        { f: 349.23, d: 0.4 }, // F4
        { f: 246.94, d: 0.4 }, // B3
        { f: 311.13, d: 0.4 }, // D#4
        { f: 369.99, d: 0.8 }, // F#4
      ];

      notes.forEach((note, i) => {
        playNote(note.f, note.d, now + i * 0.5);
      });

      musicTimeout = setTimeout(playMelody, notes.length * 500 + 2000);
    }

    playMelody();
  }

  function stopMusic() {
    isPlaying = false;
    musicToggle.textContent = '♪';
    musicToggle.style.color = '#d4a853';
    if (musicTimeout) {
      clearTimeout(musicTimeout);
      musicTimeout = null;
    }
  }

  // --- Auto carousel (travels chapter) ---
  const carousel = document.getElementById('travel-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const slides = track.querySelectorAll('.polaroid');
    let currentSlide = 0;
    let carouselInterval = null;
    const intervalTime = 4000;

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function startCarousel() {
      stopCarousel();
      carouselInterval = setInterval(nextSlide, intervalTime);
    }

    function stopCarousel() {
      if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
      }
    }

    // Dot clicks
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        stopCarousel();
        goToSlide(parseInt(dot.dataset.slide));
        startCarousel();
      });
    });

    // Pause on hover/touch
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
    carousel.addEventListener('touchstart', stopCarousel, { passive: true });
    carousel.addEventListener('touchend', startCarousel, { passive: true });

    // Start only when visible (IntersectionObserver)
    const carouselObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCarousel();
          } else {
            stopCarousel();
          }
        });
      },
      { threshold: 0.3 }
    );
    carouselObserver.observe(carousel);
  }

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

  // --- Touch swipe ---
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
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
