const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Objeto que representa o mouse
let mouse = {
  x: null,
  y: null,
  radius: 100 // raio de repulsão
};

// Atualiza a posição do mouse
window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Quando o mouse sai da tela, desativa repulsão
window.addEventListener('mouseout', function() {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 1;
    this.speedY = (Math.random() - 0.5) * 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Rebate nas bordas
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    // Repulsão pelo mouse
    if (mouse.x && mouse.y) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouse.radius - distance) / mouse.radius;
        const moveX = Math.cos(angle) * force * 2;
        const moveY = Math.sin(angle) * force * 2;
        this.x += moveX;
        this.y += moveY;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();
  }
}

function connectParticles() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a + 1; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 0, 0, ${1 - distance / 120})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function createParticles(num) {
  particlesArray = [];
  for (let i = 0; i < num; i++) {
    particlesArray.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}

initCanvas();
createParticles(80);
animate();

window.addEventListener('resize', () => {
  initCanvas();
  createParticles(80);
});
