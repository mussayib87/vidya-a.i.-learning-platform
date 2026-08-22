export type ClassLevel = {
  id: string;
  label: string;
  group: "School" | "Senior Secondary" | "College";
};

export const classLevels: ClassLevel[] = [
  { id: "class-6", label: "Class 6", group: "School" },
  { id: "class-7", label: "Class 7", group: "School" },
  { id: "class-8", label: "Class 8", group: "School" },
  { id: "class-9", label: "Class 9", group: "School" },
  { id: "class-10", label: "Class 10", group: "School" },
  { id: "class-11", label: "Class 11", group: "Senior Secondary" },
  { id: "class-12", label: "Class 12", group: "Senior Secondary" },
  { id: "ug-1", label: "Undergraduate — Year 1", group: "College" },
  { id: "ug-2", label: "Undergraduate — Year 2", group: "College" },
  { id: "ug-3", label: "Undergraduate — Year 3", group: "College" },
  { id: "pg", label: "Postgraduate", group: "College" },
];

export type Language = { id: string; label: string; native: string };

export const languages: Language[] = [
  { id: "en", label: "English", native: "English" },
  { id: "hi", label: "Hindi", native: "हिन्दी" },
  { id: "bn", label: "Bengali", native: "বাংলা" },
  { id: "mr", label: "Marathi", native: "मराठी" },
  { id: "te", label: "Telugu", native: "తెలుగు" },
  { id: "ta", label: "Tamil", native: "தமிழ்" },
  { id: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { id: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { id: "ml", label: "Malayalam", native: "മലയാളം" },
  { id: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { id: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { id: "as", label: "Assamese", native: "অসমীয়া" },
  { id: "ur", label: "Urdu", native: "اردو" },
];

export const learningGoals = [
  { id: "exam", label: "Score higher in exams" },
  { id: "concepts", label: "Understand concepts deeply" },
  { id: "homework", label: "Finish homework faster" },
  { id: "competitive", label: "Prepare for competitive exams" },
  { id: "revision", label: "Revise the full syllabus" },
];

export const studyTimes = [
  { id: "15", label: "15 minutes a day" },
  { id: "30", label: "30 minutes a day" },
  { id: "60", label: "1 hour a day" },
  { id: "120", label: "2+ hours a day" },
];

export const difficultyLevels = [
  { id: "beginner", label: "Beginner", hint: "Start from the basics" },
  { id: "intermediate", label: "Intermediate", hint: "I know the fundamentals" },
  { id: "advanced", label: "Advanced", hint: "Challenge me with hard problems" },
];

export const learningStyles = [
  { id: "visual", label: "Visual", hint: "Diagrams and illustrations" },
  { id: "reading", label: "Reading", hint: "Clear written explanations" },
  { id: "practice", label: "Practice-first", hint: "Learn by solving problems" },
  { id: "audio", label: "Audio", hint: "Spoken explanations" },
];

export function labelFor(
  list: { id: string; label: string }[],
  id?: string | null,
) {
  return list.find((item) => item.id === id)?.label ?? "Not set";
}
