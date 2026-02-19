import { useState, useEffect } from "react";
import { generateQuestion } from "./mathGenerator";
import "./MathGame.css";

// Guest 
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

  
  const [level, setLevel] = useState("easy");
  const [autoLevel, setAutoLevel] = useState(true);
  const [maxQuestions, setMaxQuestions] = useState(10);

  const [q, setQ] = useState(() => generateQuestion(level));
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const [time, setTime] = useState(10);

  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const [finished, setFinished] = useState(false);

  const [saved, setSaved] = useState(false);

  const [startAt, setStartAt] = useState(null);


//niveau auto
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
    setStartAt(Date.now());
  }
//kit 3iyet l qst li moraha
  function nextQuestion(customLevel) {
    const lv = customLevel || level;
    setQ(generateQuestion(lv));
    setInput("");
    setTime(10);
  }

  //kit sift score l databsase
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

    if (total >= maxQuestions) {
      setFinished(true);
      return;
    }

    const correct = Number(input) === q.answer;
    const newTotal = total + 1;

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

  // we9t
  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setTime((t) => {
        if (finished) return t;

        if (total >= maxQuestions) {
          setFinished(true);
          return t;
        }

        if (t === 1) {
          const newTotal = total + 1;

          setMsg("Die Zeit ist abgelaufen!");
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
      <div className="mg-page">
        <div className="mg-panel">
          <div className="mg-titleRow">
            <h2 className="mg-title">Math Setup</h2>
            <span className="mg-badge">Edu-Exos</span>
          </div>

          <div className="mg-grid">
            <div className="mg-field">
              <label>Questions</label>
              <select
                value={maxQuestions}
                onChange={(e) => setMaxQuestions(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="mg-field">
              <label>Start Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>

            <div className="mg-field">
              <label>Auto Level</label>
              <button
                className={`mg-toggle ${autoLevel ? "on" : "off"}`}
                onClick={() => setAutoLevel(!autoLevel)}
              >
                {autoLevel ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          <div className="mg-actions">
            <button className="mg-btn primary" onClick={startGame}>
              Start
            </button>
          </div>
        </div>
      </div>
    );
  }

  // SAVED SCREEN
  if (saved) {
    return (
      <div className="mg-page">
        <div className="mg-panel">
          <h2 className="mg-title"> Saved!</h2>
          <p className="mg-sub">Deine Sitzung wurde gespeichert.</p>

          <div className="mg-actions">
            <button className="mg-btn primary" onClick={startGame}>
              Replay
            </button>
            <button className="mg-btn" onClick={() => setStarted(false)}>
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GAME SCREEN
  return (
    <div className="mg-page">
      <div className="mg-panel">
        <div className="mg-titleRow">
          <h2 className="mg-title">Math Game</h2>
          <span className="mg-chip">
            Level: <b>{level}</b> • Time: <b>{time}s</b>
          </span>
        </div>

        <div className="mg-stats">
          <div className="mg-stat">
            <span>Score</span>
            <b>
              {score} / {total}
            </b>
          </div>
          <div className="mg-stat">
            <span>Progress</span>
            <b>
              {total} / {maxQuestions}
            </b>
          </div>
          <div className="mg-stat">
            <span>Streak</span>
            <b>{streak}</b>
          </div>
          <div className="mg-stat">
            <span>Errors</span>
            <b>{mistakes}</b>
          </div>
        </div>

        <div className="mg-row">
          <span className="mg-muted">Auto Level</span>
          <button
            className={`mg-toggle ${autoLevel ? "on" : "off"}`}
            onClick={() => setAutoLevel(!autoLevel)}
          >
            {autoLevel ? "ON" : "OFF"}
          </button>
        </div>

        <div className="mg-row">
          <span className="mg-muted">Manual Level</span>
          <div className="mg-levelBtns">
            <button
              className="mg-btn"
              disabled={autoLevel}
              onClick={() => {
                setLevel("easy");
                nextQuestion("easy");
              }}
            >
              Easy
            </button>
            <button
              className="mg-btn"
              disabled={autoLevel}
              onClick={() => {
                setLevel("medium");
                nextQuestion("medium");
              }}
            >
              Medium
            </button>
            <button
              className="mg-btn"
              disabled={autoLevel}
              onClick={() => {
                setLevel("hard");
                nextQuestion("hard");
              }}
            >
              Hard
            </button>
          </div>
        </div>

        <div className="mg-question">
          <div className="mg-qLabel">Question</div>
          <div className="mg-qText">{q.question}</div>
        </div>

        <div className="mg-answer">
          <input
            className="mg-input"
            disabled={finished}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !finished) checkAnswer();
            }}
            placeholder="Antwort eingeben…"
          />
          <button
            className="mg-btn primary"
            disabled={finished}
            onClick={checkAnswer}
          >
            Check
          </button>
          <button
            className="mg-btn"
            disabled={!finished}
            onClick={() => saveScoreToDb(score, total, level)}
          >
            Finish (Save)
          </button>
        </div>

        {finished && (
          <p className="mg-hint">
            Sitzung beendet! Klicke auf <b>“Finish (Save)”</b> um zu speichern.
          </p>
        )}

        {msg && <div className="mg-msg">{msg}</div>}
      </div>
    </div>
  );
}