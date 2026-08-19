import { useFilterWash } from "../../../hooks/useFilterWash";
import Item from "../../WashObject/wash";
import classes from "./list.module.css";

const STATUS_FILTERS = [
  { label: "All", value: null },
  { label: "Pending", value: 0 },
  { label: "Accepted", value: 1 },
  { label: "Completed", value: 2 },
  { label: "Rejected", value: -1 },
];

const groupByHour = (objects) =>
  Object.groupBy(
    objects,
    (wash) => wash.Wash_Date?.split(" ")[1]?.split(":")[0] ?? "??",
  );

export default function WashesList({
  objects,
  renderActions,
  filterToday = false,
}) {
  const { filteredWashes, filter, plateFilter, setPlateFilter, setFilter } =
    useFilterWash(objects, { filterToday });
  const grouped = groupByHour(filteredWashes);
  console.log("Grouped washes by hour:", grouped); // Debugging log
  return (
    <div className={classes.wrapper}>
      <div className={classes.filters}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            className={`${classes.filterBtn} ${filter === f.value ? classes.active : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
        <input
          type="text"
          placeholder="Filter by plate number"
          value={plateFilter}
          onChange={(e) => setPlateFilter(e.target.value)}
          className={classes.plateInput}
        />
      </div>
      <div className={classes.listContainer}>
        {grouped && Object.keys(grouped).length > 0 ? (
          Object.entries(grouped)
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
            ))
        ) : (
          <p className={classes.noWashes}>No washes available.</p>
        )}
      </div>
    </div>
  );
}
