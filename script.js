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
  document.getElementById('sparkle-container').appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 1000);
});

/* Scratch card */
const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 320;
canvas.height = 200;
ctx.fillStyle = "gray";
ctx.fillRect(0,0,320,200);

let drawing = false;

canvas.addEventListener("mousedown", ()=>drawing=true);
canvas.addEventListener("mouseup", ()=>drawing=false);

canvas.addEventListener("mousemove", (e)=>{
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.globalCompositeOperation="destination-out";
  ctx.beginPath();
  ctx.arc(x,y,20,0,Math.PI*2);
  ctx.fill();

  document.getElementById("bracelet").style.display="block";
});

/* Tic Tac Toe AI */
const board = document.getElementById("gameBoard");
let cells = [];
let player = "X";

for (let i=0;i<9;i++){
  const cell = document.createElement("div");
  cell.className="cell";
  cell.onclick=()=>playerMove(i);
  board.appendChild(cell);
  cells.push(cell);
}

function playerMove(i){
  if(cells[i].innerText===""){
    cells[i].innerText="X";
    setTimeout(aiMove,300);
  }
}

function aiMove(){
  let empty = cells.map((c,i)=>c.innerText===""?i:null).filter(v=>v!=null);
  if(empty.length===0) return;
  let choice = empty[Math.floor(Math.random()*empty.length)];
  cells[choice].innerText="O";
}
