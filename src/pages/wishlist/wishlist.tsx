import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../../components/reveal";
import { getWishlists, removeWishlist } from "../../services/api";
import type { WishlistDestination } from "../../services/api";
import "./wishlist.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop";

function formatRupiah(value: number) {
  return `Rp. ${value.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function parseDateMonth(dateStr: string) {
  return new Date(dateStr)
    .toLocaleDateString("id-ID", { month: "short" })
    .toUpperCase();
}

function parseDateDay(dateStr: string) {
  return String(new Date(dateStr).getDate());
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistDestination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlists()
      .then(setWishlist)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const items = useMemo(() => wishlist, [wishlist]);

  const handleRemove = async (destinationId: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== destinationId));
    try {
      await removeWishlist(destinationId);
    } catch {
      // revert on failure
      getWishlists().then(setWishlist).catch(() => {});
    }
  };

  return (
    <div className="wishlistPage">
      <section className="wishlistSection">
        <div className="wishlistContainer">
          <div className="wishlistHeader">
            <Link to="/" className="wishlistBack" aria-label="Kembali">
              ←
            </Link>
            <h1 className="wishlistTitle">Wishlist</h1>
          </div>

          {loading ? (
            <div className="wishlistEmpty">Memuat...</div>
          ) : items.length === 0 ? (
            <div className="wishlistEmpty">Wishlist masih kosong.</div>
          ) : (
            <div className="wishlistGrid">
              {items.map((item, index) => (
                <Reveal key={item.id} delay={index * 80}>
                  <article className="wishlistCard">
                    <div className="wishlistCard__thumb">
                      <img
                        src={item.image_url ?? FALLBACK_IMAGE}
                        alt={item.name}
                        className="wishlistCard__thumbImage"
                      />

                      <button
                        className="wishlistCard__fav"
                        type="button"
                        aria-label="hapus dari wishlist"
                        onClick={() => handleRemove(item.id)}
                      >
                        ★
                      </button>

                      <span className="wishlistCard__badge">
                        {item.category.name}
                      </span>
                    </div>

                    <div className="wishlistCard__content">
                      <div className="wishlistCard__date">
                        <span className="wishlistCard__month">
                          {parseDateMonth(item.date)}
                        </span>
                        <span className="wishlistCard__day">
                          {parseDateDay(item.date)}
                        </span>
                      </div>

                      <div className="wishlistCard__body">
                        <div className="wishlistCard__title">{item.name}</div>
                        <div className="wishlistCard__venue">{item.category.name}</div>
                        <div className="wishlistCard__time">
                          {item.start_time} - {item.end_time}
                        </div>
                        <div className="wishlistCard__price">
                          🎟 {formatRupiah(Number(item.price))}
                        </div>

                        <Link
                          to={`/paket-wisata/${item.id}`}
                          className="wishlistCard__button"
                        >
                          PESAN SEKARANG
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
