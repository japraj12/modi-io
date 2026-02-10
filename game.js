const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const bgMusic = document.getElementById("bgMusic");
const dieSound = document.getElementById("dieSound");

const birdImg = new Image();
birdImg.src = "character.png";

const pipeImg = new Image();
pipeImg.src = "obstacle.png";

let bird, pipes, frame, score, gameOver;
let highScore = localStorage.getItem("highScore") || 0;

function resetGame() {
  bird = { x: 60, y: 250, w: 50, h: 50, v: 0 };
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  bgMusic.currentTime = 0;
  bgMusic.play();
}

resetGame();

document.addEventListener("keydown", flap);
document.addEventListener("click", flap);

function flap() {
  if (gameOver) {
    resetGame();
    return;
  }
  bird.v = -8;
}

function spawnPipe() {
  let gap = 160;
  let top = Math.random() * 200 + 50;
  pipes.push({ x: canvas.width, top, bottom: top + gap, passed: false });
}

function update() {
  if (gameOver) return;

  bird.v += 0.5;
  bird.y += bird.v;

  if (frame % 90 === 0) spawnPipe();
  frame++;

  pipes.forEach(p => p.x -= 2.5);

  pipes.forEach(p => {
    if (
      bird.x < p.x + 70 &&
      bird.x + bird.w > p.x &&
      (bird.y < p.top || bird.y + bird.h > p.bottom)
    ) {
      endGame();
    }

    if (!p.passed && p.x + 70 < bird.x) {
      score++;
      p.passed = true;
    }
  });

  if (bird.y < 0 || bird.y + bird.h > canvas.height) {
    endGame();
  }
}

function endGame() {
  gameOver = true;
  bgMusic.pause();
  dieSound.play();

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(birdImg, bird.x, bird.y, bird.w, bird.h);

  pipes.forEach(p => {
    ctx.drawImage(pipeImg, p.x, 0, 70, p.top);
    ctx.drawImage(pipeImg, p.x, p.bottom, 70, canvas.height - p.bottom);
  });

  ctx.fillStyle = "black";
  ctx.font = "22px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("High: " + highScore, 10, 55);

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "36px Arial";
    ctx.fillText("GAME OVER", 80, 260);
    ctx.font = "20px Arial";
    ctx.fillText("Click to Play Again", 100, 320);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
