export type Lesson = {
  id: string;
  subjectId: string;
  title: string;
  duration: number;
  completed: boolean;
  summary: string;
  explanation: string[];
  examples: { title: string; body: string }[];
  keyPoints: string[];
};

export type Subject = {
  id: string;
  name: string;
  icon: string;
  description: string;
  colorClass: string;
};

export const subjects: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "Sigma",
    description: "Algebra, geometry, trigonometry and calculus foundations.",
    colorClass: "from-primary to-accent",
  },
  {
    id: "physics",
    name: "Physics",
    icon: "Atom",
    description: "Motion, energy, electricity and the laws behind them.",
    colorClass: "from-primary to-primary",
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: "FlaskConical",
    description: "Atoms, bonding, reactions and periodic trends.",
    colorClass: "from-accent to-primary",
  },
  {
    id: "biology",
    name: "Biology",
    icon: "Leaf",
    description: "Cells, genetics, human physiology and ecosystems.",
    colorClass: "from-success to-primary",
  },
  {
    id: "english",
    name: "English",
    icon: "BookOpen",
    description: "Grammar, comprehension, writing and literature.",
    colorClass: "from-accent to-accent",
  },
  {
    id: "computer-science",
    name: "Computer Science",
    icon: "Code2",
    description: "Programming logic, data structures and algorithms.",
    colorClass: "from-primary to-accent",
  },
  {
    id: "social-science",
    name: "Social Science",
    icon: "Globe2",
    description: "History, civics, geography and economics.",
    colorClass: "from-warning to-accent",
  },
  {
    id: "hindi",
    name: "Hindi",
    icon: "Languages",
    description: "व्याकरण, गद्य, पद्य और लेखन कौशल।",
    colorClass: "from-accent to-warning",
  },
];

function lesson(
  subjectId: string,
  index: number,
  title: string,
  summary: string,
  explanation: string[],
  examples: { title: string; body: string }[],
  keyPoints: string[],
  completed: boolean,
  duration = 12,
): Lesson {
  return {
    id: `${subjectId}-${index}`,
    subjectId,
    title,
    duration,
    completed,
    summary,
    explanation,
    examples,
    keyPoints,
  };
}

