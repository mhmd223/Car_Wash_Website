import useNav from "../../../hooks/useNav/useNav.jsx";
import Users from "./adminTabs/Users/Users.jsx";
import classes from "./dashboard.module.css";

import { useAllUsers } from "../../../hooks/useAccountStats.js";
export default function AdminDashboard() {
  const { data: allUsers, isLoading, isError } = useAllUsers();
  const tabs = [
    {
      tab: "Users",
      component: Users,
      props: { allUsers, isLoading, isError },
    },
  ];
  const { Nav, ActiveComponent } = useNav({
    tabs,
    initialActivePage: Users,
  });

  const propsToPass =
    tabs.find((tab) => tab.component === ActiveComponent)?.props || {};
  console.log(propsToPass);
  return (
    <div className={classes.dashboardContainer}>
      <h1>Admin Dashboard</h1>
      {Nav}
      <ActiveComponent {...propsToPass} />
    </div>
  );
}
