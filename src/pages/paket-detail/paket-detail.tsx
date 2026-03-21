import { useMemo, useState } from "react";
import "./paket-detail.css";

type VisitorForm = {
  fullName: string;
  email: string;
  phone: string;
};

export default function PaketDetailPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState<VisitorForm>({
    fullName: "",
    email: "",
    phone: "",
  });

  const ticketName = "Tiket Standard";
  const eventTitle = "Kegiatan & Kerajinan";
  const ticketPrice = 200000;
  const tax = 20000;

  const total = useMemo(() => qty * ticketPrice, [qty]);
  const grandTotal = useMemo(() => total + tax, [total]);

  const getTodayDate = () => {
    const today = new Date();

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    return today.toLocaleDateString("id-ID", options);
  };

  const openModal = () => {
    setStep(1);
    setQty(1);
    setForm({
      fullName: "",
      email: "",
      phone: "",
    });
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const decreaseQty = () => {
    setQty((prev) => Math.max(0, prev - 1));
  };

  const increaseQty = () => {
    setQty((prev) => prev + 1);
  };

  const handleNextFromStep1 = () => {
    if (qty < 1) return;
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!form.fullName || !form.email || !form.phone) {
      alert("Mohon lengkapi data pengunjung dulu ya.");
      return;
    }
    setStep(3);
  };

  const handlePayNow = () => {
    alert("Pembayaran dummy berhasil diproses 🎉");
    closeModal();
  };

  return (
    <div className="page">
      <main className="paketDetail">
        <section className="paketDetail__hero">
          <div className="paketDetail__heroImage">
            <div className="paketDetail__heroPlaceholder">🖼</div>
          </div>
        </section>

        <section className="paketDetail__content container">
          <div className="paketDetail__topRow">
            <div>
              <h1 className="paketDetail__title">Kegiatan &amp; Kerajinan</h1>
            </div>

            <button
              className="paketDetail__fav"
              type="button"
              aria-label="Favorit"
            >
              ☆
            </button>
          </div>

          <div className="paketDetail__main">
            <div className="paketDetail__left">
              <section className="paketDetail__section">
                <h2 className="paketDetail__heading">Date and Time</h2>

                <div className="paketDetail__infoItem">
                  <span className="paketDetail__icon">🗓</span>
                  <span>{getTodayDate()}</span>
                </div>

                <div className="paketDetail__infoItem">
                  <span className="paketDetail__icon">🕒</span>
                  <span>Time</span>
                </div>
              </section>

              <section className="paketDetail__section">
                <h2 className="paketDetail__heading">Location</h2>

                <div className="paketDetail__infoItem">
                  <span className="paketDetail__icon">📍</span>
                  <span>Address</span>
                </div>

                <div className="paketDetail__map">
                  <div className="paketDetail__mapExpand">⤢</div>
                  <div className="paketDetail__mapPin">📍</div>
                  <div className="paketDetail__mapZoom">
                    <button type="button">+</button>
                    <button type="button">−</button>
                  </div>
                </div>
              </section>

              <section className="paketDetail__section">
                <h2 className="paketDetail__heading">Ticket Information</h2>

                <div className="paketDetail__infoItem">
                  <span className="paketDetail__icon">🎟</span>
                  <span>Ticket Type: Price /ticket</span>
                </div>
              </section>

              <section className="paketDetail__section">
                <h2 className="paketDetail__heading">Event Description</h2>

                <p className="paketDetail__paragraph">
                  Lorem ipsum dolor sit amet consectetur. Eget vulputate sociis
                  sit urna sit aliquet. Vivamus facilisis diam libero dolor
                  volutpat diam eu.
                </p>
              </section>
            </div>

            <aside className="paketDetail__right">
              <button
                type="button"
                className="paketDetail__orderBtn"
                onClick={openModal}
              >
                🎟 Pesan Sekarang
              </button>
            </aside>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="bookingModal__overlay" onClick={closeModal}>
          <div className="bookingModal" onClick={(e) => e.stopPropagation()}>
            {/* STEP 1 */}
            {step === 1 && (
              <>
                <div className="bookingModal__header">
                  <h2 className="bookingModal__title">Pilih tiket</h2>
                  <button
                    type="button"
                    className="bookingModal__close"
                    onClick={closeModal}
                  >
                    ✕
                  </button>
                </div>

                <div className="bookingModal__body bookingModal__body--gray">
                  <div className="ticketTable__head">
                    <span>Ticket Types</span>
                    <span>Quantity</span>
                  </div>

                  <div className="ticketItem">
                    <div className="ticketItem__accent" />
                    <div className="ticketItem__content">
                      <div className="ticketItem__info">
                        <div className="ticketItem__name">{ticketName}</div>
                        <div className="ticketItem__price">Rp 200.000,-</div>
                      </div>

                      <div className="ticketQty">
                        <button type="button" onClick={decreaseQty}>
                          −
                        </button>
                        <span>{qty}</span>
                        <button type="button" onClick={increaseQty}>
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bookingModal__footer">
                  <div className="bookingSummary">
                    <span>
                      Qty: <strong>{qty}</strong>
                    </span>
                    <span>
                      Total:{" "}
                      <strong className="text-green">
                        Rp {total.toLocaleString("id-ID")},-
                      </strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    className="bookingPrimaryBtn"
                    onClick={handleNextFromStep1}
                    disabled={qty < 1}
                  >
                    Process Pembayaran <span>›</span>
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <div className="bookingModal__header">
                  <button
                    type="button"
                    className="bookingModal__back"
                    onClick={() => setStep(1)}
                  >
                    ←
                  </button>
                  <h2 className="bookingModal__title">Detail Pengunjung</h2>
                  <button
                    type="button"
                    className="bookingModal__close"
                    onClick={closeModal}
                  >
                    ✕
                  </button>
                </div>

                <div className="bookingModal__body bookingModal__body--gray">
                  <div className="visitorTop">
                    <div>
                      <div className="visitorTop__event">{eventTitle}</div>
                      <div className="visitorTop__ticket">
                        {ticketName}: Tiket #1
                      </div>
                    </div>
                    <div className="visitorTop__date">📅 {getTodayDate()}</div>
                  </div>

                  <div className="visitorFormCard">
                    <label className="visitorField">
                      <span>Nama Lengkap</span>
                      <input
                        type="text"
                        placeholder="Masukkan Nama Lengkap"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                      />
                    </label>

                    <label className="visitorField">
                      <span>Alamat Email</span>
                      <input
                        type="email"
                        placeholder="Masukkan Alamat Email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </label>

                    <label className="visitorField">
                      <span>Nomor Hp</span>
                      <div className="phoneField">
                        <span className="phoneField__prefix">🇮🇩</span>
                        <input
                          type="text"
                          placeholder="Masukkan Nomor Handphone"
                          value={form.phone}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </label>
                  </div>

                  <p className="bookingTerms">
                    I accept the <a href="#">Terms of Service</a> and have read
                    the <a href="#">Privacy Policy</a>
                  </p>
                </div>

                <div className="bookingModal__footer">
                  <div className="bookingSummary">
                    <span>
                      Qty: <strong>{qty}</strong>
                    </span>
                    <span>
                      Total:{" "}
                      <strong className="text-green">
                        Rp {total.toLocaleString("id-ID")}
                      </strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    className="bookingPrimaryBtn bookingPrimaryBtn--muted"
                    onClick={handleNextFromStep2}
                  >
                    Lanjutkan Pembayaran <span>›</span>
                  </button>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <div className="bookingModal__header">
                  <button
                    type="button"
                    className="bookingModal__back"
                    onClick={() => setStep(2)}
                  >
                    ←
                  </button>
                  <h2 className="bookingModal__title">Ringkasan Pesanan</h2>
                  <button
                    type="button"
                    className="bookingModal__close"
                    onClick={closeModal}
                  >
                    ✕
                  </button>
                </div>

                <div className="bookingModal__body bookingModal__body--gray bookingModal__body--summary">
                  <div className="ticketSummaryCard">
                    <div className="ticketSummaryCard__title">{ticketName}</div>
                    <div className="ticketSummaryCard__content">
                      <div>
                        <div className="ticketSummaryCard__label">
                          Nama Pengunjung
                        </div>
                        <div className="ticketSummaryCard__value">
                          {form.fullName}
                        </div>
                        <div className="ticketSummaryCard__value">
                          {form.email}
                        </div>
                      </div>
                      <div className="ticketSummaryCard__badge">Rp.200.000</div>
                    </div>
                  </div>
                </div>

                <div className="bookingModal__footer bookingModal__footer--summary">
                  <div className="paymentSummary">
                    <div className="paymentSummary__row">
                      <span>Sub Total:</span>
                      <strong>Rp {total.toLocaleString("id-ID")}</strong>
                    </div>
                    <div className="paymentSummary__row">
                      <span>Tax:</span>
                      <strong>Rp {tax.toLocaleString("id-ID")}</strong>
                    </div>
                    <div className="paymentSummary__divider" />
                    <div className="paymentSummary__row paymentSummary__row--grand">
                      <span>Order Total:</span>
                      <strong className="text-green">
                        Rp.{grandTotal.toLocaleString("id-ID")}
                      </strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="bookingPayBtn"
                    onClick={handlePayNow}
                  >
                    🔒 Bayar Sekarang
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
