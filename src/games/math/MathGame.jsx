import { useState, useEffect } from "react";
import { generateQuestion } from "./mathGenerator";

//  player_id stable (pas besoin de login)
function getPlayerId() {
  let id = localStorage.getItem("player_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("player_id", id);
  }
  return id;
}

export default function MathGame() {
  const [started, setStarted] = useState(false);

  // setup
  const [level, setLevel] = useState("easy");
  const [autoLevel, setAutoLevel] = useState(true);
  const [maxQuestions, setMaxQuestions] = useState(10);

  // game state
  const [q, setQ] = useState(() => generateQuestion(level));
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const [time, setTime] = useState(10);

  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const [finished, setFinished] = useState(false);

  // after finish saving
  const [saved, setSaved] = useState(false);

  // ✅ pour calculer durationSec
  const [startAt, setStartAt] = useState(null);

  function levelUp() {
    setLevel((lv) =>
      lv === "easy" ? "medium" : lv === "medium" ? "hard" : "hard"
    );
  }

  function levelDown() {
    setLevel((lv) =>
      lv === "hard" ? "medium" : lv === "medium" ? "easy" : "easy"
    );
  }

  function startGame() {
    setScore(0);
    setTotal(0);
    setTime(10);
    setMsg("");
    setInput("");
    setFinished(false);
    setSaved(false);

    setStreak(0);
    setMistakes(0);

    setQ(generateQuestion(level));
    setStarted(true);

    // ✅ start time
    setStartAt(Date.now());
  }

  function nextQuestion(customLevel) {
    const lv = customLevel || level;
    setQ(generateQuestion(lv));
    setInput("");
    setTime(10);
  }

  function saveScoreToDb(scoreToSend, totalToSend, levelToSend) {
    const playerId = getPlayerId();
    const durationSec = startAt ? Math.floor((Date.now() - startAt) / 1000) : 0;

    fetch("http://localhost:3001/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId,
        game: "math",
        score: scoreToSend,
        total: totalToSend,
        level: levelToSend,
        durationSec,
      }),
    })
      .then((r) => r.text())
      .then((txt) => {
        console.log("API RESPONSE:", txt);
        if (txt === "OK") setSaved(true);
      })
      .catch((e) => console.log("FETCH ERROR:", e));
  }

  function checkAnswer() {
    if (finished) return;

    // stop si déjà limite
    if (total >= maxQuestions) {
      setFinished(true);
      return;
    }

    const correct = Number(input) === q.answer;
    const newTotal = total + 1;

    // fini si on atteint la limite
    if (newTotal >= maxQuestions) setFinished(true);

    setTotal((t) => t + 1);

    if (correct) {
      setScore((s) => s + 1);
      setMsg("Richtig");

      if (autoLevel) {
        setMistakes(0);
        setStreak((s) => {
          const ns = s + 1;
          if (ns === 3) {
            levelUp();
            return 0;
          }
          return ns;
        });
      }
    } else {
      setMsg("Falsch (Antwort: " + q.answer + ")");

      if (autoLevel) {
        setStreak(0);
        setMistakes((m) => {
          const nm = m + 1;
          if (nm === 2) {
            levelDown();
            return 0;
          }
          return nm;
        });
      }
    }

    setTimeout(() => {
      setMsg("");
      if (newTotal < maxQuestions) nextQuestion();
    }, 800);
  }

  // Timer
  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setTime((t) => {
        if (finished) return t;

        // sécurité
        if (total >= maxQuestions) {
          setFinished(true);
          return t;
        }

        if (t === 1) {
          // temps fini = une question perdue
          const newTotal = total + 1;

          setMsg("⏰ Die Zeit ist abgelaufen!");
          setTotal((tot) => tot + 1);

          if (autoLevel) {
            setStreak(0);
            setMistakes((m) => {
              const nm = m + 1;
              if (nm === 2) {
                levelDown();
                return 0;
              }
              return nm;
            });
          }

          // fini ou nouvelle question
          if (newTotal >= maxQuestions) {
            setFinished(true);
            return 10;
          }

          setQ(generateQuestion(level));
          setInput("");
          return 10;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, finished, level, autoLevel, total, maxQuestions]);

  // SETUP SCREEN
  if (!started) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Math Setup</h2>

        <p>
          <b>Questions:</b>{" "}
          <select
            value={maxQuestions}
            onChange={(e) => setMaxQuestions(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </p>

        <p>
          <b>Start Level:</b>{" "}
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </p>

        <p>
          <b>Auto Level:</b>{" "}
          <button onClick={() => setAutoLevel(!autoLevel)}>
            {autoLevel ? "ON" : "OFF"}
          </button>
        </p>

        <button onClick={startGame}>Start</button>
      </div>
    );
  }

  // SAVED SCREEN
  if (saved) {
    return (
      <div style={{ padding: 20 }}>
        <h2>✅ Saved!</h2>
        <p>Deine Sitzung wurde gespeichert.</p>

        <button onClick={startGame}>Replay</button>

        <button onClick={() => setStarted(false)} style={{ marginLeft: 10 }}>
          Exit
        </button>
      </div>
    );
  }

  // GAME SCREEN
  return (
    <div style={{ padding: 20 }}>
      <h2>Math Game</h2>

      <p>
        <b>Score:</b> {score} / {total}
      </p>

      <p>
        <b>Progress:</b> {total} / {maxQuestions}
      </p>

      <p>
        <b>Level:</b> {level} | <b>Time:</b> {time}s
      </p>

      <p>
        <b>Auto Level:</b>{" "}
        <button onClick={() => setAutoLevel(!autoLevel)}>
          {autoLevel ? "ON" : "OFF"}
        </button>
      </p>

      <p>
        <b>Manual Level:</b>{" "}
        <button
          disabled={autoLevel}
          onClick={() => {
            setLevel("easy");
            nextQuestion("easy");
          }}
        >
          Easy
        </button>{" "}
        <button
          disabled={autoLevel}
          onClick={() => {
            setLevel("medium");
            nextQuestion("medium");
          }}
        >
          Medium
        </button>{" "}
        <button
          disabled={autoLevel}
          onClick={() => {
            setLevel("hard");
            nextQuestion("hard");
          }}
        >
          Hard
        </button>
      </p>

      <p>
        <b>Streak:</b> {streak} | <b>Errors:</b> {mistakes}
      </p>

      <p style={{ fontSize: 18 }}>
        <b>{q.question}</b>
      </p>

      <input
        disabled={finished}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !finished) checkAnswer();
        }}
      />

      <button
        disabled={finished}
        onClick={checkAnswer}
        style={{ marginLeft: 10 }}
      >
        Check
      </button>

      <button
        disabled={!finished}
        onClick={() => saveScoreToDb(score, total, level)}
        style={{ marginLeft: 10 }}
      >
        Finish (Save)
      </button>

      {finished && (
        <p>
          <b>Sitzung beendet! Klicke auf “Finish (Save)” um zu speichern.</b>
        </p>
      )}

      {msg && <p>{msg}</p>}
    </div>
  );
}
