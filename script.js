// ---------- DATA ----------
const OG_DATA = [
  { name: 'badjon', joined: '12.03.25', role: 'Plasma OG 👑', trillions: 37 },
  { name: 'CATT', joined: '14.02.25', role: 'Plasma OG 👑', trillions: 82 },
  { name: 'crpbase', joined: '15.03.25', role: 'Plasma OG 👑', trillions: 108 },
  { name: 'Dirty Squirrel', joined: '17.03.25', role: 'Plasma OG 👑', trillions: 142 },
  { name: 'fungie', joined: '05.01.25', role: 'Plasma OG 👑', trillions: 329 },
  { name: 'Happy', joined: '13.03.25', role: 'Plasma OG 👑', trillions: 80 },
  { name: 'jojo.usdt', joined: '25.03.25', role: 'Plasma OG 👑', trillions: 595 },
  { name: 'Lennart', joined: '31.03.25', role: 'Plasma OG 👑', trillions: 0 },
  { name: 'Mario', joined: '29.03.25', role: 'Plasma OG 👑', trillions: 241 },
  { name: 'onlinelink', joined: '27.03.25', role: 'Plasma OG 👑', trillions: 86 },
  { name: 'primay.eth', joined: '15.03.25', role: 'Plasma OG 👑', trillions: 468 },
  { name: 'Smart', joined: '22.10.24', role: 'Plasma OG 👑', trillions: 65 },
  { name: 'Techaddict', joined: '14.02.25', role: 'Plasma OG 👑', trillions: 670 },
];

// ---------- SLIDER ----------
const cards = document.querySelectorAll('.r-card');
let idx = 0;
setInterval(()=>{ cards[idx].classList.remove('active'); idx = (idx + 1) % cards.length; cards[idx].classList.add('active'); }, 3000);

// ---------- 3D DEMO CARD ----------
const wrap = document.getElementById('demoWrap');
const demoCard = document.getElementById('demoCard');
wrap.addEventListener('mousemove', (e)=>{
  const r = wrap.getBoundingClientRect();
  const x = e.clientX - r.left, y = e.clientY - r.top;
  const rotY = ((x - r.width/2) / (r.width/2)) * 10;
  const rotX = -((y - r.height/2) / (r.height/2)) * 10;
  demoCard.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  demoCard.style.boxShadow = `${-rotY*1.2}px ${12+rotX*0.6}px 40px rgba(10,21,18,0.35)`;
});
wrap.addEventListener('mouseleave', ()=>{ demoCard.style.transform = 'rotateX(0) rotateY(0)'; demoCard.style.boxShadow = '0 18px 50px rgba(10,21,18,0.35)'; });

// ---------- SPARKS ON BUTTON ----------
const btn = document.getElementById('ctaBtn');
let sparkTimer = null;
function spark(x, y){
  const s = document.createElement('span'); s.className = 'spark';
  const a = Math.random()*Math.PI*2, d = 30 + Math.random()*50;
  s.style.left = x + 'px'; s.style.top = y + 'px';
  s.style.setProperty('--tx', Math.cos(a)*d + 'px'); s.style.setProperty('--ty', Math.sin(a)*d + 'px');
  btn.appendChild(s); setTimeout(()=> s.remove(), 800);
}
btn.addEventListener('mouseenter', ()=>{
  const r = btn.getBoundingClientRect(), cx = r.width/2, cy = r.height/2;
  for(let i=0;i<18;i++) spark(cx,cy); sparkTimer = setInterval(()=> spark(Math.random()*r.width, Math.random()*r.height), 90);
});
btn.addEventListener('mouseleave', ()=>{ clearInterval(sparkTimer); sparkTimer = null; });

