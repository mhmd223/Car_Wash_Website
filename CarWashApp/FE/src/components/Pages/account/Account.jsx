import classes from "./account.module.css";
import { IoPersonCircleOutline } from "react-icons/io5";
import AccountStats from "../../ObjectList/AccountStats/AccountStats";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import { useContext } from "react";
import { editAccount } from "../../../services/account_services";
import { useUserStats } from "../../../hooks/useUserWashes";

import EditAccForm from "../../FormComponents/Forms/EditAccountForm/EditAccForm";

export default function Account() {
  const { user, setUser } = useContext(UserContext);

  const handleEditSubmit = async (id, username, email, phone, password) => {
    const data = await editAccount(id, username, email, phone, password);
    if (data?.edited) setUser((prev) => ({ ...prev, ...data.edited }));
  };

  const {
    data: userStats,
    status: statsStatus,
    error: statsError,
  } = useUserStats(user?.id);

  const stats = [
    {
      title: "Washes Booked",
      data: userStats?.amount_of_washes ?? 0,
      format: "number",
    },
    {
      title: "Washes Completed",
      data: userStats?.completed_washes ?? 0,
      format: "number",
    },
  ];

  return (
    <div className={classes.accountContainer}>
      <div className={classes.accountInfo}>
        <div className={classes.accountDetails}>
          <div className={classes.accountIcon}>
            <IoPersonCircleOutline className={classes.icon} />
            <p className={classes.accountName}>{user.username}</p>
          </div>
        </div>

        <div className={classes.accountActions}>
          <button className={classes.editButton}>Edit</button>
          <button className={classes.logoutButton}>Log Out</button>
        </div>
      </div>

      <AccountStats stats={stats} />
      <EditAccForm userData={user} onSubmit={handleEditSubmit} />
    </div>
  );
}
