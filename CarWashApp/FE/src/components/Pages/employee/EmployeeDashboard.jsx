import {
  useAllWashes,
  useUpdateWashStatus,
} from "../../../hooks/useEmployeeWashes";
import { WASH_EVENTS } from "../../../../../shared/events";
import { useFilterWash } from "../../../hooks/useFilterWash";
import WashesList from "../../ObjectList/WashesList/WashesList";
import classes from "./employee.module.css";
import { useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import { useContext } from "react";

import useSocket from "../../../Socket/useSocket";
const STATUS_FILTERS = [
  { label: "All", value: null },
  { label: "Pending", value: 0 },
  { label: "Accepted", value: 1 },
  { label: "Completed", value: 2 },
  { label: "Rejected", value: -1 },
];

export default function EmployeeDashboard() {
  const { socket } = useContext(UserContext);
  const queryClient = useQueryClient();
  const { data: washes, status, error } = useAllWashes();
  const { mutate: updateStatus } = useUpdateWashStatus();
  const { filteredWashes, filter, plateFilter, setPlateFilter, setFilter } =
    useFilterWash(washes || []);

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

  const filtered = filteredWashes;
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h2 className={classes.title}>Wash Bookings</h2>

        <div className={classes.filters}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.label}
              className={`${classes.filterBtn} ${filter === f.value ? classes.active : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
          <input
            type="text"
            placeholder="Filter by plate number"
            value={plateFilter}
            onChange={(e) => setPlateFilter(e.target.value)}
            className={classes.plateInput}
          />
        </div>
      </div>

      <div className={classes.content}>
        {status === "pending" && <p className={classes.msg}>Loading...</p>}
        {status === "error" && (
          <p className={classes.msg}>Error: {error.message}</p>
        )}

        {status === "success" && (
          <>
            {filtered.length === 0 && (
              <p className={classes.msg}>No bookings found.</p>
            )}
            <WashesList
              objects={filtered}
              renderActions={(wash) => (
                <div className={classes.actions}>
                  {wash.Wash_Status === 0 && (
                    <>
                      <button
                        className={classes.acceptBtn}
                        onClick={() =>
                          updateStatus({ washId: wash.ID, status: 1 , custId: wash.Cust_ID})
                        }
                      >
                        Accept
                      </button>
                      <button
                        className={classes.rejectBtn}
                        onClick={() =>
                          updateStatus({ washId: wash.ID, status: -1 , custId: wash.Cust_ID})
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
                        updateStatus({ washId: wash.ID, status: 2 , custId: wash.Cust_ID})
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