// ---------- LOGО FIELD ----------
const canvas = document.getElementById('bgCanvas'), ctx = canvas.getContext('2d');
let W, H, DPR = Math.min(window.devicePixelRatio||1, 2);
function resize(){ W = canvas.width = Math.floor(innerWidth * DPR); H = canvas.height = Math.floor(innerHeight * DPR); canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; }
resize(); addEventListener('resize', resize);
const logo = new Image(); logo.src = 'logo.png'; let logoReady = false; logo.onload = ()=> logoReady = true;
const COUNT = 64; const nodes = []; function rand(a,b){return Math.random()*(b-a)+a}
for(let i=0;i<COUNT;i++){ nodes.push({ x: Math.random()*W, y: Math.random()*H, angle: Math.random()*Math.PI*2, speed: rand(0.9,1.8), size: rand(20,36), tw: rand(0.6,1.2) }); }
const mouse = {x:-9999,y:-9999}; window.addEventListener('mousemove',(e)=>{mouse.x=e.clientX*DPR;mouse.y=e.clientY*DPR}); window.addEventListener('mouseleave',()=>{mouse.x=mouse.y=-9999});
function wrapAngle(a){ a = (a + Math.PI) % (Math.PI*2); return a < 0 ? a + Math.PI*2 - Math.PI : a - Math.PI; }
function starTick(t=0){
  ctx.clearRect(0,0,W,H); const influence=180*DPR, steerStrength=0.08, margin=160;
  for(const n of nodes){
    const dx=n.x-mouse.x, dy=n.y-mouse.y, d=Math.hypot(dx,dy)||1;
    if(d<influence){ const target=Math.atan2(dy,dx); let diff=wrapAngle(target-n.angle); n.angle += diff*steerStrength; }
    n.x += Math.cos(n.angle)*n.speed; n.y += Math.sin(n.angle)*n.speed;
    if(n.x<-margin) n.x=W+margin; if(n.y<-margin) n.y=H+margin; if(n.x>W+margin) n.x=-margin; if(n.y>H+margin) n.y=-margin;
    ctx.save(); ctx.globalAlpha = 0.72 + Math.sin(t*0.002*n.tw)*0.18; ctx.shadowColor = '#569F8C'; ctx.shadowBlur=22*DPR;
    if(logoReady){ const s=n.size*DPR; ctx.drawImage(logo,n.x-s/2,n.y-s/2,s,s);} else { ctx.fillStyle='#162F29'; ctx.beginPath(); ctx.arc(n.x,n.y,8*DPR,0,Math.PI*2); ctx.fill(); }
    ctx.restore();
  } requestAnimationFrame(starTick);
} starTick();

// ---------- Scroll reveal ----------
const groups = document.querySelectorAll('.reveal-group');
const io = new IntersectionObserver((entries)=>{
  for(const entry of entries){
    if(entry.isIntersecting){
      const els = entry.target.querySelectorAll('.reveal, .link-btn, .made-with');
      els.forEach((el,i)=> setTimeout(()=> el.classList.add('show'), i*120));
      io.unobserve(entry.target);
    }
  }
},{threshold:0.2});
groups.forEach(g=> io.observe(g));

// ---------- Hearts around Love ----------
const madeWith = document.getElementById('madeWith'); const loveSpan = madeWith?.querySelector('.love');
function spawnHeart(cx, cy){
  const h=document.createElement('span'); h.className='heart'; h.textContent='❤';
  const angle=Math.random()*Math.PI*2, radius=8+Math.random()*14;
  h.style.left=cx+'px'; h.style.top=cy+'px'; h.style.setProperty('--hx', Math.cos(angle)*radius+'px'); h.style.setProperty('--hy', Math.sin(angle)*radius+'px');
  madeWith.appendChild(h); setTimeout(()=>h.remove(),900);
}
if(madeWith && loveSpan){
  madeWith.style.position='relative';
  let timer=null;
  loveSpan.addEventListener('mouseenter',()=>{
    const r=loveSpan.getBoundingClientRect(), base=madeWith.getBoundingClientRect();
    const cx=r.left + r.width/2 - base.left, cy=r.top + r.height/2 - base.top;
    for(let i=0;i<8;i++) spawnHeart(cx,cy); timer=setInterval(()=>spawnHeart(cx,cy),140);
  });
  loveSpan.addEventListener('mouseleave',()=>{ clearInterval(timer); timer=null; });
}

