'use strict';

/* =====================================================
   Plasma Pre-Trillions - script.js (manual flow for unknown users)
   - If nickname not in known lists: show manual step with Role + Join date (>= 17.10.2024)
   - Then only one reveal: Stablecoins share
   - No trillions field shown or hinted
   ===================================================== */

// ===== Demo data (safe to keep) =====
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
const EC_DATA = [
  {"name":"YURII","joined":"29.04.2025","trillions":26},
  {"name":"Manners// ST","joined":"18.03.2025","trillions":118},
  {"name":"bad friend","joined":"18.03.2025","trillions":118},
  {"name":"Bakbar hippo","joined":"23.03.2025","trillions":85},
  {"name":"bigbossss","joined":"26.03.2025","trillions":80},
  {"name":"Bobddbr IVX","joined":"19.05.2025","trillions":13}
];
const SC_DATA = [
  {"name":"0xprune","joined":"02.04.2025","trillions":116},
  {"name":"aadvark89","joined":"15.03.2025","trillions":10},
  {"name":"Baikan","joined":"27.03.2025","trillions":92}
];

// === Plasma org teams (auto-match) ===
const COMMUNITY_TEAM = [
  { name: 'scene', joined: '18.10.2024', role: 'Community Team', trillions: 644 },
  { name: 'Googly', joined: '09.02.2025', role: 'Community Team', trillions: 3 },
  { name: 'rongplace - Chinese Ansem', joined: '19.10.2024', role: 'Community Team', trillions: 7 },
  { name: 'kay00nee', joined: '03.04.2025', role: 'Community Team', trillions: 0 },
  { name: 'Max Apoz Φ', joined: '18.02.2025', role: 'Community Team', trillions: 209 },
  { name: 'shadowfax', joined: '14.03.2025', role: 'Community Team', trillions: 317 },
];
const PLASMA_TEAM = [
  { name: 'Paul',   joined: '18.10.2024', role: 'Plasma Team', trillions: 0 },
  { name: 'Zzz',    joined: '17.10.2024', role: 'Plasma Team', trillions: 3 },
  { name: 'Nathan', joined: '05.02.2025', role: 'Plasma Team', trillions: 407 },
  { name: 'Lucid',  joined: '17.10.2024', role: 'Plasma Team', trillions: 9 },
];

function normalizeNick(s){
  return String(s||'')
    .replace(/\s+/g,' ')
    .replace(/^"(.*)"$/, '$1')
    .trim()
    .toLowerCase();
}

// ===== Helpers =====
const qs = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// ===== Stablecoin checker (Covalent) =====
const API_KEY = 'cqt_rQ4Rj36cD34jH39R849DTwBRJFkH';
const STABLES = new Set(['USDC','USDT','DAI','FRAX','TUSD','BUSD','USDP','USDD','GUSD','LUSD','RSV','SAI','MIM','USDN','FEI','CUSD','SUSD','XSGD','EURS','HUSD','USDK','USDS','USDE','USDL','PAI','YUSD']);

function isStableToken(item){
  const s = (item.contract_ticker_symbol || '').toUpperCase();
  const n = (item.contract_name || '').toUpperCase();
  if (STABLES.has(s)) return true;
  return /\bUSD\b|\bSTABLE\b/.test(s) || /\bUSD\b|\bSTABLE\b/.test(n);
}

async function fetchChainItems(chain, address){
  const params = new URLSearchParams({
    'quote-currency':'usd',
    'no-nft-fetch':'true',
    'no-spam':'true'
  });
  const tries = [
    { url: `https://api.covalenthq.com/v1/${chain}/address/${address}/balances_v2/?${params.toString()}`, headers: { 'Authorization': `Bearer ${API_KEY}` } },
    { url: `https://api.covalenthq.com/v1/${chain}/address/${address}/balances_v2/?${params.toString()}&key=${encodeURIComponent(API_KEY)}`, headers: {} },
    { url: `https://goldrush.dev/api/v1/${chain}/address/${address}/balances_v2/?${params.toString()}&key=${encodeURIComponent(API_KEY)}`, headers: {} }
  ];
  let lastErr = null;
  for (const t of tries){
    try{
      const r = await fetch(t.url, { headers: t.headers });
      if (r.ok){ const j = await r.json(); return (j && j.data && j.data.items) || []; }
      lastErr = new Error('HTTP '+r.status);
    }catch(e){ lastErr = e; }
  }
  if (lastErr) console.warn('All attempts failed for', chain, lastErr.message||lastErr);
  return [];
}

