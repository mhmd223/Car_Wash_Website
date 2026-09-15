// Admin shell: staff tabs, live wash updates, account editing, and logout.
import useNav from "../../../hooks/useNav/useNav.jsx";
import Users from "./adminTabs/Users/Users.jsx";
import Business from "./adminTabs/Business/Business.jsx";
import Washes from "./adminTabs/Washes/Washes.jsx";
import Schedule from "./adminTabs/Schedule/Schedule.jsx";
import classes from "./dashboard.module.css";
import { useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import { logout } from "../../../services/account_services";
import { useEditAccount } from "../../../hooks/useAccountStats.js";
import EditAccForm from "../../FormComponents/Forms/EditAccountForm/EditAccForm";
import useSocket from "../../../Socket/useSocket";
import { WASH_EVENTS } from "../../../../../shared/events";

import {
  useAllUsers,
  useBusinessReport,
  useUpdateUser,
} from "../../../hooks/useAccountStats.js";
import {
  useAllWashes,
  useUpdateWashStatus,
} from "../../../hooks/useEmployeeWashes.js";
export default function AdminDashboard() {
  const { user, socket, setUser } = useContext(UserContext);
  const queryClient = useQueryClient();
  const editAccount = useEditAccount();
  const [editMode, setEditMode] = useState(false);
  const { data: allUsers, isLoading, isError } = useAllUsers();
  const {
    data: businessData,
    isLoading: businessIsLoading,
    isError: businessIsError,
  } = useBusinessReport();
  const {
    data: washes,
    status: washesStatus,
    error: washesError,
  } = useAllWashes();
  const { mutate: updateWashStatus } = useUpdateWashStatus();

  useSocket(socket, WASH_EVENTS.NEW_WASH_BOOKED, (newWash) => {
    queryClient.setQueryData(["allWashes"], (oldData) => [
      ...(oldData || []),
      newWash,
    ]);
  });

  useSocket(socket, WASH_EVENTS.WASH_STATUS_UPDATED, ({ washId, status }) => {
    queryClient.setQueryData(["allWashes"], (oldData) =>
      (oldData || []).map((wash) =>
        wash.ID === washId ? { ...wash, Wash_Status: status } : wash,
      ),
    );
  });

  const updateUser = useUpdateUser();

  const tabs = [
    {
      tab: "Users",
      component: Users,
      props: { allUsers, isLoading, isError, updateUser },
    },
    {
      tab: "Business",
      component: Business,
      props: {
        data: businessData,
        isLoading: businessIsLoading,
        isError: businessIsError,
      },
    },
    {
      tab: "Washes",
      component: Washes,
      props: {
        washes,
        status: washesStatus,
        error: washesError,
        updateWashStatus,
      },
    },
    {
      tab: "Schedule",
      component: Schedule,
      props: {},
    },
  ];
  const { Nav, ActiveComponent } = useNav({
    tabs,
    initialActivePage: Users,
  });

  const propsToPass =
    tabs.find((tab) => tab.component === ActiveComponent)?.props || {};

  const handleLogout = async () => {
    await logout(queryClient);
    setUser(null);
    window.location.href = "/login";
  };

  const handleEditSubmit = async (id, username, email, phone, password) => {
    const result = await editAccount.mutateAsync({
      id,
      username,
      email,
      phone,
      password,
    });

    setUser({ ...user, username, email, phone });
    return result;
  };

  return (
    <div className={classes.dashboardContainer}>
      <div className={classes.dashboardHeader}>
        <div>
          <p className={classes.eyebrow}>Operations</p>
          <h1>Admin Dashboard</h1>
        </div>
        <div className={classes.headerActions}>
          <button
            type="button"
            className={classes.editButton}
            onClick={() => setEditMode(true)}
          >
            Edit account
          </button>
          <button
            type="button"
            className={classes.logoutButton}
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
      {Nav}
      <ActiveComponent {...propsToPass} />
      {editMode && (
        <EditAccForm
          key={user?.id}
          userData={user}
          onSubmit={handleEditSubmit}
          setEditMode={setEditMode}
        />
      )}
    </div>
  );
}
