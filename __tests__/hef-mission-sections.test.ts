import { describe, it, expect } from "vitest";
import { findSection, parseAnswerKey, parseFlashQuiz, parseReflection, revisionOf } from "../scripts/hef/mission-sections.mjs";

// Extrait fidèle au format des chapitres HEF (01-Course/chapters/*.md).
const MISSION = `# Mission 01 — Cadrer un problème

## 🐉 Mini-boss (40 XP)

Texte du mini-boss.

## ⚡ Quiz éclair (15 XP si 4/5 ou plus)

Chapitre d'ouverture : les 5 questions portent sur cette mission.

**1.** « Le site est lent » est :
- A. un symptôme
- B. une solution
- C. un fait vérifié

**2.** Laquelle est une hypothèse ?
- A. La page renvoie l'erreur 500.
- B. Le serveur est probablement saturé.
- C. Dix clients ont écrit à ce sujet.

**3.** Dans la phrase « Il faut ajouter un cache », qu'est-ce qui manque ?
- A. Le problème que ce cache doit résoudre
- B. Le nom du cache
- C. Rien

**4.** 🔁 *Révision mission 03* : Pour tester l'absence de valeur on écrit :
- A. IS NULL
- B. = NULL
- C. == NULL

**5.** 🔁 *Révision HEF-010, mission 08* : Un cas limite typique est :
- A. une liste vide
- B. une liste triée
- C. une liste de 3 éléments

<details>
<summary>✅ Réponses</summary>

1. **A**, c'est ce qu'on observe. 2. **B**, ce n'est pas vérifié. 3. **A**. 4. **A**. 5. **A**.

</details>

---

## 🪞 Je réfléchis (10 XP)

Reprends la feuille de ton défi d'échauffement.

1. Qu'est-ce qui a changé dans ta façon de poser des questions à Léo ?
2. Dans ta vie, quelle situation aurait été plus simple si tu avais d'abord cadré le problème ?

---

## 🎒 À retenir

1. Un **symptôme** n'est ni un problème ni une solution.
`;

// Extrait au format des labos (03-Labs/*.md).
const LAB = `# Lab — Enquête

## Preuves à rendre

- incidents.py

## Réflexion

- Quel faux positif as-tu dû corriger ?
- Quelle information supplémentaire aurais-tu aimé avoir pendant l'enquête ?
`;

describe("findSection", () => {
  it("s'arrête au titre ## suivant et ignore les ###", () => {
    const section = findSection("## A\n\n### sous\ntexte\n## B\nautre", /^A$/);
    expect(section).toEqual({ heading: "A", body: "\n### sous\ntexte" });
  });

  it("renvoie null si la section est absente", () => {
    expect(findSection("## A\ntexte", /quiz/i)).toBeNull();
  });
});

describe("parseAnswerKey", () => {
  it("lit une clé sur une seule ligne avec explications", () => {
    expect(parseAnswerKey("1. **A**, c'est observé. 2. **C**.")).toEqual({
      1: { letter: "A", explanation: "c'est observé." },
      2: { letter: "C", explanation: null },
    });
  });

  it("lit une clé sur plusieurs lignes", () => {
    expect(parseAnswerKey("1. **B**.\n2. **A** — car X.\n")).toEqual({
      1: { letter: "B", explanation: null },
      2: { letter: "A", explanation: "car X." },
    });
  });
});

describe("revisionOf", () => {
  it("reconnaît les trois formes de préfixe de révision", () => {
    expect(revisionOf("🔁 *Révision mission 03* : Q")).toEqual({ module: null, mission: 3 });
    expect(revisionOf("🔁 *Révision de la mission 01* : Q")).toEqual({ module: null, mission: 1 });
    expect(revisionOf("🔁 *Révision HEF-010, mission 08* : Q")).toEqual({
      module: "HEF-010",
      mission: 8,
    });
    expect(revisionOf("Une question normale ?")).toBeNull();
  });
});

describe("parseFlashQuiz", () => {
  const quiz = parseFlashQuiz(MISSION);

  it("extrait les 5 questions avec leurs options", () => {
    expect(quiz?.questions).toHaveLength(5);
    expect(quiz?.questions.map((q: { order: number }) => q.order)).toEqual([1, 2, 3, 4, 5]);
    expect(quiz?.questions[0]).toEqual({
      order: 1,
      text: "« Le site est lent » est :",
      revisionOf: null,
      explanation: "c'est ce qu'on observe.",
      options: [
        { text: "un symptôme", isCorrect: true },
        { text: "une solution", isCorrect: false },
        { text: "un fait vérifié", isCorrect: false },
      ],
    });
  });

  it("marque exactement une bonne réponse par question", () => {
    for (const question of quiz!.questions) {
      const correct = question.options.filter((o: { isCorrect: boolean }) => o.isCorrect);
      expect(correct).toHaveLength(1);
    }
    expect(quiz!.questions[1].options[1].isCorrect).toBe(true);
  });

  it("convertit le seuil 4/5 en score de réussite et lit l'XP", () => {
    expect(quiz?.passScore).toBe(80);
    expect(quiz?.xp).toBe(15);
  });

  it("garde le texte des questions de révision et expose leur origine", () => {
    expect(quiz?.questions[3].text).toBe(
      "🔁 *Révision mission 03* : Pour tester l'absence de valeur on écrit :",
    );
    expect(quiz?.questions[3].revisionOf).toEqual({ module: null, mission: 3 });
    expect(quiz?.questions[4].revisionOf).toEqual({ module: "HEF-010", mission: 8 });
  });

  it("ne déborde pas hors du bloc <details> des réponses", () => {
    expect(quiz?.questions[4].explanation).toBeNull();
    for (const question of quiz!.questions) {
      expect(question.explanation ?? "").not.toMatch(/details|---/);
    }
  });

  it("renvoie null sans section quiz éclair", () => {
    expect(parseFlashQuiz(LAB)).toBeNull();
  });

  it("laisse isCorrect à false si la clé de réponses manque", () => {
    const noKey = parseFlashQuiz("## ⚡ Quiz éclair\n\n**1.** Q ?\n- A. oui\n- B. non\n");
    expect(noKey?.passScore).toBe(60);
    expect(noKey?.questions[0].options.every((o: { isCorrect: boolean }) => !o.isCorrect)).toBe(
      true,
    );
  });
});

describe("parseReflection", () => {
  it("extrait les 2 questions de « Je réfléchis » d'une mission", () => {
    expect(parseReflection(MISSION)).toEqual({
      xp: 10,
      intro: "Reprends la feuille de ton défi d'échauffement.",
      questions: [
        { order: 1, text: "Qu'est-ce qui a changé dans ta façon de poser des questions à Léo ?" },
        {
          order: 2,
          text: "Dans ta vie, quelle situation aurait été plus simple si tu avais d'abord cadré le problème ?",
        },
      ],
    });
  });

  it("extrait la section ## Réflexion d'un labo", () => {
    expect(parseReflection(LAB)).toEqual({
      xp: null,
      intro: null,
      questions: [
        { order: 1, text: "Quel faux positif as-tu dû corriger ?" },
        {
          order: 2,
          text: "Quelle information supplémentaire aurais-tu aimé avoir pendant l'enquête ?",
        },
      ],
    });
  });

  it("renvoie null sans section de réflexion", () => {
    expect(parseReflection("## 🎒 À retenir\n\n1. Rien.")).toBeNull();
  });
});