async function getPortfolioBreakdown(address){
  const addr = String(address||'').trim();
  if (!/^0x[a-fA-F0-9]{40}$/.test(addr)){
    return { total: 0, stable: 0, percentage: 0 };
  }
  const chains = ['eth-mainnet','arbitrum-mainnet','base-mainnet','optimism-mainnet','polygon-mainnet','bsc-mainnet','linea-mainnet'];
  let total = 0, stable = 0;
  for (const c of chains){
    const items = await fetchChainItems(c, addr);
    for (const it of items){
      const q = parseFloat(it.quote);
      if (!Number.isFinite(q)) continue;
      total += q;
      if (isStableToken(it)) stable += q;
    }
  }
  const percentage = total > 0 ? (stable/total)*100 : 0;
  return { total, stable, percentage };
}

// ===== Slider / tilt / sparks / tables (safe no-ops if absent) =====
(function(){
  const cards = qsa('.r-card'); if(cards.length){ let i=0; setInterval(()=>{ cards[i].classList.remove('active'); i=(i+1)%cards.length; cards[i].classList.add('active'); },3000); }
  const wrap = qs('#demoWrap'), card = qs('#demoCard'); if(wrap&&card){ wrap.addEventListener('mousemove', (e)=>{ const r=wrap.getBoundingClientRect(); const x=e.clientX-r.left, y=e.clientY-r.top; const ry=((x-r.width/2)/(r.width/2))*10, rx=-((y-r.height/2)/(r.height/2))*10; card.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg)`; card.style.boxShadow=`${-ry*1.2}px ${12+rx*0.6}px 40px rgba(10,21,18,0.35)`; }); wrap.addEventListener('mouseleave', ()=>{ card.style.transform='rotateX(0) rotateY(0)'; card.style.boxShadow='0 18px 50px rgba(10,21,18,0.35)'; }); }
  const btn = qs('#ctaBtn') || qsa('button').find(b => /create my score card/i.test(b.textContent||'')); if(btn){ let t=null; btn.addEventListener('mouseenter',(e)=>{ t=setInterval(()=>{ const s=document.createElement('span'); s.className='spark'; s.style.left=(e.offsetX||8)+'px'; s.style.top=(e.offsetY||8)+'px'; s.style.setProperty('--tx',(Math.random()*60-30)+'px'); s.style.setProperty('--ty',(-20-Math.random()*40)+'px'); btn.appendChild(s); setTimeout(()=>s.remove(),700); },200); }); btn.addEventListener('mouseleave',()=>{ clearInterval(t); t=null; }); }
  function fillTable(id,rows,withOgIcon){ const tb=qs('#'+id+' tbody'); if(!tb) return; tb.innerHTML=''; rows.forEach(r=>{ const tr=document.createElement('tr'); const td1=document.createElement('td'); if(withOgIcon){ const wrap=document.createElement('div'); wrap.className='name-with-icon'; const ic=document.createElement('img'); ic.src='og.png'; ic.alt='OG'; const span=document.createElement('span'); span.textContent=r.name; wrap.append(ic,span); td1.appendChild(wrap); }else{ td1.textContent=r.name; } const td2=document.createElement('td'); td2.textContent=r.joined||'-'; const td3=document.createElement('td'); td3.textContent=(r.trillions!=null)?r.trillions:'-'; tr.append(td1,td2,td3); tb.appendChild(tr); }); } fillTable('ogTable',OG_DATA,true); fillTable('ecTable',EC_DATA,false); fillTable('scTable',SC_DATA,false);
})();

// ===== Glitch engine =====
let glitchTimer=null;
function startEndlessGlitch(el, target){ stopEndlessGlitch(); const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%'; glitchTimer=setInterval(()=>{ let out=''; for(let i=0;i<target.length;i++){ out+= (target[i]===' ')? ' ' : chars[Math.floor(Math.random()*chars.length)]; } el.textContent=out; },60); }
function stopEndlessGlitch(){ if(glitchTimer){ clearInterval(glitchTimer); glitchTimer=null; } }
function glitchScrambleReveal(finalText, el){
  return new Promise((resolve)=>{
    stopEndlessGlitch();
    const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%';
    const target=finalText.split('');
    const start=performance.now(); const duration=900;
    function frame(now){
      const p=Math.min(1,(now-start)/duration);
      let out='';
      for(let i=0;i<target.length;i++){
        const fixed=Math.random()<p; const ch=target[i];
        out+= (ch===' ' || fixed)? ch : chars[Math.floor(Math.random()*chars.length)];
      }
      el.textContent=out;
      if(p<1) requestAnimationFrame(frame);
      else{ el.textContent=finalText; resolve(); }
    }
    requestAnimationFrame(frame);
  });
}

// ===== Wizard =====
(function(){
  const wizard = qs('#wizard');
  const openBtn = qs('#ctaBtn') || qsa('button').find(b => /create my score card/i.test(b.textContent||''));
  if(!wizard){ return; }
  function step(n){ qsa('.wizard-step').forEach(s=> s.classList.toggle('hidden', s.getAttribute('data-step') !== String(n))); }
  function openWizard(){ wizard.classList.remove('hidden'); wizard.setAttribute('aria-hidden','false'); step(1); nickInput?.focus(); }
  function closeWizard(){ stopEndlessGlitch(); wizard.classList.add('hidden'); wizard.setAttribute('aria-hidden','true'); }

  // inputs
  const nickInput = qs('#nickInput');
  const walletInput = qs('#walletInput');
  const avatarInput = qs('#avatarInput');
  const avatarPreview = qs('#avatarPreview');
  const fileName = qs('#fileName');

  // buttons
  const wClose = qs('#wClose');
  const wCancel = qs('#wCancel');
  const wNext = qs('#wNext');
  const wBack2 = qs('#wBack2');
  const wNext2 = qs('#wNext2');
  const wBack3 = qs('#wBack3');
  const wNext3 = qs('#wNext3');
  const wBack4 = qs('#wBack4');
  const wNext4 = qs('#wNext4');
  const wBack5 = qs('#wBack5');
  const wFinish = qs('#wFinish');

  // displays
  const roleText = qs('#roleText');
  const joinText = qs('#joinText');
  const trillionsText = qs('#trillionsText');
  const stableShareText = qs('#stableShareText');

  // Dynamically add Step 2m (manual) so HTML stays intact
  const panel = wizard.querySelector('.wizard-panel');
  let step2m = wizard.querySelector('[data-step="2m"]');
  if(!step2m){
    step2m = document.createElement('div');
    step2m.className = 'wizard-step hidden';
    step2m.setAttribute('data-step','2m');
    step2m.innerHTML = `
      <h3 class="w-title">We couldn't gather your data. Please enter manually.</h3>
      <label class="w-label" for="manualRole">Your Role</label>
      <select id="manualRole" class="w-input">
        <option value="Plasma OG 👑">Plasma OG 👑</option>
        <option value="SC Contributor">SC Contributor</option>
        <option value="Early Contributor">Early Contributor</option>
        <option value="Community Team">Community Team</option>
        <option value="Plasma Team">Plasma Team</option>
        <option value="Verified" selected>Verified</option>
      </select>
      <label class="w-label" for="manualJoin">Date of joining</label>
      <input id="manualJoin" class="w-input" type="text" placeholder="dd.mm.yyyy" autocomplete="off" />
      <div class="w-actions">
        <button class="w-btn" id="wBack2m">Back</button>
        <button class="w-btn primary" id="wNext2m">Next</button>
      </div>`;
    panel.appendChild(step2m);
  }
  const manualRole = ()=> qs('#manualRole');
  const manualJoin = ()=> qs('#manualJoin');
  const wBack2m = ()=> qs('#wBack2m');
  const wNext2m = ()=> qs('#wNext2m');

  // CTA open
  openBtn?.addEventListener('click', openWizard);
  wClose?.addEventListener('click', closeWizard);
  wCancel?.addEventListener('click', closeWizard);

  // file preview
  avatarInput?.addEventListener('change', ()=>{
    const file = avatarInput.files && avatarInput.files[0];
    fileName.textContent = file ? file.name : 'No file selected';
    if(!file){ avatarPreview.style.backgroundImage=''; avatarPreview.setAttribute('aria-hidden','true'); return; }
    const reader = new FileReader();
    reader.onload = e=>{ avatarPreview.style.backgroundImage = `url('${e.target.result}')`; avatarPreview.setAttribute('aria-hidden','false'); };
    reader.readAsDataURL(file);
  });

  function findUser(nick){
  const n = normalizeNick(nick);
  const pick =
    OG_DATA.find(x => normalizeNick(x.name) === n) ||
    EC_DATA.find(x => normalizeNick(x.name) === n) ||
    SC_DATA.find(x => normalizeNick(x.name) === n) ||
    COMMUNITY_TEAM.find(x => normalizeNick(x.name) === n) ||
    PLASMA_TEAM.find(x => normalizeNick(x.name) === n);

  if (!pick) return null;

  const derivedRole =
    pick.role ||
    (EC_DATA.includes(pick) ? 'Early Contributor' :
     SC_DATA.includes(pick) ? 'SC Contributor' :
     'Verified');

  return {
    name: pick.name,
    role: derivedRole,
    joined: pick.joined || '-',
    trillions: pick.trillions ?? '-',
  };
}

  let currentUser = null;
  let manualFlow = false;

  // Step 1 -> 2 or 2m
  wNext?.addEventListener('click', ()=>{
    const nick = (nickInput?.value || '').trim();
    const wallet = (walletInput?.value || '').trim();
    if(!nick){ alert('Enter nickname'); nickInput?.focus(); return; }
    if(!wallet){ alert('Enter wallet'); walletInput?.focus(); return; }
    try{ localStorage.setItem('plasmaScoreCard', JSON.stringify({nick, wallet, ts: Date.now()})); }catch(_){}
    currentUser = findUser(nick);
    if(currentUser){
      manualFlow = false;
      step(2);
      wNext2?.setAttribute('disabled','disabled');
      const role = currentUser.role || 'Verified';
      startEndlessGlitch(roleText, role);
      let done=false;
      const finish=()=>{ if(done) return; done=true; glitchScrambleReveal(role, roleText).then(()=> wNext2?.removeAttribute('disabled')); };
      const t=setTimeout(()=>{ finish(); }, 1200);
      roleText.onclick=()=>{ clearTimeout(t); finish(); };
    } else {
      manualFlow = true;
      step('2m');
      manualRole().value = 'Verified';
      manualJoin().value = '';
    }
  });

  // Known flow: 2 -> 3 -> 4 -> 5
  wBack2?.addEventListener('click', ()=>{ stopEndlessGlitch(); step(1); });
  wNext2?.addEventListener('click', ()=>{
    step(3);
    wNext3?.setAttribute('disabled','disabled');
    const joined = currentUser ? currentUser.joined : '-';
    startEndlessGlitch(joinText, joined);
    let done=false;
    const finish=()=>{ if(done) return; done=true; glitchScrambleReveal(joined, joinText).then(()=> wNext3?.removeAttribute('disabled')); };
    const t=setTimeout(()=>{ finish(); }, 1200);
    joinText.onclick=()=>{ clearTimeout(t); finish(); };
  });

  wBack3?.addEventListener('click', ()=>{ stopEndlessGlitch(); step(2); });
  wNext3?.addEventListener('click', ()=>{
    step(4);
    wNext4?.setAttribute('disabled','disabled');
    const tri = currentUser && currentUser.trillions!=null ? String(currentUser.trillions) : '-';
    startEndlessGlitch(trillionsText, tri);
    let done=false;
    const finish=()=>{ if(done) return; done=true; glitchScrambleReveal(tri, trillionsText).then(()=> wNext4?.removeAttribute('disabled')); };
    const t=setTimeout(()=>{ finish(); }, 1200);
    trillionsText.onclick=()=>{ clearTimeout(t); finish(); };
  });

  wBack4?.addEventListener('click', ()=>{ stopEndlessGlitch(); step(3); });
  wNext4?.addEventListener('click', async ()=>{
    step(5);
    wFinish?.setAttribute('disabled','disabled');
    const wallet = (walletInput?.value || '').trim();
    startEndlessGlitch(stableShareText, '00.00%');
    let share = '0.00%';
    try{
      if(wallet){
        const { percentage } = await getPortfolioBreakdown(wallet);
        share = `${percentage.toFixed(2)}%`;
      }
    }catch(e){ console.warn('Stable share error', e); }
    let done=false;
    const finish=()=>{ if(done) return; done=true; glitchScrambleReveal(share, stableShareText).then(()=> wFinish?.removeAttribute('disabled')); };
    const t=setTimeout(()=>{ finish(); }, 1200);
    stableShareText.onclick=()=>{ clearTimeout(t); finish(); };
  });

  // Manual flow: 2m -> 5 (only stable share reveal) with date guard >= 17.10.2024
  wBack2m().addEventListener('click', ()=>{ step(1); });
  wNext2m().addEventListener('click', ()=>{
    // date guard
    const minDate = new Date('2024-10-17');
    const raw = (manualJoin().value||'').trim();
    if(raw){
      const parts = raw.split('.');
      if(parts.length === 3){
        const d = new Date(parts[2], parts[1]-1, parts[0]);
        if(isNaN(d.getTime())){
          alert('Enter date in format dd.mm.yyyy');
          return;
        }
        if(d < minDate){
          alert('Date cannot be earlier than 17.10.2024');
          return;
        }
      }
    }
    const roleSel = manualRole().value || 'Verified';
    const joinVal = raw || '-';
    // silently assign trillions 10..100
    const silentTri = Math.floor(Math.random()*91) + 10;
    currentUser = { name: (nickInput?.value||'').trim(), role: roleSel, joined: joinVal, trillions: silentTri };
    step(5);
    wFinish?.setAttribute('disabled','disabled');
    const wallet = (walletInput?.value || '').trim();
    startEndlessGlitch(stableShareText, '00.00%');
    (async ()=>{
      let share = '0.00%';
      try{
        if(wallet){
          const { percentage } = await getPortfolioBreakdown(wallet);
          share = `${percentage.toFixed(2)}%`;
        }
      }catch(e){ console.warn('Stable share error', e); }
      let done=false;
      const finish=()=>{ if(done) return; done=true; glitchScrambleReveal(share, stableShareText).then(()=> wFinish?.removeAttribute('disabled')); };
      const t=setTimeout(()=>{ finish(); }, 1200);
      stableShareText.onclick=()=>{ clearTimeout(t); finish(); };
    })();
  });

  // Finish
  wBack5?.addEventListener('click', ()=>{ if(manualFlow){ step('2m'); } else { step(4); } });
  wFinish?.addEventListener('click', ()=>{ closeWizard(); });

  // Enter -> primary
  wizard.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      const primary = qs('.wizard-step:not(.hidden) .w-btn.primary');
      primary?.click();
    }
  });

  // Ensure CTA clickable even with overlay
  const cta = openBtn;
  if (cta){
    const style = window.getComputedStyle(cta);
    if (style.pointerEvents === 'none'){ cta.style.pointerEvents = 'auto'; }
    cta.style.zIndex = 10;
    cta.style.position = 'relative';
  }
})();


// ---- Reveal on scroll (How it works, footer, love) ----
(function(){
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    for (const e of entries){
      if (e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  els.forEach(el => io.observe(el));
})();

// ---- Background: flying Plasma logos (fallback to circles) ----
(function(){
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
  function resize(){ W = canvas.width = Math.floor(innerWidth*DPR); H = canvas.height = Math.floor(innerHeight*DPR); canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px'; }
  resize(); addEventListener('resize', resize);

  const COUNT = 42;
  const nodes = [];
  function rand(a,b){ return Math.random()*(b-a)+a; }

  const sprite = new Image();
  let useImage = false;
  sprite.onload = ()=>{ useImage = true; };
  sprite.onerror = ()=>{ useImage = false; };
  sprite.src = 'logo.png'; // put logo.png in same folder

  for (let i=0;i<COUNT;i++){
    nodes.push({
      x: Math.random()*W,
      y: Math.random()*H,
      vx: rand(-0.8,0.8),
      vy: rand(-0.6,0.6),
      r: rand(14,22),
      rot: rand(0, Math.PI*2),
      spin: rand(-0.01,0.01)
    });
  }

  const mouse = {x:-9999, y:-9999};
  addEventListener('mousemove', e=>{ mouse.x = e.clientX*DPR; mouse.y = e.clientY*DPR; });
  addEventListener('mouseleave', ()=>{ mouse.x = mouse.y = -9999; });

  function tick(){
    ctx.clearRect(0,0,W,H);
    for (const n of nodes){
      const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx,dy) || 1;
      if (d < 140*DPR){ n.vx += (dx/d)*0.08; n.vy += (dy/d)*0.08; }
      n.x += n.vx; n.y += n.vy; n.rot += n.spin;
      if (n.x < -40) { n.x = W+40; } if (n.x > W+40) { n.x = -40; }
      if (n.y < -40) { n.y = H+40; } if (n.y > H+40) { n.y = -40; }

      if (useImage){
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(n.rot);
        ctx.globalAlpha = 0.9;
        ctx.shadowColor = '#569F8C';
        ctx.shadowBlur = 24*DPR;
        const s = n.r*DPR;
        ctx.drawImage(sprite, -s, -s, s*2, s*2);
        ctx.restore();
      } else {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#162F29';
        ctx.shadowColor = '#569F8C';
        ctx.shadowBlur = 18*DPR;
        ctx.beginPath(); ctx.arc(n.x, n.y, (n.r*0.55)*DPR, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();


/* ======== Reveal on scroll for .reveal elements ======== */
(function(){
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    for (const e of entries){
      if (e.isIntersecting){
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  els.forEach(el => io.observe(el));
})();

/* ======== Background: flying Plasma logos (fallback to circles) ======== */
(function(){
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, DPR = Math.min(window.devicePixelRatio || 1, 2);
  function resize(){
    W = canvas.width  = Math.floor(innerWidth * DPR);
    H = canvas.height = Math.floor(innerHeight * DPR);
    canvas.style.width  = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
  }
  resize();
  addEventListener('resize', resize);

  const COUNT = 48;
  const nodes = [];
  function rand(a,b){ return Math.random()*(b-a)+a; }

  const sprite = new Image();
  let useImage = false;
  sprite.onload  = ()=>{ useImage = true; };
  sprite.onerror = ()=>{ useImage = false; };
  sprite.src = 'logo.png'; // optional; put logo.png next to index.html

  for (let i=0;i<COUNT;i++){
    nodes.push({
      x: Math.random()*W,
      y: Math.random()*H,
      vx: rand(-0.8,0.8),
      vy: rand(-0.6,0.6),
      r: rand(14,22),
      rot: rand(0, Math.PI*2),
      spin: rand(-0.01,0.01)
    });
  }

  const mouse = {x:-9999, y:-9999};
  addEventListener('mousemove', e=>{ mouse.x = e.clientX*DPR; mouse.y = e.clientY*DPR; });
  addEventListener('mouseleave', ()=>{ mouse.x = mouse.y = -9999; });

  function tick(){
    ctx.clearRect(0,0,W,H);
    for (const n of nodes){
      const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx,dy) || 1;
      if (d < 140*DPR){ n.vx += (dx/d)*0.08; n.vy += (dy/d)*0.08; }

      n.x += n.vx; n.y += n.vy; n.rot += n.spin;

      if (n.x < -40)      n.x = W+40;
      else if (n.x > W+40) n.x = -40;
      if (n.y < -40)      n.y = H+40;
      else if (n.y > H+40) n.y = -40;

      if (useImage){
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(n.rot);
        ctx.globalAlpha = 0.9;
        ctx.shadowColor = '#569F8C';
        ctx.shadowBlur = 24*DPR;
        const s = n.r*DPR;
        ctx.drawImage(sprite, -s, -s, s*2, s*2);
        ctx.restore();
      } else {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = '#162F29';
        ctx.shadowColor = '#569F8C';
        ctx.shadowBlur = 18*DPR;
        ctx.beginPath();
        ctx.arc(n.x, n.y, (n.r*0.55)*DPR, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ======== Ensure CTA is always clickable (z-index, pointer-events) ======== */
(function(){
  const cta = document.getElementById('ctaBtn') || Array.from(document.querySelectorAll('button')).find(b => /create my score card/i.test((b.textContent||'').toLowerCase()));
  if (!cta) return;
  const cs = getComputedStyle(cta);
  if (cs.pointerEvents === 'none') cta.style.pointerEvents = 'auto';
  cta.style.zIndex = 11;
  cta.style.position = 'relative';
})();
