import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderHistories, getOrderHistory, submitReview } from "../../services/api";
import type { OrderHistoryItem, ReviewData } from "../../services/api";
import "./riwayat-pesanan.css";

const FALLBACK_DESTINATION =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop";
const FALLBACK_ACCOMMODATION =
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop";

function formatRupiah(value: string | number) {
  return `Rp. ${Number(value).toLocaleString("id-ID")}`;
}

function formatOrderDate(isoDate: string) {
  const d = new Date(isoDate);
  const date = d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
}

function statusClass(status: string) {
  const s = status.toLowerCase().replace(/\s/g, "_");
  if (s === "paid" || s.includes("success") || s.includes("completed")) return "paid";
  if (s.includes("failed") || s.includes("cancel")) return "failed";
  if (s === "draft") return "draft";
  return "pending";
}

function statusLabel(sc: string) {
  if (sc === "paid") return "PAID";
  if (sc === "pending") return "UNPAID";
  if (sc === "failed") return "REJECTED";
  return "DRAFT";
}

const STATUS_FILTER_OPTIONS = [
  { key: "paid", label: "PAID" },
  { key: "pending", label: "UNPAID" },
  { key: "failed", label: "REJECTED" },
  { key: "draft", label: "DRAFT" },
];

export default function RiwayatPesananPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detailMap, setDetailMap] = useState<Record<number, OrderHistoryItem>>({});
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ── filters ──
  const [filterStatus, setFilterStatus] = useState<Set<string>>(new Set());
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // ── review modal ──
  const [reviewModal, setReviewModal] = useState<{ orderId: number } | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    getOrderHistories()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    let result = orders;
    const search = keyword.trim().toLowerCase();
    if (search) {
      result = result.filter(
        (o) =>
          o.booking_code.toLowerCase().includes(search) ||
          o.order_item.name.toLowerCase().includes(search),
      );
    }
    if (filterStatus.size > 0) {
      result = result.filter((o) => filterStatus.has(statusClass(o.status)));
    }
    if (filterStartDate) {
      const start = new Date(filterStartDate).getTime();
      result = result.filter((o) => new Date(o.created_at).getTime() >= start);
    }
    if (filterEndDate) {
      const end = new Date(filterEndDate + "T23:59:59").getTime();
      result = result.filter((o) => new Date(o.created_at).getTime() <= end);
    }
    return result;
  }, [orders, keyword, filterStatus, filterStartDate, filterEndDate]);

  const hasFilter = filterStatus.size > 0 || filterStartDate || filterEndDate;

  const clearFilters = () => {
    setFilterStatus(new Set());
    setFilterStartDate("");
    setFilterEndDate("");
  };

  const toggleStatusFilter = (key: string) => {
    setFilterStatus((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handleResume = (order: OrderHistoryItem) => {
    if (order.order_item.type === "accommodation") {
      navigate("/penginapan", { state: { resumeOrder: order } });
    } else {
      navigate(`/paket-wisata/${order.order_item.id}`, { state: { resumeOrder: order } });
    }
  };

  const handleContinuePayment = (order: OrderHistoryItem) => {
    if (order.order_item.type === "accommodation") {
      navigate("/penginapan", { state: { openPayment: order } });
    } else {
      navigate(`/paket-wisata/${order.order_item.id}`, { state: { openPayment: order } });
    }
  };

  const handleToggleDetail = async (order: OrderHistoryItem) => {
    if (expandedId === order.id) { setExpandedId(null); return; }
    setExpandedId(order.id);
    if (detailMap[order.id]) return;
    setLoadingDetail(true);
    try {
      const detail = await getOrderHistory(order.id);
      setDetailMap((prev) => ({ ...prev, [order.id]: detail }));
    } catch {
      setDetailMap((prev) => ({ ...prev, [order.id]: order }));
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <main className="riwayat">
      {/* ── Hero ── */}
      <section className="riwayat__hero">
        <h1 className="riwayat__heroTitle">Riwayat Pesanan</h1>
        <div className="riwayat__searchWrap">
          <span className="riwayat__searchIcon">⌕</span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="riwayat__searchInput"
            placeholder="Order ID"
          />
          {keyword && (
            <button type="button" className="riwayat__clearBtn" onClick={() => setKeyword("")}>✕</button>
          )}
        </div>
      </section>

      {/* ── Body ── */}
      <div className="riwayat__body container">

        {/* ── Filter sidebar ── */}
        <aside className="riwayat__filter">
          <div className="riwayat__filterTitle">FILTER</div>

          <div className="riwayat__filterGroup">
            <div className="riwayat__filterLabel">STATUS</div>
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <label key={opt.key} className="riwayat__filterCheck">
                <input
                  type="checkbox"
                  checked={filterStatus.has(opt.key)}
                  onChange={() => toggleStatusFilter(opt.key)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          <div className="riwayat__filterGroup">
            <div className="riwayat__filterLabel">DATE</div>
            <div className="riwayat__filterDateLabel">START DATE</div>
            <input
              type="date"
              className="riwayat__filterDate"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
            <div className="riwayat__filterDateLabel">END DATE</div>
            <input
              type="date"
              className="riwayat__filterDate"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>

          {hasFilter && (
            <button type="button" className="riwayat__clearFilter" onClick={clearFilters}>
              Hapus Filter
            </button>
          )}
        </aside>

        {/* ── Order list ── */}
        <section className="riwayat__list">
          {loading ? (
            <div className="riwayat__empty">Memuat...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="riwayat__empty">Pesanan tidak ditemukan.</div>
          ) : (
            filteredOrders.map((order) => {
              const sc = statusClass(order.status);
              const isExpanded = expandedId === order.id;
              const detail = detailMap[order.id];
              const fallback = order.order_item.type === "accommodation" ? FALLBACK_ACCOMMODATION : FALLBACK_DESTINATION;

              return (
                <article key={order.id} className="riwayat__card">
                  {/* Status badge */}
                  <div className={`riwayat__badge riwayat__badge--${sc}`}>
                    {statusLabel(sc)}
                  </div>

                  {/* Meta row */}
                  <div className="riwayat__meta">
                    <span>{formatOrderDate(order.created_at)}</span>
                    <span className="riwayat__metaDivider">|</span>
                    <span>Order ID: <strong>{order.booking_code}</strong></span>
                    <span className="riwayat__metaTotal">
                      Total: <strong className="riwayat__metaTotalValue">{formatRupiah(order.order_total)}</strong>
                    </span>
                  </div>

                  {/* Content box */}
                  <div className="riwayat__content">
                    <div className="riwayat__contentInner">
                      {/* Thumbnail */}
                      <div className="riwayat__thumb">
                        <img
                          src={order.order_item.image_url ?? fallback}
                          alt={order.order_item.name}
                          className="riwayat__thumbImg"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback; }}
                        />
                        {order.review != null && (
                          <span className="riwayat__reviewed" title="Sudah diulas">★</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="riwayat__info">
                        <div className="riwayat__infoName">{order.order_item.name}</div>
                        <div className="riwayat__infoCategory">
                          {order.order_item.type === "accommodation" ? "Penginapan" : order.order_item.category_name}
                        </div>
                        {order.order_item.type === "accommodation" ? (
                          <div className="riwayat__infoMeta">{order.qty} Malam</div>
                        ) : (
                          <>
                            <div className="riwayat__infoMeta">{order.order_item.date}</div>
                            <div className="riwayat__infoTime">{order.order_item.start_time} - {order.order_item.end_time}</div>
                            <div className="riwayat__infoMeta">{order.qty} Tiket</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="riwayat__actions">
                      {sc === "draft" && (
                        <button type="button" className="riwayat__btn riwayat__btn--primary" onClick={() => handleResume(order)}>
                          Lanjutkan Pesanan
                        </button>
                      )}
                      {sc === "pending" && (
                        <button type="button" className="riwayat__btn riwayat__btn--primary" onClick={() => handleContinuePayment(order)}>
                          Lanjutkan Pembayaran
                        </button>
                      )}
                      {(sc === "paid" || sc === "failed") && (
                        <button
                          type="button"
                          className="riwayat__btn riwayat__btn--primary"
                          onClick={() => handleToggleDetail(order)}
                        >
                          {isExpanded ? "Tutup Detail" : "Lihat Detail"}
                        </button>
                      )}
                      {sc === "paid" && order.can_review === true && (
                        <button
                          type="button"
                          className="riwayat__btn riwayat__btn--review"
                          onClick={() => {
                            setReviewModal({ orderId: order.id });
                            setRating(0);
                            setComment("");
                            setReviewError("");
                          }}
                        >
                          Beri Ulasan
                        </button>
                      )}
                      {sc === "paid" && (
                        <button
                          type="button"
                          className="riwayat__btn riwayat__btn--ticket"
                          onClick={() => window.open(`/ticket/${order.booking_code}`, "_blank")}
                        >
                          🎟 Tiket
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded visitor detail */}
                  {isExpanded && (
                    <div className="riwayat__detail">
                      {loadingDetail && !detail ? (
                        <p className="riwayat__detailLoading">Memuat detail...</p>
                      ) : detail ? (
                        <>
                          {detail.visitor_details.length > 0 && (
                            <>
                              <div className="riwayat__detailTitle">Detail Pengunjung</div>
                              <div className="riwayat__visitorGrid">
                                {detail.visitor_details.map((v, i) => (
                                  <div key={v.id} className="riwayat__visitorCard">
                                    <div className="riwayat__visitorNo">Pengunjung #{i + 1}</div>
                                    <div className="riwayat__visitorName">{v.name}</div>
                                    <div className="riwayat__visitorSub">{v.email}</div>
                                    <div className="riwayat__visitorSub">{v.phone_number}</div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                          {detail.order_add_ons && detail.order_add_ons.length > 0 && (
                            <>
                              <div className="riwayat__detailTitle" style={{ marginTop: detail.visitor_details.length > 0 ? 12 : 0 }}>Add-ons</div>
                              <div className="riwayat__addonList">
                                {detail.order_add_ons.map((addon) => (
                                  <div key={addon.id} className="riwayat__addonItem">
                                    <span>{addon.name}</span>
                                    <span className="riwayat__addonPrice">+{formatRupiah(addon.price)}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                          <div className="riwayat__detailSummary">
                            <span>Qty: <strong>{detail.qty}</strong></span>
                            <span>Sub Total: <strong>{formatRupiah(detail.sub_total)}</strong></span>
                            <span>Tax: <strong>{formatRupiah(detail.tax)}</strong></span>
                          </div>
                        </>
                      ) : (
                        <p className="riwayat__detailLoading">Belum ada detail pengunjung.</p>
                      )}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </section>
      </div>

      {/* ── Review Modal ── */}
      {reviewModal !== null && (
        <div className="reviewModal__overlay" onClick={() => setReviewModal(null)}>
          <div className="reviewModal" onClick={(e) => e.stopPropagation()}>
            <div className="reviewModal__header">
              <span className="reviewModal__title">Beri Ulasan</span>
              <button type="button" className="reviewModal__close" onClick={() => setReviewModal(null)}>✕</button>
            </div>

            <div className="reviewModal__label">RATING</div>
            <div className="reviewModal__stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" className="reviewModal__star" onClick={() => setRating(star)} aria-label={`${star} bintang`}>
                  {star <= rating ? "★" : "☆"}
                </button>
              ))}
            </div>

            <div className="reviewModal__label">ULASAN</div>
            <textarea
              className="reviewModal__textarea"
              placeholder="Bagikan pengalaman Anda di sini..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />

            {reviewError && <div className="reviewModal__error">{reviewError}</div>}

            <button
              type="button"
              className="reviewModal__submit"
              disabled={reviewSubmitting}
              onClick={async () => {
                if (rating === 0) { setReviewError("Pilih rating terlebih dahulu"); return; }
                setReviewError("");
                setReviewSubmitting(true);
                const capturedOrderId = reviewModal.orderId;
                try {
                  const result: { message: string; data: ReviewData } = await submitReview(capturedOrderId, { rating, comment });
                  setOrders((prev) =>
                    prev.map((o) => o.id === capturedOrderId ? { ...o, can_review: false, review: result.data } : o)
                  );
                  setReviewModal(null);
                } catch (err) {
                  setReviewError(err instanceof Error ? err.message : "Gagal mengirim ulasan.");
                } finally {
                  setReviewSubmitting(false);
                }
              }}
            >
              {reviewSubmitting ? "Mengirim..." : "KIRIM ULASAN"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
