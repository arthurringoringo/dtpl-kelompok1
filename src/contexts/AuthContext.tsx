import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setLoggedIn: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(isAuthenticated);

  useEffect(() => {
    // Re-check when user returns to this tab (e.g. logged in from another tab)
    const check = () => setLoggedIn(isAuthenticated());
    document.addEventListener("visibilitychange", check);
    return () => document.removeEventListener("visibilitychange", check);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
