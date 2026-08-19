import {
  useAllWashes,
  useUpdateWashStatus,
} from "../../../hooks/useEmployeeWashes";
import { WASH_EVENTS } from "../../../../../shared/events";
import WashesList from "../../ObjectList/WashesList/WashesList";
import classes from "./employee.module.css";
import { useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import { useContext } from "react";

import useSocket from "../../../Socket/useSocket";

export default function EmployeeDashboard() {
  const { socket } = useContext(UserContext);
  const queryClient = useQueryClient();
  const { data: washes, status, error } = useAllWashes();
  const { mutate: updateStatus } = useUpdateWashStatus();

  useSocket(socket, WASH_EVENTS.NEW_WASH_BOOKED, (newWash) => {
    queryClient.setQueryData(["allWashes"], (oldData) => [
      ...(oldData || []),
      newWash,
    ]);
  });

  useSocket(socket, WASH_EVENTS.WASH_STATUS_UPDATED, ({ washId, status }) => {
    queryClient.setQueryData(["allWashes"], (oldData) => {
      if (!oldData) return [];
      return oldData.map((wash) =>
        wash.ID === washId ? { ...wash, Wash_Status: status } : wash,
      );
    });

    console.log("Updated washes after receiving new wash:", [
      queryClient.getQueryData(["allWashes"]),
    ]);
  });

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h2 className={classes.title}>Wash Bookings</h2>
      </div>

      <div className={classes.content}>
        {status === "pending" && <p className={classes.msg}>Loading...</p>}
        {status === "error" && (
          <p className={classes.msg}>Error: {error.message}</p>
        )}

        {status === "success" && (
          <>
            <WashesList
              objects={washes || []}
              filterToday
              renderActions={(wash) => (
                <div className={classes.actions}>
                  {wash.Wash_Status === 0 && (
                    <>
                      <button
                        className={classes.acceptBtn}
                        onClick={() =>
                          updateStatus({
                            washId: wash.ID,
                            status: 1,
                            custId: wash.Cust_ID,
                          })
                        }
                      >
                        Accept
                      </button>
                      <button
                        className={classes.rejectBtn}
                        onClick={() =>
                          updateStatus({
                            washId: wash.ID,
                            status: -1,
                            custId: wash.Cust_ID,
                          })
                        }
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {wash.Wash_Status === 1 && (
                    <button
                      className={classes.completeBtn}
                      onClick={() =>
                        updateStatus({
                          washId: wash.ID,
                          status: 2,
                          custId: wash.Cust_ID,
                        })
                      }
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              )}
            />
          </>
        )}
      </div>
    </div>
  );
}
