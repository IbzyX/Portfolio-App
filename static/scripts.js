
// --- Navbar highlight --- 
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
let current = '';

sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
    current = section.getAttribute('id');
    }
});

navLinks.forEach(link => {
    link.classList.remove('nav-link-active');
    if (link.getAttribute('href') === `#${current}`) {
    link.classList.add('nav-link-active');
    }
});
});


// --- Home section Background (Fluid canvas) ---
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let lastMoveTime = Date.now();
let hasExploded = false;

const particleCount = 1200;
const interactionRadius = 300;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Particle {
  constructor() {
    this.x = random(0, canvas.width);
    this.y = random(0, canvas.height);
    this.vx = random(-0.3, 0.3);
    this.vy = random(-0.3, 0.3);
    this.size = random(1, 3);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around screen edges
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;

    // Repel slightly from mouse while it's moving
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < interactionRadius && !hasExploded) {
      const force = (interactionRadius - dist) / interactionRadius;
      this.vx += (dx / dist) * force * -0.4;
      this.vy += (dy / dist) * force * -0.4;
    }

    // Smooth slowdown
    this.vx *= 0.98;
    this.vy *= 0.98;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 255, 255, 0.7)";
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function explodeParticles() {
  // Give every particle a push outward from the mouse
  for (let p of particles) {
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
    const force = 7 / dist; // stronger force near the mouse
    p.vx += (dx / dist) * force;
    p.vy += (dy / dist) * force;
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(15, 15, 15, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Detect idle state
  const now = Date.now();
  if (now - lastMoveTime > 1000 && !hasExploded) {
    explodeParticles();
    hasExploded = true;
  }

  particles.forEach((p) => {
    p.move();
    p.draw();
  });

  requestAnimationFrame(animate);
}

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  lastMoveTime = Date.now();
  hasExploded = false; // reset explosion trigger
});

initParticles();
animate();
