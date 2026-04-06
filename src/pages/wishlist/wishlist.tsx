import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../../components/reveal";
import "./wishlist.css";

type WishlistItem = {
  id: number;
  category: string;
  title: string;
  venue: string;
  dateMonth: string;
  dateDay: string;
  time: string;
  price: number;
  image_url?: string;
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop";

const initialWishlist: WishlistItem[] = [
  {
    id: 1,
    category: "Kesenian & Budaya",
    title: "Nikmati Kesenian & Budaya",
    venue: "Venue",
    dateMonth: "NOV",
    dateDay: "22",
    time: "00:00 AM - 00:00 PM",
    price: 100000,
  },
  {
    id: 2,
    category: "Kesenian & Budaya",
    title: "Nikmati Kesenian & Budaya",
    venue: "Venue",
    dateMonth: "NOV",
    dateDay: "22",
    time: "00:00 AM - 00:00 PM",
    price: 100000,
  },
  {
    id: 3,
    category: "Kesenian & Budaya",
    title: "Nikmati Kesenian & Budaya",
    venue: "Venue",
    dateMonth: "NOV",
    dateDay: "22",
    time: "00:00 AM - 00:00 PM",
    price: 100000,
  },
  {
    id: 4,
    category: "Kesenian & Budaya",
    title: "Nikmati Kesenian & Budaya",
    venue: "Venue",
    dateMonth: "NOV",
    dateDay: "22",
    time: "00:00 AM - 00:00 PM",
    price: 100000,
  },
  {
    id: 5,
    category: "Kesenian & Budaya",
    title: "Nikmati Kesenian & Budaya",
    venue: "Venue",
    dateMonth: "NOV",
    dateDay: "22",
    time: "00:00 AM - 00:00 PM",
    price: 100000,
  },
  {
    id: 6,
    category: "Kesenian & Budaya",
    title: "Nikmati Kesenian & Budaya",
    venue: "Venue",
    dateMonth: "NOV",
    dateDay: "22",
    time: "00:00 AM - 00:00 PM",
    price: 100000,
  },
];

function formatRupiah(value: number) {
  return `Rp. ${value.toLocaleString("id-ID")}`;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const items = useMemo(() => wishlist, [wishlist]);

  const handleRemove = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
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

          {items.length === 0 ? (
            <div className="wishlistEmpty">Wishlist masih kosong.</div>
          ) : (
            <div className="wishlistGrid">
              {items.map((item, index) => (
                <Reveal key={item.id} delay={index * 80}>
                  <article className="wishlistCard">
                    <div className="wishlistCard__thumb">
                      <img
                        src={item.image_url ?? FALLBACK_IMAGE}
                        alt={item.title}
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
                        {item.category}
                      </span>
                    </div>

                    <div className="wishlistCard__content">
                      <div className="wishlistCard__date">
                        <span className="wishlistCard__month">
                          {item.dateMonth}
                        </span>
                        <span className="wishlistCard__day">
                          {item.dateDay}
                        </span>
                      </div>

                      <div className="wishlistCard__body">
                        <div className="wishlistCard__title">{item.title}</div>
                        <div className="wishlistCard__venue">{item.venue}</div>
                        <div className="wishlistCard__time">{item.time}</div>
                        <div className="wishlistCard__price">
                          🎟 {formatRupiah(item.price)}
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
