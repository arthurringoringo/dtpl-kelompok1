import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "dummy_session";

function getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
}

function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

export default function Navbar() {
    const navigate = useNavigate();
    const [session, setSession] = useState<{ email: string } | null>(null);
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setSession(getSession());
    }, []);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const logout = () => {
        clearSession();
        setSession(null);
        setOpen(false);
        navigate("/");
    };

    return (
        <header className="navbar">
            <div className="navbar__inner container">
                <div className="brand">
                    <div className="brand__mark" aria-hidden="true">▦</div>
                    <div className="brand__name">Eventify</div>
                </div>

                <nav className="nav">
                    <a className="nav__link nav__link--active" href="#beranda">Beranda</a>
                    <a className="nav__link" href="#paket">Paket Wisata</a>
                    <a className="nav__link" href="#penginapan">Penginapan</a>
                    <a className="nav__link" href="#tentang">Tentang Kami</a>
                </nav>

                <div className="nav__actions">
                    {!session ? (
                        <>
                            <Link to="/login" className="btn btn--ghost">
                                Masuk
                            </Link>
                            <Link to="/register" className="btn btn--primary">
                                Daftar
                            </Link>
                        </>
                    ) : (
                        <div className="navAuth">
                            <button className="navIconBtn" type="button" title="Tickets">
                                <span className="navIconBtn__icon" aria-hidden="true">🎟️</span>
                                <span className="navIconBtn__label">Tickets</span>
                            </button>

                            <button className="navIconBtn" type="button" title="Interested">
                                <span className="navIconBtn__icon" aria-hidden="true">⭐</span>
                                <span className="navIconBtn__label">Interested</span>
                            </button>

                            <div className="profileMenu" ref={menuRef}>
                                <button
                                    type="button"
                                    className="profileBtn"
                                    onClick={() => setOpen((v) => !v)}
                                    aria-haspopup="menu"
                                    aria-expanded={open}
                                    title={session.email}
                                >
                                    <span className="profileIcon" aria-hidden="true">👤</span>
                                    <span className="profileCaret" aria-hidden="true">▾</span>
                                </button>

                                {open && (
                                    <div className="profileDropdown" role="menu">
                                        <button
                                            className="profileItem"
                                            type="button"
                                            onClick={() => {
                                                setOpen(false);
                                                navigate("/account");
                                            }}
                                        >
                                            Pengaturan Akun
                                        </button>

                                        <button
                                            className="profileItem profileItem--danger"
                                            type="button"
                                            onClick={logout}
                                        >
                                            Keluar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}