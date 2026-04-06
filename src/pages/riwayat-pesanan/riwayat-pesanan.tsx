import { useMemo, useState } from "react";
import "./riwayat-pesanan.css";

type OrderStatus = "Paid" | "Failed";

type OrderItem = {
  id: string;
  title: string;
  category: string;
  dateVenue: string;
  time: string;
  total: number;
  status: OrderStatus;
  orderDate: string;
};

const dummyOrders: OrderItem[] = [
  {
    id: "522072134013222",
    title: "PAKET 1",
    category: "Kegiatan & Kerajinan",
    dateVenue: "Date | Venue",
    time: "00:00 AM - 00:00 PM",
    total: 200000,
    status: "Paid",
    orderDate: "04/03/2026 10:00 AM",
  },
  {
    id: "522072134013232",
    title: "PAKET 2",
    category: "Wisata Edukasi",
    dateVenue: "Date | Venue",
    time: "10:00 AM - 03:00 PM",
    total: 400000,
    status: "Failed",
    orderDate: "26/04/2026 11:02 AM",
  },
];

function formatRupiah(value: number) {
  return `Rp. ${value.toLocaleString("id-ID")}`;
}

export default function RiwayatPesananPage() {
  const [keyword, setKeyword] = useState("");

  const filteredOrders = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    if (!search) return dummyOrders;

    return dummyOrders.filter((order) => {
      return (
        order.id.toLowerCase().includes(search) ||
        order.title.toLowerCase().includes(search) ||
        order.category.toLowerCase().includes(search) ||
        order.status.toLowerCase().includes(search)
      );
    });
  }, [keyword]);

  return (
    <main className="orderHistory">
      <section className="orderHistory__hero">
        <div className="container">
          <h1 className="orderHistory__title">Riwayat Pesanan</h1>

          <div className="orderHistory__searchWrap">
            <span className="orderHistory__searchIcon">⌕</span>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="orderHistory__searchInput"
              placeholder="Order ID"
            />
            {keyword && (
              <button
                type="button"
                className="orderHistory__clearBtn"
                onClick={() => setKeyword("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="orderHistory__content">
        <div className="container orderHistory__list">
          {filteredOrders.length === 0 ? (
            <div className="orderHistory__empty">Pesanan tidak ditemukan.</div>
          ) : (
            filteredOrders.map((order) => (
              <article className="orderHistory__card" key={order.id}>
                <div className="orderHistory__badgeRow">
                  <span
                    className={`orderHistory__badge orderHistory__badge--${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="orderHistory__topRow">
                  <div className="orderHistory__meta">
                    <span>{order.orderDate}</span>
                    <span className="orderHistory__divider">|</span>
                    <span>Order ID: {order.id}</span>
                  </div>

                  <div className="orderHistory__total">
                    <span className="orderHistory__totalLabel">Total:</span>
                    <span className="orderHistory__totalValue">
                      {formatRupiah(order.total)}
                    </span>
                  </div>
                </div>

                <div className="orderHistory__detailCard">
                  <div className="orderHistory__detailGrid">
                    <div className="orderHistory__thumb">
                      <button
                        type="button"
                        className="orderHistory__thumbClose"
                      >
                        ✕
                      </button>
                      <div className="orderHistory__thumbIcon">🖼️</div>
                    </div>

                    <div className="orderHistory__detailText">
                      <div className="orderHistory__packageTitle">
                        {order.title}
                      </div>
                      <div className="orderHistory__packageCategory">
                        {order.category}
                      </div>
                      <div className="orderHistory__packageMeta">
                        {order.dateVenue}
                      </div>
                      <div className="orderHistory__packageTime">
                        {order.time}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
