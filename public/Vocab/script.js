/* =========================
   QUESTIONS
   ⚠️ Remplace/colle ici TOUTES tes questions
========================= */

const easy = [
  { q: "I drink coffee in the _____.", a: ["Night", "Morning", "Week"], c: 1 },
  { q: "She is very _____ and helps others.", a: ["Kind", "Loud", "Fast"], c: 0 },
  { q: "We _____ English every day.", a: ["Study", "Sleep", "Drive"], c: 0 },
  { q: "He goes to _____ at 8 a.m.", a: ["Work", "Play", "Eat"], c: 0 },
  { q: "A car needs _____ to move.", a: ["Water", "Energy", "Paper"], c: 1 },
  { q: "I feel _____ when I hear good news.", a: ["Happy", "Angry", "Cold"], c: 0 },
  { q: "The opposite of big is _____.", a: ["Tall", "Small", "Wide"], c: 1 },
  { q: "We use a phone to _____ people.", a: ["Call", "Cook", "Build"], c: 0 },
  { q: "She wears a jacket when it is _____.", a: ["Hot", "Cold", "Fast"], c: 1 },
  { q: "A doctor works in a _____.", a: ["School", "Hospital", "Shop"], c: 1 },
  { q: "A week has _____ days.", a: ["5", "7", "10"], c: 1 },
  { q: "Fish can _____ in water.", a: ["Fly", "Swim", "Drive"], c: 1 },
  { q: "Milk is a _____ drink.", a: ["Sweet", "Healthy", "Loud"], c: 1 },
  { q: "We wear shoes on our _____.", a: ["Hands", "Feet", "Head"], c: 1 },
  { q: "You sleep at _____.", a: ["Morning", "Night", "Noon"], c: 1 },
  { q: "Fire is very _____.", a: ["Cold", "Hot", "Wet"], c: 1 },
  { q: "The sun rises in the _____.", a: ["West", "East", "North"], c: 1 },
  { q: "I eat _____ in the morning.", a: ["Dinner", "Breakfast", "Lunch"], c: 1 },
  { q: "We read books with our _____.", a: ["Hands", "Eyes", "Feet"], c: 1 },
  { q: "A teacher helps students to _____.", a: ["Learn", "Sleep", "Run"], c: 0 }];

const medium = [
  { q: "She has lived here _____ 2020.", a: ["since", "for", "during"], c: 0 },
  { q: "He is not _____ tall as his brother.", a: ["so", "too", "as"], c: 2 },
  { q: "This exercise is _____ than the last one.", a: ["more easy", "easier", "most easy"], c: 1 },
  { q: "She speaks English very _____.", a: ["good", "well", "better"], c: 1 },
  { q: "There isn’t _____ milk left.", a: ["many", "few", "much"], c: 2 },
  { q: "I forgot _____ Anna.", a: ["tell", "to tell", "telling"], c: 1 },
  { q: "They have already _____ their homework.", a: ["do", "did", "done"], c: 2 },
  { q: "She prefers tea _____ coffee.", a: ["than", "to", "from"], c: 1 },
  { q: "He apologized _____ being late.", a: ["for", "about", "to"], c: 0 },
  { q: "This phone is _____ expensive.", a: ["too", "very", "so"], c: 0 },
  { q: "He works _____ a teacher.", a: ["as", "like", "for"], c: 0 },
  { q: "The train arrived _____ time.", a: ["in", "on", "at"], c: 1 },
  { q: "I didn’t have _____ time.", a: ["enough", "too", "very"], c: 0 },
  { q: "She is responsible _____ the project.", a: ["of", "for", "to"], c: 1 },
  { q: "I’m looking forward to _____ you.", a: ["see", "seeing", "seen"], c: 1 },
  { q: "We stayed home _____ the rain.", a: ["because", "because of", "so"], c: 1 },
  { q: "He asked where I _____ from.", a: ["am", "was", "were"], c: 1 },
  { q: "She is _____ than her sister.", a: ["taller", "tall", "most tall"], c: 0 },
  { q: "We should leave now _____ we’re late.", a: ["and", "or", "but"], c: 0 },
  { q: "They were tired _____ continued.", a: ["but", "because", "so"], c: 0 }
];

