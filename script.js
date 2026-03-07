






const canvas=document.getElementById('c');
const ctx=canvas.getContext('2d');
const CW=Math.min(window.innerWidth-28,400);
const CH=Math.min(window.innerHeight-130,600);
canvas.width=CW; canvas.height=CH;
document.getElementById('gameContainer').style.width=CW+'px';
document.getElementById('gameContainer').style.height=CH+'px';
const S=CW/400;

// ── Constants ──
const HEAD_R     = 22*S;   // head = face circle
const BODY_H     = 28*S;   // torso line length
const ARM_L      = 18*S;
const LEG_L      = 22*S;
const PIPE_W     = 60*S;
const PIPE_GAP   = 160*S;
const PIPE_SPEED = 2.7;
const GRAVITY    = 0.36;
const FLAP_FORCE = -7.6;
const MAX_FALL   = 10;
const GROUND_H   = 68*S;
const GROUND_Y   = CH-GROUND_H;
const PIPE_EVERY = 92;
// Total height of character (for collision = head only)
const CHAR_H = HEAD_R*2 + BODY_H + LEG_L;

const img=new Image();
img.src='data:image/jpeg;base64,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'
let mode='idle',score=0,best=0,fr=0;
// bird.y = center of head
const bird={x:110*S, y:CH*0.38, vy:0, ang:0};
let pipes=[],parts=[],gx=0;
let clouds=[
  {x:60*S, y:50*S,  r:40*S, sp:0.4*S},
  {x:230*S,y:36*S,  r:30*S, sp:0.27*S},
  {x:360*S,y:85*S,  r:44*S, sp:0.33*S},
];

// ── SKY ──
function sky(){
  const g=ctx.createLinearGradient(0,0,0,GROUND_Y);
  g.addColorStop(0,'#1361d8'); g.addColorStop(0.5,'#40b5ff'); g.addColorStop(1,'#87defd');
  ctx.fillStyle=g; ctx.fillRect(0,0,CW,GROUND_Y);
}

// ── CLOUDS ──
function drawClouds(){
  clouds.forEach(c=>{
    ctx.save();
    ctx.fillStyle='rgba(255,255,255,0.88)';
    ctx.shadowColor='rgba(255,255,255,0.3)'; ctx.shadowBlur=14;
    [[0,0,c.r,c.r*0.55],[c.r*.52,-c.r*.26,c.r*.62,c.r*.48],[-c.r*.48,-c.r*.16,c.r*.55,c.r*.42]].forEach(([ox,oy,rx,ry])=>{
      ctx.beginPath(); ctx.ellipse(c.x+ox,c.y+oy,rx,ry,0,0,Math.PI*2); ctx.fill();
    });
    ctx.restore();
    c.x-=c.sp; if(c.x+c.r*2<0) c.x=CW+c.r;
  });
}

// ── GROUND ──
function ground(){
  const g=ctx.createLinearGradient(0,GROUND_Y,0,CH);
  g.addColorStop(0,'#8b5e3c'); g.addColorStop(0.15,'#9e6d3d'); g.addColorStop(1,'#5a3a1a');
  ctx.fillStyle=g; ctx.fillRect(0,GROUND_Y,CW,GROUND_H);
  ctx.fillStyle='#5cb85c'; ctx.fillRect(0,GROUND_Y,CW,15*S);
  ctx.fillStyle='#4a9e4a'; ctx.fillRect(0,GROUND_Y+13*S,CW,4*S);
  ctx.fillStyle='rgba(0,0,0,0.07)';
  const tw=22*S;
  for(let i=(gx%tw)-tw;i<CW;i+=tw) ctx.fillRect(i,GROUND_Y+17*S,tw*.46,GROUND_H-19*S);
}

// ── PIPE ──
function pipe(px,topH){
  const botY=topH+PIPE_GAP, botH=GROUND_Y-botY;
  if(botH<=0)return;
  const capW=PIPE_W+14*S, capH=26*S, cx2=px-7*S;
  const pg=ctx.createLinearGradient(px,0,px+PIPE_W,0);
  pg.addColorStop(0,'#1c781c'); pg.addColorStop(.28,'#4ecf4e'); pg.addColorStop(.65,'#33b033'); pg.addColorStop(1,'#135213');
  ctx.fillStyle=pg;
  ctx.fillRect(px,0,PIPE_W,topH-capH+2);
  ctx.fillRect(px,botY+capH-2,PIPE_W,botH-capH+2);
  const cg=ctx.createLinearGradient(cx2,0,cx2+capW,0);
  cg.addColorStop(0,'#186818'); cg.addColorStop(.28,'#55df55'); cg.addColorStop(.65,'#38c038'); cg.addColorStop(1,'#114911');
  ctx.fillStyle=cg;
  rr(cx2,topH-capH,capW,capH,6*S); ctx.fill();
  rr(cx2,botY,capW,capH,6*S); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.15)';
  ctx.fillRect(px+9*S,0,9*S,topH-capH);
  ctx.fillRect(px+9*S,botY+capH,9*S,botH-capH);
}

