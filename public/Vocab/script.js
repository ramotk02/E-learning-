// ===== QUESTIONS =====

// EASY
const easy = [
  {q:"I drink coffee in the _____.", a:["Night","Morning","Week"], c:1},
  {q:"She is very _____ and helps others.", a:["Kind","Loud","Fast"], c:0},
  {q:"We _____ English every day.", a:["Study","Sleep","Drive"], c:0},
  {q:"He goes to _____ at 8 a.m.", a:["Work","Play","Eat"], c:0},
  {q:"A car needs _____ to move.", a:["Water","Energy","Paper"], c:1},
  {q:"I feel _____ when I hear good news.", a:["Happy","Angry","Cold"], c:0},
  {q:"The opposite of big is _____.", a:["Tall","Small","Wide"], c:1},
  {q:"We use a phone to _____ people.", a:["Call","Cook","Build"], c:0},
  {q:"She wears a jacket when it is _____.", a:["Hot","Cold","Fast"], c:1},
  {q:"A doctor works in a _____.", a:["School","Hospital","Shop"], c:1},
  {q:"A week has _____ days.", a:["5","7","10"], c:1},
  {q:"Fish can _____ in water.", a:["Fly","Swim","Drive"], c:1},
  {q:"Milk is a _____ drink.", a:["Sweet","Healthy","Loud"], c:1},
  {q:"We wear shoes on our _____.", a:["Hands","Feet","Head"], c:1},
  {q:"You sleep at _____.", a:["Morning","Night","Noon"], c:1},
  {q:"Fire is very _____.", a:["Cold","Hot","Wet"], c:1},
  {q:"The sun rises in the _____.", a:["West","East","North"], c:1},
  {q:"I eat _____ in the morning.", a:["Dinner","Breakfast","Lunch"], c:1},
  {q:"We read books with our _____.", a:["Hands","Eyes","Feet"], c:1},
  {q:"A teacher helps students to _____.", a:["Learn","Sleep","Run"], c:0}
];
// MEDIUM
const medium = [
  {q:"She has lived here _____ 2020.", a:["since","for","during"], c:0},
  {q:"He is not _____ tall as his brother.", a:["so","too","as"], c:2},
  {q:"This exercise is _____ than the last one.", a:["more easy","easier","most easy"], c:1},
  {q:"She speaks English very _____.", a:["good","well","better"], c:1},
  {q:"There isn’t _____ milk left.", a:["many","few","much"], c:2},
  {q:"I forgot _____ Anna.", a:["tell","to tell","telling"], c:1},
  {q:"They have already _____ their homework.", a:["do","did","done"], c:2},
  {q:"She prefers tea _____ coffee.", a:["than","to","from"], c:1},
  {q:"He apologized _____ being late.", a:["for","about","to"], c:0},
  {q:"This phone is _____ expensive.", a:["too","very","so"], c:0},
  {q:"He works _____ a teacher.", a:["as","like","for"], c:0},
  {q:"The train arrived _____ time.", a:["in","on","at"], c:1},
  {q:"I didn’t have _____ time.", a:["enough","too","very"], c:0},
  {q:"She is responsible _____ the project.", a:["of","for","to"], c:1},
  {q:"I’m looking forward to _____ you.", a:["see","seeing","seen"], c:1},
  {q:"We stayed home _____ the rain.", a:["because","because of","so"], c:1},
  {q:"He asked where I _____ from.", a:["am","was","were"], c:1},
  {q:"She is _____ than her sister.", a:["taller","tall","most tall"], c:0},
  {q:"We should leave now _____ we’re late.", a:["and","or","but"], c:0},
  {q:"They were tired _____ continued.", a:["but","because","so"], c:0}
];
// HARD
const hard = [
  {q:"Hardly had he arrived _____ it started raining.", a:["than","when","then"], c:1},
  {q:"She speaks as if she _____ everything.", a:["knows","knew","known"], c:1},
  {q:"This is the first time I _____ this.", a:["do","did","have done"], c:2},
  {q:"No sooner _____ the door than the phone rang.", a:["had he closed","he had closed","he closed"], c:0},
  {q:"The more you practice, the _____ you become.", a:["better","best","good"], c:0},
  {q:"He denied _____ the files.", a:["steal","to steal","stealing"], c:2},
  {q:"Had I known earlier, I _____ differently.", a:["act","would act","would have acted"], c:2},
  {q:"She objected to _____ treated unfairly.", a:["be","being","been"], c:1},
  {q:"Few people are aware _____ the risks.", a:["about","of","for"], c:1},
  {q:"He is accustomed to _____ under pressure.", a:["work","working","worked"], c:1},
  {q:"The decision was made _____ explanation.", a:["without","unless","despite"], c:0},
  {q:"Not only _____ late, but he forgot the files.", a:["he was","was he","he is"], c:1},
  {q:"She acted _____ she knew him.", a:["like","as though","than"], c:1},
  {q:"The contract is valid _____ both sign.", a:["unless","provided that","despite"], c:1},
  {q:"The report must be submitted _____ Friday.", a:["until","by","during"], c:1},
  {q:"He insisted _____ paying.", a:["on","to","for"], c:0},
  {q:"She has difficulty _____ her ideas.", a:["express","to express","expressing"], c:2},
  {q:"The project was delayed due _____ issues.", a:["of","to","for"], c:1},
  {q:"He suggested that she _____ early.", a:["leaves","leave","left"], c:1},
  {q:"The task was _____ difficult.", a:["so","such","too"], c:2}
];
// ===== LOGIC =====
let questions = [];
let index = 0;
let score = 0;
let time = 180;
let timer;

const quiz = document.getElementById("quiz");
const timerText = document.getElementById("timer");
const scoreText = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

function setLevel(level) {
  questions = level === "easy" ? easy : level === "medium" ? medium : hard;
}

startBtn.onclick = startQuiz;

function startQuiz() {
  index = 0;
  score = 0;
  time = 180;
  scoreText.textContent = "Score: 0";
  timerText.textContent = "Time: 180";
  startBtn.style.display = "none";
  showQuestion();
  timer = setInterval(countdown, 1000);
}

function countdown() {
  time--;
  timerText.textContent = "Time: " + time;
  if (time === 0) endQuiz();
}

function showQuestion() {
  if (index >= questions.length) return endQuiz();

  const q = questions[index];
  quiz.innerHTML = `<p><b>${index + 1}. ${q.q}</b></p>`;

  q.a.forEach((ans, i) => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => checkAnswer(btn, i === q.c);
    quiz.appendChild(btn);
  });
}

function checkAnswer(btn, correct) {
  if (correct) {
    btn.classList.add("correct");
    score++;
    scoreText.textContent = "Score: " + score;
  } else {
    btn.classList.add("wrong");
  }

  document.querySelectorAll("#quiz button").forEach(b => b.disabled = true);

  setTimeout(() => {
    index++;
    showQuestion();
  }, 700);
}

function endQuiz() {
  clearInterval(timer);
  quiz.innerHTML = `
    <h2>Quiz Finished</h2>
    <p>Your score: ${score} / ${questions.length}</p>
  `;
  startBtn.style.display = "block";
}