const hard = [
  { q: "Hardly had he arrived _____ it started raining.", a: ["than", "when", "then"], c: 1 },
  { q: "She speaks as if she _____ everything.", a: ["knows", "knew", "known"], c: 1 },
  { q: "This is the first time I _____ this.", a: ["do", "did", "have done"], c: 2 },
  { q: "No sooner _____ the door than the phone rang.", a: ["had he closed", "he had closed", "he closed"], c: 0 },
  { q: "The more you practice, the _____ you become.", a: ["better", "best", "good"], c: 0 },
  { q: "He denied _____ the files.", a: ["steal", "to steal", "stealing"], c: 2 },
  { q: "Had I known earlier, I _____ differently.", a: ["act", "would act", "would have acted"], c: 2 },
  { q: "She objected to _____ treated unfairly.", a: ["be", "being", "been"], c: 1 },
  { q: "Few people are aware _____ the risks.", a: ["about", "of", "for"], c: 1 },
  { q: "He is accustomed to _____ under pressure.", a: ["work", "working", "worked"], c: 1 },
  { q: "The decision was made _____ explanation.", a: ["without", "unless", "despite"], c: 0 },
  { q: "Not only _____ late, but he forgot the files.", a: ["he was", "was he", "he is"], c: 1 },
  { q: "She acted _____ she knew him.", a: ["like", "as though", "than"], c: 1 },
  { q: "The contract is valid _____ both sign.", a: ["unless", "provided that", "despite"], c: 1 },
  { q: "The report must be submitted _____ Friday.", a: ["until", "by", "during"], c: 1 },
  { q: "He insisted _____ paying.", a: ["on", "to", "for"], c: 0 },
  { q: "She has difficulty _____ her ideas.", a: ["express", "to express", "expressing"], c: 2 },
  { q: "The project was delayed due _____ issues.", a: ["of", "to", "for"], c: 1 },
  { q: "He suggested that she _____ early.", a: ["leaves", "leave", "left"], c: 1 },
  { q: "The task was _____ difficult.", a: ["so", "such", "too"], c: 2 }
];

/* =========================
   HELPERS
========================= */

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getPool(level) {
  return level === "easy" ? easy : level === "medium" ? medium : hard;
}

function getPlayerId() {
  // Si tu as login: user = {id, username}
  const u = localStorage.getItem("user");
  if (u) {
    try {
      return JSON.parse(u).id;
    } catch { }
  }

  // fallback anonyme
  let id = localStorage.getItem("player_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("player_id", id);
  }
  return id;
}

/* =========================
   DOM
========================= */

const elQuiz = document.getElementById("quiz");
const elAnswers = document.getElementById("answers");
const elTimer = document.getElementById("timer");
const elScore = document.getElementById("score");
const elMsg = document.getElementById("msg");

const elStart = document.getElementById("startBtn");
const elSave = document.getElementById("saveBtn");

const selCount = document.getElementById("countSelect");
const selLevel = document.getElementById("levelSelect");
const selTime = document.getElementById("timeSelect");

const hintTime = document.getElementById("hintTime");
const hintCount = document.getElementById("hintCount");
const playerPill = document.getElementById("playerPill");

/* =========================
   STATE
========================= */

let selectedLevel = "easy";
let maxQuestions = 10;
let timePerQ = 15;

let pool = [];        // ✅ pool de la partie (déjà random + slice, donc sans répétition)
let idx = 0;

let score = 0;
let total = 0;

let time = 15;
let timer = null;

let finished = false;
let startAt = null;

/* =========================
   UI helpers
========================= */

function renderInfo() {
  elTimer.textContent = "Time: " + time;
  elScore.textContent = "Score: " + score;
  hintTime.textContent = timePerQ + "s";
  hintCount.textContent = String(maxQuestions);
}

function showMsg(text) {
  elMsg.style.display = "block";
  elMsg.textContent = text;
}

function clearMsg() {
  elMsg.style.display = "none";
  elMsg.textContent = "";
}

function stopTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}

function startTimer() {
  stopTimer();
  timer = setInterval(() => {
    if (finished) return;

    time--;
    renderInfo();

    if (time <= 0) {
      timeout();
    }
  }, 1000);
}

/* =========================
   GAME FLOW
========================= */

