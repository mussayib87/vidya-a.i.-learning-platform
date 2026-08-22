import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService, type AuthUser } from "@/services/auth.service";
import {
  emptyProfile,
  profileService,
  type StudentProfile,
} from "@/services/profile.service";

type AppContextValue = {
  user: AuthUser | null;
  profile: StudentProfile;
  ready: boolean;
  completedLessons: string[];
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signUp: (name: string, email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<StudentProfile>) => void;
  toggleLessonComplete: (lessonId: string) => void;
};

export const AppContext = createContext<AppContextValue | null>(null);

const COMPLETED_KEY = "vidya.completedLessons";

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<StudentProfile>(emptyProfile);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    const stored = profileService.get();
    setUser(session);
    setProfile(
      stored ?? {
        ...emptyProfile,
        name: session?.name ?? "",
        email: session?.email ?? "",
      },
    );
    try {
      const raw = window.localStorage.getItem(COMPLETED_KEY);
      if (raw) setCompletedLessons(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const updateProfile = useCallback((patch: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      profileService.save(next);
      return next;
    });
  }, []);

  const toggleLessonComplete = useCallback((lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      window.localStorage.setItem(COMPLETED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const account = await authService.signIn(email, password);
    setUser(account);
    setProfile((prev) => {
      const stored = profileService.get();
      const next = stored ?? {
        ...prev,
        name: account.name,
        email: account.email,
      };
      profileService.save(next);
      return next;
    });
    return account;
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const account = await authService.signUp(name, email, password);
      setUser(account);
      const next = { ...emptyProfile, name: account.name, email: account.email };
      profileService.save(next);
      setProfile(next);
      return account;
    },
    [],
  );

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      ready,
      completedLessons,
      signIn,
      signUp,
      signOut,
      updateProfile,
      toggleLessonComplete,
    }),
    [
      user,
      profile,
      ready,
      completedLessons,
      signIn,
      signUp,
      signOut,
      updateProfile,
      toggleLessonComplete,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
