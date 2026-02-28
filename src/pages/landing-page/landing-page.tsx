import "./landing-page.css";
import { Link } from "react-router-dom";

type Category = {
    label: string;
};

const categories: Category[] = [
    { label: "Kerajinan" },
    { label: "Kulineran" },
    { label: "Keliling Desa" },
    { label: "Kesenian" },
    { label: "Atraksi" },
    { label: "Outbond" },
];

export default function Home() {
    return (
        <div className="page">
            {/* NAVBAR */}
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
                        <Link to="/login" className="btn btn--ghost">
                            Masuk
                        </Link>
                        <Link to="/register" className="btn btn--primary">
                            Daftar
                        </Link>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <main id="beranda" className="hero">
                <div className="hero__inner container">
                    <div className="hero__content">
                        <div className="hero__kicker">DESA WISATA MANUD JAYA</div>

                        <h1 className="hero__title">
                            ALAM, BUDAYA, SENI,
                            <br />
                            DAN KERAJINAN
                        </h1>

                        <p className="hero__desc">
                            Selamat datang di Desa Manud Jaya, tempat kreativitas bertemu alam!
                            Dari UMKM inovatif hingga pesona pertanian dan wisata yang
                            membuka, desa ini penuh peluang. Meski menghadapi tantangan
                            pasca-pandemi dan kesadaran lingkungan yang perlu ditingkatkan,
                            semangat warganya membara untuk membangun masa depan bersama.
                        </p>

                        <button className="btn btn--cta">Jelajahi Destinasi</button>
                    </div>

                    <div className="hero__media">
                        <div className="hero__imageWrap">
                            <img
                                className="hero__image"
                                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop"
                                alt="Pemandangan desa wisata"
                                loading="lazy"
                            />
                            <div className="hero__imageGlow" aria-hidden="true" />
                        </div>
                    </div>
                </div>
            </main>

            {/* CATEGORY */}
            <section className="section container">
                <h2 className="section__title">Jelajahi Kategori</h2>

                <div className="categories">
                    {categories.map((c) => (
                        <button key={c.label} className="cat" type="button">
                            <div className="cat__circle" aria-hidden="true" />
                            <div className="cat__label">{c.label}</div>
                        </button>
                    ))}
                </div>
            </section>

            {/* POPULAR EVENTS */}
            <section className="section container">
                <div className="popular">
                    <div className="popular__header">
                        <span className="popular__subtitle">Popular events</span>
                        <h2 className="popular__title">Kegiatan Populer</h2>
                    </div>

                    {/* FILTER */}
                    <div className="popular__filters">
                        <button className="chip chip--active">Semua</button>
                        <button className="chip">Hari ini</button>
                        <button className="chip">Besok</button>
                        <button className="chip">Minggu ini</button>
                        <button className="chip">Gratis</button>
                    </div>

                    {/* CARD GRID */}
                    <div className="eventGrid">
                        {[
                            {
                                tag: "Kerajinan",
                                title: "Temukan Kerajinan Desa",
                            },
                            {
                                tag: "Kesenian & Budaya",
                                title: "Nikmati Kesenian & Budaya",
                            },
                            {
                                tag: "Atraksi",
                                title: "Pesona Alam Desa",
                            },
                            {
                                tag: "Atraksi",
                                title: "Jelajahi Sejarah & Budaya",
                            },
                            {
                                tag: "Kulineran",
                                title: "Lezatnya Kuliner Desa",
                            },
                            {
                                tag: "Keliling Desa",
                                title: "Temukan pesona setiap sudut desa",
                            },
                        ].map((item, i) => (
                            <div className="eventCard" key={i}>
                                <div className="eventCard__image">
                                    <span className="eventCard__fav">★</span>
                                </div>

                                <div className="eventCard__body">
                                    <span className="eventCard__tag">{item.tag}</span>

                                    <div className="eventCard__meta">
                                        <div className="eventCard__date">
                                            <span className="eventCard__month">NOV</span>
                                            <span className="eventCard__day">22</span>
                                        </div>

                                        <div className="eventCard__info">
                                            <h3 className="eventCard__title">{item.title}</h3>
                                            <div className="eventCard__venue">Venue</div>
                                            <div className="eventCard__time">
                                                09.00 AM - 06.00 PM
                                            </div>
                                            <div className="eventCard__price">
                                                Rp. 100.000
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer__inner container">
                    <div className="footer__col">
                        <div className="footer__title">Jam Operasional</div>
                        <div className="footer__row">
                            <span>Senin</span>
                            <span>06.00 - 23.59 WIB</span>
                        </div>
                        <div className="footer__row">
                            <span>Selasa - Jumat</span>
                            <span>07.00 - 23.59 WIB</span>
                        </div>
                        <div className="footer__row">
                            <span>Sabtu, Minggu</span>
                            <span>05.00 - 23.59 WIB</span>
                        </div>
                    </div>

                    <div className="footer__col footer__col--center">
                        <div className="footer__brand">Desa Wisata Manud Jaya</div>
                        <div className="footer__desc">
                            Tempat yang cocok untuk menikmati suasana pedesaan di Yogyakarta.
                        </div>
                        <div className="footer__quote">“Sejuk dan Tentram”</div>
                    </div>

                    <div className="footer__col footer__col--right">
                        <div className="footer__title">Kontak</div>
                        <div className="footer__contact">
                            <div className="footer__contactItem">📞 0813 1234 5678</div>
                            <div className="footer__contactItem">📍 @desawisata_manudjaya</div>
                            <div className="footer__contactItem">✉️ manudjaya.desawisata@gmail.com</div>
                        </div>

                        <div className="map">
                            <div className="map">
                                <iframe
                                    className="map__iframe"
                                    title="Lokasi UI Salemba"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps?q=Universitas%20Indonesia%20Salemba&output=embed"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer__bottom container">
                    <div className="footer__line" />
                </div>
            </footer>
        </div>
    );
}