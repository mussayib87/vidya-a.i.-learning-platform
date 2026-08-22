export type TutorReply = {
  keywords: string[];
  answer: string;
  simple: string;
};

export const tutorReplies: TutorReply[] = [
  {
    keywords: ["quadratic", "discriminant", "roots"],
    answer:
      "A quadratic equation looks like ax² + bx + c = 0. You can solve it by factorising, completing the square, or using the formula x = (−b ± √(b² − 4ac)) / 2a. The part under the root, b² − 4ac, is the discriminant: positive means two real roots, zero means one repeated root, negative means no real roots.",
    simple:
      "Think of it as a puzzle with an x² in it. Plug a, b and c into the formula and it gives you the answers. If the number under the square root is negative, there is no real answer.",
  },
  {
    keywords: ["newton", "force", "motion", "law"],
    answer:
      "Newton's three laws describe motion. First: an object keeps doing what it is doing unless a net force acts on it. Second: net force equals mass times acceleration (F = ma). Third: every action has an equal and opposite reaction on a different body.",
    simple:
      "Things don't move or stop by themselves — something has to push or pull them. The harder the push, the faster it speeds up. And when you push a wall, the wall pushes you back just as hard.",
  },
  {
    keywords: ["photosynthesis", "plant", "chloroplast", "leaf"],
    answer:
      "Photosynthesis is how green plants make food. Chloroplasts capture sunlight and use it to combine carbon dioxide from the air with water from the roots, producing glucose and releasing oxygen: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.",
    simple:
      "Plants make their own food using sunlight, water and air. The leftover is oxygen, which we breathe.",
  },
  {
    keywords: ["atom", "electron", "proton", "shell"],
    answer:
      "An atom has protons and neutrons in a tiny nucleus with electrons around it in shells. The number of protons is the atomic number and identifies the element. Each shell holds up to 2n² electrons, and the outermost electrons decide how the element reacts.",
    simple:
      "An atom is like a tiny solar system: a heavy centre with light electrons moving around it. The outer electrons decide who the atom likes to bond with.",
  },
  {
    keywords: ["tense", "grammar", "verb", "english"],
    answer:
      "English has twelve tenses formed by combining past, present and future with simple, continuous, perfect and perfect continuous aspects. Pick the tense from the time of the action and whether it is finished, ongoing, or connected to now.",
    simple:
      "Tense just tells when something happened. Ask yourself: is it happening now, did it already happen, or will it happen later?",
  },
  {
    keywords: ["array", "complexity", "algorithm", "code", "search"],
    answer:
      "An array stores items side by side, so reading position i is instant — O(1). Searching an unsorted array takes O(n) comparisons, but if the array is sorted you can use binary search and finish in about O(log n) steps by halving the range each time.",
    simple:
      "An array is like a row of lockers with numbers. Going straight to locker 7 is instant. Finding a locker by what's inside means opening them one by one — unless they're arranged in order, then you can guess the middle each time.",
  },
];

export const fallbackReply = {
  answer:
    "Here is how I would approach that: break the question into what you already know and what you need to find. Write down the definitions involved, then connect them with one rule or formula at a time. If you paste the exact question or the chapter name, I can walk through it step by step.",
  simple:
    "Let's take it slowly. Tell me what the question gives you and what it asks for, and we will fill the gap one small step at a time.",
};

export const suggestedQuestions = [
  "Explain quadratic equations with an example",
  "What are Newton's laws of motion?",
  "How does photosynthesis work?",
  "Why is binary search faster than linear search?",
];
