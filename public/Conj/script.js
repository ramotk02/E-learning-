/* =========================
   DATA
========================= */

const pronouns = ["ich", "du", "er/sie/es", "wir", "ihr", "sie"];

const verbes = {
  gehen: {
    level: "easy", type: "irregulier",
    present: ["gehe", "gehst", "geht", "gehen", "geht", "gehen"],
    passe: "gegangen"
  },
  machen: {
    level: "easy", type: "regulier",
    present: ["mache", "machst", "macht", "machen", "macht", "machen"],
    passe: "gemacht"
  },
  lernen: {
    level: "easy", type: "regulier",
    present: ["lerne", "lernst", "lernt", "lernen", "lernt", "lernen"],
    passe: "gelernt"
  },
  spielen: {
    level: "easy", type: "regulier",
    present: ["spiele", "spielst", "spielt", "spielen", "spielt", "spielen"],
    passe: "gespielt"
  },
  arbeiten: {
    level: "easy", type: "regulier",
    present: ["arbeite", "arbeitest", "arbeitet", "arbeiten", "arbeitet", "arbeiten"],
    passe: "gearbeitet"
  },

  sein: {
    level: "medium", type: "irregulier",
    present: ["bin", "bist", "ist", "sind", "seid", "sind"],
    passe: "gewesen"
  },
  haben: {
    level: "medium", type: "irregulier",
    present: ["habe", "hast", "hat", "haben", "habt", "haben"],
    passe: "gehabt"
  },
  essen: {
    level: "medium", type: "irregulier",
    present: ["esse", "isst", "isst", "essen", "esst", "essen"],
    passe: "gegessen"
  },
  fahren: {
    level: "medium", type: "irregulier",
    present: ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"],
    passe: "gefahren"
  },
  sehen: {
    level: "medium", type: "irregulier",
    present: ["sehe", "siehst", "sieht", "sehen", "seht", "sehen"],
    passe: "gesehen"
  },

  nehmen: {
    level: "hard", type: "irregulier",
    present: ["nehme", "nimmst", "nimmt", "nehmen", "nehmt", "nehmen"],
    passe: "genommen"
  },
  sprechen: {
    level: "hard", type: "irregulier",
    present: ["spreche", "sprichst", "spricht", "sprechen", "sprecht", "sprechen"],
    passe: "gesprochen"
  },
  geben: {
    level: "hard", type: "irregulier",
    present: ["gebe", "gibst", "gibt", "geben", "gebt", "geben"],
    passe: "gegeben"
  }
};

/* =========================
   DOM
========================= */

const elTimer = document.getElementById("timer");
const elScore = document.getElementById("score");
const elProgress = document.getElementById("progress");
const elLevelDisplay = document.getElementById("levelDisplay");
const elQuestion = document.getElementById("question");
const elMsg = document.getElementById("msg");

const elAnswer = document.getElementById("answerInput");
const elCheck = document.getElementById("checkBtn");
const elSave = document.getElementById("saveBtn");

const selCount = document.getElementById("countSelect");
const selLevel = document.getElementById("levelSelect");
const selTime = document.getElementById("timeSelect");
const selTense = document.getElementById("tenseSelect");
const elTip = document.getElementById("tipText");

/* =========================
   STATE
========================= */

let maxQuestions = 10;
let timePerQ = 15;
let selectedLevel = "easy";
let selectedTense = "present";

let score = 0;
let index = 0;
let time = 15;
let timer = null;

let questions = [];
let finished = false;
let startAt = null;

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

function showMsg(text) {
  elMsg.style.display = "block";
  elMsg.innerText = text;
}

function clearMsg() {
  elMsg.style.display = "none";
  elMsg.innerText = "";
}

function stopTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}

function setRunningUI(running) {
  elAnswer.disabled = !running;
  elCheck.disabled = !running;
  if (!running) elAnswer.value = "";
}

function getPlayerId() {
  // si tu as déjà un user dans localStorage
  const u = localStorage.getItem("user");
  if (u) {
    try { return JSON.parse(u).id; } catch {}
  }

  let id = localStorage.getItem("player_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("player_id", id);
  }
  return id;
}

function updateTip() {
  const q = Number(selCount.value || 10);
  const t = Number(selTime.value || 15);
  elTip.innerHTML = `Tipp: Du hast <b>${t}s</b> pro Frage • Ziel: <b>${q}</b> Fragen`;
}

/* =========================
   GENERATE EXAM
========================= */

