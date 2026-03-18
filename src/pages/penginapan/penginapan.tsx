import "./penginapan.css";

type Room = {
  id: number;
  title: string;
  price: string;
  facilities: string[];
};

const rooms: Room[] = [
  {
    id: 1,
    title: "Kamar Standard",
    price: "Rp. 200.000 / Malam",
    facilities: [
      "1 Queen bed",
      "Free wi-fi",
      "AC",
      "Air mineral",
      "TV",
      "Desk",
      "Perlengkapan kamar mandi (air panas, kamar mandi pribadi, shower)",
    ],
  },
  {
    id: 2,
    title: "Kamar Keluarga",
    price: "Rp. 400.000 / Malam",
    facilities: [
      "2 Queen bed",
      "Sarapan",
      "Free wi-fi",
      "AC, Kipas angin",
      "Air mineral",
      "TV, Desk",
      "Perlengkapan kamar mandi (air panas, kamar mandi pribadi, shower)",
    ],
  },
];

export default function PenginapanPage() {
  return (
    <div className="penginapanPage">
      <section className="penginapanHero">
        <div className="penginapanHero__inner">
          <h1 className="penginapanHero__title">PENGINAPAN</h1>
          <div className="penginapanHero__line" />
        </div>
      </section>

      <section className="penginapanSection">
        <div className="penginapanContainer">
          {rooms.map((room) => (
            <article className="roomCard" key={room.id}>
              <h2 className="roomCard__title">{room.title}</h2>

              <div className="roomCard__content">
                <div className="roomCard__imageWrap">
                  <div className="roomCard__image">
                    <span className="roomCard__imageIcon">🖼</span>
                  </div>
                </div>

                <div className="roomCard__detail">
                  <h3 className="roomCard__subtitle">Fasilitas:</h3>
                  <ul className="roomCard__list">
                    {room.facilities.map((facility, index) => (
                      <li key={index}>{facility}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="roomCard__divider" />

              <div className="roomCard__price">{room.price}</div>

              <button className="roomCard__button" type="button">
                PESAN SEKARANG
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}