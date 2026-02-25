export function generateQuestion(level = "easy") {

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

  
  if (Math.random() < 0.5) {
    const a = Math.floor(Math.random() * 8) + 2;
    const x = Math.floor(Math.random() * 10) + 1; 
    const b = Math.floor(Math.random() * 20) - 10; 
    const c = a * x + b;

    const bText = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;

    return {
      question: `${a}x ${bText} = ${c}   (x = ?)`,
      answer: x
    };
  }

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
    a = answer * b; 
  }

  return {
    question: `${a} ${op} ${b} = ?`,
    answer
  };
}