export const lessons: Lesson[] = [
  lesson(
    "mathematics",
    1,
    "Linear Equations in One Variable",
    "Solve equations of the form ax + b = 0 and apply them to word problems.",
    [
      "A linear equation in one variable is any equation that can be written as ax + b = 0, where a is not zero. The highest power of the variable is one, which is why its graph is a straight line.",
      "To solve it, isolate the variable: move constants to one side, variable terms to the other, and divide by the coefficient. Whatever operation you apply to one side must be applied to the other, which keeps the equation balanced.",
      "Word problems become linear equations once you name the unknown. Read the sentence, assign a variable, translate each phrase into an operation, then solve and check the answer against the original statement.",
    ],
    [
      {
        title: "Solve 3x + 7 = 22",
        body: "Subtract 7 from both sides: 3x = 15. Divide both sides by 3: x = 5. Check: 3(5) + 7 = 22.",
      },
      {
        title: "Word problem",
        body: "A notebook costs 15 rupees more than a pen. Together they cost 65 rupees. Let the pen be x, so x + (x + 15) = 65, giving 2x = 50 and x = 25. The pen costs 25 rupees, the notebook 40 rupees.",
      },
    ],
    [
      "Standard form is ax + b = 0 with a ≠ 0.",
      "Keep the equation balanced: do the same operation on both sides.",
      "Always substitute your answer back to verify it.",
    ],
    true,
  ),
  lesson(
    "mathematics",
    2,
    "Quadratic Equations and the Discriminant",
    "Factorise, complete the square and read the nature of roots from b² − 4ac.",
    [
      "A quadratic equation has the form ax² + bx + c = 0 with a ≠ 0. It can have two real roots, one repeated root, or no real roots.",
      "Three standard methods solve it: factorisation, completing the square, and the quadratic formula x = (−b ± √(b² − 4ac)) / 2a.",
      "The discriminant D = b² − 4ac tells you the nature of the roots before you solve: D > 0 gives two distinct real roots, D = 0 gives one repeated root, and D < 0 gives no real roots.",
    ],
    [
      {
        title: "Factorisation",
        body: "x² − 5x + 6 = 0 factorises as (x − 2)(x − 3) = 0, so x = 2 or x = 3.",
      },
      {
        title: "Discriminant",
        body: "For 2x² + 3x + 5 = 0, D = 9 − 40 = −31 < 0, so the equation has no real roots.",
      },
    ],
    [
      "Quadratic formula works for every quadratic equation.",
      "D = b² − 4ac decides how many real roots exist.",
      "Sum of roots = −b/a, product of roots = c/a.",
    ],
    true,
  ),
  lesson(
    "mathematics",
    3,
    "Introduction to Trigonometric Ratios",
    "Define sine, cosine and tangent using a right-angled triangle.",
    [
      "In a right-angled triangle, the trigonometric ratios relate an acute angle to the lengths of two sides. Sine is opposite over hypotenuse, cosine is adjacent over hypotenuse, and tangent is opposite over adjacent.",
      "The reciprocal ratios cosecant, secant and cotangent simply invert these three. Because the ratios depend only on the angle, they stay the same for similar triangles of any size.",
      "The standard angles 0°, 30°, 45°, 60° and 90° appear constantly in exams, so their values are worth memorising as a small table.",
    ],
    [
      {
        title: "Finding a ratio",
        body: "A triangle has opposite side 3, adjacent 4 and hypotenuse 5. Then sin θ = 3/5, cos θ = 4/5 and tan θ = 3/4.",
      },
      {
        title: "Standard angle",
        body: "sin 30° = 1/2, so if the hypotenuse is 10 cm the side opposite the 30° angle is 5 cm.",
      },
    ],
    [
      "SOH-CAH-TOA is the fastest way to recall the three ratios.",
      "sin²θ + cos²θ = 1 for every angle θ.",
      "Ratios depend on the angle, not on the size of the triangle.",
    ],
    false,
  ),
  lesson(
    "mathematics",
    4,
    "Probability Basics",
    "Measure how likely an event is and combine simple events.",
    [
      "Probability of an event equals the number of favourable outcomes divided by the total number of equally likely outcomes. It always lies between 0 and 1.",
      "The probability of an event not happening is 1 minus the probability that it happens. This complement rule often shortens long calculations.",
      "For two events you can add probabilities when the events cannot happen together, and multiply them when the events are independent.",
    ],
    [
      {
        title: "Single die",
        body: "Rolling a fair die, P(even number) = 3/6 = 1/2 because 2, 4 and 6 are favourable.",
      },
      {
        title: "Complement rule",
        body: "If P(rain tomorrow) = 0.3, then P(no rain) = 1 − 0.3 = 0.7.",
      },
    ],
    [
      "0 ≤ P(E) ≤ 1 always.",
      "P(not E) = 1 − P(E).",
      "Independent events multiply; mutually exclusive events add.",
    ],
    false,
  ),
  lesson(
    "physics",
    1,
    "Motion in a Straight Line",
    "Distance, displacement, speed, velocity and acceleration.",
    [
      "Distance is the total path length travelled while displacement is the shortest straight line from start to finish, with direction. Distance can never be negative; displacement can.",
      "Speed is distance per unit time; velocity is displacement per unit time and therefore has direction. Acceleration is the rate of change of velocity.",
      "For uniform acceleration the three equations of motion apply: v = u + at, s = ut + ½at², and v² = u² + 2as.",
    ],
    [
      {
        title: "Round trip",
        body: "A student walks 200 m to school and returns. Distance = 400 m, displacement = 0 m.",
      },
      {
        title: "Using v = u + at",
        body: "A bus starts from rest and accelerates at 2 m/s² for 5 s. Final velocity = 0 + 2 × 5 = 10 m/s.",
      },
    ],
    [
      "Displacement is a vector, distance is a scalar.",
      "Slope of a distance–time graph is speed.",
      "Equations of motion assume constant acceleration.",
    ],
    true,
  ),
  lesson(
    "physics",
    2,
    "Newton's Laws of Motion",
    "Inertia, F = ma, and action–reaction pairs.",
    [
      "The first law states that a body continues at rest or in uniform motion unless an unbalanced external force acts on it. This tendency is called inertia and it grows with mass.",
      "The second law quantifies force: the net force equals mass times acceleration, F = ma. One newton is the force that accelerates 1 kg at 1 m/s².",
      "The third law says every action has an equal and opposite reaction. The two forces act on different bodies, which is why they never cancel each other out.",
    ],
    [
      {
        title: "Second law",
        body: "A 4 kg box pushed with a net force of 12 N accelerates at a = F/m = 3 m/s².",
      },
      {
        title: "Third law",
        body: "When you walk, your foot pushes the ground backwards and the ground pushes you forwards with equal force.",
      },
    ],
    [
      "Inertia depends only on mass.",
      "F = ma applies to the net force, not a single force.",
      "Action and reaction act on two different bodies.",
    ],
    false,
  ),
  lesson(
    "chemistry",
    1,
    "Atomic Structure",
    "Protons, neutrons, electrons and how electrons fill shells.",
    [
      "An atom has a dense nucleus containing protons and neutrons, surrounded by electrons in shells. The atomic number equals the proton count and defines the element.",
      "Mass number is protons plus neutrons. Atoms of the same element with different neutron counts are isotopes, such as carbon-12 and carbon-14.",
      "Electrons occupy shells that hold at most 2n² electrons. The outermost shell decides the chemical behaviour of the element.",
    ],
    [
      {
        title: "Sodium",
        body: "Sodium has 11 protons, so its configuration is 2, 8, 1. The single outer electron makes it highly reactive.",
      },
      {
        title: "Isotopes",
        body: "Chlorine-35 and chlorine-37 both have 17 protons but 18 and 20 neutrons respectively.",
      },
    ],
    [
      "Atomic number = number of protons.",
      "Shell capacity is 2n².",
      "Valence electrons determine reactivity.",
    ],
    true,
  ),
  lesson(
    "chemistry",
    2,
    "Chemical Bonding",
    "Why atoms share or transfer electrons to form compounds.",
    [
      "Atoms bond to reach a stable outer shell, usually eight electrons. Metals tend to lose electrons and non-metals tend to gain them.",
      "An ionic bond forms when electrons transfer, producing oppositely charged ions held by electrostatic attraction. These compounds have high melting points and conduct when molten.",
      "A covalent bond forms when atoms share electron pairs. Such molecules usually have lower melting points and do not conduct electricity.",
    ],
    [
      {
        title: "Ionic",
        body: "Sodium gives its outer electron to chlorine, forming Na⁺ and Cl⁻, which attract to make NaCl.",
      },
      {
        title: "Covalent",
        body: "Two hydrogen atoms share one electron each to form H₂ with a single shared pair.",
      },
    ],
    [
      "Bonding is driven by the search for a full outer shell.",
      "Ionic = transfer, covalent = sharing.",
      "Bond type explains melting point and conductivity.",
    ],
    false,
  ),
  lesson(
    "biology",
    1,
    "The Cell: Structure and Function",
    "Organelles and the difference between plant and animal cells.",
    [
      "The cell is the basic structural and functional unit of life. Prokaryotic cells lack a nucleus; eukaryotic cells keep DNA inside a membrane-bound nucleus.",
      "Mitochondria release energy, ribosomes build proteins, and the endoplasmic reticulum transports materials inside the cell.",
      "Plant cells additionally have a rigid cellulose cell wall, chloroplasts for photosynthesis and a large central vacuole.",
    ],
    [
      {
        title: "Energy",
        body: "Muscle cells contain many mitochondria because contraction demands a constant supply of energy.",
      },
      {
        title: "Plant vs animal",
        body: "A leaf cell is green because of chloroplasts; a human cheek cell has none.",
      },
    ],
    [
      "All living things are made of cells.",
      "Mitochondria are the powerhouse of the cell.",
      "Cell wall, chloroplast and large vacuole are plant-only features.",
    ],
    true,
  ),
  lesson(
    "english",
    1,
    "Tenses and Sentence Structure",
    "Use the twelve tenses correctly in writing and speech.",
    [
      "English tenses combine three times (past, present, future) with four aspects (simple, continuous, perfect, perfect continuous), giving twelve forms.",
      "The simple present states habits and facts, the present continuous describes actions happening now, and the present perfect links a past action to the present moment.",
      "A clear sentence keeps subject and verb in agreement and keeps tense consistent within a paragraph unless the time frame genuinely changes.",
    ],
    [
      {
        title: "Present perfect",
        body: "\"I have finished my homework\" tells us the task is complete and relevant right now.",
      },
      {
        title: "Agreement",
        body: "\"The list of books is on the table\" — the subject is \"list\", so the verb is singular.",
      },
    ],
    [
      "Twelve tenses = three times × four aspects.",
      "Keep subject–verb agreement with the true subject.",
      "Stay consistent in tense within a paragraph.",
    ],
    false,
  ),
  lesson(
    "computer-science",
    1,
    "Arrays and Time Complexity",
    "Store data in order and reason about how fast an algorithm runs.",
    [
      "An array stores elements in contiguous memory, so reading any index takes constant time. Inserting or deleting in the middle costs linear time because elements must shift.",
      "Big-O notation describes how running time grows with input size n. O(1) is constant, O(n) is linear, O(log n) is logarithmic and O(n²) is quadratic.",
      "Choosing the right complexity matters: a linear search scans every element, while a binary search on a sorted array halves the range each step.",
    ],
    [
      {
        title: "Linear search",
        body: "Scanning 1,000,000 items may need 1,000,000 comparisons — O(n).",
      },
      {
        title: "Binary search",
        body: "The same sorted list needs only about 20 comparisons — O(log n).",
      },
    ],
    [
      "Array indexing is O(1); middle insertion is O(n).",
      "Big-O describes growth, not exact time.",
      "Sorting first can make repeated searches far cheaper.",
    ],
    false,
  ),
  lesson(
    "social-science",
    1,
    "The Indian Constitution",
    "Fundamental rights, duties and the structure of government.",
    [
      "The Constitution of India came into force on 26 January 1950 and is the longest written constitution of any sovereign country. It sets out how power is shared between the union and the states.",
      "Part III guarantees six fundamental rights, including equality, freedom, and the right to constitutional remedies, which lets a citizen approach the courts directly.",
      "Government is divided into the legislature that makes laws, the executive that implements them, and the judiciary that interprets them — a separation designed to prevent concentration of power.",
    ],
    [
      {
        title: "Right to equality",
        body: "Article 14 guarantees equality before the law for every person within India.",
      },
      {
        title: "Federal structure",
        body: "Education appears on the Concurrent List, so both Parliament and state legislatures can make laws about it.",
      },
    ],
    [
      "Adopted 26 November 1949, in force 26 January 1950.",
      "Six fundamental rights are listed in Part III.",
      "Three organs: legislature, executive, judiciary.",
    ],
    false,
  ),
  lesson(
    "hindi",
    1,
    "संज्ञा और उसके भेद",
    "व्यक्ति, वस्तु, स्थान और भाव के नामों को पहचानना।",
    [
      "किसी व्यक्ति, वस्तु, स्थान, प्राणी अथवा भाव के नाम को संज्ञा कहते हैं। वाक्य में संज्ञा प्रायः कर्ता या कर्म का कार्य करती है।",
      "संज्ञा के पाँच भेद माने जाते हैं — व्यक्तिवाचक, जातिवाचक, भाववाचक, समूहवाचक और द्रव्यवाचक।",
      "भाववाचक संज्ञा किसी गुण, दशा या भाव का बोध कराती है और प्रायः विशेषण या क्रिया से बनती है, जैसे मीठा से मिठास।",
    ],
    [
      {
        title: "व्यक्तिवाचक",
        body: "गंगा, दिल्ली और प्रेमचंद किसी एक ही व्यक्ति, नदी या नगर का बोध कराते हैं।",
      },
      {
        title: "भाववाचक",
        body: "बचपन, मित्रता और ईमानदारी भाव या दशा को दर्शाते हैं।",
      },
    ],
    [
      "संज्ञा किसी नाम का बोध कराती है।",
      "संज्ञा के पाँच प्रमुख भेद होते हैं।",
      "भाववाचक संज्ञा गुण या भाव बताती है।",
    ],
    false,
  ),
];

export function lessonsBySubject(subjectId: string) {
  return lessons.filter((l) => l.subjectId === subjectId);
}

export function getSubject(id: string) {
  return subjects.find((s) => s.id === id);
}

export function getLesson(id: string) {
  return lessons.find((l) => l.id === id);
}
