import { Link } from "react-router-dom";
import Reveal from "../../components/reveal";
import "./paket-wisata.css";

type PackageItem = {
  id: string;
  paketNo: string;
  title: string;
  dateVenue: string;
  time: string;
  price: string;
};

const dummyPackages: PackageItem[] = [
  {
    id: "1",
    paketNo: "PAKET 1",
    title: "Kegiatan & Kerajinan",
    dateVenue: "Date | Venue",
    time: "00:00 AM - 00:00 PM",
    price: "Rp. 200.000",
  },
  {
    id: "2",
    paketNo: "PAKET 2",
    title: "Kegiatan & Kerajinan",
    dateVenue: "Date | Venue",
    time: "00:00 AM - 00:00 PM",
    price: "Rp. 200.000",
  },
  {
    id: "3",
    paketNo: "PAKET 1",
    title: "Kegiatan & Kerajinan",
    dateVenue: "Date | Venue",
    time: "00:00 AM - 00:00 PM",
    price: "Rp. 200.000",
  },
  {
    id: "4",
    paketNo: "PAKET 1",
    title: "Kegiatan & Kerajinan",
    dateVenue: "Date | Venue",
    time: "00:00 AM - 00:00 PM",
    price: "Rp. 200.000",
  },
  {
    id: "5",
    paketNo: "PAKET 1",
    title: "Kegiatan & Kerajinan",
    dateVenue: "Date | Venue",
    time: "00:00 AM - 00:00 PM",
    price: "Rp. 200.000",
  },
  {
    id: "6",
    paketNo: "PAKET 1",
    title: "Kegiatan & Kerajinan",
    dateVenue: "Date | Venue",
    time: "00:00 AM - 00:00 PM",
    price: "Rp. 200.000",
  },
  {
    id: "7",
    paketNo: "PAKET 1",
    title: "Kegiatan & Kerajinan",
    dateVenue: "Date | Venue",
    time: "00:00 AM - 00:00 PM",
    price: "Rp. 200.000",
  },
  {
    id: "8",
    paketNo: "PAKET 1",
    title: "Kegiatan & Kerajinan",
    dateVenue: "Date | Venue",
    time: "00:00 AM - 00:00 PM",
    price: "Rp. 200.000",
  },
];

export default function PaketWisataPage() {
  return (
    <div className="paketPage">
      {/* Banner */}
      <section className="paketHero">
        <Reveal>
          <div>
            <h1 className="paketHero__title">PAKET WISATA</h1>
            <div className="paketHero__underline" />
          </div>
        </Reveal>
      </section>

      {/* Content */}
      <section className="paketSection">
        <div className="paketGrid">
          {dummyPackages.map((p, index) => (
            <Reveal
              key={p.id}
              delay={index * 100}
              variant={index % 2 === 0 ? "left" : "right"}
            >
              <article className="paketCard">
                <div className="paketCard__thumb">
                  <button
                    className="paketCard__fav"
                    type="button"
                    aria-label="favorit"
                  >
                    ☆
                  </button>
                </div>

                <div className="paketCard__body">
                  <div className="paketCard__metaTop">
                    <div className="paketCard__paketNo">{p.paketNo}</div>
                    <div className="paketCard__title">{p.title}</div>
                  </div>

                  <div className="paketCard__metaMid">
                    <div className="paketCard__line">{p.dateVenue}</div>
                    <div className="paketCard__lineMuted">{p.time}</div>
                  </div>

                  <div className="paketCard__bottom">
                    <div className="paketCard__price">
                      <span className="paketCard__priceIcon">💚</span>
                      {p.price}
                    </div>

                    <Link to={`/paket-wisata/${p.id}`} className="paketCard__btn">
                      Selengkapnya
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}