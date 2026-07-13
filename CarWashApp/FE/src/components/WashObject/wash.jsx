import classes from "./item.module.css";
import { icons } from "../../data/icons/icons.js";
export default function Item({ item }) {
  const statusMap = {
    [-1]: "Rejected",
    0: "Pending",
    1: "Accepted",
    2: "Completed",
  };
  return (
    <div className={classes.item + " " + classes.itemPending}>
      <h2>{item.Car_Plate}</h2>
      <div className={classes.namePrice}>
        <p className={classes.price}>
          {<icons.price className={classes.Icon} />} {item.Price}
        </p>
        <h3>{item.Name}</h3>
      </div>
      <p className={classes.carPlate}>
        {<icons.car className={classes.Icon} />}
        {item.Car_Plate}
      </p>
      <p className={classes.phone}>
        {<icons.phone className={classes.Icon} />}
        {item.Cust_Phone}
      </p>
      <p className={classes.date}>{item.Wash_Date}</p>
      <p className={classes.status}>{statusMap[item.Wash_Status]}</p>
    </div>
  );
}
