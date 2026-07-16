// ===========================
// PARTICLE SYSTEM (shared visual language with homepage)
// ===========================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particles = [];
let mouseX = 0, mouseY = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.radius = Math.random() * 1.5 + 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.7 ? '#00f5ff' : '#0066ff';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      this.x += (dx / dist) * 0.6;
      this.y += (dy / dist) * 0.6;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function initParticles() {
  const count = Math.floor((canvas.width * canvas.height) / 14000);
  particles = Array.from({ length: Math.min(count, 90) }, () => new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 140) {
        const alpha = (1 - dist / 140) * 0.18;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ===========================
// SCROLL FADE-IN
// ===========================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(2, 10, 20, 0.95)';
    navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
  } else {
    navbar.style.background = 'rgba(2, 10, 20, 0.7)';
    navbar.style.boxShadow = 'none';
  }
});

// ===========================
// PHOTO LIGHTBOX
// ===========================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.gallery-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const img = thumb.querySelector('img');
    openLightbox(img.src, img.alt);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

// ===========================
// BUILD GALLERY CAROUSEL
// ===========================
const carousel = document.getElementById('build-carousel');

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const tabs = Array.from(carousel.querySelectorAll('.carousel-tab'));
  const total = slides.length;
  const currentEl = document.getElementById('carousel-current');
  const totalEl = document.getElementById('carousel-total');
  const fill = document.getElementById('carousel-progress-fill');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  let currentIndex = 0;
  let autoplayEnabled = true;

  totalEl.textContent = String(total).padStart(2, '0');

  function restartProgress() {
    fill.style.animationPlayState = '';
    fill.classList.remove('running');
    void fill.offsetWidth; // force reflow to restart the CSS animation
    fill.classList.add('running');
  }

  function goToSlide(index) {
    index = (index + total) % total;
    slides[currentIndex].classList.remove('is-active', 'is-entering');
    tabs[currentIndex].classList.remove('is-active');
    currentIndex = index;
    slides[currentIndex].classList.add('is-active', 'is-entering');
    tabs[currentIndex].classList.add('is-active');
    currentEl.textContent = String(currentIndex + 1).padStart(2, '0');
    setTimeout(() => slides[currentIndex].classList.remove('is-entering'), 500);
    restartProgress();
  }

  function manualGo(index) {
    autoplayEnabled = false;
    goToSlide(index);
  }

  prevBtn.addEventListener('click', () => manualGo(currentIndex - 1));
  nextBtn.addEventListener('click', () => manualGo(currentIndex + 1));
  tabs.forEach((tab, i) => tab.addEventListener('click', () => manualGo(i)));

  fill.addEventListener('animationend', () => {
    if (autoplayEnabled) goToSlide(currentIndex + 1);
  });

  carousel.addEventListener('mouseenter', () => { fill.style.animationPlayState = 'paused'; });
  carousel.addEventListener('mouseleave', () => { fill.style.animationPlayState = 'running'; });

  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) manualGo(currentIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    const rect = carousel.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft') manualGo(currentIndex - 1);
    if (e.key === 'ArrowRight') manualGo(currentIndex + 1);
  });

  restartProgress();
}
