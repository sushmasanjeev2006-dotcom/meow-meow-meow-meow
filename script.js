let currentPage = 1;

function login() {
  const u = document.getElementById('user').value;
  const p = document.getElementById('pass').value;

  if (u === "Shub@princess" && p === "Fast-text") {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('portal').classList.remove('hidden');
    document.getElementById('bgMusic').play();
  } else {
    document.getElementById('loginMsg').innerText = "Wrong credentials 💔";
  }
}

function nextPage() {
  document.getElementById(`page${currentPage}`).classList.remove('active');
  currentPage++;
  document.getElementById(`page${currentPage}`).classList.add('active');
}

/* Sparkle effect */
document.addEventListener('click', (e) => {
  const sparkle = document.createElement('span');
  sparkle.style.left = e.pageX + 'px';
  sparkle.style.top = e.pageY + 'px';

  const container = document.getElementById('sparkle-container');
  container.appendChild(sparkle);

  document.getElementById("clickSound").play();

  setTimeout(() => sparkle.remove(), 800);
});

/* HD Scratch Card */
const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 320;
canvas.height = 200;

const coverImg = new Image();
coverImg.src = "https://i.imgur.com/3ZQ3ZfX.png"; // foil texture
coverImg.onload = () => ctx.drawImage(coverImg,0,0,320,200);

let scratching = false;

canvas.addEventListener("mousedown",()=>scratching=true);
canvas.addEventListener("mouseup",()=>scratching=false);

canvas.addEventListener("mousemove",(e)=>{
  if(!scratching) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.globalCompositeOperation="destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI*2);
  ctx.fill();

  document.getElementById("bracelet").style.display="block";
});


function aiMove(){
  let empty = cells
    .map((c,i)=>c.innerText===""?i:null)
    .filter(v=>v!=null);

  if(empty.length===0) return;

  // try to win
  let pick = empty.sort(()=>0.5-Math.random())[0];
  cells[pick].innerText="O";
}
