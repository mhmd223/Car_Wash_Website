import { useContext, useMemo } from "react";
import { Link, Navigate } from "react-router-dom";
import { pages } from "../../../data/pages/pages.js";
import { UserContext } from "../../ContextComponents/UserContext/UserContext.js";
import { useUserWashes } from "../../../hooks/useUserWashes.js";
import { statusConfig } from "../../../data/washStatus.js";
import classes from "./home.module.css";

const shortcuts = pages.filter((p) => p.name !== "about" && p.name !== "home");

const SHORTCUT_DESC = {
  washes: "Book & track washes",
  cars: "Manage your vehicles",
  account: "Profile & stats",
};

const ROLE_REDIRECT = { admin: "/admin/dashboard", washer: "/employee" };

export default function Home() {
  const { user } = useContext(UserContext);

  const redirect = ROLE_REDIRECT[user?.role?.toLowerCase()];
  if (redirect) return <Navigate to={redirect} replace />;

  const { data: washes = [] } = useUserWashes(user?.id, { retry: false });

  const upcomingWashes = useMemo(
    () => washes.filter((w) => w.Wash_Status === 0 || w.Wash_Status === 1),
    [washes],
  );

  return (
    <div className={classes.container}>
      <div className={classes.grid}>
        {shortcuts.map(({ name, icon: Icon }) => (
          <Link key={name} to={`/${name}`} className={classes.card}>
            {name === "washes" && upcomingWashes.length > 0 && (
              <span className={classes.badge}>{upcomingWashes.length}</span>
            )}
            <Icon className={classes.icon} />
            <span className={classes.label}>{name}</span>
            <span className={classes.desc}>{SHORTCUT_DESC[name]}</span>
          </Link>
        ))}
      </div>
      {upcomingWashes.length > 0 && (
        <section className={classes.alerts}>
          <p className={classes.alertsHeader}>Upcoming washes</p>
          <div className={classes.alertList}>
            {upcomingWashes.map((w) => {
              const status = statusConfig[w.Wash_Status];
              return (
                <Link key={w.ID} to="/washes" className={classes.alertItem}>
                  <span
                    className={`${classes.alertBadge} ${classes[status.cls]}`}
                  >
                    {status.label}
                  </span>
                  <span className={classes.alertPlate}>{w.Car_Plate}</span>
                  <span className={classes.alertMeta}>{w.Name}</span>
                  <span className={classes.alertDate}>
                    {w.Wash_Date.slice(0, 16)}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
