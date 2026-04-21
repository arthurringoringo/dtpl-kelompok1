import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getSession, setSession } from "../utils/auth";
import { getMe } from "../services/api";

function isAuthenticated(): boolean {
  // Check for auth cookie
  if (document.cookie.split(";").some((c) => c.trim().startsWith("auth="))) {
    return true;
  }
  // Fallback: localStorage session set by the app on login
  return !!localStorage.getItem("dummy_session");
}

type AuthContextType = {
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
  role: string | null;
  refreshUser: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setLoggedIn: () => {},
  role: null,
  refreshUser: async () => null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(isAuthenticated);
  const [role, setRole] = useState<string | null>(() => getSession()?.role ?? null);

  useEffect(() => {
    // Re-check when user returns to this tab (e.g. logged in from another tab)
    const check = () => setLoggedIn(isAuthenticated());
    document.addEventListener("visibilitychange", check);
    return () => document.removeEventListener("visibilitychange", check);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setRole(null);
      return;
    }
    const sessionRole = getSession()?.role ?? null;
    if (sessionRole) {
      setRole(sessionRole);
    } else {
      // Session predates role storage — fetch from server to hydrate
      getMe()
        .then((user) => {
          const existing = getSession();
          setSession({ ...existing, ...user } as Parameters<typeof setSession>[0]);
          setRole(user.role ?? null);
        })
        .catch(() => {});
    }
  }, [isLoggedIn]);

  const refreshUser = async (): Promise<string | null> => {
    try {
      const user = await getMe();
      const existing = getSession();
      setSession({ ...existing, ...user } as Parameters<typeof setSession>[0]);
      const newRole = user.role ?? null;
      setRole(newRole);
      return newRole;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, role, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
