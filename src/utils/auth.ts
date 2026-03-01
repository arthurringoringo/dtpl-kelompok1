export type User = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

const USERS_KEY = "dummy_users";
const SESSION_KEY = "dummy_session";

export function getSessionUser(): User | null {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) return null;

  const { email } = JSON.parse(session);
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

  return users.find(u => u.email === email) || null;
}

export function updateUser(updated: User) {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const newUsers = users.map(u =>
    u.email === updated.email ? updated : u
  );
  localStorage.setItem(USERS_KEY, JSON.stringify(newUsers));
}

export function setSession(email: string) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
}

export function getSession(): { email: string } | null {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

/* Ambil semua user */
export function getUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
}

/* Simpan user baru */
export function registerUser(user: User): { success: boolean; message: string } {
    const users = getUsers();

    const exists = users.find(u => u.email === user.email);
    if (exists) {
        return { success: false, message: "Email sudah terdaftar" };
    }

    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { success: true, message: "Berhasil daftar" };
}

/* Login */
export function loginUser(email: string, password: string): boolean {
  const users = getUsers();
  const ok = users.some(u => u.email === email && u.password === password);
  if (ok) setSession(email);
  return ok;
}