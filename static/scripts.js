
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

const particleCount = 1400;
const interactionRadius = 350;

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
    const force = 12 / dist;
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
  if (now - lastMoveTime > 1500 && !hasExploded) {
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





// --- Project learn more --- 
const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close');

const projectData = {
  projectMakerAI: {
    title: "Project Maker AI",
    description: `
    <p>Project Maker AI is an AI-powered web application designed to automate and accelerate the early stages of project planning. The application was built using a full-stack Flask architecture and integrates OpenAI’s GPT-3.5 model to generate structured project scaffolding from simple user prompts. This includes intelligently generated project requirements, timelines, and task breakdowns to help individuals and teams get started faster.</p>
    <p>The backend is powered by Python and Flask, with user authentication and a PostgreSQL database handling via Supabase, which also hosts the stored user-generated project plans. The application supports real-time user interactions for a smooth experience, and is deployed on Render for scalable, cloud-native hosting.</p>
    <p>By combining AI generation with persistent user data and interactive design, Project Maker AI serves as a productivity tool for developers, product managers, and entrepreneurs looking to reduce the overhead of initial planning. The project emphasizes practical AI integration, secure backend infrastructure, and deployable, full-stack architecture in a real-world use case.</p>
    <h3>Key Features:</h3>
      <ul>
        <li> - AI generator - GPT-3.5 Turbo</li>
        <li> - Inteligent project breakdown and flagging</li>
        <li> - User Authenitcation and History recall</li>
      </ul>
      <p><h3>Stack:</h3> Python (Flask), JavaScript, HTML, CSS, OpenAI API</p>
      <a href="https://github.com/IbzyX/ProjectMakerAI" target="_blank" class="modal-link">View on GitHub →</a>
    `
  },
  financeTracker: {
    title: "Finance Tracker",
    description: `
    <p>Finance Tracker is a full-stack web application designed to help users monitor their personal finances, visualize spending patterns, and project future investments all in one place through an interactive, data-rich dashboard. Built with Flask and a modular JavaScript frontend, the app features a responsive UI and dynamic visualizations powered by Chart.js to create a seamless cross-device experience.</p>
    <p>A core focus of the project is data security and user privacy, especially given the sensitivity of financial information. The app implements secure user authentication protocols to protect user accounts, with session management and encrypted communication ensuring that only authorized users can access personal data. Users can input financial information manually or connect their accounts via the TrueLayer API, which provides bank-grade security standards for linking to real-time bank and investment portfolio data.</p>
    <p>All data is stored securely in a Supabase-hosted PostgreSQL database, with role-based access control and strict validation practices in place. The entire stack is deployed on Render, supporting scalable and reliable cloud performance.</p>
    <p>Finance Tracker combines practical financial tools with a strong emphasis on data protection and secure architecture, making it both a robust technical project and a trustworthy personal finance solution.</p>
    <h3>Key Features:</h3>
      <ul>
        <li> - Modular charts using Chart.js allowing for full dashboard customisation</li>
        <li> - Secure User autentication and Bank trusted APIs</li>
        <li> - Manual or Real-time expense updates</li>
      </ul>
      <p><h3>Stack:</h3> Python (Flask), JavaScript, HTML, CSS, Chart.js, TrueLayer API</p>
      <a href="https://github.com/IbzyX/FinanceTracker" target="_blank" class="modal-link">View on GitHub →</a>
    `
  },
  portfolio: {
    title: "Tech Portfolio",
    description: `
    <p>This project serves as my personal developer portfolio. It began as a traditional <strong>Node.js + Express.js</strong> application to showcase my work as a full-stack developer through a custom-built portfolio web app, and was later refactored into a <strong>serverless web application</strong> hosted on <strong>Vercel</strong>.</p>
    <p>The backend logic, including <strong>contact form handling</strong> and <strong>email delivery</strong>, is implemented using <strong>Vercel Serverless Functions</strong>, integrated with <strong>Nodemailer</strong> for message routing and <strong>input validation</strong> to ensure secure submissions. This transition to a <strong>serverless architecture</strong> significantly improved scalability, reduced hosting complexity, and enabled faster API response times.</p>
    <p>On the frontend, the site features <strong>responsive layouts</strong>, <strong>smooth animations</strong>, and <strong>custom JavaScript effects</strong> such as interactive particle backgrounds to create an engaging and modern user experience. The project reflects a focus on <strong>clean architecture</strong>, <strong>performance optimization</strong>, and <strong>cloud-native deployment</strong> practices.</p>      
    <h3>Key Features:</h3>
      <ul>
        <li> - Form handling and email delivery</li>
        <li> - Interactive Animation and Smooth responsive UI</li>
        <li> - Serverless Cloud deployment on Vercel </li>
      </ul>
      <p><h3>Stack:</h3> Node.js, Express.js, JavaScript, HTML, CSS, Tailwind, Nodemailer</p>
      <a href="https://github.com/IbzyX/Portfolio-App" target="_blank" class="modal-link">View on GitHub →</a>
    `
  }
};

document.querySelectorAll('.learn-more').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const projectKey = e.target.getAttribute('data-project');
    const project = projectData[projectKey];

    if (project) {
      modalBody.innerHTML = `<h2>${project.title}</h2>${project.description}`;
      modal.style.display = 'flex';
    }
  });
});

closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});






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