import classes from "./account.module.css";
import { IoPersonCircleOutline } from "react-icons/io5";
import AccountStats from "../../ObjectList/AccountStats/AccountStats";

const stats = [
  { title: "Washes Booked", data: 10, format: "number" },
  { title: "Washes Completed", data: 5, format: "number" },
];

export default function Account() {
  return (
    <div className={classes.accountContainer}>
      <div className={classes.accountInfo}>
        <div className={classes.accountDetails}>
          <div className={classes.accountIcon}>
            <IoPersonCircleOutline className={classes.icon} />
            <p className={classes.accountName}>NAME</p>
          </div>
        </div>

        <div className={classes.accountActions}>
          <button className={classes.editButton}>Edit</button>
          <button className={classes.logoutButton}>Log Out</button>
        </div>
      </div>

      <AccountStats stats={stats} />
    </div>
  );
}
