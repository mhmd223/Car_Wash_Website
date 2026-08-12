import Item from "../../WashObject/wash";
import classes from "./list.module.css";

const groupByHour = (objects) =>
  Object.groupBy(
    objects,
    (wash) => wash.Wash_Date?.split(" ")[1]?.split(":")[0] ?? "??",
  );

export default function WashesList({ objects, renderActions }) {
  const grouped = groupByHour(objects);
  console.log("Grouped washes by hour:", grouped); // Debugging log
  return (
    <div className={classes.listContainer}>
      {Object.entries(grouped)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([hour, hourWashes]) => (
          <div key={hour} className={classes.hourGroup}>
            <h3 className={classes.hourLabel}>
              {String(hour).padStart(2, "0")}:00
            </h3>
            <div className={classes.hourCards}>
              {hourWashes.map((object) => (
                <Item
                  key={object.ID}
                  item={object}
                  actions={renderActions?.(object)}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
