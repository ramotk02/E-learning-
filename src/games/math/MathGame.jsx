import { useState, useEffect } from "react";
import { generateQuestion } from "./mathGenerator";

export default function MathGame() {
  // level
  const [level, setLevel] = useState("easy");
  const [autoLevel, setAutoLevel] = useState(true);

  // question / input / message
  const [q, setQ] = useState(() => generateQuestion(level));
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState("");

  // score
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  // timer
  const [time, setTime] = useState(10);

  // auto difficulty counters
  const [streak, setStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);

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

  function nextQuestion(customLevel) {
    const lv = customLevel || level;
    setQ(generateQuestion(lv));
    setInput("");
    setTime(10);
  }

  function checkAnswer() {
    setTotal((t) => t + 1);

    if (Number(input) === q.answer) {
      setScore((s) => s + 1);
      setMsg("✅ Richtig");

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
      setMsg("❌ Falsch (Antwort: " + q.answer + ")");

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
      nextQuestion();
    }, 800);
  }

  // Timer: simple interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => {
        if (t === 1) {
          setMsg("⏰ Die Zeit ist abgelaufen!");
          setTotal((tot) => tot + 1);

          // si AutoLevel ON, le temps écoulé compte comme erreur
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

          setQ(generateQuestion(level));
          setInput("");
          return 10;
        }

        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [level, autoLevel]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Math Game</h2>

      <p>
        <b>Score:</b> {score} / {total}
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

      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={checkAnswer} style={{ marginLeft: 10 }}>
        Check
      </button>

      {msg && <p>{msg}</p>}
    </div>
  );
}