// ---------- Endless glitch helpers ----------
let glitchTimer = null;
function startEndlessGlitch(el, target){
  stopEndlessGlitch();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%';
  glitchTimer = setInterval(()=>{
    let out = '';
    for(let i=0;i<target.length;i++){
      const ch = target[i];
      out += (ch===' ') ? ' ' : chars[Math.floor(Math.random()*chars.length)];
    }
    el.textContent = out;
  }, 60);
}
function stopEndlessGlitch(){ if(glitchTimer){ clearInterval(glitchTimer); glitchTimer=null; } }


// ===== Stablecoin share logic (Covalent) =====
const STABLECOIN_TICKERS = [
  'USDC','USDT','DAI','FRAX','TUSD','BUSD','USDP','USDD','GUSD',
  'LUSD','RSV','SAI','MIM','USDN','FEI','CUSD','SUSD','XSGD','EURS',
  'HUSD','USDK','USDS','USDE','USDL','PAI','YUSD'
];

// Replace with your own key
const COVALENT_API_KEY = 'cqt_rQ4Rj36cD34jH39R849DTwBRJFkH';

function isStableToken(token){
  const symbol = (token.contract_ticker_symbol || '').toUpperCase();
  const name = (token.contract_name || '').toUpperCase();
  if (STABLECOIN_TICKERS.includes(symbol)) return true;
  return /\bUSD\b|\bSTABLE\b/.test(symbol) || /\bUSD\b|\bSTABLE\b/.test(name);
}

async function getPortfolioBreakdown(address){
  const addr = String(address || '').trim();
  if(!addr) throw new Error('Wallet address is empty');
  const chains = [
    'eth-mainnet',
    'arbitrum-mainnet',
    'base-mainnet',
    'linea-mainnet',
    'bsc-mainnet',
    'optimism-mainnet',
    'polygon-mainnet'
  ];
  let total = 0;
  let stable = 0;
  for(const chain of chains){
    const baseUrl = `https://api.covalenthq.com/v1/${chain}/address/${addr}/balances_v2/`;
    const query = new URLSearchParams({
      'quote-currency':'usd',
      'no-nft-fetch':'true',
      'no-spam':'true',
      key: COVALENT_API_KEY
    });
    const url = `${baseUrl}?${query.toString()}`;
    try{
      const resp = await fetch(url);
      if(!resp.ok){ console.warn('Chain', chain, 'status', resp.status); continue; }
      const data = await resp.json();
      const items = (data && data.data && data.data.items) || [];
      for(const it of items){
        const v = parseFloat(it.quote);
        if(Number.isFinite(v)){
          total += v;
          if(isStableToken(it)) stable += v;
        }
      }
    }catch(e){
      console.warn('Error for chain', chain, e);
      continue;
    }
  }
  const percentage = total > 0 ? (stable / total) * 100 : 0;
  return { total, stable, percentage };
}
// ===== end stable logic =====

// ---------- Wizard ----------
const wizard = document.getElementById('wizard');
const wClose = document.getElementById('wClose');

// Steps
const steps = Array.from(document.querySelectorAll('.wizard-step'));
function showStep(n){ steps.forEach(s=> s.classList.toggle('hidden', s.getAttribute('data-step') != String(n))); }

// Step 1 elements
const next1 = document.getElementById('wNext1');
const discordInput = document.getElementById('discordInput');
const walletInput = document.getElementById('walletInput');
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');

// Step 2 elements
const back2 = document.getElementById('wBack2');
const next2 = document.getElementById('wNext2');
const roleText = document.getElementById('roleText');
const roleNotice = document.getElementById('roleNotice');
const manualRoleWrap = document.getElementById('manualRoleWrap');
const roleSelect = document.getElementById('roleSelect');

// Step 3 elements
const back3 = document.getElementById('wBack3');
const next3 = document.getElementById('wNext3');
const joinKnown = document.getElementById('joinKnown');
const joinKnownText = document.getElementById('joinKnownText');
const joinManual = document.getElementById('joinManual');
const joinInput = document.getElementById('joinInput');

// Step 4 elements
const back4 = document.getElementById('wBack4');
const next4 = document.getElementById('wNext4');
const trillionsSpin = document.getElementById('trillionsSpin');

