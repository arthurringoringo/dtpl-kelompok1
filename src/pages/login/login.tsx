import { useState } from "react";
import "./login.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Login() {
    const [showPw, setShowPw] = useState(false);

    return (
        <div className="loginShell">
            {/* LEFT - background + quote */}
            <section className="loginLeft" aria-label="Banner">
                <div className="loginLeft__overlay" />

                <div className="loginLeft__content">
                    <Link to="/" className="logoLink">
                        <img
                            className="loginLeft__logo"
                            src={logo}
                            alt="Logo"
                        />
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

                    <form className="loginForm" onSubmit={(e) => e.preventDefault()}>
                        <label className="field">
                            <span className="field__label">Alamat Email</span>
                            <input
                                className="field__input"
                                type="email"
                                placeholder="Masukkan Alamat Email"
                                autoComplete="email"
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
                                    required
                                />

                                <button
                                    type="button"
                                    className="pwToggle"
                                    onClick={() => setShowPw((v) => !v)}
                                    aria-label={showPw ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                                >
                                    👁
                                </button>
                            </div>
                        </label>

                        <button className="loginBtn" type="submit">
                            Masuk
                        </button>

                        <div className="loginHint">
                            Belum punya akun? <a className="link" href="/register">Daftar</a>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}