import { useState, useEffect } from "react";

const levels = [
  { label: "Anfänger", emoji: "🐍" },
  { label: "Fortgeschritten", emoji: "⚡" },
  { label: "Profi", emoji: "🔥" },
];

const allQuestions = {
  0: [
    {
      question: "Was gibt `print(2 + 3)` aus?",
      code: "print(2 + 3)",
      options: ["23", "5", "2+3", "Fehler"],
      answer: 1,
      explanation: "`2 + 3` ist eine Addition. Python rechnet das aus und gibt `5` aus."
    },
    {
      question: "Wie erstellt man eine Variable `x` mit dem Wert 10?",
      options: ["var x = 10", "x == 10", "x = 10", "int x = 10"],
      answer: 2,
      explanation: "In Python weist man Variablen einfach mit `=` zu, ohne Schlüsselwort wie `var` oder Typangabe."
    },
    {
      question: "Was ist der Datentyp von `'Hallo'`?",
      options: ["int", "bool", "str", "list"],
      answer: 2,
      explanation: "Text in Anführungszeichen ist in Python ein `str` (String = Zeichenkette)."
    },
    {
      question: "Was gibt `len('Python')` zurück?",
      code: "len('Python')",
      options: ["5", "6", "7", "Fehler"],
      answer: 1,
      explanation: "`len()` zählt die Zeichen. 'Python' hat 6 Buchstaben → `6`."
    },
    {
      question: "Wie startet man einen `if`-Block?",
      options: ["if x > 0 {", "if (x > 0):", "if x > 0:", "IF x > 0 THEN"],
      answer: 2,
      explanation: "In Python schreibt man `if Bedingung:` – ohne Klammern und mit Doppelpunkt."
    },
  ],
  1: [
    {
      question: "Was gibt dieser Code aus?",
      code: "x = [1, 2, 3]\nprint(x[1])",
      options: ["1", "2", "3", "Fehler"],
      answer: 1,
      explanation: "Listen-Indizes starten bei 0. `x[1]` ist also das zweite Element: `2`."
    },
    {
      question: "Was macht `range(3)`?",
      options: ["[1, 2, 3]", "[0, 1, 2]", "[0, 1, 2, 3]", "Fehler"],
      answer: 1,
      explanation: "`range(3)` erzeugt die Zahlen 0, 1, 2 – es beginnt bei 0 und endet vor 3."
    },
    {
      question: "Was gibt dieser Code aus?",
      code: 'def greet(name):\n    return "Hallo " + name\n\nprint(greet("Welt"))',
      options: ["Hallo", "Welt", "Hallo Welt", "Fehler"],
      answer: 2,
      explanation: "Die Funktion verbindet `'Hallo '` mit dem Parameter `name`. Ergebnis: `'Hallo Welt'`."
    },
    {
      question: "Wie fügt man `4` einer Liste `zahlen` hinzu?",
      options: ["zahlen.add(4)", "zahlen.push(4)", "zahlen.append(4)", "zahlen + 4"],
      answer: 2,
      explanation: "`.append()` fügt ein Element ans Ende einer Liste an."
    },
    {
      question: "Was gibt `type(3.14)` zurück?",
      options: ["int", "str", "float", "double"],
      answer: 2,
      explanation: "Dezimalzahlen sind in Python vom Typ `float`."
    },
  ],
  2: [
    {
      question: "Was gibt dieser Code aus?",
      code: "print([x**2 for x in range(4)])",
      options: ["[0,1,4,9]", "[1,4,9,16]", "[0,1,2,3]", "Fehler"],
      answer: 0,
      explanation: "List Comprehension mit `x**2` für x in [0,1,2,3]: Ergibt `[0, 1, 4, 9]`."
    },
    {
      question: "Was ist `*args` in einer Funktion?",
      options: [
        "Ein Pflichtparameter",
        "Ermöglicht beliebig viele positionelle Argumente",
        "Ein Schlüsselwortargument",
        "Ein Rückgabewert"
      ],
      answer: 1,
      explanation: "`*args` sammelt alle überzähligen positionellen Argumente in einem Tupel."
    },
    {
      question: "Was gibt dieser Code aus?",
      code: "d = {'a': 1, 'b': 2}\nprint(d.get('c', 0))",
      options: ["None", "Fehler", "0", "c"],
      answer: 2,
      explanation: "`.get(key, default)` gibt `default` zurück, wenn der Schlüssel nicht existiert. Hier: `0`."
    },
    {
      question: "Was macht `lambda x: x * 2`?",
      options: [
        "Definiert eine normale Funktion",
        "Eine anonyme Funktion, die x verdoppelt",
        "Importiert ein Modul",
        "Erstellt eine Klasse"
      ],
      answer: 1,
      explanation: "`lambda` erstellt eine anonyme (namenlose) Funktion – hier: nimmt `x` und gibt `x * 2` zurück."
    },
    {
      question: "Was ist der Unterschied zwischen `is` und `==`?",
      options: [
        "Kein Unterschied",
        "`is` prüft Wertgleichheit, `==` Identität",
        "`==` prüft Wertgleichheit, `is` prüft Objektidentität",
        "`is` funktioniert nur mit Strings"
      ],
      answer: 2,
      explanation: "`==` vergleicht Werte; `is` prüft, ob beide Variablen auf dasselbe Objekt im Speicher zeigen."
    },
  ],
};