function rr(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

// ── DRAW CHARACTER ──
// Character: round face photo + body line + arm lines + leg lines
// bird.y = top of head (center)
function drawChar(){
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.ang * 0.35); // gentle tilt

  const HR = HEAD_R; // head radius

  // ── Shadow on ground (only when alive) ──
  if(mode !== 'dead'){
    const dist = GROUND_Y - bird.y;
    const opacity = Math.max(0, 0.2 - dist/600);
    if(opacity > 0){
      ctx.save();
      ctx.translate(dist*0.1, dist - HR);
      ctx.scale(1, 0.2);
      ctx.fillStyle = `rgba(0,0,0,${opacity})`;
      ctx.beginPath(); ctx.arc(0,0,HR*0.9,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
  }

  // ── Body (line from bottom of head downward) ──
  const neckY = HR;      // bottom of head
  const waistY = neckY + BODY_H;

  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 3.5*S;
  ctx.lineCap = 'round';

  // Body line
  ctx.beginPath(); ctx.moveTo(0, neckY); ctx.lineTo(0, waistY); ctx.stroke();

  // Arms (flap based on vy)
  const armAngle = mode==='playing' ? Math.sin(fr*0.3)*0.5 + 0.3 : 0.3;
  // Left arm
  ctx.beginPath();
  ctx.moveTo(0, neckY + BODY_H*0.35);
  ctx.lineTo(-ARM_L * Math.cos(armAngle), neckY + BODY_H*0.35 + ARM_L * Math.sin(armAngle + (bird.vy < 0 ? -0.7 : 0.4)));
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(0, neckY + BODY_H*0.35);
  ctx.lineTo( ARM_L * Math.cos(armAngle), neckY + BODY_H*0.35 + ARM_L * Math.sin(armAngle + (bird.vy < 0 ? -0.7 : 0.4)));
  ctx.stroke();

  // Legs
  const legAngle = mode==='playing' ? Math.sin(fr*0.2)*0.3 : 0.25;
  // Left leg
  ctx.beginPath();
  ctx.moveTo(0, waistY);
  ctx.lineTo(-LEG_L * Math.sin(legAngle + 0.3), waistY + LEG_L * Math.cos(legAngle + 0.3));
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(0, waistY);
  ctx.lineTo( LEG_L * Math.sin(legAngle + 0.3), waistY + LEG_L * Math.cos(legAngle + 0.3));
  ctx.stroke();

  // ── Head: face photo circle ──
  // White glow ring
  ctx.beginPath(); ctx.arc(0,0,HR+5*S,0,Math.PI*2);
  ctx.strokeStyle = mode==='dead' ? 'rgba(255,60,60,0.6)' : 'rgba(255,255,200,0.3)';
  ctx.lineWidth=2.5*S; ctx.stroke();

  // Clip circle and draw photo
  ctx.save();
  ctx.beginPath(); ctx.arc(0,0,HR,0,Math.PI*2); ctx.clip();
  if(img.complete && img.naturalWidth>10){
    const iw=img.naturalWidth, ih=img.naturalHeight;
    // Tight crop: focus on face, cut white space
    // Photo has white space top/sides - zoom into center
    const cropX = iw*0.08, cropY = ih*0.04;
    const cropW = iw*0.84, cropH = ih*0.90;
    ctx.drawImage(img, cropX, cropY, cropW, cropH, -HR, -HR, HR*2, HR*2);
  } else {
    ctx.fillStyle='#FFD59A';
    ctx.fillRect(-HR,-HR,HR*2,HR*2);
  }
  ctx.restore();

  // White border ring
  ctx.beginPath(); ctx.arc(0,0,HR,0,Math.PI*2);
  ctx.strokeStyle='#fff'; ctx.lineWidth=3*S; ctx.stroke();

  ctx.restore();
}

// ── PARTICLES ──
function drawParts(){
  parts=parts.filter(p=>p.life>0);
  parts.forEach(p=>{
    ctx.save(); ctx.globalAlpha=p.life/p.maxLife;
    ctx.font=p.sz+'px serif'; ctx.fillText(p.e,p.x,p.y);
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.2; p.life--;
    ctx.restore();
  });
}
function scoreParticles(){
  ['⭐','✨','🌟','💫','🎉'].forEach(e=>{
    parts.push({x:bird.x+(Math.random()-.5)*45, y:bird.y-20,
      vx:(Math.random()-.5)*3.5, vy:-3.5-Math.random()*2.5,
      e, sz:15+Math.random()*10, life:42, maxLife:42});
  });
}
function deathParticles(){
  ['💥','😵','💀','🔥','😱','✨'].forEach(e=>{
    parts.push({x:bird.x+(Math.random()-.5)*55, y:bird.y+(Math.random()-.5)*45,
      vx:(Math.random()-.5)*7, vy:-5-Math.random()*4,
      e, sz:18+Math.random()*14, life:55, maxLife:55});
  });
}

// ── LOGIC ──
function flap(){
  if(mode==='idle'){startGame();return;}
  if(mode==='dead')return;
  bird.vy=FLAP_FORCE;
  beep(580,950,0.1);
}
function startGame(){
  mode='playing'; score=0; pipes=[]; parts=[]; fr=0;
  bird.y=CH*0.38; bird.vy=0; bird.ang=0; gx=0;
  document.getElementById('scoreLive').textContent='0';
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('overScreen').classList.add('hidden');
}
function addPipe(){
  const minH=60*S, maxH=GROUND_Y-PIPE_GAP-60*S;
  pipes.push({x:CW+PIPE_W, topH:minH+Math.random()*(maxH-minH), scored:false});
}
function hitTest(){
  // Collision = head circle only (forgiving)
  const br=HEAD_R-4*S;
  if(bird.y+br>=GROUND_Y||bird.y-br<=0)return true;
  for(const p of pipes){
    const cx2=p.x-7*S, cw2=PIPE_W+14*S;
    if(bird.x+br>cx2 && bird.x-br<cx2+cw2)
      if(bird.y-br<p.topH || bird.y+br>p.topH+PIPE_GAP)return true;
  }
  return false;
}
function die(){
  mode='dead';
  if(score>best)best=score;
  deathParticles(); beep(350,60,0.18);
  let sh=10,dir=1;
  const gc=document.getElementById('gameContainer');
  const iv=setInterval(()=>{
    gc.style.transform=`translateX(${sh*dir}px)`;
    sh-=1.5; dir*=-1;
    if(sh<=0){gc.style.transform='';clearInterval(iv);}
  },28);
  setTimeout(()=>{
    document.getElementById('finalScore').textContent=score;
    document.getElementById('finalBest').textContent=best;
    document.getElementById('overScreen').classList.remove('hidden');
  },680);
}
function beep(f1,f2,vol){
  try{
    const ac=new(window.AudioContext||window.webkitAudioContext)();
    const o=ac.createOscillator(),g=ac.createGain();
    o.connect(g);g.connect(ac.destination);
    o.frequency.setValueAtTime(f1,ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(f2,ac.currentTime+0.09);
    g.gain.setValueAtTime(vol,ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+0.18);
    o.start();o.stop(ac.currentTime+0.2);
  }catch(e){}
}

// ── MAIN LOOP ──
function loop(){
  ctx.clearRect(0,0,CW,CH);
  sky(); drawClouds();
  if(mode!=='idle') pipes.forEach(p=>pipe(p.x,p.topH));
  ground(); drawChar(); drawParts();

  if(mode==='playing'){
    fr++;
    bird.vy=Math.min(bird.vy+GRAVITY,MAX_FALL);
    bird.y+=bird.vy;
    bird.ang=Math.min(Math.max(bird.vy*0.055,-0.52),1.2);
    gx=(gx+PIPE_SPEED)%(22*S*2);
    if(fr%PIPE_EVERY===0)addPipe();
    pipes.forEach(p=>p.x-=PIPE_SPEED);
    pipes=pipes.filter(p=>p.x+PIPE_W+20*S>0);
    pipes.forEach(p=>{
      if(!p.scored&&p.x+PIPE_W<bird.x-HEAD_R){
        p.scored=true; score++;
        const el=document.getElementById('scoreLive');
        el.textContent=score;
        el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
        document.getElementById('bestVal').textContent=Math.max(score,best);
        scoreParticles(); beep(700,1150,0.08);
      }
    });
    if(hitTest())die();
  }

  if(mode==='idle'){
    bird.y=CH*0.38+Math.sin(Date.now()*0.002)*10;
    bird.ang=0;
  }

  requestAnimationFrame(loop);
}

// ── INPUT ──
document.addEventListener('keydown',e=>{
  if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();flap();}
});
canvas.addEventListener('pointerdown',e=>{e.preventDefault();flap();});
document.getElementById('startBtn').addEventListener('click',e=>{e.stopPropagation();startGame();});
document.getElementById('retryBtn').addEventListener('click',e=>{e.stopPropagation();startGame();});

img.onload=()=>loop();
img.onerror=()=>loop();
if(img.complete&&img.naturalWidth>0)loop();
bird.vy=Math.min(bird.vy+GRAVITY*dt, MAX_FALL);
bird.y+=bird.vy*dt;
gx=(gx+PIPE_SPEED*dt)%(22*S*2);
pipeTimer+=dt;
pipes.forEach(p=>p.x-=PIPE_SPEED*dt);let dt=(timestamp-lastTime)/TARGET_MS;
dt=Math.min(dt, 3);
lastTime=timestamp;