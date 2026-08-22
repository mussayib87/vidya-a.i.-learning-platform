/**
 * Profile / learning-preferences service.
 *
 * Persists the student profile. Swap the storage calls for Supabase queries
 * (table: profiles) when the backend is connected.
 */

export type StudentProfile = {
  name: string;
  email: string;
  classLevel: string | null;
  language: string;
  subjects: string[];
  goals: string[];
  dailyMinutes: string;
  difficulty: string;
  learningStyle: string;
  notifications: {
    dailyReminder: boolean;
    weeklyReport: boolean;
    achievements: boolean;
  };
  onboardingComplete: boolean;
};

const PROFILE_KEY = "vidya.profile";

export const emptyProfile: StudentProfile = {
  name: "",
  email: "",
  classLevel: null,
  language: "en",
  subjects: [],
  goals: [],
  dailyMinutes: "30",
  difficulty: "intermediate",
  learningStyle: "visual",
  notifications: {
    dailyReminder: true,
    weeklyReport: true,
    achievements: true,
  },
  onboardingComplete: false,
};

export const profileService = {
  get(): StudentProfile | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(PROFILE_KEY);
      return raw ? ({ ...emptyProfile, ...JSON.parse(raw) } as StudentProfile) : null;
    } catch {
      return null;
    }
  },

  save(profile: StudentProfile) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(PROFILE_KEY);
  },
};
