import "./landing-page.css";
import Reveal from "../../components/reveal";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCategories, getDestinations, getWishlists, addWishlist, removeWishlist } from "../../services/api";
import type { Category, Destination } from "../../services/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop";

type FilterKey = "" | "today" | "tomorrow" | "this_week" | "free";

const FILTERS: { label: string; key: FilterKey }[] = [
  { label: "Semua", key: "" },
  { label: "Hari Ini", key: "today" },
  { label: "Besok", key: "tomorrow" },
  { label: "Minggu Ini", key: "this_week" },
  { label: "Gratis", key: "free" },
];

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("");
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getWishlists()
      .then((items) => setWishlistedIds(new Set(items.map((i) => i.id))))
      .catch(() => {});
  }, []);

  const handleToggleWishlist = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    const isWishlisted = wishlistedIds.has(id);
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      isWishlisted ? next.delete(id) : next.add(id);
      return next;
    });
    try {
      if (isWishlisted) {
        await removeWishlist(id);
      } else {
        await addWishlist(id);
      }
    } catch {
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        isWishlisted ? next.add(id) : next.delete(id);
        return next;
      });
    }
  };

  useEffect(() => {
    const params: Parameters<typeof getDestinations>[0] = {};
    if (activeFilter === "free") params.price = "free";
    else if (activeFilter) params.day = activeFilter as "today" | "tomorrow" | "this_week";
    getDestinations(params).then(setDestinations).catch(() => {});
  }, [activeFilter]);

  const displayedDestinations = destinations.slice(0, 6);

  return (
    <div className="page">
      {/* HERO */}
      <main id="beranda" className="hero">
        <div className="hero__inner container">
          <Reveal variant="left" className="hero__content">
            <div className="hero__kicker">DESA WISATA MANUD JAYA</div>

            <h1 className="hero__title">
              ALAM, BUDAYA, SENI,
              <br />
              DAN KERAJINAN
            </h1>

            <p className="hero__desc">
              Selamat datang di Desa Manud Jaya, tempat kreativitas bertemu
              alam! Dari UMKM inovatif hingga pesona pertanian dan wisata yang
              membuka, desa ini penuh peluang. Meski menghadapi tantangan
              pasca-pandemi dan kesadaran lingkungan yang perlu ditingkatkan,
              semangat warganya membara untuk membangun masa depan bersama.
            </p>

            <button className="btn btn--cta">Jelajahi Destinasi</button>
          </Reveal>

          <Reveal variant="right" className="hero__media">
            <div className="hero__imageWrap">
              <img
                className="hero__image"
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop"
                alt="Pemandangan desa wisata"
                loading="lazy"
              />
              <div className="hero__imageGlow" aria-hidden="true" />
            </div>
          </Reveal>
        </div>
      </main>

      {/* CATEGORY */}
      <section className="section container">
        <Reveal>
          <h2 className="section__title">Jelajahi Kategori</h2>
        </Reveal>

        <div className="categories">
          {categories.map((c, index) => (
            <Reveal key={c.id} delay={index * 100}>
              <button
                className="cat"
                type="button"
                onClick={() => navigate(`/paket?category_id=${c.id}`)}
              >
                <div className="cat__circle" aria-hidden="true">
                  <img
                    src={c.image_url ?? FALLBACK_IMAGE}
                    alt={c.name}
                    className="cat__image"
                    loading="lazy"
                  />
                </div>
                <div className="cat__label">{c.name}</div>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* POPULAR EVENTS */}
      <section className="section container">
        <div className="popular">
          <Reveal>
            <div className="popular__header">
              <span className="popular__subtitle">Popular events</span>
              <h2 className="popular__title">Kegiatan Populer</h2>
            </div>
          </Reveal>

          <div className="popular__filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`chip${activeFilter === f.key ? " chip--active" : ""}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="eventGrid">
            {displayedDestinations.length > 0 ? (
              displayedDestinations.map((item, i) => (
                <Reveal
                  key={item.id}
                  delay={i * 120}
                  variant={i % 2 === 0 ? "left" : "right"}
                >
                  <Link to={`/paket-wisata/${item.id}`} className="eventCard__link">
                  <div className="eventCard">
                    <div className="eventCard__image">
                      <img
                        src={item.image_url ?? FALLBACK_IMAGE}
                        alt={item.name}
                        className="eventCard__imageTag"
                      />
                      <button
                        type="button"
                        className="eventCard__fav"
                        aria-label={wishlistedIds.has(item.id) ? "hapus dari wishlist" : "tambah ke wishlist"}
                        onClick={(e) => handleToggleWishlist(e, item.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        {wishlistedIds.has(item.id) ? "★" : "☆"}
                      </button>
                    </div>

                    <div className="eventCard__body">
                      <span className="eventCard__tag">{item.category_name}</span>

                      <div className="eventCard__meta">
                        <div className="eventCard__date">
                          <span className="eventCard__month">
                            {new Date(item.date)
                              .toLocaleDateString("id-ID", { month: "short" })
                              .toUpperCase()}
                          </span>
                          <span className="eventCard__day">
                            {new Date(item.date).getDate()}
                          </span>
                        </div>

                        <div className="eventCard__info">
                          <h3 className="eventCard__title">{item.name}</h3>
                          <div className="eventCard__venue">{item.category_name}</div>
                          <div className="eventCard__time">
                            {item.start_time} - {item.end_time}
                          </div>
                          <div className="eventCard__price">
                            Rp. {Number(item.price).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </Link>
                </Reveal>
              ))
            ) : (
              <Reveal>
                <div className="emptyState">
                  Belum ada destinasi.
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
