/* Juego romántico — script.js
   - Escenas: start -> game -> end
   - Minijuego: atrapa corazones que aparecen aleatoriamente
   - Personalización por nombre
*/

const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

const sceneStart = qs('#scene-start');
const sceneGame = qs('#scene-game');
const sceneEnd = qs('#scene-end');
const nameInput = qs('#name');
const startBtn = qs('#startBtn');
const surpriseBtn = qs('#surpriseBtn');
const greeting = qs('#greeting');
const scoreEl = qs('#score');
const timeEl = qs('#time');
const gameArea = qs('#game-area');
const finishEarly = qs('#finishEarly');
const endTitle = qs('#endTitle');
const endMessage = qs('#endMessage');
const replay = qs('#replay');
const download = qs('#download');
const confettiCanvas = qs('#confetti');

let playerName = '';
let score = 0;
let timer = 30;
let spawnInterval = null;
let countdownInterval = null;

function showScene(el){
  qsa('.scene').forEach(s=>s.classList.remove('active'));
  el.classList.add('active');
}

function personalizeName(){
  playerName = nameInput.value.trim() || 'amor';
  greeting.textContent = `¡Hola, ${playerName}!`;
}

startBtn.addEventListener('click',()=>{
  personalizeName();
  startGame();
});

surpriseBtn.addEventListener('click',()=>{
  nameInput.value = 'Mi vida';
  personalizeName();
  startGame();
});

function startGame(){
  score = 0; timer = 30; updateScore(); updateTime();
  gameArea.innerHTML = '';
  showScene(sceneGame);
  // spawn corazones cada 700-1100ms
  spawnInterval = setInterval(spawnHeart, 800);
  countdownInterval = setInterval(()=>{
    timer--; updateTime(); if(timer<=0) finishGame();
  },1000);
}

function finishGame(){
  clearInterval(spawnInterval); spawnInterval = null;
  clearInterval(countdownInterval); countdownInterval = null;
  showEnd();
}

finishEarly.addEventListener('click', finishGame);

function updateScore(){ scoreEl.textContent = score }
function updateTime(){ timeEl.textContent = timer }

function spawnHeart(){
  const heart = document.createElement('div');
  heart.className = 'heart floating-heart';
  // position random inside gameArea
  const rect = gameArea.getBoundingClientRect();
  const size = 40 + Math.random()*40; // 40-80
  const x = Math.random()*(rect.width - size);
  const y = Math.random()*(rect.height - size);
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-7.5-4.9-9.2-8.1C1.3 9.9 4 6 7.5 6c1.9 0 3 .9 4.5 2.6C13.5 6.9 14.6 6 16.5 6 20 6 22.7 9.9 21.2 12.9 19.5 16.1 12 21 12 21z" fill="url(#g)"/></svg>`;
  // add gradient id safety
  heart.querySelector('svg').innerHTML = `<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#ff9a9e"/><stop offset="1" stop-color="#ff6f91"/></linearGradient></defs>` + heart.querySelector('svg').innerHTML;

  // click to pop
  heart.addEventListener('click', (e)=>{
    e.stopPropagation();
    popHeart(heart);
  });

  // small intro animation
  heart.style.transform = 'scale(0.2)';
  heart.style.opacity = '0';
  gameArea.appendChild(heart);
  requestAnimationFrame(()=>{
    heart.style.transition = 'transform 280ms cubic-bezier(.2,.9,.3,1), opacity 200ms';
    heart.style.transform = 'scale(1)';
    heart.style.opacity = '1';
  });

  // auto disappear in 3-5s
  setTimeout(()=>{
    if(document.body.contains(heart)){
      heart.style.opacity = '0';
      setTimeout(()=>heart.remove(),400);
    }
  },3000 + Math.random()*2000);
}

function popHeart(el){
  score += 1 + Math.floor(Math.random()*2);
  updateScore();
  // pop animation
  el.style.transition = 'transform 320ms ease, opacity 320ms ease';
  el.style.transform = 'scale(1.6) rotate(-10deg)';
  el.style.opacity = '0';
  // small spark (temporary)
  const spark = document.createElement('div');
  spark.className = 'spark';
  spark.style.position='absolute';
  const rect = el.getBoundingClientRect();
  const areaRect = gameArea.getBoundingClientRect();
  spark.style.left = `${rect.left - areaRect.left + rect.width/2}px`;
  spark.style.top = `${rect.top - areaRect.top + rect.height/2}px`;
  gameArea.appendChild(spark);
  setTimeout(()=>{ spark.remove() },500);
  setTimeout(()=>el.remove(),350);
}

function showEnd(){
  showScene(sceneEnd);
  // message personalizado
  const compliments = [
    `Tu sonrisa hace que todo sea mejor, ${playerName}.`,
    `Si tuviera que elegir un lugar favorito sería a tu lado, ${playerName}.`,
    `Eres mi pensamiento favorito, ${playerName}.`,
    `Cada latido me recuerda que te quiero, ${playerName}.`
  ];
  const idx = Math.min(compliments.length-1, Math.floor((score/10)));
  endTitle.textContent = `¡${playerName}, lo lograste!`;
  endMessage.textContent = `${compliments[idx]} Obtuviste ${score} puntos. Aquí viene algo bonito...`;
  // start confetti
  startConfetti();
}

replay.addEventListener('click', ()=>{ showScene(sceneStart); stopConfetti(); });

download.addEventListener('click', ()=>{
  // capture a screenshot-ish using SVG data: render a summary image
  const data = `${playerName} — Puntos: ${score} \n\n${endMessage.textContent}`;
  const blob = new Blob([data],{type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${playerName}-recuerdo.txt`; a.click(); URL.revokeObjectURL(url);
});

// Simple confetti implementation (canvas)
let confettiCtx=null;let confettiAnim=null;let confettiParticles=[];
function startConfetti(){
  const c = confettiCanvas; c.width = innerWidth; c.height = innerHeight; confettiCtx = c.getContext('2d');
  confettiParticles = [];
  for(let i=0;i<120;i++){
    confettiParticles.push({
      x: Math.random()*c.width,
      y: Math.random()*c.height - c.height,
      r: 6+Math.random()*10,
      dx: -2 + Math.random()*4,
      dy: 1 + Math.random()*3,
      color: `hsl(${Math.random()*50+320},80%,60%)`
    });
  }
  confettiLoop();
}

function confettiLoop(){
  const c = confettiCanvas; confettiCtx.clearRect(0,0,c.width,c.height);
  for(const p of confettiParticles){
    confettiCtx.fillStyle = p.color; confettiCtx.beginPath(); confettiCtx.ellipse(p.x,p.y,p.r,p.r*0.6,0,0,Math.PI*2); confettiCtx.fill();
    p.x += p.dx; p.y += p.dy; p.dy += 0.03;
    if(p.y>c.height+20){ p.y = -10; p.x = Math.random()*c.width; p.dy = 1+Math.random()*2 }
  }
  confettiAnim = requestAnimationFrame(confettiLoop);
}

function stopConfetti(){ if(confettiAnim) cancelAnimationFrame(confettiAnim); const c=confettiCanvas; const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height); }

// small accessibility: click background to spawn a heart
gameArea.addEventListener('click', (e)=>{ spawnHeart() });

// initial greeting text
greeting.textContent = '¡Hola!';

// Resize confetti canvas
window.addEventListener('resize', ()=>{ if(confettiCanvas.width) { confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight } });
