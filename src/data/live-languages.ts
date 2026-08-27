export type LiveLanguage = {
  id: string;
  label: string;
  native: string;
  /** BCP-47 tag used by browser SpeechRecognition and SpeechSynthesis */
  bcp47: string;
};

export const liveLanguages: LiveLanguage[] = [
  { id: "en", label: "English", native: "English", bcp47: "en-IN" },
  { id: "kn", label: "Kannada", native: "ಕನ್ನಡ", bcp47: "kn-IN" },
  { id: "hi", label: "Hindi", native: "हिन्दी", bcp47: "hi-IN" },
  { id: "te", label: "Telugu", native: "తెలుగు", bcp47: "te-IN" },
  { id: "ta", label: "Tamil", native: "தமிழ்", bcp47: "ta-IN" },
  { id: "ml", label: "Malayalam", native: "മലയാളം", bcp47: "ml-IN" },
  { id: "mr", label: "Marathi", native: "मराठी", bcp47: "mr-IN" },
  { id: "bn", label: "Bengali", native: "বাংলা", bcp47: "bn-IN" },
  { id: "ur", label: "Urdu", native: "اردو", bcp47: "ur-IN" },
];

export const liveGrades = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `class-${i + 1}`,
    label: `Class ${i + 1}`,
  })),
];

export const liveSubjects = [
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Social Science",
  "Computer Science",
];

export function liveLanguage(id: string): LiveLanguage {
  return liveLanguages.find((l) => l.id === id) ?? liveLanguages[0]!;
}
