export function generateQuestion(level = "easy") {

  // EASY : + et -
  if (level === "easy") {
    const a = Math.floor(Math.random() * 20) + 1;
    const b = Math.floor(Math.random() * 20) + 1;
    const op = Math.random() < 0.5 ? "+" : "-";

    const answer = op === "+" ? a + b : a - b;

    return {
      question: `${a} ${op} ${b} = ?`,
      answer
    };
  }

  // MEDIUM : + - *
  if (level === "medium") {
    const ops = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];

    let a, b, answer;

    if (op === "+") {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 50) + 10;
      answer = a + b;
    }

    if (op === "-") {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 50) + 10;
      answer = a - b;
    }

    if (op === "*") {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      answer = a * b;
    }

    return {
      question: `${a} ${op} ${b} = ?`,
      answer
    };
  }

  // HARD : opérations OU équations
  // 50% chance d'avoir une équation
  if (Math.random() < 0.5) {
    // ÉQUATION : ax + b = c
    const a = Math.floor(Math.random() * 8) + 2;
    const x = Math.floor(Math.random() * 10) + 1; // vraie solution
    const b = Math.floor(Math.random() * 20) - 10; // peut être négatif
    const c = a * x + b;

    const bText = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

    return {
      question: `${a}x ${bText} = ${c}   (x = ?)`,
      answer: x
    };
  }

  // HARD : + - * /
  const ops = ["+", "-", "*", "/"];
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a, b, answer;

  if (op === "+") {
    a = Math.floor(Math.random() * 200) + 50;
    b = Math.floor(Math.random() * 200) + 50;
    answer = a + b;
  }

  if (op === "-") {
    a = Math.floor(Math.random() * 200) + 50;
    b = Math.floor(Math.random() * 200) + 10;
    answer = a - b;
  }

  if (op === "*") {
    a = Math.floor(Math.random() * 20) + 5;
    b = Math.floor(Math.random() * 20) + 5;
    answer = a * b;
  }

  if (op === "/") {
    b = Math.floor(Math.random() * 12) + 2;
    answer = Math.floor(Math.random() * 20) + 2;
    a = answer * b; // division entière garantie
  }

  return {
    question: `${a} ${op} ${b} = ?`,
    answer
  };
}