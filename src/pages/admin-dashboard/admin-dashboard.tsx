import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin-sidebar";
import { getAdminDashboard, type AdminDashboardResponse } from "../../services/api";
import "./admin-dashboard.css";
import "../admin-destination-list/admin-shared.css";

type PeriodKey = "daily" | "weekly" | "monthly";

type ChartPoint = {
  dateKey: string;
  label: string;
  totalSales: number;
};

function compactRupiah(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`;
  return String(Math.round(value));
}

function buildStraightLinePath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  return points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<PeriodKey>("weekly");
  const [dashboardData, setDashboardData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getAdminDashboard({ period })
      .then(setDashboardData)
      .catch((err) => setError(err instanceof Error ? err.message : "Gagal memuat dashboard."))
      .finally(() => setLoading(false));
  }, [period]);

  const chartData = useMemo<ChartPoint[]>(() => {
    if (!dashboardData) return [];
    return dashboardData.chart.map((item) => ({
      dateKey: String(item.destination_id),
      label: item.name,
      totalSales: item.total_sales,
    }));
  }, [dashboardData]);

  const chart = useMemo(() => {
    const width = 980;
    const height = 400;
    const padding = {
      top: 24,
      right: 20,
      bottom: 96,
      left: 50,
    };

    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...chartData.map((item) => item.totalSales), 1);

    const points = chartData.map((item, index) => {
      const x =
        chartData.length === 1
          ? padding.left + innerWidth / 2
          : padding.left + (index * innerWidth) / (chartData.length - 1);

      const y =
        padding.top + innerHeight - (item.totalSales / maxValue) * innerHeight;

      return {
        ...item,
        x,
        y,
      };
    });

    const linePath = buildStraightLinePath(points);
    const bottomY = height - padding.bottom;

    const areaPath =
      points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`
        : "";

    const gridLines = Array.from({ length: 5 }, (_, index) => {
      const value = Math.round((maxValue / 4) * (4 - index));
      const y = padding.top + (innerHeight / 4) * index;

      return { value, y };
    });

    return {
      width,
      height,
      bottomY,
      points,
      linePath,
      areaPath,
      gridLines,
    };
  }, [chartData]);

  const rankingSummary = useMemo(() => {
    if (!dashboardData) return [];
    return dashboardData.chart.map((item) => ({
      id: item.destination_id,
      name: item.name,
      sales: item.total_orders,
      revenue: item.total_sales,
    }));
  }, [dashboardData]);

  return (
    <div className="adminDashboardPage">
      <div className="adminShell">
        <AdminSidebar />

        <main className="adminDashboardContent">
          <div className="adminDashboardHeader">
            <div>
              <h1 className="adminDashboardTitle">Dashboard</h1>
            </div>

            <div className="adminDashboardFilters">
              <button
                type="button"
                className={`adminDashboardFilter ${period === "daily" ? "adminDashboardFilter--active" : ""}`}
                onClick={() => setPeriod("daily")}
              >
                Harian
              </button>

              <button
                type="button"
                className={`adminDashboardFilter ${period === "weekly" ? "adminDashboardFilter--active" : ""}`}
                onClick={() => setPeriod("weekly")}
              >
                Mingguan
              </button>

              <button
                type="button"
                className={`adminDashboardFilter ${period === "monthly" ? "adminDashboardFilter--active" : ""}`}
                onClick={() => setPeriod("monthly")}
              >
                Bulanan
              </button>
            </div>
          </div>

          {error && <div className="adminDashboardError">{error}</div>}

          <div key={period} className="adminDashboardMetrics">
            <article className="dashboardMetricCard">
              <span className="dashboardMetricCard__label">
                Total Penjualan
              </span>
              <strong className="dashboardMetricCard__value">
                {loading
                  ? "Memuat..."
                  : dashboardData
                  ? `Rp ${Number(dashboardData.summary.total_sales).toLocaleString("id-ID")}`
                  : "-"}
              </strong>
              <span className="dashboardMetricCard__hint">seluruh paket</span>
            </article>

            <article className="dashboardMetricCard">
              <span className="dashboardMetricCard__label">
                Total Order
              </span>
              <strong className="dashboardMetricCard__value">
                {loading
                  ? "Memuat..."
                  : dashboardData
                  ? dashboardData.summary.total_orders
                  : "-"}
              </strong>
              <span className="dashboardMetricCard__hint">
                transaksi
              </span>
            </article>

            <article className="dashboardMetricCard">
              <span className="dashboardMetricCard__label">
                Destinasi Aktif
              </span>
              <strong className="dashboardMetricCard__value">
                {loading
                  ? "Memuat..."
                  : dashboardData
                  ? dashboardData.summary.active_destinations
                  : "-"}
              </strong>
              <span className="dashboardMetricCard__hint">
                destinasi
              </span>
            </article>
          </div>

          <div className="adminDashboardGrid">
            <section key={`${period}-chart`} className="dashboardChartCard">
              <div className="dashboardChartCard__top">
                <div>
                  <h2 className="dashboardChartCard__title">
                    Grafik Total Penjualan Destinasi
                  </h2>
                  <p className="dashboardChartCard__caption">
                    X = destinasi, Y = total penjualan
                  </p>
                </div>

                <div className="dashboardChartCard__badge">
                  {period === "daily" && "Hari ini"}
                  {period === "weekly" &&
                    "7 hari sebelum hari ini s/d hari ini"}
                  {period === "monthly" &&
                    "30 hari sebelum hari ini s/d hari ini"}
                </div>
              </div>

              <div className="dashboardChart">
                {loading ? (
                  <p style={{ padding: "24px", color: "#888" }}>Memuat...</p>
                ) : (
                  <svg
                    viewBox={`0 0 ${chart.width} ${chart.height}`}
                    className="dashboardChart__svg"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="salesAreaGradientStraight"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#4f7cff"
                          stopOpacity="0.24"
                        />
                        <stop
                          offset="100%"
                          stopColor="#4f7cff"
                          stopOpacity="0.02"
                        />
                      </linearGradient>
                    </defs>

                    {chart.gridLines.map((line) => (
                      <g key={line.y}>
                        <line
                          x1={50}
                          x2={chart.width - 20}
                          y1={line.y}
                          y2={line.y}
                          className="dashboardChart__gridLine"
                        />
                        <text
                          x={10}
                          y={line.y + 4}
                          className="dashboardChart__gridLabel"
                        >
                          {compactRupiah(line.value)}
                        </text>
                      </g>
                    ))}

                    {chart.points.length > 1 && (
                      <path d={chart.areaPath} className="dashboardChart__area" />
                    )}

                    {chart.points.length > 1 && (
                      <path d={chart.linePath} className="dashboardChart__line" />
                    )}

                    {chart.points.map((point, index) => (
                      <g key={point.dateKey}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="5.5"
                          className="dashboardChart__dot"
                          style={{ animationDelay: `${index * 60}ms` }}
                        />

                        <text
                          x={point.x}
                          y={point.y - 12}
                          textAnchor="middle"
                          className="dashboardChart__pointValue"
                        >
                          {compactRupiah(point.totalSales)}
                        </text>

                        <text
                          x={point.x}
                          y={chart.bottomY + 20}
                          textAnchor="middle"
                          className="dashboardChart__xLabel"
                        >
                          {(() => {
                            const words = point.label.split(" ");
                            const lines: string[] = [];
                            for (let i = 0; i < words.length; i += 2)
                              lines.push(words.slice(i, i + 2).join(" "));
                            return lines.map((line, i) => (
                              <tspan key={i} x={point.x} dy={i === 0 ? 0 : "1.3em"}>
                                {line}
                              </tspan>
                            ));
                          })()}
                        </text>
                      </g>
                    ))}
                  </svg>
                )}
              </div>
            </section>

            <aside key={`${period}-summary`} className="dashboardRankingCard">
              <div className="dashboardRankingCard__top">
                <h2 className="dashboardRankingCard__title">
                  Summary per Paket
                </h2>
                <span className="dashboardRankingCard__pill">
                  {period === "daily" && "Harian"}
                  {period === "weekly" && "Mingguan"}
                  {period === "monthly" && "Bulanan"}
                </span>
              </div>

              <div className="dashboardRankingList">
                {loading ? (
                  <p style={{ padding: "16px", color: "#888" }}>Memuat...</p>
                ) : (
                  rankingSummary.map((item) => {
                    const maxSales = Math.max(
                      ...rankingSummary.map((pkg) => pkg.sales),
                      1,
                    );
                    const width = `${(item.sales / maxSales) * 100}%`;

                    return (
                      <div
                        key={item.id}
                        className="dashboardRankingItem dashboardRankingItem--clickable"
                        onClick={() => navigate(`/admin/destinasi/${item.id}/pembeli`, { state: { name: `${item.name} #${item.id}` } })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && navigate(`/admin/destinasi/${item.id}/pembeli`, { state: { name: `${item.name} #${item.id}` } })}
                      >
                        <div className="dashboardRankingItem__row">
                          <div>
                            <div className="dashboardRankingItem__name">
                              {item.name} <span className="dashboardRankingItem__id">#{item.id}</span>
                            </div>
                            <div className="dashboardRankingItem__meta">
                              Total penjualan dalam periode terpilih
                            </div>
                          </div>

                          <div className="dashboardRankingItem__revenue">
                            <div>Rp {Number(item.revenue).toLocaleString("id-ID")}</div>
                            <div>{item.sales} order</div>
                          </div>
                        </div>

                        <div className="dashboardRankingItem__bar">
                          <div
                            className="dashboardRankingItem__barFill"
                            style={{ width }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
