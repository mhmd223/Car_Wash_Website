import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import classes from "./business.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
);

const currency = new Intl.NumberFormat("en-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0,
});

const numberValue = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const dateLabel = (value) => {
  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) return "Unknown date";
  return new Intl.DateTimeFormat("en-IL", {
    day: "2-digit",
    month: "short",
  }).format(new Date(year, month - 1, day));
};

export default function Business({ data, isLoading, isError }) {
  const salesReport = (Array.isArray(data?.salesReport) ? data.salesReport : [])
    .map((report) => ({
      date: String(report.Wash_Date || "").trim(),
      status: Number(report.Wash_Status),
      amount: numberValue(report.Total_Sales),
    }))
    .filter((report) => report.date && [-1, 2].includes(report.status));
  const mostWashedVehicles = (
    Array.isArray(data?.mostWashedVehicles) ? data.mostWashedVehicles : []
  ).map((vehicle) => ({
    plate: String(vehicle.License_Plate || "Unknown plate").trim(),
    brand: String(vehicle.Car_Brand || "Unknown brand").trim(),
    model: String(vehicle.Car_Model || "Unknown model").trim(),
    washes: numberValue(vehicle.Wash_Count),
  }));
  const completedSales = salesReport
    .filter((report) => report.status === 2)
    .reduce((sum, report) => sum + report.amount, 0);
  const rejectedSales = salesReport
    .filter((report) => report.status === -1)
    .reduce((sum, report) => sum + report.amount, 0);
  const completedWashes = salesReport.filter(
    (report) => report.status === 2,
  ).length;
  const rejectedWashes = salesReport.filter(
    (report) => report.status === -1,
  ).length;
  const washTotal = completedWashes + rejectedWashes;
  const completionRate = washTotal
    ? Math.round((completedWashes / washTotal) * 100)
    : 0;
  const salesGap = completedSales - rejectedSales;
  const salesByDate = salesReport.reduce((dates, report) => {
    dates[report.date] ??= { completed: 0, rejected: 0 };
    const key = report.status === 2 ? "completed" : "rejected";
    dates[report.date][key] += report.amount;
    return dates;
  }, {});
  const salesDates = Object.keys(salesByDate).sort();
  const topVehicle = mostWashedVehicles[0];

  const salesChartData = {
    labels: salesDates.map(dateLabel),
    datasets: [
      {
        label: "Completed sales",
        data: salesDates.map((date) => salesByDate[date].completed),
        borderColor: "#fa8112",
        backgroundColor: "#fa821233",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: "#fa8112",
      },
      {
        label: "Rejected sales",
        data: salesDates.map((date) => salesByDate[date].rejected),
        borderColor: "#9b4d3d",
        backgroundColor: "#9b4d3d22",
        fill: false,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: "#9b4d3d",
      },
    ],
  };

  const vehicleChartData = {
    labels: mostWashedVehicles.map((vehicle) => vehicle.plate),
    datasets: [
      {
        label: "Completed washes",
        data: mostWashedVehicles.map((vehicle) => vehicle.washes),
        backgroundColor: "#fa8112",
        borderRadius: 3,
        maxBarThickness: 34,
      },
    ],
  };

  if (isLoading) {
    return <div className={classes.state}>Loading business report...</div>;
  }

  if (isError) {
    return (
      <div className={classes.state} role="alert">
        Unable to load the business report.
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div>
          <p className={classes.eyebrow}>Overview</p>
          <h2 className={classes.title}>Business performance</h2>
        </div>
        <span className={classes.period}>Completed washes</span>
      </div>

      <section className={classes.metrics} aria-label="Business summary">
        <article className={classes.metric}>
          <span>Completed sales</span>
          <strong>{currency.format(completedSales)}</strong>
        </article>
        <article className={classes.metric}>
          <span>Rejected wash value</span>
          <strong>{currency.format(rejectedSales)}</strong>
        </article>
        <article
          className={`${classes.metric} ${salesGap >= 0 ? classes.highlight : classes.alert}`}
        >
          <span>Sales value gap</span>
          <strong>{currency.format(salesGap)}</strong>
        </article>
        <article className={classes.metric}>
          <span>Wash completion</span>
          <strong>{completionRate}%</strong>
          <small>
            {completedWashes} completed / {rejectedWashes} rejected
          </small>
        </article>
      </section>

      <section className={classes.chartGrid}>
        <article className={classes.chartPanel}>
          <div className={classes.panelHeading}>
            <h3>Sales report</h3>
            <span>Daily revenue</span>
          </div>
          {salesReport.length ? (
            <div className={classes.chart}>
              <Line
                data={salesChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: true, position: "bottom" },
                    tooltip: {
                      callbacks: {
                        label: (context) =>
                          ` ${context.dataset.label}: ${currency.format(context.raw)}`,
                      },
                    },
                  },
                  scales: {
                    y: { beginAtZero: true, grid: { color: "#22222212" } },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>
          ) : (
            <p className={classes.empty}>No sales recorded yet.</p>
          )}
        </article>

        <article className={classes.chartPanel}>
          <div className={classes.panelHeading}>
            <h3>Most washed vehicles</h3>
            <span>Top 10 by completed washes</span>
          </div>
          {mostWashedVehicles.length ? (
            <div className={classes.chart}>
              <Bar
                data={vehicleChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 } },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>
          ) : (
            <p className={classes.empty}>No completed washes recorded yet.</p>
          )}
          {topVehicle && (
            <div className={classes.vehicleDetails}>
              <div>
                <span>Most washed vehicle</span>
                <strong>{topVehicle.plate}</strong>
              </div>
              <div>
                <span>Make and model</span>
                <strong>
                  {topVehicle.brand} {topVehicle.model}
                </strong>
              </div>
              <div>
                <span>Completed washes</span>
                <strong>{topVehicle.washes}</strong>
              </div>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
