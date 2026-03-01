import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import logo from "../../assets/logo.png";

type User = {
  name: string;
  email: string;
  password: string;
};

const USERS_KEY = "dummy_users";
const SESSION_KEY = "dummy_session";

function getUsers(): User[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? (JSON.parse(raw) as User[]) : [];
}

function seedDefaultUserIfEmpty() {
  const users = getUsers();
  if (users.length > 0) return;

  const seeded: User[] = [
    { name: "Demo User", email: "demo@mail.com", password: "123456" },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
}

export default function Login() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    seedDefaultUserIfEmpty();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const users = getUsers();
    const ok = users.some((u) => u.email === email && u.password === password);

    if (!ok) {
      setError("Email atau kata sandi salah.");
      return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
    navigate("/");
  };

  return (
    <div className="loginShell">
      {/* LEFT - background + quote */}
      <section className="loginLeft" aria-label="Banner">
        <div className="loginLeft__overlay" />

        <div className="loginLeft__content">
          <Link to="/" className="logoLink" aria-label="Kembali ke Beranda">
            <img className="loginLeft__logo" src={logo} alt="Logo" />
          </Link>

          <div className="loginLeft__quote">
            “Gaperlu bingung
            <br />
            rencanain liburan kamu.”
          </div>
        </div>
      </section>

      {/* RIGHT - panel nempel kanan */}
      <section className="loginRight" aria-label="Login panel">
        <div className="loginRightPanel">
          <h1 className="loginTitle">Selamat Datang Kembali!</h1>

          <form className="loginForm" onSubmit={handleLogin}>
            <label className="field">
              <span className="field__label">Alamat Email</span>
              <input
                className="field__input"
                type="email"
                placeholder="Masukkan Alamat Email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="field">
              <span className="field__label">Kata Sandi</span>

              <div className="field__inputWrap">
                <input
                  className="field__input field__input--withIcon"
                  type={showPw ? "text" : "password"}
                  placeholder="Masukkan Kata Sandi"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="pwToggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  title={showPw ? "Sembunyikan" : "Tampilkan"}
                >
                  👁
                </button>
              </div>
            </label>

            {error && <div className="formError">{error}</div>}

            <button className="loginBtn" type="submit">
              Masuk
            </button>

            <div className="loginHint">
              Belum punya akun? <Link className="link" to="/register">Daftar</Link>
            </div>

            <div className="loginHint" style={{ marginTop: 2 }}>
              <span style={{ opacity: 0.85 }}>
                Demo: <b>demo@mail.com</b> / <b>123456</b>
              </span>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
