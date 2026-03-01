import "./landing-page.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        </div>
    );
}