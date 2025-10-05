
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

let shockwave = {
  active: false,
  radius: 0,
  opacity: 0,
  x: 0,
  y: 0
};

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

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;

    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < interactionRadius && !hasExploded) {
      const force = (interactionRadius - dist) / interactionRadius;
      this.vx += (dx / dist) * force * -0.4;
      this.vy += (dy / dist) * force * -0.4;
    }

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
  for (let p of particles) {
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
    const force = 10 / dist;
    p.vx += (dx / dist) * force;
    p.vy += (dy / dist) * force;
  }

  shockwave.active = true;
  shockwave.radius = 0;
  shockwave.opacity = 0.8;
  shockwave.x = mouse.x;
  shockwave.y = mouse.y;
}

function drawShockwave() {
  if (!shockwave.active) return;

  ctx.beginPath();
  ctx.arc(shockwave.x, shockwave.y, shockwave.radius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(0, 255, 255, ${shockwave.opacity})`;
  ctx.lineWidth = 2;
  ctx.stroke();

  shockwave.radius += 8;
  shockwave.opacity *= 0.95;

  if (shockwave.opacity < 0.05) {
    shockwave.active = false;
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(15, 15, 15, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const now = Date.now();
  if (now - lastMoveTime > 1000 && !hasExploded) {
    explodeParticles();
    hasExploded = true;
  }

  drawShockwave();

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
  hasExploded = false;
});

initParticles();
animate();



// --- Project img slides ---
let slideId = ["ProjectMakerAI", "FinanceTracker", "Portfolio"];
let slidesIndex = new Array(slideId.length).fill(0); 

for (let i = 0; i < slideId.length; i++) {
  showSlides(0, i);
}

slideId.forEach((_, i) => {
  setInterval(() => {
    plusSlides(1, i);
  }, 7000);
});

function plusSlides(n, no) {
  slidesIndex[no] += n;
  showSlides(slidesIndex[no], no);
}

function showSlides(n, no) {
  let slides = document.getElementsByClassName(slideId[no]);
  if (slides.length === 0) return;

  if (n >= slides.length) slidesIndex[no] = 0;
  if (n < 0) slidesIndex[no] = slides.length - 1;

  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
  }

  slides[slidesIndex[no]].classList.add("active");
}



// --- Contact --- 
const form = document.getElementById('contactForm');
const statusText = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusText.textContent = "Sending...";

    const payload = {
        name: form.name.value,
        email: form.email.value,
        message: form.message.value
    };

    try {
        const res = await fetch('/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            statusText.textContent = "Message sent successfully!";
            form.requestFullscreen();
        } else {
            statusText.textContent = (data.error || "Failed to send.");
        }
    } catch (err) {
        statusText.textContent = "Network error. Try again later";
    }
});