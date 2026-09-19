'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface SessionUser {
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  /** null while the stored session is still being read, then the user or null. */
  user: SessionUser | null;
  /** True until the first localStorage read completes — avoids flicker/redirect races. */
  loading: boolean;
  signIn: (user: SessionUser) => void;
  signOut: () => void;
}

const STORAGE_KEY = 'bt.session';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Read the stored session once on mount. This has to happen in an effect
  // rather than during render because localStorage only exists in the browser.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SessionUser;
        if (parsed?.email) setUser(parsed);
      }
    } catch {
      // Corrupt or unavailable storage — treat as signed out.
    }
    setLoading(false);
  }, []);

  const signIn = useCallback((next: SessionUser) => {
    setUser(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage may be blocked; the in-memory session still works this visit.
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clean up.
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signOut }),
    [user, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return ctx;
}
