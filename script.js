let currentPage = 1;

function login() {
  const u = document.getElementById('user').value;
  const p = document.getElementById('pass').value;

  if (u === "Shub@princess" && p === "Fast-text") {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('portal').classList.remove('hidden');
    document.getElementById('bgMusic').play();
  } else {
    document.getElementById('loginMsg').innerText = "Wrong princess key 💔";
  }
}

function nextPage() {
  document.getElementById(`page${currentPage}`).classList.remove('active');
  currentPage++;
  document.getElementById(`page${currentPage}`).classList.add('active');
}

/* Scratch Card Logic */
const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 200;

ctx.fillStyle = "gray";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let scratching = false;

canvas.addEventListener("mousedown", () => scratching = true);
canvas.addEventListener("mouseup", () => scratching = false);

canvas.addEventListener("mousemove", (e) => {
  if (!scratching) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
  ctx.fill();

  document.getElementById("bracelet").style.display = "block";
});

/* Tic Tac Toe */
const board = document.getElementById("gameBoard");
let turn = "X";

for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.onclick = () => {
    if (cell.innerText === "") {
      cell.innerText = turn;
      turn = turn === "X" ? "O" : "X";
    }
  };
  board.appendChild(cell);
}
