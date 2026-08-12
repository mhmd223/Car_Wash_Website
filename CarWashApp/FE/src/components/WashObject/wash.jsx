import classes from "./item.module.css";
import { icons } from "../../data/icons/icons.js";
import { statusConfig } from "../../data/washStatus";
export { statusConfig };
export default function Item({ item, actions }) {
  const status = statusConfig[item.Wash_Status] ?? {
    label: "Unknown",
    cls: "",
  };
  const carName = [item.Car_Brand, item.Car_Model].filter(Boolean).join(" ");

  return (
    <div className={classes.item}>
      <div className={classes.cardHeader}>
        <span className={`${classes.statusBadge} ${classes[status.cls] ?? ""}`}>
          {status.label}
        </span>
        <p className={classes.carPlateLabel}>{item.Car_Plate}</p>
      </div>

      {carName && <h2 className={classes.carName}>{carName}</h2>}

      <div className={classes.divider} />

      <div className={classes.row}>
        <icons.car className={classes.Icon} />
        <span>{item.Name}</span>
      </div>

      <div className={classes.row}>
        <icons.price className={classes.Icon} />
        <span>{item.Price} ₪</span>
      </div>

      <div className={classes.row}>
        <icons.phone className={classes.Icon} />
        <span>{item.Cust_Phone}</span>
      </div>

      <p className={classes.date}>{item.Wash_Date}</p>
      {actions}
    </div>
  );
}
