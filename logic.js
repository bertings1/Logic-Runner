let score = 0;
let lives = 3;
let timeLeft = 100;
let timer;

const questions = [
  {expr: (P,Q,R)=>!P||(Q&&R), text:"¬P ∨ (Q ∧ R)"},
  {expr: (P,Q)=>P&&!Q, text:"P ∧ ¬Q"},
  {expr: (P,Q)=>!P&&!Q, text:"¬P ∧ ¬Q"},
  {expr: (P,Q)=>P||!Q, text:"P ∨ ¬Q"},
  {expr: (P,Q)=>P===Q, text:"P ↔ Q"},
  {expr: (P,Q)=>!P||Q, text:"P → Q"}
];

let current;

function startGame() {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  newRound();
  startTimer();
}

function newRound() {
  current = questions[Math.floor(Math.random()*questions.length)];

  let P = Math.random() < 0.5;
  let Q = Math.random() < 0.5;
  let R = Math.random() < 0.5;

  current.values = {P, Q, R};
  current.answer = current.expr(P, Q, R);

  document.getElementById("problem").innerHTML = current.text;
  document.getElementById("values").innerHTML =
    `P=${P} , Q=${Q} , R=${R}`;
}

function answer(choice) {
  if (choice === current.answer) {
    score++;
  } else {
    lives--;
  }

  document.getElementById("score").innerHTML = score;
  document.getElementById("lives").innerHTML = lives;

  if (lives <= 0) return gameOver();

  newRound();
  resetTimer();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft -= 1;
    document.getElementById("timerFill").style.width = timeLeft + "%";

    if (timeLeft <= 0) {
      gameOver();
    }
  }, 150);
}

function resetTimer() {
  timeLeft = 100;
}

function gameOver() {
  clearInterval(timer);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("gameover").classList.remove("hidden");
  document.getElementById("finalScore").textContent = score;
}

function restart() {
  window.location.reload();
}
