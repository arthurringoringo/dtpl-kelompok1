import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "../../components/admin-sidebar";
import { getDestinationBuyers, getOrderById, type DestinationBuyersResponse, type OrderResponse } from "../../services/api";
import "./admin-destination-buyers.css";
import "../admin-destination-list/admin-shared.css";

const STATUS_LABELS: Record<string, string> = {
  paid: "Paid",
  waiting_for_payment: "Pending",
  draft: "Draft",
  failed: "Cancelled",
};

function formatRupiahBuyers(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function AdminDestinationBuyersPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { name?: string } | null;

  const [data, setData] = useState<DestinationBuyersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [detailMap, setDetailMap] = useState<Record<number, OrderResponse>>({});
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    getDestinationBuyers(id, {
      page,
      status: statusFilter || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    })
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Gagal memuat data pembeli."),
      )
      .finally(() => setLoading(false));
  }, [id, page, statusFilter, startDate, endDate]);

  const handleReset = () => {
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleToggleRow = async (orderId: number) => {
    if (expandedId === orderId) { setExpandedId(null); return; }
    setExpandedId(orderId);
    if (detailMap[orderId]) return;
    setLoadingDetail(true);
    try {
      const detail = await getOrderById(orderId);
      setDetailMap((prev) => ({ ...prev, [orderId]: detail }));
    } catch {
      // leave detail empty, row stays open
    } finally {
      setLoadingDetail(false);
    }
  };

  const destinationName =
    data?.destination.name ?? locationState?.name ?? "Data Pembeli";

  const perPage = data?.meta.per_page ?? 10;
  const total = data?.meta.total ?? 0;
  const totalPages = Math.ceil(total / perPage) || 1;
  const showingFrom = total === 0 ? 0 : (page - 1) * perPage + 1;
  const showingTo = Math.min(page * perPage, total);

  return (
    <div className="buyersPage adminPage">
      <div className="adminShell">
        <AdminSidebar />

        <main className="adminContent buyersContent">
          {/* Header */}
          <div className="buyersHeader">
            <button type="button" className="buyersBack" onClick={() => navigate(-1)}>
              ← Kembali
            </button>
            <h1 className="buyersTitle">{destinationName}</h1>
          </div>

          {error && <div className="buyersError">{error}</div>}

          {/* Filter bar */}
          <div className="buyersFilterBar">
            <div className="buyersFilterBar__group">
              <label className="buyersFilterBar__fieldLabel">From</label>
              <input
                type="date"
                className="buyersFilterBar__date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              />
            </div>

            <div className="buyersFilterBar__group">
              <label className="buyersFilterBar__fieldLabel">To</label>
              <input
                type="date"
                className="buyersFilterBar__date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              />
            </div>

            <div className="buyersFilterBar__group">
              <label className="buyersFilterBar__fieldLabel">Order Status</label>
              <select
                className="buyersFilterBar__select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="">All Order Status</option>
                <option value="paid">Paid</option>
                <option value="waiting_for_payment">Pending</option>
                <option value="draft">Draft</option>
                <option value="failed">Cancelled</option>
              </select>
            </div>

            <button type="button" className="buyersFilterBar__reset" onClick={handleReset}>
              Reset Filter
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <p className="buyersLoading">Memuat...</p>
          ) : (
            <>
              <div className="buyersTableWrap">
                <table className="buyersTable">
                  <thead>
                    <tr>
                      <th>ORDER ID</th>
                      <th>NAMA PEMBELI</th>
                      <th>EMAIL</th>
                      <th>TANGGAL</th>
                      <th>TOTAL</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!data?.data.length ? (
                      <tr>
                        <td colSpan={6} className="buyersEmpty">
                          Tidak ada data pembeli.
                        </td>
                      </tr>
                    ) : (
                      data.data.map((item) => {
                        const isExpanded = expandedId === item.order_id;
                        const detail = detailMap[item.order_id];
                        return (
                          <React.Fragment key={item.order_id}>
                            <tr
                              className={`buyersTable__row ${isExpanded ? "buyersTable__row--active" : ""}`}
                              onClick={() => handleToggleRow(item.order_id)}
                            >
                              <td className="buyersTable__orderId">
                                <span className="buyersTable__expand">{isExpanded ? "▾" : "▸"}</span>
                                {item.booking_code}
                              </td>
                              <td>{item.buyer_name}</td>
                              <td className="buyersTable__email">{item.buyer_email}</td>
                              <td>
                                {new Date(item.purchased_at).toLocaleDateString("id-ID", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td>{formatRupiahBuyers(Number(item.order_total))}</td>
                              <td>
                                <span className={`buyersBadge buyersBadge--${item.status}`}>
                                  {STATUS_LABELS[item.status] ?? item.status}
                                </span>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr key={`${item.order_id}-detail`} className="buyersTable__detailRow">
                                <td colSpan={6} className="buyersTable__detailCell">
                                  {loadingDetail && !detail ? (
                                    <p className="buyersDetail__loading">Memuat detail...</p>
                                  ) : detail ? (
                                    <div className="buyersDetail">
                                      {/* Order info */}
                                      <div className="buyersDetail__section">
                                        <div className="buyersDetail__sectionTitle">Info Pesanan</div>
                                        <div className="buyersDetail__infoGrid">
                                          <div className="buyersDetail__infoItem">
                                            <span className="buyersDetail__infoLabel">Paket</span>
                                            <span className="buyersDetail__infoValue">{detail.order_item.name}</span>
                                          </div>
                                          <div className="buyersDetail__infoItem">
                                            <span className="buyersDetail__infoLabel">Tanggal</span>
                                            <span className="buyersDetail__infoValue">{detail.order_item.date}</span>
                                          </div>
                                          <div className="buyersDetail__infoItem">
                                            <span className="buyersDetail__infoLabel">Waktu</span>
                                            <span className="buyersDetail__infoValue">{detail.order_item.start_time} – {detail.order_item.end_time}</span>
                                          </div>
                                          <div className="buyersDetail__infoItem">
                                            <span className="buyersDetail__infoLabel">Jumlah Tiket</span>
                                            <span className="buyersDetail__infoValue">{detail.qty} Tiket</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Add-ons */}
                                      {detail.order_add_ons && detail.order_add_ons.length > 0 && (
                                        <div className="buyersDetail__section">
                                          <div className="buyersDetail__sectionTitle">Add-ons</div>
                                          <div className="buyersDetail__addonList">
                                            {detail.order_add_ons.map((addon) => (
                                              <div key={addon.id} className="buyersDetail__addonItem">
                                                <span>{addon.name}</span>
                                                <span className="buyersDetail__addonPrice">+{formatRupiahBuyers(Number(addon.price))}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Visitors */}
                                      {detail.order_visitor_details.length > 0 && (
                                        <div className="buyersDetail__section">
                                          <div className="buyersDetail__sectionTitle">Detail Pengunjung</div>
                                          <div className="buyersDetail__visitorGrid">
                                            {detail.order_visitor_details.map((v, i) => (
                                              <div key={v.id} className="buyersDetail__visitorCard">
                                                <div className="buyersDetail__visitorNo">Pengunjung #{i + 1}</div>
                                                <div className="buyersDetail__visitorName">{v.name}</div>
                                                <div className="buyersDetail__visitorSub">{v.email}</div>
                                                <div className="buyersDetail__visitorSub">{v.phone_number}</div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Price breakdown */}
                                      <div className="buyersDetail__priceBreakdown">
                                        <div className="buyersDetail__priceRow">
                                          <span>Sub Total</span>
                                          <span>{formatRupiahBuyers(Number(detail.sub_total))}</span>
                                        </div>
                                        <div className="buyersDetail__priceRow">
                                          <span>Pajak</span>
                                          <span>{formatRupiahBuyers(Number(detail.tax))}</span>
                                        </div>
                                        <div className="buyersDetail__priceRow buyersDetail__priceRow--total">
                                          <span>Total</span>
                                          <span>{formatRupiahBuyers(Number(detail.order_total))}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="buyersDetail__loading">Gagal memuat detail.</p>
                                  )}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="buyersPagination">
                <span className="buyersPagination__info">
                  Showing {showingFrom}–{showingTo} of {total}
                </span>
                <button
                  type="button"
                  className="buyersPagination__btn"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="buyersPagination__btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  ›
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
