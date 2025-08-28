'use strict';

/* =====================================================
   Plasma Pre-Trillions - script.js (stable share enabled)
   - CTA works even if selector differs
   - Wizard steps 1..5
   - Real stablecoin % via Covalent with robust fallbacks
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

// ===== Helpers =====
const qs = (sel, root=document) => root.querySelector(sel);
const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// ===== Stablecoin checker (Covalent) =====
// User key embedded
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

// ===== Simple slider (if present) =====
(function(){
  const cards = qsa('.r-card');
  if(cards.length === 0) return;
  let idx = 0;
  setInterval(()=>{
    cards[idx].classList.remove('active');
    idx = (idx + 1) % cards.length;
    cards[idx].classList.add('active');
  }, 3000);
})();

// ===== 3D tilt demo (if present) =====
(function(){
  const wrap = qs('#demoWrap');
  const card = qs('#demoCard');
  if(!wrap || !card) return;
  wrap.addEventListener('mousemove', (e)=>{
    const r = wrap.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rotY = ((x - r.width/2) / (r.width/2)) * 10;
    const rotX = -((y - r.height/2) / (r.height/2)) * 10;
    card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.boxShadow = `${-rotY*1.2}px ${12+rotX*0.6}px 40px rgba(10,21,18,0.35)`;
  });
  wrap.addEventListener('mouseleave', ()=>{
    card.style.transform = 'rotateX(0) rotateY(0)';
    card.style.boxShadow = '0 18px 50px rgba(10,21,18,0.35)';
  });
})();

// ===== Button sparks (if present) =====
(function(){
  const btn = qs('#ctaBtn') || qsa('button').find(b => /create my score card/i.test(b.textContent||''));
  if(!btn) return;
  let timer = null;
  function spark(e){
    const s = document.createElement('span');
    s.className = 'spark';
    s.style.left = (e.offsetX||8) + 'px';
    s.style.top = (e.offsetY||8) + 'px';
    btn.appendChild(s);
    setTimeout(()=> s.remove(), 600);
  }
  btn.addEventListener('mouseenter', (e)=>{ timer = setInterval(()=> spark(e), 200); });
  btn.addEventListener('mouseleave', ()=>{ clearInterval(timer); timer=null; });
})();

// ===== Community tables (if present) =====
(function(){
  function fillTable(id, rows, withOgIcon){
    const tb = qs('#'+id+' tbody');
    if(!tb) return;
    tb.innerHTML = '';
    rows.forEach(r=>{
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      if(withOgIcon){
        const wrap = document.createElement('div'); wrap.className='name-with-icon';
        const ic = document.createElement('img'); ic.src='og.png'; ic.alt='OG';
        const span = document.createElement('span'); span.textContent = r.name;
        wrap.append(ic, span); td1.appendChild(wrap);
      }else{ td1.textContent = r.name; }
      const td2 = document.createElement('td'); td2.textContent = r.joined || '-';
      const td3 = document.createElement('td'); td3.textContent = (r.trillions!=null)? r.trillions : '-';
      tr.append(td1, td2, td3); tb.appendChild(tr);
    });
  }
  fillTable('ogTable', OG_DATA, true);
  fillTable('ecTable', EC_DATA, false);
  fillTable('scTable', SC_DATA, false);
})();

// ===== Glitch engine =====
let glitchTimer=null;
function startEndlessGlitch(el, target){
  stopEndlessGlitch();
  const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%';
  glitchTimer=setInterval(()=>{
    let out='';
    for(let i=0;i<target.length;i++){
      const ch=target[i];
      out+= (ch===' ')? ' ' : chars[Math.floor(Math.random()*chars.length)];
    }
    el.textContent=out;
  },60);
}
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

  // display fields
  const roleText = qs('#roleText');
  const joinText = qs('#joinText');
  const trillionsText = qs('#trillionsText');
  const stableShareText = qs('#stableShareText');

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
    const n = nick.trim().toLowerCase();
    const f = OG_DATA.find(x => String(x.name).toLowerCase() === n) ||
              EC_DATA.find(x => String(x.name).toLowerCase() === n) ||
              SC_DATA.find(x => String(x.name).toLowerCase() === n);
    if(!f) return null;
    return { name: f.name, role: f.role || (EC_DATA.includes(f)?'Early Contributor':'SC Contributor'), joined: f.joined || '-', trillions: f.trillions ?? '-' };
  }
  let currentUser = null;

  // Step 1 -> 2
  wNext?.addEventListener('click', ()=>{
    const nick = (nickInput?.value || '').trim();
    const wallet = (walletInput?.value || '').trim();
    if(!nick){ alert('Enter nickname'); nickInput?.focus(); return; }
    if(!wallet){ alert('Enter wallet'); walletInput?.focus(); return; }
    try{ localStorage.setItem('plasmaScoreCard', JSON.stringify({nick, wallet, ts: Date.now()})); }catch(_){}
    currentUser = findUser(nick);
    step(2);
    wNext2?.setAttribute('disabled','disabled');
    const role = currentUser ? currentUser.role : 'Verified';
    startEndlessGlitch(roleText, role);
    let done=false;
    const finish=()=>{ if(done) return; done=true; glitchScrambleReveal(role, roleText).then(()=> wNext2?.removeAttribute('disabled')); };
    const t=setTimeout(()=>{ finish(); }, 1200);
    roleText.onclick=()=>{ clearTimeout(t); finish(); };
  });

  // Step 2 -> 3
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

  // Step 3 -> 4
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

  // Step 4 -> 5
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

  // Finish
  wBack5?.addEventListener('click', ()=>{ stopEndlessGlitch(); step(4); });
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