function generateExam() {
  const filtered = Object.keys(verbes).filter(v => verbes[v].level === selectedLevel);

  if (filtered.length === 0) {
    questions = [];
    return;
  }

  const shuffled = shuffle(filtered);

  questions = shuffled
    .slice(0, Math.min(maxQuestions, shuffled.length))
    .map(v => {
      const pIndex = Math.floor(Math.random() * 6);
      return {
        verb: v,
        pronoun: pronouns[pIndex],
        answer: selectedTense === "present"
          ? verbes[v].present[pIndex]
          : verbes[v].passe
      };
    });
}

/* =========================
   START
========================= */

function startExam() {
  selectedLevel = selLevel.value;
  selectedTense = selTense.value;
  maxQuestions = Number(selCount.value);
  timePerQ = Number(selTime.value);

  score = 0;
  index = 0;
  time = timePerQ;
  finished = false;
  startAt = Date.now();

  elSave.disabled = true;
  clearMsg();

  elLevelDisplay.innerText = selectedLevel;
  elScore.innerText = String(score);
  elTimer.innerText = String(timePerQ);

  generateExam();

  if (questions.length === 0) {
    elQuestion.innerText = "Keine Verben gefunden für dieses Level.";
    elProgress.innerText = "0 / 0";
    setRunningUI(false);
    return;
  }

  setRunningUI(true);
  nextQuestion();
}

/* =========================
   QUESTION
========================= */

function nextQuestion() {
  if (finished) return;

  if (index >= questions.length) {
    endExam();
    return;
  }

  const q = questions[index];

  elQuestion.innerText = `Konjugiere (${selectedTense}): ${q.pronoun} ${q.verb}`;
  elProgress.innerText = `${index + 1} / ${questions.length}`;
  elScore.innerText = String(score);

  elAnswer.value = "";
  clearMsg();

  startTimer();
}

/* =========================
   TIMER
========================= */

function startTimer() {
  stopTimer();
  time = timePerQ;
  elTimer.innerText = String(time);

  timer = setInterval(() => {
    if (finished) return;

    time--;
    elTimer.innerText = String(time);

    if (time <= 0) {
      stopTimer();
      showMsg("⏰ Zeit abgelaufen!");
      index++;
      setTimeout(() => {
        clearMsg();
        nextQuestion();
      }, 600);
    }
  }, 1000);
}

/* =========================
   CHECK
========================= */

function checkAnswer() {
  if (finished) return;
  if (index >= questions.length) return;

  const input = elAnswer.value.trim().toLowerCase();
  const correct = String(questions[index].answer).toLowerCase();

  stopTimer();

  if (input === correct) {
    score++;
    elScore.innerText = String(score);
    showMsg("✅ Richtig!");
  } else {
    showMsg("❌ Falsch! Antwort: " + questions[index].answer);
  }

  index++;

  setTimeout(() => {
    clearMsg();
    nextQuestion();
  }, 700);
}

/* =========================
   END
========================= */

function endExam() {
  finished = true;
  stopTimer();

  setRunningUI(false);

  elQuestion.innerText = `Exam beendet! Score: ${score}/${questions.length}`;
  elProgress.innerText = `${questions.length} / ${questions.length}`;
  elTimer.innerText = "0";

  elSave.disabled = false;
  showMsg("Sitzung beendet! Klicke auf Finish (Save).");
}

/* =========================
   SAVE TO DB
========================= */

async function saveToDB() {
  const durationSec = startAt ? Math.floor((Date.now() - startAt) / 1000) : 0;
  const token = localStorage.getItem("token");

  await fetch("http://localhost:3001/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      game: "conjugation",
      score,
      total: questions.length,
      level: selectedLevel,
      durationSec
    }),
  });
}

/* =========================
   EVENTS / INIT
========================= */

document.getElementById("startBtn").addEventListener("click", startExam);
elCheck.addEventListener("click", checkAnswer);

elAnswer.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkAnswer();
});

elSave.addEventListener("click", async () => {
  elSave.disabled = true;
  await saveToDB();
  showMsg("✅ Gespeichert!");
});

document.getElementById("backBtn").addEventListener("click", () => history.back());

selCount.addEventListener("change", updateTip);
selTime.addEventListener("change", updateTip);

(function init() {
  updateTip();

  const pid = getPlayerId();
  const pill = document.getElementById("playerInfo");
  pill.innerText = "Player: " + String(pid).slice(0, 8) + "…";

  // état initial
  elLevelDisplay.innerText = selLevel.value;
  elTimer.innerText = String(selTime.value || 15);
  elScore.innerText = "0";
  elProgress.innerText = "0 / 0";

  setRunningUI(false);
})();