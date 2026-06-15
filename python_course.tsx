import { useState } from "react";

const curriculum = [
  {
    id: 0, title: "Variablen & Typen", emoji: "📦",
    lessons: [
      {
        title: "Was ist eine Variable?",
        content: `Eine Variable ist wie eine beschriftete Box – du speicherst darin einen Wert und kannst ihn später abrufen.`,
        code: `name = "Anna"\nalter = 25\ngroesse = 1.72\nist_student = True\n\nprint(name)   # Anna\nprint(alter)  # 25`,
        explanation: "In Python brauchst du kein `var` oder Typangabe – einfach `name = wert`. Python erkennt den Typ automatisch.",
        exercise: { prompt: 'Was gibt `print(type(42))` aus?', options: ["<class 'str'>", "<class 'int'>", "<class 'float'>", "<class 'bool'>"], answer: 1, hint: "42 ist eine ganze Zahl." }
      },
      {
        title: "Strings & Zahlen",
        content: "Es gibt verschiedene Datentypen. Die wichtigsten: `str` (Text), `int` (ganze Zahl), `float` (Dezimalzahl), `bool` (Wahr/Falsch).",
        code: `text = "Hallo"        # str\nganze_zahl = 7       # int\ndezimal = 3.14       # float\nwahr = True          # bool\n\nprint(type(text))    # <class 'str'>`,
        explanation: "Mit `type()` kannst du den Datentyp einer Variable prüfen.",
        exercise: { prompt: 'Was ergibt `"5" + "3"`?', options: ["8", "53", "\"53\"", "Fehler"], answer: 1, hint: 'Strings werden mit + zusammengefügt, nicht addiert.' }
      },
    ]
  },
  {
    id: 1, title: "if / else", emoji: "🔀",
    lessons: [
      {
        title: "Bedingungen",
        content: "Mit `if` kannst du Code nur dann ausführen, wenn eine Bedingung erfüllt ist. Der Einzug (4 Leerzeichen) ist in Python Pflicht!",
        code: `alter = 20\n\nif alter >= 18:\n    print("Erwachsen")\nelse:\n    print("Minderjährig")`,
        explanation: "Python nutzt Einrückung statt geschweifte Klammern. Alles unter dem `if:` muss eingerückt sein.",
        exercise: { prompt: 'Was gibt dieser Code aus?\n\nx = 10\nif x > 5:\n    print("groß")\nelse:\n    print("klein")', options: ["klein", "groß", "10", "Fehler"], answer: 1, hint: "10 ist größer als 5." }
      },
      {
        title: "elif",
        content: "`elif` steht für \"else if\" – damit kannst du mehrere Bedingungen prüfen.",
        code: `note = 85\n\nif note >= 90:\n    print("Sehr gut")\nelif note >= 70:\n    print("Gut")\nelif note >= 50:\n    print("Bestanden")\nelse:\n    print("Durchgefallen")`,
        explanation: "Python prüft von oben nach unten. Sobald eine Bedingung stimmt, wird der Rest übersprungen.",
        exercise: { prompt: 'Was wird ausgegeben wenn `note = 60`?', options: ["Sehr gut", "Gut", "Bestanden", "Durchgefallen"], answer: 2, hint: "60 >= 50 ist wahr, aber 60 >= 70 ist falsch." }
      },
    ]
  },
  {
    id: 2, title: "Schleifen", emoji: "🔁",
    lessons: [
      {
        title: "for-Schleife",
        content: "Eine `for`-Schleife wiederholt Code für jedes Element in einer Sequenz.",
        code: `früchte = ["Apfel", "Banane", "Kirsche"]\n\nfor frucht in früchte:\n    print(frucht)\n\n# Ausgabe:\n# Apfel\n# Banane\n# Kirsche`,
        explanation: "`for element in liste:` – die Variable `element` nimmt bei jeder Runde den nächsten Wert an.",
        exercise: { prompt: 'Wie oft wird "Hallo" ausgegeben?\n\nfor i in range(3):\n    print("Hallo")', options: ["2", "3", "4", "0"], answer: 1, hint: "range(3) erzeugt 0, 1, 2 – also 3 Werte." }
      },
      {
        title: "while-Schleife",
        content: "`while` läuft solange eine Bedingung wahr ist. Vorsicht: Vergisst man die Abbruchbedingung, läuft sie ewig!",
        code: `zähler = 0\n\nwhile zähler < 5:\n    print(zähler)\n    zähler += 1\n\n# Gibt 0 1 2 3 4 aus`,
        explanation: "`zähler += 1` erhöht den Zähler um 1 pro Runde. Ohne das würde die Schleife nie enden.",
        exercise: { prompt: 'Was ist der letzte ausgegebene Wert?\n\nx = 10\nwhile x > 7:\n    print(x)\n    x -= 1', options: ["7", "8", "10", "6"], answer: 1, hint: "Die Schleife läuft solange x > 7. Wann hört sie auf?" }
      },
    ]
  },
  {
    id: 3, title: "Funktionen", emoji: "⚙️",
    lessons: [
      {
        title: "Funktionen definieren",
        content: "Funktionen sind wiederverwendbare Code-Blöcke. Du definierst sie einmal mit `def` und kannst sie beliebig oft aufrufen.",
        code: `def begrüsse(name):\n    print("Hallo, " + name + "!")\n\nbegrüsse("Anna")   # Hallo, Anna!\nbegrüsse("Ben")    # Hallo, Ben!`,
        explanation: "`def funktionsname(parameter):` – der Code in der Funktion wird erst ausgeführt, wenn du sie aufrufst.",
        exercise: { prompt: 'Was gibt `quadrat(4)` zurück?\n\ndef quadrat(x):\n    return x * x', options: ["8", "16", "4", "Fehler"], answer: 1, hint: "4 * 4 = ?" }
      },
      {
        title: "Return & Standardwerte",
        content: "`return` gibt einen Wert zurück. Parameter können Standardwerte haben.",
        code: `def potenz(basis, exponent=2):\n    return basis ** exponent\n\nprint(potenz(3))    # 9  (3²)\nprint(potenz(3, 3)) # 27 (3³)`,
        explanation: "Wenn du `exponent` nicht angibst, wird der Standardwert `2` verwendet.",
        exercise: { prompt: 'Was gibt `addiere(5)` zurück?\n\ndef addiere(x, y=10):\n    return x + y', options: ["5", "10", "15", "Fehler"], answer: 2, hint: "y hat den Standardwert 10." }
      },
    ]
  },
  {
    id: 4, title: "Listen & Dicts", emoji: "📋",
    lessons: [
      {
        title: "Listen",
        content: "Listen speichern mehrere Werte in einer Variable. Sie sind geordnet und veränderbar.",
        code: `zahlen = [3, 1, 4, 1, 5]\n\nzahlen.append(9)   # anhängen\nzahlen.sort()      # sortieren\nprint(zahlen)      # [1, 1, 3, 4, 5, 9]\nprint(len(zahlen)) # 6\nprint(zahlen[0])   # 1 (erstes Element)`,
        explanation: "Listen-Index startet bei 0. `zahlen[-1]` gibt das letzte Element zurück.",
        exercise: { prompt: 'Was gibt `farben[2]` zurück?\n\nfarben = ["rot", "grün", "blau"]', options: ["rot", "grün", "blau", "Fehler"], answer: 2, hint: "Index 0 = rot, 1 = grün, 2 = ?" }
      },
      {
        title: "Dictionaries",
        content: "Dictionaries speichern Schlüssel-Wert-Paare – wie ein Wörterbuch oder eine JSON-Datei.",
        code: `person = {\n    "name": "Anna",\n    "alter": 25,\n    "stadt": "Zürich"\n}\n\nprint(person["name"])         # Anna\nperson["beruf"] = "Ingenieur" # hinzufügen\nprint(person.keys())          # alle Schlüssel`,
        explanation: 'Mit `dict["schlüssel"]` greifst du auf einen Wert zu. Mit `.get("schlüssel", default)` vermeidest du Fehler bei fehlenden Schlüsseln.',
        exercise: { prompt: 'Was gibt `d.get("c", 0)` zurück?\n\nd = {"a": 1, "b": 2}', options: ["None", "Fehler", "0", "\"c\""], answer: 2, hint: '"c" existiert nicht im Dict – was ist der Standardwert?' }
      },
    ]
  },
];