function startGame() {
  selectedLevel = selLevel.value;
  maxQuestions = Number(selCount.value);
  timePerQ = Number(selTime.value);

  const fullPool = getPool(selectedLevel);

  if (!fullPool.length) {
    elQuiz.innerHTML = `<div><b>No questions found for "${selectedLevel}".</b></div>`;
    elAnswers.innerHTML = "";
    return;
  }

  // ✅ NO REPEAT: mélange puis on prend les X premières
  const shuffled = shuffle(fullPool);
  pool = shuffled.slice(0, Math.min(maxQuestions, shuffled.length));

  // reset
  idx = 0;
  score = 0;
  total = 0;
  time = timePerQ;
  finished = false;
  startAt = Date.now();

  clearMsg();
  elSave.disabled = true;

  elStart.textContent = "Running...";
  elStart.disabled = true;

  renderInfo();
  showQuestion();
  startTimer();
}

function showQuestion() {
  if (finished) return;

  // fin si on a fait toutes les questions du pool
  if (idx >= pool.length) {
    endGame();
    return;
  }

  const q = pool[idx];

  elQuiz.innerHTML = `<div><b>${idx + 1} / ${pool.length}.</b> ${q.q}</div>`;
  elAnswers.innerHTML = "";

  q.a.forEach((ans, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "vg-btn";
    b.textContent = ans;
    b.onclick = () => answer(i === q.c, b);
    elAnswers.appendChild(b);
  });
}

function answer(correct, btn) {
  if (finished) return;

  stopTimer();

  total++;

  if (correct) {
    score++;
    btn.classList.add("correct");
    showMsg("✅ Correct!");
  } else {
    btn.classList.add("wrong");
    const q = pool[idx];
    showMsg("❌ Wrong (Answer: " + q.a[q.c] + ")");
  }

  elAnswers.querySelectorAll("button").forEach((x) => (x.disabled = true));
  renderInfo();

  setTimeout(() => {
    clearMsg();
    idx++;
    time = timePerQ;

    if (idx >= pool.length) {
      endGame();
    } else {
      showQuestion();
      startTimer();
    }
  }, 650);
}

function timeout() {
  if (finished) return;

  stopTimer();
  total++;

  showMsg("⏰ Time out!");

  setTimeout(() => {
    clearMsg();
    idx++;
    time = timePerQ;

    if (idx >= pool.length) {
      endGame();
    } else {
      showQuestion();
      startTimer();
    }
  }, 650);
}

function endGame() {
  finished = true;
  stopTimer();

  elQuiz.innerHTML = `
    <div style="font-size:22px;font-weight:1000">Quiz Finished</div>
    <div style="margin-top:8px">Score: <b>${score}</b> / <b>${pool.length}</b></div>
  `;
  elAnswers.innerHTML = "";

  elStart.textContent = "Replay";
  elStart.disabled = false;

  elSave.disabled = false;
  showMsg("Sitzung beendet! Klicke auf Finish (Save).");
}

/* =========================
   SAVE TO DB
========================= */

async function saveSession() {
  const playerId = getPlayerId();
  const durationSec = startAt ? Math.floor((Date.now() - startAt) / 1000) : 0;
  const token = localStorage.getItem("token"); // si tu utilises JWT

  // Si ton backend actuel attend playerId: OK on l’envoie.
  // Si tu as sécurisé /save avec JWT, token sera utilisé.
  await fetch("http://localhost:3001/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: JSON.stringify({
      playerId,
      game: "vocab",
      score,
      total: pool.length,
      level: selectedLevel,
      durationSec,
    }),
  });
}

/* =========================
   EVENTS
========================= */

selCount.addEventListener("change", (e) => {
  maxQuestions = Number(e.target.value);
  hintCount.textContent = String(maxQuestions);
});

selLevel.addEventListener("change", (e) => {
  selectedLevel = e.target.value;
});

selTime.addEventListener("change", (e) => {
  timePerQ = Number(e.target.value);
  time = timePerQ;
  hintTime.textContent = timePerQ + "s";
  renderInfo();
});

elStart.addEventListener("click", startGame);

elSave.addEventListener("click", async () => {
  elSave.disabled = true;
  await saveSession();
  showMsg("✅ Gespeichert!");
});

/* =========================
   INIT
========================= */

(function init() {
  const pid = getPlayerId();
  playerPill.textContent = "Player: " + String(pid).slice(0, 8) + "…";

  // default values from selects
  selectedLevel = selLevel.value;
  maxQuestions = Number(selCount.value);
  timePerQ = Number(selTime.value);
  time = timePerQ;

  renderInfo();
})();