// Step 5 elements
const back5 = document.getElementById('wBack5');
const finish = document.getElementById('wFinish');
const stableShareSpan = document.getElementById('stableShare');

function openWizard(){ wizard.classList.remove('hidden'); wizard.setAttribute('aria-hidden','false'); showStep(1); }
function closeWizard(){ wizard.classList.add('hidden'); wizard.setAttribute('aria-hidden','true'); }

btn.addEventListener('click', openWizard);
wClose.addEventListener('click', closeWizard);

// State
let currentUser = null;
let chosenRole = null;
let joinDate = null;
let trillionsTarget = null;
let avatarDataURL = null;
let spinTimer = null;
let autoRevealTimer = null;

avatarInput?.addEventListener('change', (e)=>{
  const f = e.target.files?.[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    avatarDataURL = reader.result;
    avatarPreview.style.backgroundImage = `url('${avatarDataURL}')`;
  };
  reader.readAsDataURL(f);
});

// Step 1 -> Step 2
next1.addEventListener('click', ()=>{
  const name = (discordInput.value || '').trim();
  const wallet = (walletInput.value || '').trim();
  if(!name){ alert('Enter your nick'); return; }
  if(!wallet){ alert('Enter your wallet'); return; }
  // Find user in base
  currentUser = OG_DATA.find(x=> x.name.toLowerCase() === name.toLowerCase()) || null;
  // Prepare step 2
  next2.setAttribute('disabled','disabled');
  roleText.textContent = '...';
  clearTimeout(autoRevealTimer);
  stopEndlessGlitch();
  if(currentUser){
    manualRoleWrap.classList.add('hidden');
    roleNotice.classList.add('hidden');
    startEndlessGlitch(roleText, currentUser.role);
    autoRevealTimer = setTimeout(()=>{
      stopEndlessGlitch();
      glitchScrambleReveal(currentUser.role, roleText).then(()=>{
        chosenRole = currentUser.role;
        next2.removeAttribute('disabled');
      });
    }, 1400);
  }else{
    roleNotice.classList.remove('hidden');
    manualRoleWrap.classList.remove('hidden');
    // Start with selected current option
    startEndlessGlitch(roleText, roleSelect.value);
    autoRevealTimer = setTimeout(()=>{
      stopEndlessGlitch();
      glitchScrambleReveal(roleSelect.value, roleText).then(()=>{
        chosenRole = roleSelect.value;
        next2.removeAttribute('disabled');
      });
    }, 1400);
  }
  showStep(2);
});

// Click to reveal role immediately
roleText?.addEventListener('click', ()=>{
  if(next2 && next2.disabled){
    stopEndlessGlitch();
    const target = currentUser ? currentUser.role : roleSelect.value;
    glitchScrambleReveal(target, roleText).then(()=>{
      chosenRole = target;
      next2.removeAttribute('disabled');
    });
  }
});

roleSelect?.addEventListener('change', ()=>{
  if(!currentUser){
    startEndlessGlitch(roleText, roleSelect.value);
    next2.setAttribute('disabled','disabled');
  }
});

back2?.addEventListener('click', ()=>{
  clearTimeout(autoRevealTimer);
  stopEndlessGlitch();
  showStep(1);
});

// Step 2 -> Step 3
next2?.addEventListener('click', ()=>{
  // Prepare join info
  if(currentUser){
    joinManual.classList.add('hidden');
    joinKnown.classList.remove('hidden');
    joinKnownText.textContent = currentUser.joined;
    joinDate = currentUser.joined;
    next3.removeAttribute('disabled');
  }else{
    joinKnown.classList.add('hidden');
    joinManual.classList.remove('hidden');
    next3.setAttribute('disabled','disabled');
  }
  showStep(3);
});

joinInput?.addEventListener('input', ()=>{
  if(joinInput.value){
    joinDate = joinInput.value;
    next3.removeAttribute('disabled');
  }else{
    next3.setAttribute('disabled','disabled');
  }
});

back3?.addEventListener('click', ()=> showStep(2));

