// ===========================
// PARTICLE SYSTEM
// ===========================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

let particles = [];
let connections = [];
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

    // subtle mouse repulsion
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
// TYPEWRITER EFFECT
// ===========================
const phrases = [
  'Aspiring Engineer',
  'Accessible Tech Builder',
  'Basketball Player',
  'Hardware Builder',
  'Problem Solver',
  'Sonoma County, CA',
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
let pauseTimer = null;
const typeEl = document.getElementById('typewriter');

function typewrite() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typeEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      pauseTimer = setTimeout(typewrite, 2000);
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typewrite, deleting ? 45 : 90);
}

setTimeout(typewrite, 1600);

// ===========================
// SCROLL ANIMATIONS
// ===========================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

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
// ACTIVE NAV LINK
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--cyan)';
    }
  });
});

// ===========================
// PROJECT LINK PLACEHOLDER
// ===========================
document.getElementById('plotter-link').addEventListener('click', function(e) {
  const href = this.getAttribute('href');
  if (!href || href === '#') {
    e.preventDefault();
    // Ripple effect on click
    const card = document.getElementById('project-plotter');
    card.style.boxShadow = '0 0 0 2px var(--cyan), 0 20px 60px rgba(0,245,255,0.2)';
    setTimeout(() => {
      card.style.boxShadow = '';
    }, 600);
  }
});

// ===========================
// EV PROJECT CARD — WHOLE CARD NAVIGATES
// ===========================
document.getElementById('project-ev').addEventListener('click', function (e) {
  if (e.target.closest('#ev-link')) return;
  window.location.href = 'charger.html';
});

// ===========================
// READ MORE TOGGLE
// ===========================
document.querySelectorAll('.read-more-btn').forEach(btn => {
  const content = document.getElementById(btn.getAttribute('aria-controls'));
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    btn.classList.toggle('open');
    content.classList.toggle('open');
  });
});

// ===========================
// STAGGER PROJECT CARDS
// ===========================
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.setProperty('--i', i);
  card.style.transitionDelay = `${i * 0.1}s`;
});
