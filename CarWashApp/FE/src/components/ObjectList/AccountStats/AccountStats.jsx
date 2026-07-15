import classes from "./accountStats.module.css";
import StatItem from "../../StatItem/StatItem";

export default function AccountStats({ stats }) {
  return (
    <div className={classes.accountStats}>
      {stats.map((stat, index) => (
        <StatItem
          key={index}
          title={stat.title}
          data={stat.data}
          format={stat.format}
        />
      ))}
    </div>
  );
}
