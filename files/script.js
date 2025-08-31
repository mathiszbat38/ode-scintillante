// ===== ScrollReveal animations =====
window.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('sr');
  if (window.ScrollReveal) {
    const sr = ScrollReveal();
    sr.reveal('.fade-up', { distance: '20px', origin: 'bottom', duration: 800, easing: 'ease-out', interval: 80 });
    sr.reveal('.slide-left', { distance: '40px', origin: 'left', duration: 900, easing: 'cubic-bezier(.2,.6,.2,1)', interval: 100 });
    sr.reveal('.slide-right', { distance: '40px', origin: 'right', duration: 900, easing: 'cubic-bezier(.2,.6,.2,1)', interval: 100 });
    sr.reveal('.reveal', { distance: '24px', origin: 'bottom', duration: 800, easing: 'ease', interval: 80 });
  }
});

// ===== Canvas scintillant (particules) =====
(() => {
  const canvas = document.getElementById('sparkCanvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  let width, height, particles = [], baseCount = 80, maxCount = 500;

  const rand = (min, max) => Math.random() * (max - min) + min;
  const TAU = Math.PI * 2;

  function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function makeParticle(){
    const size = rand(1, 3.8);
    const speed = rand(0.15, 0.6);
    const drift = rand(-0.2, 0.2);
    const opacity = rand(0.35, 0.9);
    const hue = Math.random() < 0.7 ? 50 : 240; // or doré, or bleu nuit
    return {
      x: rand(0, width),
      y: rand(0, height),
      r: size,
      vx: drift,
      vy: -speed,
      a: opacity,
      hue,
      twinkle: rand(0.002, 0.01)
    };
  }

  function init(count = baseCount){
    particles = [];
    for(let i=0;i<count;i++) particles.push(makeParticle());
  }
  init(baseCount);

  function step(){
    ctx.clearRect(0,0,width,height);
    for (let p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = height + 10; p.x = rand(0, width); }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      // twinkle (sinus on alpha)
      p.a += Math.sin(Date.now() * p.twinkle) * 0.002;

      // draw
      ctx.beginPath();
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*3);
      if (p.hue === 50){
        grd.addColorStop(0, `rgba(255,215,0,${Math.min(1, Math.max(0, p.a))})`);
        grd.addColorStop(1, 'rgba(255,215,0,0)');
      } else {
        grd.addColorStop(0, `rgba(26,26,64,${Math.min(1, Math.max(0, p.a*0.6))})`);
        grd.addColorStop(1, 'rgba(26,26,64,0)');
      }
      ctx.fillStyle = grd;
      ctx.arc(p.x, p.y, p.r*3, 0, TAU);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  function intensify(delta=40){
    const current = particles.length;
    const target = Math.min(maxCount, current + delta);
    for(let i=current;i<target;i++) particles.push(makeParticle());
  }

  function gentleBurst(){
    intensify(60);
  }

  const buttons = [
    document.getElementById('sparkBtn'),
    document.getElementById('sparkBtnHero')
  ].filter(Boolean);

  buttons.forEach(btn => btn.addEventListener('click', gentleBurst));
})();
