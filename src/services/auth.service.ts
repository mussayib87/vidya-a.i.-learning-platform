/**
 * Authentication service.
 *
 * This is the single boundary between the UI and the auth provider.
 * Today it is backed by browser storage with mock latency; when Lovable Cloud
 * (Supabase) is connected only the bodies below change — no component does.
 */

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

const SESSION_KEY = "vidya.session";
const delay = (ms = 550) => new Promise((r) => setTimeout(r, ms));

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function nameFromEmail(email: string) {
  const handle = email.split("@")[0] ?? "student";
  return handle
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const authService = {
  getSession(): AuthUser | null {
    return read<AuthUser>(SESSION_KEY);
  },

  async signIn(email: string, password: string): Promise<AuthUser> {
    await delay();
    if (!email.includes("@")) throw new Error("Enter a valid email address.");
    if (password.length < 6)
      throw new Error("Password must be at least 6 characters.");
    const user: AuthUser = {
      id: `user_${btoa(email).replace(/=/g, "").slice(0, 12)}`,
      name: nameFromEmail(email),
      email,
    };
    write(SESSION_KEY, user);
    return user;
  },

  async signUp(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthUser> {
    await delay();
    if (!name.trim()) throw new Error("Please enter your name.");
    if (!email.includes("@")) throw new Error("Enter a valid email address.");
    if (password.length < 6)
      throw new Error("Password must be at least 6 characters.");
    const user: AuthUser = {
      id: `user_${btoa(email).replace(/=/g, "").slice(0, 12)}`,
      name: name.trim(),
      email,
    };
    write(SESSION_KEY, user);
    return user;
  },

  async requestPasswordReset(email: string): Promise<void> {
    await delay();
    if (!email.includes("@")) throw new Error("Enter a valid email address.");
  },

  async signOut(): Promise<void> {
    if (typeof window !== "undefined")
      window.localStorage.removeItem(SESSION_KEY);
  },
};
