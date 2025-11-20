// script.js - multi-page portal controller
const BRACELET_SRC = 'assets/bracelet.png';
const MUSIC_SRC = 'assets/music.mp3'; // place your royalty-free file here (or use mine)

/* ----------------- utilities ----------------- */
function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }
function spawnSpark(x,y){ // sparkle burst on click
  const el = document.createElement('div');
  el.className = 'spark';
  const size = 8 + Math.random()*10;
  el.style.position='absolute';
  el.style.left = (x - size/2) + 'px';
  el.style.top = (y - size/2) + 'px';
  el.style.width = el.style.height = size + 'px';
  el.style.borderRadius = '50%';
  el.style.pointerEvents = 'none';
  el.style.opacity = 1;
  el.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,111,181,0.85))`;
  el.style.boxShadow = `0 0 10px rgba(255,111,181,0.9)`;
  el.style.transform = `translateY(0) scale(0.6)`;
  el.style.transition = 'transform 700ms cubic-bezier(.2,.9,.2,1), opacity 700ms';
  document.body.appendChild(el);
  requestAnimationFrame(()=> {
    el.style.transform = `translateY(${ -30 - Math.random()*40 }px) scale(1) rotate(${Math.random()*90}deg)`;
    el.style.opacity = 0;
  });
  setTimeout(()=> el.remove(), 800);
}

// global sparkle binding
document.addEventListener('click', (e)=>{
  const root = document.body;
  spawnSpark(e.clientX, e.clientY);
});

/* ----------------- MUSIC (starts after user interaction) ----------------- */
function initMusic(){
  // create audio element if not present (per-page may create one too)
  let player = document.getElementById('globalAudio');
  if(!player){
    player = document.createElement('audio');
    player.id = 'globalAudio';
    player.loop = true;
    player.src = MUSIC_SRC;
    player.crossOrigin = 'anonymous';
    player.volume = 0.22;
    document.body.appendChild(player);
  }
  // play only after user gesture: clicking Login or Demo buttons will call playMusic()
}
function playMusic(){
  const p = document.getElementById('globalAudio');
  if(!p) return;
  p.play().catch(()=>{ /* autoplay blocked */ });
}
function toggleMusic(){
  const p = document.getElementById('globalAudio');
  if(!p) return;
  if(p.paused) p.play(); else p.pause();
}

/* ----------------- detect page ----------------- */
const path = location.pathname.split('/').pop() || 'index.html';

/* ----------------- page: index.html (login) ----------------- */
if(path === 'index.html' || path === ''){
  initMusic();
  const btnLogin = document.getElementById('btnLogin');
  const btnDemo = document.getElementById('btnDemo');
  const loginError = document.getElementById('loginError');

  btnLogin && btnLogin.addEventListener('click', ()=>{
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    if(user === 'Shub@princess' && pass === 'Fast-text'){
      loginError.style.display = 'none';
      // start music (user gesture)
      playMusic();
      // animate click spark
      createClickSparkEffect();
      // after small delay, navigate to stage1
      setTimeout(()=> location.href = 'stage1.html', 420);
    } else {
      loginError.style.display = 'block';
      loginError.textContent = 'Invalid credentials — try again';
    }
  });

  btnDemo && btnDemo.addEventListener('click', ()=>{
    playMusic();
    setTimeout(()=> location.href = 'stage1.html', 220);
  });
}

/* ----------------- page: stage1.html ----------------- */
if(path === 'stage1.html'){
  initMusic();
  // questions building
  const STAGE1 = [
    {label:'Favourite White Monster flavour?', choices:['Original White','Zero Chill','Tropical','Classic']},
    {label:'Best Re:Zero character?', choices:['Subaru','Emilia','Rem','Ram']},
    {label:'One workout you secretly like?', choices:['Squats','Cardio','Pulls','Stretching']}
  ];
  const stage1Answers = [];
  const qList = document.getElementById('qList');
  STAGE1.forEach((q,idx) => {
    const wrapper = document.createElement('div'); wrapper.className='q-item';
    const left = document.createElement('div'); left.innerHTML = `<strong>${q.label}</strong><div class="muted" style="font-size:13px">${q.choices.join(' • ')}</div>`;
    const sel = document.createElement('select'); sel.innerHTML = '<option value="">Select</option>' + q.choices.map(c=>`<option value="${c}">${c}</option>`).join('');
    sel.addEventListener('change', ()=> stage1Answers[idx] = sel.value);
    wrapper.appendChild(left); wrapper.appendChild(sel); qList.appendChild(wrapper);
  });

  document.getElementById('btnStage1Next').addEventListener('click', ()=>{
    const answered = stage1Answers.filter(Boolean).length;
    if(answered === 0){
      document.getElementById('stage1Note').textContent = 'Answer at least one for coins, or skip to continue.';
      return;
    }
    const coins = (parseInt(localStorage.getItem('portal_coins')||'0')) + answered * 2;
    localStorage.setItem('portal_coins', String(coins));
    document.getElementById('stage1Note').textContent = 'Yes, you are princess';
    // sparkle feedback
    spawnSpark(window.innerWidth/2, window.innerHeight/2);
    // go to next page after small delay
    setTimeout(()=> location.href = 'tictactoe.html', 800);
  });

  document.getElementById('btnStage1Skip').addEventListener('click', ()=> location.href = 'tictactoe.html');
}

/* ----------------- page: stage2.html (anime questions) ----------------- */
if(path === 'stage2.html'){
  initMusic();
  const ANIME_Q = [
    {label:'Favorite Re:Zero scene?', choices:['Emilia rescue','Subaru struggle','Rem confession','Battle scenes']},
    {label:'OST vibe you prefer?', choices:['Melancholic piano','Epic orchestra','Slow synth','Gentle strings']},
  ];
  const ans = [];
  const wrap = document.getElementById('animeQList');
  ANIME_Q.forEach((q,idx)=>{
    const w = document.createElement('div'); w.className='q-item';
    w.innerHTML = `<div><strong>${q.label}</strong><div class="muted" style="font-size:13px">${q.choices.join(' • ')}</div></div>`;
    const sel = document.createElement('select'); sel.innerHTML = '<option value="">Select</option>' + q.choices.map(c=>`<option>${c}</option>`).join('');
    sel.addEventListener('change', ()=> ans[idx]=sel.value);
    w.appendChild(sel); wrap.appendChild(w);
  });
  document.getElementById('btnAnimeNext').addEventListener('click', ()=>{
    const done = ans.filter(Boolean).length;
    if(!done){ document.getElementById('stage2Note').textContent = 'Pick one if you can — but still proceed.'; return; }
    localStorage.setItem('portal_anime', JSON.stringify(ans));
    document.getElementById('stage2Note').textContent = 'Saved. Continue to next.';
    setTimeout(()=> location.href = 'stage3.html', 600);
  });
}

/* ----------------- page: stage3.html (inside jokes) ----------------- */
if(path === 'stage3.html'){
  initMusic();
  const btnNext = document.getElementById('btnJokesNext');
  btnNext.addEventListener('click', ()=>{
    const heart = document.getElementById('heartText').value.trim();
    localStorage.setItem('portal_jokes', JSON.stringify(["Yes, you are princess","Zyada uda na karo janab","Jaldi reply kar diya karo"]));
    if(heart) localStorage.setItem('portal_heart', heart);
    spawnSpark(window.innerWidth/2, window.innerHeight/2);
    setTimeout(()=> location.href = 'stage4.html', 600);
  });
}

/* ----------------- page: stage4.html (emotional support) ----------------- */
if(path === 'stage4.html'){
  initMusic();
  document.getElementById('btnCommitNext').addEventListener('click', ()=>{
    const commit = document.getElementById('commitText').value.trim();
    if(commit) localStorage.setItem('portal_commit', commit);
    spawnSpark(window.innerWidth/2, window.innerHeight/2);
    setTimeout(()=> location.href = 'stage2.html', 500); // move to anime page (or next requested)
  });
}

/* ----------------- page: tictactoe.html (medium AI) ----------------- */
if(path === 'tictactoe.html'){
  initMusic();
  // medium AI: 60% optimal (minimax), 40% random among available
  let board = Array(9).fill(null);
  const boardEl = document.getElementById('tttBoard');
  function renderBoard(){
    boardEl.innerHTML = '';
    for(let i=0;i<9;i++){
      const cell = document.createElement('div'); cell.className='cell'; cell.dataset.i=i;
      cell.textContent = board[i] || '';
      cell.addEventListener('click', ()=> humanPlay(i));
      boardEl.appendChild(cell);
    }
    const w = checkWinner(board);
    const status = document.getElementById('tttStatus');
    if(w) status.textContent = w==='X' ? 'You won!' : 'AI won.';
    else if(board.every(Boolean)) status.textContent = 'Draw.';
    else status.textContent = 'Your move.';
  }
  function humanPlay(i){
    if(board[i] || checkWinner(board)) return;
    board[i] = 'X'; renderBoard();
    if(checkWinner(board) || board.every(Boolean)) return;
    setTimeout(aiMove, 260);
  }
  function aiMove(){
    // 60% chance use minimax, else pick a random good move
    const chance = Math.random();
    let move = null;
    if(chance < 0.6){
      move = minimaxRoot(board, 'O');
    } else {
      const available = board.map((v,i)=> v?null:i).filter(x=>x!==null);
      move = available[Math.floor(Math.random()*available.length)];
    }
    if(move!=null) board[move] = 'O';
    renderBoard();
  }
  function checkWinner(b){
    const L = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(const ln of L){ const [a,b1,c]=ln; if(b[a] && b[a]===b[b1] && b[a]===b[c]) return b[a]; }
    return null;
  }
  function minimaxRoot(bs, player){
    const avail = bs.map((v,i)=> v?null:i).filter(x=>x!==null);
    let best=-Infinity, move=null;
    for(const i of avail){
      bs[i]=player;
      const score = minimax(bs,0,false);
      bs[i]=null;
      if(score>best){ best=score; move=i; }
    }
    return move;
  }
  function minimax(bs, depth, isMax){
    const res = checkWinner(bs);
    if(res==='O') return 10-depth;
    if(res==='X') return depth-10;
    if(bs.every(Boolean)) return 0;
    if(isMax){
      let best=-Infinity;
      for(let i=0;i<9;i++) if(!bs[i]){ bs[i]='O'; best=Math.max(best,minimax(bs,depth+1,false)); bs[i]=null; }
      return best;
    } else {
      let best=Infinity;
      for(let i=0;i<9;i++) if(!bs[i]){ bs[i]='X'; best=Math.min(best,minimax(bs,depth+1,true)); bs[i]=null; }
      return best;
    }
  }
  document.getElementById('btnTttReset').addEventListener('click', ()=> { board = Array(9).fill(null); renderBoard(); document.getElementById('tttStatus').textContent='Board reset.'; });
  renderBoard();
}

/* ----------------- page: scratch.html (improved scratch card) ----------------- */
if(path === 'scratch.html'){
  initMusic();
  const canvas = document.getElementById('scratchCanvas');
  const img = document.getElementById('braceletUnder');
  img.src = BRACELET_SRC;

  function resize(){
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(300, Math.floor(rect.width * devicePixelRatio));
    canvas.height = Math.max(200, Math.floor(rect.height * devicePixelRatio));
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }
  resize(); window.addEventListener('resize', resize);
  const ctx = canvas.getContext('2d');

  // create metallic foil overlay
  function initOverlay(){
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#a1a1a1';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    // pattern
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = '#fff';
    for(let i=0;i<canvas.width;i+=40) ctx.fillRect(i,0,20,canvas.height);
    ctx.globalAlpha = 1;
  }
  initOverlay();

  let isDown=false;
  function getPos(e){
    const r = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - r.left) * devicePixelRatio, y: (cy - r.top) * devicePixelRatio };
  }
  function scratchAt(e){
    const p = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    const radius = 40 * devicePixelRatio;
    ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI*2); ctx.fill();
    // spark particle while scratching
    spawnSpark(p.x/devicePixelRatio, p.y/devicePixelRatio);
  }
  canvas.addEventListener('pointerdown', (e)=>{ isDown=true; scratchAt(e); });
  canvas.addEventListener('pointermove', (e)=>{ if(isDown) scratchAt(e); });
  window.addEventListener('pointerup', ()=>{ if(isDown){ isDown=false; checkPercent(); } });
  // touch
  canvas.addEventListener('touchstart', (e)=>{ isDown=true; scratchAt(e); e.preventDefault(); });
  canvas.addEventListener('touchmove', (e)=>{ if(isDown){ scratchAt(e); e.preventDefault(); } });
  canvas.addEventListener('touchend', ()=>{ if(isDown){ isDown=false; checkPercent(); } });

  function checkPercent(){
    try{
      const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
      let trans=0;
      for(let i=3;i<data.length;i+=4) if(data[i]===0) trans++;
      const total = canvas.width * canvas.height;
      const pct = Math.round(trans/total*100);
      document.getElementById('scratchNote').textContent = `Cleared ${pct}%`;
      if(pct >= 65){
        document.getElementById('btnScratchNext').disabled = false;
        // fully clear overlay elegantly
        ctx.clearRect(0,0,canvas.width,canvas.height);
        document.getElementById('scratchNote').textContent = 'Bracelet revealed — continue!';
      }
    }catch(e){
      // if cross-origin or read error allow continue
      document.getElementById('btnScratchNext').disabled = false;
      document.getElementById('scratchNote').textContent = 'Scratch unavailable — click Continue';
    }
  }

  document.getElementById('btnScratchReset').addEventListener('click', ()=> { initOverlay(); document.getElementById('btnScratchNext').disabled = true; document.getElementById('scratchNote').textContent = 'Scratch to reveal the bracelet.'; });
  document.getElementById('btnScratchNext').addEventListener('click', ()=> { const coins = (parseInt(localStorage.getItem('portal_coins')||'0')) + 6; localStorage.setItem('portal_coins', String(coins)); location.href = 'certificate.html'; });
}

/* ----------------- page: certificate.html ----------------- */
if(path === 'certificate.html'){
  initMusic();
  const canvas = document.getElementById('certCanvas');
  function draw(){
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#061018'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#fff8fb'; roundRect(ctx,64,64,W-128,H-148,20,true,false);
    ctx.fillStyle = '#3b0d26'; ctx.font = '32px Orbitron, monospace'; ctx.textAlign='center';
    ctx.fillText('Certificate of Eternal Friendship', W/2, 140);
    ctx.font = '56px Poppins, sans-serif'; ctx.fillStyle = '#04101a'; ctx.fillText('SHUB', W/2, 220);
    ctx.font = '20px Poppins'; ctx.fillStyle = '#2b2b35';
    const para = localStorage.getItem('portal_heart') || localStorage.getItem('portal_commit') || 'You are forcefully enforced for this friendship, no way to escape. This includes anime marathons, gym encouragement, and always listening.';
    wrapText(ctx, para, W/2, 270, W-320, 28);

    const img = new Image(); img.crossOrigin='anonymous';
    img.onload = function(){
      const iw = 320, ih = 320;
      ctx.drawImage(img, W/2 - iw/2, 420, iw, ih);
      ctx.beginPath(); ctx.fillStyle='rgba(255,111,181,0.12)'; ctx.arc(W-160,H-160,72,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0f1720'; ctx.font='16px Poppins'; ctx.fillText('PRINCESS SEAL', W-160, H-156);
    };
    img.onerror = function(){
      ctx.beginPath(); ctx.fillStyle='rgba(255,111,181,0.12)'; ctx.arc(W-160,H-160,72,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#0f1720'; ctx.font='16px Poppins'; ctx.fillText('PRINCESS SEAL', W-160, H-156);
    };
    img.src = BRACELET_SRC;
  }
  draw();

  document.getElementById('btnDownloadCert').addEventListener('click', ()=>{
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a'); a.href = url; a.download = 'Shub_certificate.png'; a.click();
  });

  document.getElementById('btnRestart').addEventListener('click', ()=> {
    localStorage.removeItem('portal_coins'); localStorage.removeItem('portal_heart'); localStorage.removeItem('portal_commit');
    location.href = 'index.html';
  });
}

/* ----------------- helper functions ----------------- */
function roundRect(ctx,x,y,w,h,r,fill,stroke){
  if(typeof stroke === 'undefined') stroke = true;
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
  if(fill) ctx.fill(); if(stroke) ctx.stroke();
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  ctx.textAlign='center';
  const words = text.split(' ');
  let line = '', row = 0;
  for(let n=0;n<words.length;n++){
    const testLine = line + words[n] + ' ';
    if(ctx.measureText(testLine).width > maxWidth && n > 0){
      ctx.fillText(line, x, y + row * lineHeight);
      line = words[n] + ' ';
      row++;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y + row * lineHeight);
}

/* ----------------- init music & sparkles ----------------- */
(function init(){
  // preload music
  const audio = document.createElement('audio'); audio.id='globalAudio'; audio.src = MUSIC_SRC; audio.loop = true; audio.volume = 0.22; document.body.appendChild(audio);
  // create sparkles container
  const root = document.createElement('div'); root.className = 'sparkle-root'; document.body.appendChild(root);
})();
