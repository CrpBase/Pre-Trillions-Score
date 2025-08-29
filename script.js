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

function normalizeNick(raw){
  return String(raw||'')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g,'')
    .replace(/@/g,'')
    .replace(/#[0-9]{4}\b/g,'')
    .replace(/\s+/g,'')
    .toLowerCase()
    .replace(/[^a-z0-9]/g,'');
}


// ======= Roster parsed from inline CSV (role,ds,name,joined,trillions) =======
const ROSTER_CSV = `Early,yurii_eth,YURII,29.04.2025,26
Early,duytu,Manners,18.03.2025,118
Early,bad_friend,bad friend,18.03.2025,118
Early,bakba,Bakbar hippo,23.03.2025,85
Early,bigbossss2285,bigbossss,26.03.2025,80
Early,_bobdbldr,Bobddbr IVX,19.05.2025,13
Early,.callmecs,CS,13.03.2025,144
Early,davincinft,Davinci,16.02.2025,458
Early,dimaflexx,dimafllexx,28.04.2025,62
Early,don0tcallme,doNotCallMe,19.04.2025,129
Early,dora_lsk,Dora Lak,28.04.2025,92
Early,luvflorence,Florence,27.04.2025,72
Early,flovezen,flovezen,20.04.2025,18
Early,rigzli,Frank,15.04.2025,34
Early,gedeihent,goldcow,27.03.2025,61
Early,0xhabexyz,Habelxius,30.04.2025,15
Early,idaratbn,idara,25.04.2025,6
Early,imbanytui,imbanytui,21.04.2025,14
Early,joomhiko,joom,23.04.2025,64
Early,karty,kartyy,13.03.2025,286
Early,0xktx,Ktx,16.02.2025,34
Early,kiira7094,Kira,31.01.2025,137
Early,kousik0865,Kousik,15.03.2025,336
Early,lloyd229,LLoyD,13.05.2025,121
Early,mirage5815,Lola,13.03.2025,29
Early,lubudebotton,LuBu,17.02.2025,175
Early,mvkise,makise,20.02.2025,0
Early,ntxt,mish,21.10.2025,13
Early,.mmtvr,Momo,23.04.2025,4
Early,mettin4,MTC,03.04.2025,43
Early,omgnicklachey,omgnicklachey,23.03.2025,37
Early,papa1294,papa1294,13.03.2025,19
Early,0xreinn,reinn,17.03.2025,31
Early,ressarawr,ressa,13.03.2025,29
Early,0xsparx,sparx,12.03.2025,0
Early,tomjke,t0mj,23.04.2025,6
Early,tr0uva1lle,tr0uva1lle,13.03.2025,15
Early,dushik0,u69niversal,15.02.2025,97
Early,viktor_0x,Vik Trillions,12.03.2025,74
Early,vo1k0v,Volkov,09.05.2025,69
Early,whatadgabed,whatadgabed,19.03.2025,7
Early,yourm1nd,yourmind,17.07.2025,26
Early,eugeneering,eugeneering,30.06.2025,3
Early,purson.cash,Purson,16.02.2025,26
Early,suskesorg,suskesorg,13.03.2025,26
Early,chaulin.eth,chaulin.eth,07.05.2025,6
Early,seouldatalabs,Seoul Data Labs,24.07.2025,0
Early,0xelegant,elegant,13.02.2025,45
Early,viviocean69,viviocean,06.06.2025,68
Early,miaaaami,miaaaami,05.08.2025,145
Early,dr1mmerr,DR1MMER,12.05.2025,113
Early,serrdavee,Ser Dave,03.06.2025,15
Early,6mirra6,mirra,03.06.2025,67
Early,novogodniyk111d,demon666,03.06.2025,9
Early,connectposh,Posh,04.06.2025,2
Early,tuzhkid,Tuzh,18.06.2025,84
Early,fearmypr3sence,blunt cruiser,03.06.2025,84
Early,snwdnnn,snowden,27.05.2025,82
Early,.ungus,Ungus,28.07.2025,0
SC,0xprune,0xprune,02.04.2025,116
SC,aadvark89,aadvark89,15.03.2025,10
SC,baikan,Baikan,27.03.2025,92
SC,bigray0x,bigray0x.eth,13.02.2025,70
SC,buja723,buja723,28.03.2025,165
SC,cblison,Cb Lison,01.07.2025,20
SC,coinpondo,coinPondo,17.03.2025,111
SC,d1rt.,D1rt,24.03.2025,34
SC,f5959,f5959,22.02.2025,281
SC,faizan5794,Faizan,31.03.2025,40
SC,han.eth,han.eth,19.03.2025,24
SC,ik3377,Ik San,10.04.2025,323
SC,jonathanhnd11,Jonatrillions,16.04.2025,80
SC,starboycrypto1,Kevweb3,14.03.2025,180
SC,jaykaykimkim,kimJ,13.04.2025,38
SC,kolyposts,Koly,20.03.2025,62
SC,cetsnft,Leunsca,13.02.2025,106
SC,thislikee,Liikee,25.03.2025,19
SC,m4lka,m4lka,22.10.2024,6
SC,ondewit,Ondewit,13.03.2025,65
SC,isolatedmargin,p0psicle,18.04.2025,86
SC,penjanga,penjanga,13.05.2025,17
SC,pico.mello,pico.mello,19.03.2025,1
SC,quang250802,Quang,15.02.2025,171
SC,tasherokk,Tasher,20.03.2025,81
SC,vo1tak,Voltak,01.05.2025,183
SC,wandor0,Wandor,19.10.2024,25
SC,web3_pundit,Web3Pundit,17.03.2025,18
SC,mh17x,Zeus | Trillions,13.02.2025,48
SC,aabislone,aabis,13.03.2025,417
OG,badjon1,badjon,12.03.2025,37
OG,op_catt,CATT,14.02.2025,82
OG,cryptobase,crpbase,15.03.2025,108
OG,dirty_squirrel1,Dirty Squirrel,17.03.2025,142
OG,0xfungie,fungie,05.01.2025,329
OG,happysubstack,Happy,13.03.2025,80
OG,jojo.ck,jojo.usdt,25.03.2025,595
OG,illu6089,Lennart,31.03.2025,0
OG,ranga.mario,Mario,29.03.2025,241
OG,onlinelink,onlinelink,27.03.2025,86
OG,primay_eth,primay.eth,15.03.2025,468
OG,esmart13,Smart,22.10.2024,65
OG,techaddict7,Techaddict,14.02.2025,670
COM,scenescene,scene,18.10.2024,644
COM,0xg00gly,Googly,09.02.2025,3
COM,rongplace,rongplace,19.10.2024,7
COM,kay00nee,kay00nee,03.04.2025,0
COM,0xlightx,Max Apoz,18.02.2025,209
COM,shadowofthefax,shadowfax,14.03.2025,317
PLASMA,pauliepunt,Paul,18.10.2024,0
PLASMA,splitcapital,Zzz,17.10.2024,3
PLASMA,proofof_nathan,Nathan,05.02.2025,407
PLASMA,lucidxpl,Lucid,17.10.2024,9`;
const ROSTER = ROSTER_CSV.split(/\n+/).map(line=>{
  const clean = line.replace(/["“”’']/g,'').replace(/\s+,/g, ',').trim();
  if(!clean) return null;
  const [cat, ds, name, joined, trillions] = clean.split(',').map(x=>x?.trim?.()||'');
  const role = ({'Early':'Early Contributor','SC':'SC Contributor','OG':'Plasma OG 👑','COM':'Community Team','PLASMA':'Plasma Team'})[cat] || 'Verified';
  return { cat, ds, name, joined, trillions: Number(trillions)||0, role };
}).filter(Boolean);
// Fast maps for lookup
const MAP_BY_DS = new Map(ROSTER.filter(r=>r.ds).map(r=>[normalizeNick(r.ds), r]));
const MAP_BY_NAME = new Map(ROSTER.filter(r=>r.name).map(r=>[normalizeNick(r.name), r]));

// override findUser to use DS or Name and prefer Name for display
function findUser(nickOrName){
  const n = normalizeNick(nickOrName);
  if(!n) return null;
  const byDS = MAP_BY_DS.get(n);
  const byNAME = MAP_BY_NAME.get(n);
  let pick = byDS || byNAME;
  if(!pick){
    for(const r of ROSTER){
      if(normalizeNick(r.ds).includes(n) || normalizeNick(r.name).includes(n)){ pick = r; break; }
    }
  }
  if(!pick) return null;
  function fixDate(s){
    const m = String(s||'').match(/(\d{2})[.\/(\-)](\d{2})[.\/(\-)](\d{2,4})/);
    if(!m) return s||'-';
    let [_, dd, mm, yy] = m;
    if(yy.length===2) yy = '20'+yy;
    return `${dd}.${mm}.${yy}`;
  }
  return { name: pick.name, role: pick.role, joined: fixDate(pick.joined), trillions: pick.trillions };
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

  function findUserLegacy(nick){
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
    if(!nick){ alert('Enter Discord Username'); nickInput?.focus(); return; }
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
  
wFinish?.addEventListener('click', ()=>{
  // Persist avatar dataURL from preview (if any)
  try{
    const bg = (getComputedStyle(avatarPreview||document.createElement('div')).backgroundImage||'')
      .replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    if (bg && /^data:image\//.test(bg)) {
      localStorage.setItem('plasmaAvatarDataURL', bg);
    } else {
      localStorage.removeItem('plasmaAvatarDataURL');
    }
  }catch(_){}

  // Gather values
  const name = (currentUser && currentUser.name) ? currentUser.name : ((nickInput?.value || '').trim() || 'user');
  const role = (currentUser && currentUser.role) ? currentUser.role : 'Verified';
  const trillions = (currentUser && currentUser.trillions != null) ? currentUser.trillions : 0;
  const joined = (currentUser && currentUser.joined) ? currentUser.joined : '17.10.2024';
  const stableText = (stableShareText?.textContent || '0').replace('%','').trim();
  const stable = parseFloat(stableText) || 0;

  // Compute score and status (for share text only)
  const score = computeFinalScore(role, trillions, joined, stable);
  const tier = tierByScore(score);

  // Persist params (so card.html can read even if URL trimmed by host)
  try{ localStorage.setItem('plasmaCardParams', JSON.stringify({ name, role, trillions, joined, stable, score, tier })); }catch(_){}

  // Build SHORT URL to avoid 502 on GitHub/CDN
  const base = new URL('.', location.href); // handles subfolders
  const url = new URL('card.html', base);
  url.searchParams.set('_v','pt12');
  url.searchParams.set('name', name);
  url.searchParams.set('role', role);
  url.searchParams.set('tri', String(trillions));
  url.searchParams.set('joined', joined);
  url.searchParams.set('stable', String(stable));
  // Open
  try { window.open(url.toString(), '_blank', 'noopener'); }
  catch { location.href = url.toString(); }

  closeWizard();
});
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


// ===== Final score formula per spec =====
function rolePoints(role){
  switch(role){
    case 'Plasma Team':
    case 'Community Team': return 1000;
    case 'Plasma OG 👑':
    case 'Plasma OG': return 500;
    case 'SC Contributor': return 400;
    case 'Early Contributor': return 300;
    case 'Verified':
    default: return 200;
  }
}
function stablePoints(pct){ return Math.max(0, Math.min(500, (Number(pct)||0) * 5)); } // 20% => +100, 100% => +500
function joinBonus(joinedStr){
  const ref = new Date(2024,9,17).getTime();
  let d = 0;
  try{
    const [dd,mm,yyyy] = (joinedStr||'').split('.').map(s=>parseInt(s,10));
    if(yyyy){ d = new Date(yyyy,(mm||1)-1,dd||1).getTime(); }
  }catch(_){}
  if(!d || d<ref) d = ref;
  const days = (d - ref)/(1000*3600*24);
  return Math.max(0, Math.round(100 - days/3)); // linear fade ~300 days
}
function computeFinalScore(role, trillions, joinedStr, stablePct){
  const rp = rolePoints(role);
  const tp = Math.max(0, Number(trillions)||0);
  const jb = joinBonus(joinedStr);
  const sp = stablePoints(Number(stablePct));
  return Math.round(rp + tp + jb + sp);
}
function tierByScore(score){
  if(score >= 750) return 'Plasmafia';
  if(score >= 500) return 'Plasmaphile';
  if(score >= 250) return 'Trillions';
  return 'Pre-Trillions';
}

// Store avatar dataURL globally when user selects a file
try{
  const fileInput = document.getElementById('wFile') || document.querySelector('input[type="file"]');
  if (fileInput){
    fileInput.addEventListener('change', (e)=>{
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = ()=>{ window.__plasmaAvatarData = String(reader.result||''); };
      reader.readAsDataURL(f);
    });
  }
}catch(_){}
