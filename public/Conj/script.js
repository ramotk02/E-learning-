let score = 0;
let bonneReponse = "";
let timer;
let tempsRestant = 15;

let examMode = false;
let questionCount = 0;
const maxQuestions = 10;

let currentVerb = "";
let currentPronoun = 0;

const pronouns = ["ich","du","er/sie/es","wir","ihr","sie"];

const verbes = {

gehen: {
    type: "irregulier",
    present: ["gehe","gehst","geht","gehen","geht","gehen"],
    passe: "gegangen"
},

machen: {
    type: "regulier",
    present: ["mache","machst","macht","machen","macht","machen"],
    passe: "gemacht"
},

sein: {
    type: "irregulier",
    present: ["bin","bist","ist","sind","seid","sind"],
    passe: "gewesen"
},

lernen: {
    type:"regulier",
    present:["lerne","lernst","lernt","lernen","lernt","lernen"],
    passe:"gelernt"
},

spielen: {
    type:"regulier",
    present:["spiele","spielst","spielt","spielen","spielt","spielen"],
    passe:"gespielt"
},

arbeiten: {
    type:"regulier",
    present:["arbeite","arbeitest","arbeitet","arbeiten","arbeitet","arbeiten"],
    passe:"gearbeitet"
},

essen: {
    type:"irregulier",
    present:["esse","isst","isst","essen","esst","essen"],
    passe:"gegessen"
},

fahren: {
    type:"irregulier",
    present:["fahre","fährst","fährt","fahren","fahrt","fahren"],
    passe:"gefahren"
},

sehen: {
    type:"irregulier",
    present:["sehe","siehst","sieht","sehen","seht","sehen"],
    passe:"gesehen"
}

};


// CONJUGAISON
function conjuguer() {

    const verbe = document.getElementById("verbe").value.toLowerCase();
    const temps = document.getElementById("temps").value;
    const res = document.getElementById("resultat");

    if (!verbes[verbe]) {
        res.innerHTML = "Verb nicht gefunden";
        return;
    }

    if (temps === "present") {

        res.innerHTML = `
        Typ: ${verbes[verbe].type}<br>
        ich ${verbes[verbe].present[0]}<br>
        du ${verbes[verbe].present[1]}<br>
        er/sie/es ${verbes[verbe].present[2]}<br>
        wir ${verbes[verbe].present[3]}<br>
        ihr ${verbes[verbe].present[4]}<br>
        sie ${verbes[verbe].present[5]}
        `;

    } else {

        res.innerHTML =
        `Vergangenheit: ${verbes[verbe].passe}`;
    }

    genererExercice(verbe);
}


// GENERER EXERCICE
function genererExercice(verbe) {

    currentVerb = verbe;
    currentPronoun = 0;

    bonneReponse = verbes[verbe].present[currentPronoun];

    document.getElementById("question").innerHTML =
    `Konjugiere: ${pronouns[currentPronoun]} ${verbe}`;

    startTimer(verbe);
}


// TIMER
function startTimer(verbe){

    clearInterval(timer);
    tempsRestant = 15;

    document.getElementById("timer").innerText =
    "Zeit: " + tempsRestant + "s";

    timer = setInterval(() => {

        tempsRestant--;

        document.getElementById("timer").innerText =
        "Zeit: " + tempsRestant + "s";

        if(tempsRestant === 0){

            clearInterval(timer);

            currentPronoun++;

            if(currentPronoun >= 6){

                if(examMode){
                    nextQuestion();
                }else{
                    genererExercice(verbe);
                }

            }else{

                bonneReponse =
                verbes[verbe].present[currentPronoun];

                document.getElementById("question").innerHTML =
                `Konjugiere: ${pronouns[currentPronoun]} ${verbe}`;

                startTimer(verbe);
            }
        }

    },1000);
}


// VERIFIER REPONSE
function verifier() {

    const rep = document.getElementById("reponse")
    .value.toLowerCase().trim();

    clearInterval(timer);

    if (rep === bonneReponse) {

        score++;
        alert("Richtig!");

        currentPronoun++;

        if(currentPronoun >= 6){

            if(examMode){
                nextQuestion();
            }else{
                genererExercice(currentVerb);
            }

        }else{

            bonneReponse =
            verbes[currentVerb].present[currentPronoun];

            document.getElementById("question").innerHTML =
            `Konjugiere: ${pronouns[currentPronoun]} ${currentVerb}`;

            startTimer(currentVerb);
        }

    } else {

        alert("Falsch!");
        startTimer(currentVerb);
    }

    document.getElementById("score").innerText =
    "Punkte: " + score;

    document.getElementById("reponse").value = "";
}



// MODE EXAM
function startExam(){

    examMode = true;
    score = 0;
    questionCount = 0;

    document.getElementById("score").innerText = "Punkte: 0";

    nextQuestion();
}


function nextQuestion(){

    if(questionCount >= maxQuestions){

        clearInterval(timer);

        let message = "";

        if(score >= 8){
            message = "😎 Excellent!";
        }
        else if(score >=5){
            message = "👍 Gut!";
        }
        else{
            message = "📚 Wiederholen!";
        }

        document.getElementById("examInfo").innerText =
        `Exam beendet! Score: ${score}/10 — ${message}`;

        examMode = false;
        return;
    }

    questionCount++;

    document.getElementById("examInfo").innerText =
    `Frage ${questionCount} / 10`;

    const verbList = Object.keys(verbes);
    const randomVerb =
    verbList[Math.floor(Math.random()*verbList.length)];

    genererExercice(randomVerb);
}
