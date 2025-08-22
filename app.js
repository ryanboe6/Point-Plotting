const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');
const size = 21; // -10 to 10
const cell = 20;
const offset = 20;
let target = null;
let placed = null;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw grid lines
  ctx.strokeStyle = '#ccc';
  for (let i = 0; i < size; i++) {
    let x = offset + i * cell;
    ctx.beginPath();
    ctx.moveTo(x, offset);
    ctx.lineTo(x, offset + (size-1)*cell);
    ctx.stroke();
    let y = offset + i * cell;
    ctx.beginPath();
    ctx.moveTo(offset, y);
    ctx.lineTo(offset + (size-1)*cell, y);
    ctx.stroke();
  }
  // Draw axes
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 2;
  // y-axis
  ctx.beginPath();
  ctx.moveTo(offset + 10*cell, offset);
  ctx.lineTo(offset + 10*cell, offset + (size-1)*cell);
  ctx.stroke();
  // x-axis
  ctx.beginPath();
  ctx.moveTo(offset, offset + 10*cell);
  ctx.lineTo(offset + (size-1)*cell, offset + 10*cell);
  ctx.stroke();
  ctx.lineWidth = 1;
  // Draw numbers
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  for (let i = 0; i < size; i++) {
    let n = i - 10;
    if (n !== 0) {
      ctx.fillText(n, offset + i*cell - 6, offset + 10*cell + 16);
      ctx.fillText(n, offset + 10*cell + 6, offset + (size-1-i)*cell + 4);
    }
  }
}

function coordToCanvas(x, y) {
  // x: -10 to 10, y: -10 to 10
  return [offset + (x+10)*cell, offset + (10-y)*cell];
}

function drawPlaced() {
  if (placed) {
    const [cx, cy] = coordToCanvas(placed.x, placed.y);
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, 2*Math.PI);
    ctx.fillStyle = '#1976d2';
    ctx.fill();
    ctx.strokeStyle = '#0d47a1';
    ctx.stroke();
  }
}

function drawTarget() {
  if (target) {
    const [cx, cy] = coordToCanvas(target.x, target.y);
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, 2*Math.PI);
    ctx.strokeStyle = '#43a047';
    ctx.lineWidth = 2;
    ctx.setLineDash([3,3]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
  }
}

function render() {
  drawGrid();
  drawPlaced();
}

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  // Snap to nearest integer grid
  let x = Math.round((mx - offset)/cell - 10);
  let y = Math.round(10 - (my - offset)/cell);
  if (x < -10 || x > 10 || y < -10 || y > 10) return;
  placed = {x, y};
  document.getElementById('confirm').disabled = false;
  render();
});

document.getElementById('confirm').onclick = () => {
  if (!placed) return;
  let correct = placed.x === target.x && placed.y === target.y;
  document.getElementById('feedback').textContent = correct ? 'Correct!' : `Incorrect. The correct location was (${target.x}, ${target.y})`;
  document.getElementById('confirm').disabled = true;
  document.getElementById('next').style.display = '';
  render();
  drawTarget();
};

document.getElementById('next').onclick = () => {
  newProblem();
};

function newProblem() {
  target = {
    x: Math.floor(Math.random()*21)-10,
    y: Math.floor(Math.random()*21)-10
  };
  placed = null;
  document.getElementById('problem').textContent = `Place the point (${target.x}, ${target.y}) on the grid.`;
  document.getElementById('feedback').textContent = '';
  document.getElementById('confirm').disabled = true;
  document.getElementById('next').style.display = 'none';
  render();
}

newProblem();