export default function PythonGame() {
  const [screen, setScreen] = useState("menu");
  const [level, setLevel] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answered, setAnswered] = useState(false);

  const qs = allQuestions[level];
  const q = qs[qIndex];
  const isLast = qIndex === qs.length - 1;

  function startGame(lvl) {
    setLevel(lvl);
    setQIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelected(null);
    setAnswered(false);
    setShowExplanation(false);
    setScreen("game");
  }

  function choose(i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const correct = i === q.answer;
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  }

  function next() {
    if (isLast) {
      setScreen("result");
    } else {
      setQIndex(i => i + 1);
      setSelected(null);
      setAnswered(false);
      setShowExplanation(false);
    }
  }

  const pct = Math.round((score / qs.length) * 100);

  if (screen === "menu") return (
    <div style={{padding: "2rem 1rem", maxWidth: 520, margin: "0 auto"}}>
      <h2 style={{fontSize: 22, fontWeight: 500, marginBottom: 8}}>🐍 Python Quiz</h2>
      <p style={{color: "var(--color-text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6}}>
        Teste dein Python-Wissen und lerne durch sofortiges Feedback. Wähle dein Level:
      </p>
      <div style={{display: "flex", flexDirection: "column", gap: 12}}>
        {levels.map((lv, i) => (
          <button key={i} onClick={() => startGame(i)} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "14px 18px", borderRadius: "var(--border-radius-lg)",
            border: "0.5px solid var(--color-border-secondary)",
            background: "var(--color-background-primary)",
            cursor: "pointer", textAlign: "left", fontSize: 15,
            color: "var(--color-text-primary)"
          }}>
            <span style={{fontSize: 22}}>{lv.emoji}</span>
            <div>
              <div style={{fontWeight: 500}}>{lv.label}</div>
              <div style={{fontSize: 13, color: "var(--color-text-secondary)"}}>
                {i === 0 ? "Variablen, Typen, Grundoperationen" : i === 1 ? "Listen, Funktionen, Schleifen" : "Lambdas, Comprehensions, Dicts"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  if (screen === "result") return (
    <div style={{padding: "2rem 1rem", maxWidth: 480, margin: "0 auto", textAlign: "center"}}>
      <div style={{fontSize: 48, marginBottom: 8}}>
        {pct === 100 ? "🏆" : pct >= 60 ? "🎉" : "💪"}
      </div>
      <h2 style={{fontSize: 22, fontWeight: 500, marginBottom: 4}}>
        {pct === 100 ? "Perfekt!" : pct >= 60 ? "Gut gemacht!" : "Weiter üben!"}
      </h2>
      <p style={{color: "var(--color-text-secondary)", marginBottom: "1.5rem"}}>
        Level: {levels[level].label}
      </p>
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: "1.5rem"}}>
        {[["Richtig", `${score}/${qs.length}`], ["Prozent", `${pct}%`], ["Best Streak", `${bestStreak}🔥`]].map(([l, v]) => (
          <div key={l} style={{background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "12px 8px"}}>
            <div style={{fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 4}}>{l}</div>
            <div style={{fontSize: 20, fontWeight: 500}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap"}}>
        <button onClick={() => startGame(level)} style={{
          padding: "10px 20px", borderRadius: "var(--border-radius-md)",
          border: "0.5px solid var(--color-border-secondary)",
          background: "var(--color-background-primary)",
          cursor: "pointer", fontSize: 14, color: "var(--color-text-primary)"
        }}>Nochmal</button>
        {level < 2 && (
          <button onClick={() => startGame(level + 1)} style={{
            padding: "10px 20px", borderRadius: "var(--border-radius-md)",
            border: "0.5px solid var(--color-border-secondary)",
            background: "var(--color-background-primary)",
            cursor: "pointer", fontSize: 14, color: "var(--color-text-primary)"
          }}>Nächstes Level ↗</button>
        )}
        <button onClick={() => setScreen("menu")} style={{
          padding: "10px 20px", borderRadius: "var(--border-radius-md)",
          border: "0.5px solid var(--color-border-secondary)",
          background: "var(--color-background-primary)",
          cursor: "pointer", fontSize: 14, color: "var(--color-text-secondary)"
        }}>Menü</button>
      </div>
    </div>
  );

  return (
    <div style={{padding: "1.5rem 1rem", maxWidth: 520, margin: "0 auto"}}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem"}}>
        <span style={{fontSize: 13, color: "var(--color-text-secondary)"}}>
          {levels[level].emoji} {levels[level].label} · Frage {qIndex + 1}/{qs.length}
        </span>
        <span style={{fontSize: 13, color: "var(--color-text-secondary)"}}>
          ✅ {score} {streak > 1 ? `· 🔥${streak}` : ""}
        </span>
      </div>

      <div style={{background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", marginBottom: "1rem"}}>
        <p style={{fontWeight: 500, marginBottom: q.code ? 10 : 0, lineHeight: 1.5}}>{q.question}</p>
        {q.code && (
          <pre style={{
            fontFamily: "var(--font-mono)", fontSize: 13, margin: 0,
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-md)",
            padding: "10px 12px", overflowX: "auto", lineHeight: 1.6
          }}>{q.code}</pre>
        )}
      </div>

      <div style={{display: "flex", flexDirection: "column", gap: 8, marginBottom: "1rem"}}>
        {q.options.map((opt, i) => {
          let bg = "var(--color-background-primary)";
          let border = "0.5px solid var(--color-border-secondary)";
          let color = "var(--color-text-primary)";
          if (answered) {
            if (i === q.answer) { bg = "var(--color-background-success)"; border = "1px solid var(--color-border-success)"; color = "var(--color-text-success)"; }
            else if (i === selected && selected !== q.answer) { bg = "var(--color-background-danger)"; border = "1px solid var(--color-border-danger)"; color = "var(--color-text-danger)"; }
          }
          return (
            <button key={i} onClick={() => choose(i)} style={{
              padding: "11px 14px", borderRadius: "var(--border-radius-md)",
              border, background: bg, color,
              cursor: answered ? "default" : "pointer",
              textAlign: "left", fontSize: 14, lineHeight: 1.4,
              fontFamily: "var(--font-mono)", transition: "background 0.15s"
            }}>
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div>
          <div style={{
            background: selected === q.answer ? "var(--color-background-success)" : "var(--color-background-danger)",
            border: `0.5px solid ${selected === q.answer ? "var(--color-border-success)" : "var(--color-border-danger)"}`,
            borderRadius: "var(--border-radius-md)", padding: "10px 14px", marginBottom: 12
          }}>
            <span style={{fontSize: 14, color: selected === q.answer ? "var(--color-text-success)" : "var(--color-text-danger)", fontWeight: 500}}>
              {selected === q.answer ? "✅ Richtig!" : "❌ Falsch!"}
            </span>
            {showExplanation && (
              <p style={{margin: "8px 0 0", fontSize: 13, lineHeight: 1.6, color: "var(--color-text-primary)"}}>
                {q.explanation}
              </p>
            )}
          </div>
          <div style={{display: "flex", gap: 10}}>
            {!showExplanation && (
              <button onClick={() => setShowExplanation(true)} style={{
                padding: "9px 16px", borderRadius: "var(--border-radius-md)",
                border: "0.5px solid var(--color-border-secondary)",
                background: "var(--color-background-primary)",
                cursor: "pointer", fontSize: 13, color: "var(--color-text-secondary)"
              }}>Erklärung anzeigen</button>
            )}
            <button onClick={next} style={{
              padding: "9px 20px", borderRadius: "var(--border-radius-md)",
              border: "0.5px solid var(--color-border-secondary)",
              background: "var(--color-background-primary)",
              cursor: "pointer", fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)"
            }}>{isLast ? "Ergebnis anzeigen →" : "Nächste Frage →"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
