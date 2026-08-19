import classes from "./account.module.css";
import { IoPersonCircleOutline } from "react-icons/io5";
import AccountStats from "../../ObjectList/AccountStats/AccountStats";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import { useContext, useState } from "react";
import {
  useAccountStats,
  useEditAccount,
} from "../../../hooks/useAccountStats";
import { logout } from "../../../services/account_services";
import EditAccForm from "../../FormComponents/Forms/EditAccountForm/EditAccForm";

export default function Account({ queryClient }) {
  const { user, setUser } = useContext(UserContext);
  const { mutateAsync: editAccount } = useEditAccount();

  const handleEditSubmit = async (id, username, email, phone, password) => {
    await editAccount({ id, username, email, phone, password });
  };

  const [editMode, setEditMode] = useState(false);

  const {
    data: accountStats,
    status: statsStatus,
    error: statsError,
  } = useAccountStats(user?.id, {
    enabled: !!user?.id,
  });

  const displayName = accountStats?.username ?? user.username;

  const stats = [
    {
      title: "Washes Booked",
      data: accountStats?.amount_of_washes ?? 0,
      format: "number",
    },
    {
      title: "Washes Completed",
      data: accountStats?.completed_washes ?? 0,
      format: "number",
    },
  ];

  return (
    <div className={classes.accountContainer}>
      <div className={classes.accountInfo}>
        <div className={classes.accountDetails}>
          <div className={classes.accountIcon}>
            <IoPersonCircleOutline className={classes.icon} />
            <p className={classes.accountName}>{displayName}</p>
          </div>
        </div>

        <div className={classes.accountActions}>
          <button
            className={classes.editButton}
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
          <button
            className={classes.logoutButton}
            onClick={async () => {
              await logout(queryClient);
              if (setUser) setUser(null);
              window.location.href = "/login";
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      <AccountStats stats={stats} />
      {editMode && (
        <EditAccForm
          userData={accountStats ?? user}
          onSubmit={handleEditSubmit}
          setEditMode={setEditMode}
        />
      )}
    </div>
  );
}
