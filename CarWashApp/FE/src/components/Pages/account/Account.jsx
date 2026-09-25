// Customer/admin profile page: details, activity statistics, editing, and logout.
import classes from "./account.module.css";
import { IoPersonCircleOutline } from "react-icons/io5";
import AccountStats from "../../ObjectList/AccountStats/AccountStats";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import { useContext, useEffect, useState } from "react";
import {
  useAccountStats,
  useEditAccount,
} from "../../../hooks/useAccountStats";
import { logout } from "../../../services/account_services";
import EditAccForm from "../../FormComponents/Forms/EditAccountForm/EditAccForm";
import { toast } from "react-toastify";

export default function Account({ queryClient }) {
  const { user, setUser } = useContext(UserContext);
  const { mutateAsync: editAccount } = useEditAccount();

  const handleEditSubmit = async (id, username, email, phone, password) => {
    await editAccount({ id, username, email, phone, password });
  };

  const [editMode, setEditMode] = useState(false);

  const { data: accountStats, isError: accountStatsError } = useAccountStats(
    user?.id,
    {
      enabled: !!user?.id,
    },
  );

  useEffect(() => {
    if (accountStatsError) {
      toast.error("Could not load your account statistics.");
    }
  }, [accountStatsError]);
  const profileData = { ...user, ...accountStats };

  const displayName = profileData.username;
  const email = profileData.email;
  const phone = profileData.phone;
  const role = (profileData.role ?? "customer").toLowerCase();
  const isVerified = profileData.verified;

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
            <div>
              <p className={classes.accountEyebrow}>My account</p>
              <p className={classes.accountName}>{displayName}</p>
              <p className={classes.accountRole}>{role}</p>
            </div>
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
              try {
                await logout(queryClient);
                if (setUser) setUser(null);
                toast.success("Logged out successfully.");
                window.location.href = "/login";
              } catch (error) {
                toast.error("Could not log out. Please try again.");
              }
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      <main className={classes.accountContent}>
        <section className={classes.profilePanel}>
          <div className={classes.sectionHeading}>
            <div>
              <p className={classes.sectionEyebrow}>Profile details</p>
              <h2>Keep your account current</h2>
            </div>
            <span
              className={isVerified ? classes.verified : classes.unverified}
            >
              {isVerified ? "Verified" : "Not verified"}
            </span>
          </div>
          <div className={classes.detailGrid}>
            <div className={classes.detailItem}>
              <span>Email</span>
              <strong>{email || "Not provided"}</strong>
            </div>
            <div className={classes.detailItem}>
              <span>Phone</span>
              <strong>{phone || "Not provided"}</strong>
            </div>
            <div className={classes.detailItem}>
              <span>Account type</span>
              <strong>{role}</strong>
            </div>
            <div className={classes.detailItem}>
              <span>Member access</span>
              <strong>Active</strong>
            </div>
          </div>
        </section>

        <section className={classes.statsPanel}>
          <div className={classes.sectionHeading}>
            <div>
              <p className={classes.sectionEyebrow}>Activity</p>
              <h2>Your wash history</h2>
            </div>
            <span className={classes.sectionNote}>All time</span>
          </div>
          <AccountStats stats={stats} />
        </section>
      </main>
      {editMode && (
        <EditAccForm
          key={profileData.id}
          userData={profileData}
          onSubmit={handleEditSubmit}
          setEditMode={setEditMode}
        />
      )}
    </div>
  );
}
