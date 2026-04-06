import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDestinations, getWishlists, addWishlist, removeWishlist } from "../../services/api";
import type { Destination } from "../../services/api";
import Reveal from "../../components/reveal";
import "./paket-wisata.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop";

function formatRupiah(value: string) {
  return `Rp. ${Number(value).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PaketWisataPage() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category_id");

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const params: Parameters<typeof getDestinations>[0] = {};
    if (categoryId) params.category_id = Number(categoryId);
    getDestinations(params).then(setDestinations).catch(() => {});
    getWishlists()
      .then((items) => setWishlistedIds(new Set(items.map((i) => i.id))))
      .catch(() => {});
  }, [categoryId]);

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
      // revert on failure
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        isWishlisted ? next.add(id) : next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="paketPage">
      <section className="paketHero">
        <h1 className="paketHero__title">PAKET WISATA</h1>
        <div className="paketHero__underline" />
      </section>

      <section className="paketSection">
        <div className="paketGrid">
          {destinations.map((item, index) => (
            <Reveal key={item.id} delay={index * 100}>
              <Link to={`/paket-wisata/${item.id}`} className="paketCard__link">
              <article className="paketCard">
              <div className="paketCard__thumb">
                <img
                  src={item.image_url ?? FALLBACK_IMAGE}
                  alt={item.name}
                  className="paketCard__thumbImage"
                />
                <button
                  className="paketCard__fav"
                  type="button"
                  aria-label={wishlistedIds.has(item.id) ? "hapus dari wishlist" : "tambah ke wishlist"}
                  onClick={(e) => handleToggleWishlist(e, item.id)}
                >
                  {wishlistedIds.has(item.id) ? "★" : "☆"}
                </button>
              </div>

              <div className="paketCard__body">
                <div className="paketCard__metaTop">
                  <div className="paketCard__paketNo">
                    {item.category_name.toUpperCase()}
                  </div>
                  <div className="paketCard__title">{item.name}</div>
                </div>

                <div className="paketCard__metaMid">
                  <div className="paketCard__line">{item.date}</div>
                  <div className="paketCard__lineMuted">
                    {item.start_time} - {item.end_time}
                  </div>
                </div>

                <div className="paketCard__bottom">
                  <div className="paketCard__price">
                    <span className="paketCard__priceIcon">💚</span>
                    {formatRupiah(item.price)}
                  </div>

                  <span className="paketCard__btn">
                    Selengkapnya
                  </span>
                </div>
              </div>
            </article>
            </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
