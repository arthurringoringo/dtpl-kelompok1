import { useState } from "react";
import "./register.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

export default function Register() {
    const [showPw, setShowPw] = useState(false);

    return (
        <div className="registerShell">
            {/* LEFT - background + quote */}
            <section className="registerLeft" aria-label="Banner">
                <div className="registerLeft__overlay" />

                <div className="registerLeft__content">
                    <Link to="/" className="logoLink">
                        <img
                            className="loginLeft__logo"
                            src={logo}
                            alt="Logo"
                        />
                    </Link>
                    <div className="registerLeft__quote">
                        “Gaperlu bingung
                        <br />
                        rencanain liburan kamu.”
                    </div>
                </div>
            </section>

            {/* RIGHT - panel nempel kanan */}
            <section className="registerRight" aria-label="Register panel">
                <div className="registerRightPanel">
                    <h1 className="registerTitle">Daftar Sekarang</h1>

                    <form className="registerForm" onSubmit={(e) => e.preventDefault()}>
                        <label className="field">
                            <span className="field__label">Nama Lengkap</span>
                            <input
                                className="field__input"
                                type="text"
                                placeholder="Masukkan Nama Lengkap"
                                autoComplete="name"
                                required
                            />
                        </label>

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
                                    autoComplete="new-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="pwToggle"
                                    onClick={() => setShowPw((v) => !v)}
                                    aria-label={
                                        showPw ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                                    }
                                >
                                    👁
                                </button>
                            </div>
                        </label>

                        <button className="registerBtn" type="submit">
                            Buat Akun
                        </button>

                        <div className="registerHint">
                            Sudah punya akun? <a className="link" href="/login">Masuk</a>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}