import { useMemo, useState } from "react";
import AdminSidebar from "../../components/admin-sidebar";
import "./admin-dashboard.css";
import "../admin-destination-list/admin-shared.css"

type PeriodKey = "daily" | "weekly" | "monthly";

type TransactionItem = {
  id: number;
  destination: string;
  date: string; // format: YYYY-MM-DD
  qty: number;
};

type ChartPoint = {
  dateKey: string;
  label: string;
  totalSales: number;
};

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getRangeDates(daysBeforeToday: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = addDays(today, -daysBeforeToday);
  const dates: Date[] = [];

  for (
    let current = new Date(start);
    current <= today;
    current = addDays(current, 1)
  ) {
    dates.push(new Date(current));
  }

  return dates;
}

function buildStraightLinePath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  return points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");
}

const dummyTransactions: TransactionItem[] = [
  {
    id: 1,
    destination: "Paket 1",
    date: formatDateKey(addDays(new Date(), -30)),
    qty: 4,
  },
  {
    id: 2,
    destination: "Paket 2",
    date: formatDateKey(addDays(new Date(), -29)),
    qty: 3,
  },
  {
    id: 3,
    destination: "Paket 3",
    date: formatDateKey(addDays(new Date(), -28)),
    qty: 7,
  },
  {
    id: 4,
    destination: "Paket 1",
    date: formatDateKey(addDays(new Date(), -27)),
    qty: 5,
  },
  {
    id: 5,
    destination: "Paket 4",
    date: formatDateKey(addDays(new Date(), -26)),
    qty: 8,
  },
  {
    id: 6,
    destination: "Paket 2",
    date: formatDateKey(addDays(new Date(), -25)),
    qty: 6,
  },
  {
    id: 7,
    destination: "Paket 5",
    date: formatDateKey(addDays(new Date(), -24)),
    qty: 10,
  },
  {
    id: 8,
    destination: "Paket 1",
    date: formatDateKey(addDays(new Date(), -23)),
    qty: 4,
  },
  {
    id: 9,
    destination: "Paket 4",
    date: formatDateKey(addDays(new Date(), -22)),
    qty: 9,
  },
  {
    id: 10,
    destination: "Paket 3",
    date: formatDateKey(addDays(new Date(), -21)),
    qty: 5,
  },
  {
    id: 11,
    destination: "Paket 2",
    date: formatDateKey(addDays(new Date(), -20)),
    qty: 11,
  },
  {
    id: 12,
    destination: "Paket 5",
    date: formatDateKey(addDays(new Date(), -19)),
    qty: 7,
  },
  {
    id: 13,
    destination: "Paket 1",
    date: formatDateKey(addDays(new Date(), -18)),
    qty: 6,
  },
  {
    id: 14,
    destination: "Paket 4",
    date: formatDateKey(addDays(new Date(), -17)),
    qty: 13,
  },
  {
    id: 15,
    destination: "Paket 2",
    date: formatDateKey(addDays(new Date(), -16)),
    qty: 8,
  },
  {
    id: 16,
    destination: "Paket 3",
    date: formatDateKey(addDays(new Date(), -15)),
    qty: 12,
  },
  {
    id: 17,
    destination: "Paket 5",
    date: formatDateKey(addDays(new Date(), -14)),
    qty: 9,
  },
  {
    id: 18,
    destination: "Paket 1",
    date: formatDateKey(addDays(new Date(), -13)),
    qty: 14,
  },
  {
    id: 19,
    destination: "Paket 4",
    date: formatDateKey(addDays(new Date(), -12)),
    qty: 10,
  },
  {
    id: 20,
    destination: "Paket 2",
    date: formatDateKey(addDays(new Date(), -11)),
    qty: 16,
  },
  {
    id: 21,
    destination: "Paket 3",
    date: formatDateKey(addDays(new Date(), -10)),
    qty: 12,
  },
  {
    id: 22,
    destination: "Paket 5",
    date: formatDateKey(addDays(new Date(), -9)),
    qty: 18,
  },
  {
    id: 23,
    destination: "Paket 1",
    date: formatDateKey(addDays(new Date(), -8)),
    qty: 11,
  },
  {
    id: 24,
    destination: "Paket 2",
    date: formatDateKey(addDays(new Date(), -7)),
    qty: 17,
  },
  {
    id: 25,
    destination: "Paket 4",
    date: formatDateKey(addDays(new Date(), -6)),
    qty: 13,
  },
  {
    id: 26,
    destination: "Paket 3",
    date: formatDateKey(addDays(new Date(), -5)),
    qty: 20,
  },
  {
    id: 27,
    destination: "Paket 5",
    date: formatDateKey(addDays(new Date(), -4)),
    qty: 15,
  },
  {
    id: 28,
    destination: "Paket 1",
    date: formatDateKey(addDays(new Date(), -3)),
    qty: 19,
  },
  {
    id: 29,
    destination: "Paket 2",
    date: formatDateKey(addDays(new Date(), -2)),
    qty: 22,
  },
  {
    id: 30,
    destination: "Paket 4",
    date: formatDateKey(addDays(new Date(), -1)),
    qty: 16,
  },
  { id: 31, destination: "Paket 3", date: formatDateKey(new Date()), qty: 24 },

  // tambahan transaksi di tanggal yang sama biar keliatan total agregat
  {
    id: 32,
    destination: "Paket 5",
    date: formatDateKey(addDays(new Date(), -7)),
    qty: 4,
  },
  {
    id: 33,
    destination: "Paket 1",
    date: formatDateKey(addDays(new Date(), -2)),
    qty: 3,
  },
  { id: 34, destination: "Paket 2", date: formatDateKey(new Date()), qty: 5 },
  { id: 35, destination: "Paket 4", date: formatDateKey(new Date()), qty: 2 },
];

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<PeriodKey>("weekly");

  const daysBeforeToday = useMemo(() => {
    if (period === "daily") return 0;
    if (period === "weekly") return 7;
    return 30;
  }, [period]);

  const chartData = useMemo<ChartPoint[]>(() => {
    const rangeDates = getRangeDates(daysBeforeToday);

    return rangeDates.map((date) => {
      const dateKey = formatDateKey(date);

      const totalSales = dummyTransactions
        .filter((transaction) => transaction.date === dateKey)
        .reduce((sum, transaction) => sum + transaction.qty, 0);

      return {
        dateKey,
        label: formatDateLabel(date),
        totalSales,
      };
    });
  }, [daysBeforeToday]);

  const packageSummary = useMemo(() => {
    const rangeDates = getRangeDates(daysBeforeToday);
    const allowedDateKeys = new Set(
      rangeDates.map((date) => formatDateKey(date)),
    );

    const grouped = dummyTransactions
      .filter((transaction) => allowedDateKeys.has(transaction.date))
      .reduce<Record<string, { name: string; sales: number }>>(
        (acc, transaction) => {
          if (!acc[transaction.destination]) {
            acc[transaction.destination] = {
              name: transaction.destination,
              sales: 0,
            };
          }

          acc[transaction.destination].sales += transaction.qty;
          return acc;
        },
        {},
      );

    return Object.values(grouped).sort((a, b) => b.sales - a.sales);
  }, [daysBeforeToday]);

  const summary = useMemo(() => {
    const totalSales = chartData.reduce(
      (sum, item) => sum + item.totalSales,
      0,
    );
    const highest = [...chartData].sort(
      (a, b) => b.totalSales - a.totalSales,
    )[0];
    const average =
      chartData.length > 0 ? Math.round(totalSales / chartData.length) : 0;

    return {
      totalSales,
      highest,
      average,
    };
  }, [chartData]);

  const chart = useMemo(() => {
    const width = 980;
    const height = 360;
    const padding = {
      top: 24,
      right: 20,
      bottom: 56,
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

          <div key={period} className="adminDashboardMetrics">
            <article className="dashboardMetricCard">
              <span className="dashboardMetricCard__label">
                Total Penjualan
              </span>
              <strong className="dashboardMetricCard__value">
                {summary.totalSales}
              </strong>
              <span className="dashboardMetricCard__hint">seluruh paket</span>
            </article>

            <article className="dashboardMetricCard">
              <span className="dashboardMetricCard__label">
                Rata-rata per Hari
              </span>
              <strong className="dashboardMetricCard__value">
                {summary.average}
              </strong>
              <span className="dashboardMetricCard__hint">
                transaksi / hari
              </span>
            </article>

            <article className="dashboardMetricCard">
              <span className="dashboardMetricCard__label">
                Penjualan Tertinggi
              </span>
              <strong className="dashboardMetricCard__value">
                {summary.highest?.totalSales ?? 0}
              </strong>
              <span className="dashboardMetricCard__hint">
                {summary.highest?.label ?? "-"}
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
                    X = tanggal, Y = total penjualan seluruh paket pada hari
                    tersebut
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
                        {line.value}
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
                        {point.totalSales}
                      </text>

                      <text
                        x={point.x}
                        y={chart.bottomY + 28}
                        textAnchor="middle"
                        className="dashboardChart__xLabel"
                      >
                        {point.label}
                      </text>
                    </g>
                  ))}
                </svg>
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
                {packageSummary.map((item) => {
                  const maxSales = Math.max(
                    ...packageSummary.map((pkg) => pkg.sales),
                    1,
                  );
                  const width = `${(item.sales / maxSales) * 100}%`;

                  return (
                    <div key={item.name} className="dashboardRankingItem">
                      <div className="dashboardRankingItem__row">
                        <div>
                          <div className="dashboardRankingItem__name">
                            {item.name}
                          </div>
                          <div className="dashboardRankingItem__meta">
                            Total penjualan dalam periode terpilih
                          </div>
                        </div>

                        <div className="dashboardRankingItem__revenue">
                          {item.sales} tiket
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
                })}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