// Step 3 -> Step 4
next3?.addEventListener('click', ()=>{
  trillionsSpin.textContent = '000';
  startSpin();
  next4.setAttribute('disabled','disabled');
  // pick target
  trillionsTarget = currentUser ? currentUser.trillions : pseudoRandomTrillions(discordInput.value);
  // Auto reveal after delay
  autoRevealTimer = setTimeout(()=>{
    stopSpin();
    countUpTo(trillionsSpin, trillionsTarget, 1500);
    next4.removeAttribute('disabled');
  },1400);
  showStep(4);
});

// Clicking trillions to reveal early
trillionsSpin?.addEventListener('click', ()=>{
  if(next4 && next4.disabled){
    stopSpin();
    countUpTo(trillionsSpin, trillionsTarget ?? pseudoRandomTrillions(discordInput.value), 1500);
    next4.removeAttribute('disabled');
  }
});

back4?.addEventListener('click', ()=>{ stopSpin(); showStep(3); });

// Step 4 -> Step 5
next4?.addEventListener('click', async ()=>{
  stableShareSpan.textContent = '...';
  showStep(5);
  const wallet = (walletInput.value || '').trim();
  try{
    const { percentage } = await getPortfolioBreakdown(wallet);
    stableShareSpan.textContent = percentage.toFixed(2) + '%';
  }catch(e){
    console.warn(e);
    stableShareSpan.textContent = '0.00%';
  }
});

back5?.addEventListener('click', ()=> showStep(4));

finish?.addEventListener('click', ()=>{
  // Save locally
  const payload = {
    nick: (discordInput.value || '').trim(),
    wallet: (walletInput.value || '').trim(),
    avatar: avatarDataURL || null,
    role: chosenRole || (currentUser ? currentUser.role : null),
    joined: joinDate || (currentUser ? currentUser.joined : null),
    trillions: trillionsTarget || 0,
    stableShare: stableShareSpan.textContent || null,
    ts: Date.now()
  };
  try{
    localStorage.setItem('preTrillionsProfile', JSON.stringify(payload));
    closeWizard();
    alert('Збережено локально');
  }catch(e){
    closeWizard();
    alert('Збереження не вдалося');
  }
});

// Helpers
function pseudoRandomTrillions(seed){
  const s = String(seed || 'x');
  let h = 0;
  for(let i=0;i<s.length;i++){ h = (h * 31 + s.charCodeAt(i)) >>> 0; }
  return (h % 700) + 1;
}
function computeStableShare(wallet){
  // Deterministic pseudo-random demo calc based on wallet
  const s = String(wallet || '0x');
  let t = 0;
  for(let i=0;i<s.length;i++){ t = (t * 33 + s.charCodeAt(i)) >>> 0; }
  // map to 5...95%
  return 5 + (t % 910) / 10;
}

// REUSE glitch/spin helpers from above file
function glitchScrambleReveal(finalText, el, duration=900){
  return new Promise(resolve=>{
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%';
    const target = finalText.split('');
    const start = performance.now();
    function frame(now){
      const p = Math.min(1, (now-start)/duration);
      let out = '';
      for(let i=0;i<target.length;i++){
        const fixed = Math.random() < p;
        const ch = target[i];
        out += (ch === ' ' || fixed) ? ch : chars[Math.floor(Math.random()*chars.length)];
      }
      el.textContent = out;
      if(p < 1) requestAnimationFrame(frame); else { el.textContent = finalText; el.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:420,easing:'ease-out'}); resolve(); }
    }
    requestAnimationFrame(frame);
  });
}
let spinTimer2 = null;
function startSpin(){
  stopSpin();
  spinTimer2 = setInterval(()=>{
    const s = String(Math.floor(Math.random()*1000)).padStart(3,'0');
    trillionsSpin.textContent = s;
  }, 60);
}
function stopSpin(){ if(spinTimer2){ clearInterval(spinTimer2); spinTimer2 = null; } }
function countUpTo(el, to, ms=1200){
  const start = performance.now(); const from = 0;
  function frame(now){
    const t = Math.min(1, (now-start)/ms);
    const val = Math.floor(from + (to-from) * (1 - Math.pow(1-t,3)));
    el.textContent = val.toLocaleString();
    if(t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