const TOTAL_LESSONS = curriculum.reduce((s, m) => s + m.lessons.length, 0);

export default function PythonCourse() {
  const [screen, setScreen] = useState("home");
  const [moduleIdx, setModuleIdx] = useState(0);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [stage, setStage] = useState("learn"); // learn | quiz | done
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [completed, setCompleted] = useState(new Set());

  const mod = curriculum[moduleIdx];
  const lesson = mod?.lessons[lessonIdx];
  const lessonKey = `${moduleIdx}-${lessonIdx}`;
  const isCorrect = selected === lesson?.exercise?.answer;

  function startLesson(mi, li) {
    setModuleIdx(mi); setLessonIdx(li);
    setStage("learn"); setSelected(null); setAnswered(false);
    setScreen("lesson");
  }

  function toQuiz() { setStage("quiz"); }

  function submitAnswer(i) {
    if (answered) return;
    setSelected(i); setAnswered(true);
    if (i === lesson.exercise.answer) {
      setCompleted(s => new Set([...s, lessonKey]));
    }
  }

  function nextLesson() {
    const nextLi = lessonIdx + 1;
    if (nextLi < mod.lessons.length) {
      startLesson(moduleIdx, nextLi);
    } else {
      const nextMi = moduleIdx + 1;
      if (nextMi < curriculum.length) {
        startLesson(nextMi, 0);
      } else {
        setScreen("finished");
      }
    }
  }

  const pct = Math.round((completed.size / TOTAL_LESSONS) * 100);

  // HOME
  if (screen === "home") return (
    <div style={{padding: "1.5rem 1rem", maxWidth: 540, margin: "0 auto"}}>
      <h2 style={{fontSize: 22, fontWeight: 500, marginBottom: 4}}>🐍 Python Kurs</h2>
      <p style={{color: "var(--color-text-secondary)", marginBottom: "1.5rem", lineHeight: 1.6, fontSize: 14}}>
        Lerne Python Schritt für Schritt – jede Lektion erklärt ein Konzept, zeigt Code und testet dich.
      </p>

      {completed.size > 0 && (
        <div style={{background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)", padding: "10px 14px", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 12}}>
          <div style={{flex: 1, height: 6, background: "var(--color-border-tertiary)", borderRadius: 9}}>
            <div style={{height: 6, borderRadius: 9, background: "var(--color-text-success)", width: pct + "%", transition: "width 0.3s"}} />
          </div>
          <span style={{fontSize: 13, color: "var(--color-text-secondary)", whiteSpace: "nowrap"}}>{completed.size}/{TOTAL_LESSONS} Lektionen</span>
        </div>
      )}

      <div style={{display: "flex", flexDirection: "column", gap: 10}}>
        {curriculum.map((m, mi) => {
          const done = m.lessons.filter((_, li) => completed.has(`${mi}-${li}`)).length;
          const allDone = done === m.lessons.length;
          return (
            <div key={mi} style={{
              border: "0.5px solid var(--color-border-secondary)",
              borderRadius: "var(--border-radius-lg)",
              background: "var(--color-background-primary)",
              overflow: "hidden"
            }}>
              <div style={{padding: "12px 16px", display: "flex", alignItems: "center", gap: 12}}>
                <span style={{fontSize: 20}}>{m.emoji}</span>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 500, fontSize: 15}}>{m.title}</div>
                  <div style={{fontSize: 12, color: "var(--color-text-secondary)"}}>{m.lessons.length} Lektionen · {done}/{m.lessons.length} abgeschlossen</div>
                </div>
                {allDone && <span style={{fontSize: 13, color: "var(--color-text-success)"}}>✓</span>}
              </div>
              <div style={{borderTop: "0.5px solid var(--color-border-tertiary)", display: "flex", flexDirection: "column"}}>
                {m.lessons.map((l, li) => {
                  const key = `${mi}-${li}`;
                  const isDone = completed.has(key);
                  return (
                    <button key={li} onClick={() => startLesson(mi, li)} style={{
                      padding: "9px 16px 9px 48px", textAlign: "left",
                      background: "none", border: "none",
                      borderTop: li > 0 ? "0.5px solid var(--color-border-tertiary)" : "none",
                      cursor: "pointer", fontSize: 13,
                      color: isDone ? "var(--color-text-success)" : "var(--color-text-secondary)",
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <span>{li + 1}. {l.title}</span>
                      {isDone && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // FINISHED
  if (screen === "finished") return (
    <div style={{padding: "2rem 1rem", maxWidth: 480, margin: "0 auto", textAlign: "center"}}>
      <div style={{fontSize: 56, marginBottom: 12}}>🏆</div>
      <h2 style={{fontSize: 22, fontWeight: 500, marginBottom: 8}}>Kurs abgeschlossen!</h2>
      <p style={{color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem"}}>
        Du hast alle {TOTAL_LESSONS} Lektionen durchgearbeitet. Du kennst jetzt die Grundlagen von Python!
      </p>
      <button onClick={() => setScreen("home")} style={{
        padding: "10px 24px", borderRadius: "var(--border-radius-md)",
        border: "0.5px solid var(--color-border-secondary)",
        background: "var(--color-background-primary)",
        cursor: "pointer", fontSize: 14, color: "var(--color-text-primary)"
      }}>Zurück zur Übersicht</button>
    </div>
  );

  // LESSON
  return (
    <div style={{padding: "1.5rem 1rem", maxWidth: 540, margin: "0 auto"}}>
      <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem"}}>
        <button onClick={() => setScreen("home")} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--color-text-secondary)", fontSize: 13, padding: 0
        }}>← Übersicht</button>
        <span style={{color: "var(--color-border-secondary)"}}>·</span>
        <span style={{fontSize: 13, color: "var(--color-text-secondary)"}}>{mod.emoji} {mod.title}</span>
      </div>

      <h3 style={{fontSize: 18, fontWeight: 500, marginBottom: "1rem"}}>{lesson.title}</h3>

      {stage === "learn" && (
        <>
          <p style={{lineHeight: 1.7, marginBottom: "1rem", fontSize: 14}}>{lesson.content}</p>

          <pre style={{
            fontFamily: "var(--font-mono)", fontSize: 13,
            background: "var(--color-background-secondary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-md)",
            padding: "14px 16px", overflowX: "auto", lineHeight: 1.7,
            marginBottom: "1rem"
          }}>{lesson.code}</pre>

          <div style={{
            borderLeft: "3px solid var(--color-border-info)",
            paddingLeft: 12, marginBottom: "1.5rem",
            borderRadius: 0
          }}>
            <p style={{fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0}}>
              💡 {lesson.explanation}
            </p>
          </div>

          <button onClick={toQuiz} style={{
            padding: "10px 22px", borderRadius: "var(--border-radius-md)",
            border: "0.5px solid var(--color-border-secondary)",
            background: "var(--color-background-primary)",
            cursor: "pointer", fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)"
          }}>Weiter zur Übung →</button>
        </>
      )}

      {stage === "quiz" && (
        <>
          <div style={{
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-md)",
            padding: "12px 14px", marginBottom: "1rem"
          }}>
            <pre style={{
              fontFamily: lesson.exercise.prompt.includes('\n') ? "var(--font-mono)" : "inherit",
              fontSize: 14, margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6
            }}>{lesson.exercise.prompt}</pre>
          </div>

          <div style={{display: "flex", flexDirection: "column", gap: 8, marginBottom: "1rem"}}>
            {lesson.exercise.options.map((opt, i) => {
              let border = "0.5px solid var(--color-border-secondary)";
              let bg = "var(--color-background-primary)";
              let color = "var(--color-text-primary)";
              if (answered) {
                if (i === lesson.exercise.answer) { bg = "var(--color-background-success)"; border = "1px solid var(--color-border-success)"; color = "var(--color-text-success)"; }
                else if (i === selected) { bg = "var(--color-background-danger)"; border = "1px solid var(--color-border-danger)"; color = "var(--color-text-danger)"; }
              }
              return (
                <button key={i} onClick={() => submitAnswer(i)} style={{
                  padding: "10px 14px", borderRadius: "var(--border-radius-md)",
                  border, background: bg, color,
                  cursor: answered ? "default" : "pointer",
                  textAlign: "left", fontSize: 13, fontFamily: "var(--font-mono)"
                }}>
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              );
            })}
          </div>

          {!answered && (
            <p style={{fontSize: 12, color: "var(--color-text-tertiary)"}}>
              💡 Tipp: {lesson.exercise.hint}
            </p>
          )}

          {answered && (
            <div style={{
              background: isCorrect ? "var(--color-background-success)" : "var(--color-background-danger)",
              border: `0.5px solid ${isCorrect ? "var(--color-border-success)" : "var(--color-border-danger)"}`,
              borderRadius: "var(--border-radius-md)",
              padding: "10px 14px", marginBottom: 14
            }}>
              <p style={{margin: 0, fontSize: 14, color: isCorrect ? "var(--color-text-success)" : "var(--color-text-danger)", fontWeight: 500}}>
                {isCorrect ? "✅ Richtig!" : "❌ Nicht ganz – schau dir die grün markierte Antwort an."}
              </p>
            </div>
          )}

          {answered && (
            <button onClick={nextLesson} style={{
              padding: "10px 22px", borderRadius: "var(--border-radius-md)",
              border: "0.5px solid var(--color-border-secondary)",
              background: "var(--color-background-primary)",
              cursor: "pointer", fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)"
            }}>
              {lessonIdx + 1 < mod.lessons.length ? "Nächste Lektion →" :
               moduleIdx + 1 < curriculum.length ? `Zum Modul: ${curriculum[moduleIdx + 1].title} →` : "Kurs abschliessen →"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
