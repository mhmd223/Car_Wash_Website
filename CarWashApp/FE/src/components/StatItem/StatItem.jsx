import classes from "./statItem.module.css";

function formatValue(data, format) {
  if (format === "percentage") return `${data}%`;
  if (format === "number") return Number(data).toLocaleString();
  return data;
}

export default function StatItem({ title, data, format }) {
  return (
    <div className={classes.statItem}>
      <div className={classes.statTitle}>
        <p>{title}</p>
      </div>
      <p className={classes.statValue}>{formatValue(data, format)}</p>
    </div>
  );
}
