import { useState } from "react";
import { useAllWashes, useUpdateWashStatus } from "../../../hooks/useEmployeeWashes";
import { statusConfig } from "../../WashObject/wash";
import classes from "./employee.module.css";

const STATUS_FILTERS = [
  { label: "Pending", value: 0 },
  { label: "Accepted", value: 1 },
  { label: "All", value: null },
];

export default function EmployeeDashboard() {
  const [filter, setFilter] = useState(0);
  const { data: washes, status, error } = useAllWashes();
  const { mutate: updateStatus } = useUpdateWashStatus();

  const filtered = washes
    ? filter === null
      ? washes
      : washes.filter((w) => w.Wash_Status === filter)
    : [];

  return (
    <div className={classes.container}>
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
      </div>

      {status === "pending" && <p className={classes.msg}>Loading...</p>}
      {status === "error" && <p className={classes.msg}>Error: {error.message}</p>}

      {status === "success" && (
        <div className={classes.grid}>
          {filtered.length === 0 && (
            <p className={classes.msg}>No bookings found.</p>
          )}
          {filtered.map((wash) => {
            const statusInfo = statusConfig[wash.Wash_Status] ?? {
              label: "Unknown",
              cls: "",
            };
            const carName = [wash.Car_Brand, wash.Car_Model]
              .filter(Boolean)
              .join(" ");
            return (
              <div key={wash.ID} className={classes.card}>
                <div className={classes.cardHeader}>
                  <span className={`${classes.badge} ${statusInfo.cls}`}>
                    {statusInfo.label}
                  </span>
                  <span className={classes.plate}>{wash.Car_Plate}</span>
                </div>

                {carName && <p className={classes.carName}>{carName}</p>}

                <div className={classes.divider} />

                <div className={classes.info}>
                  <span className={classes.label}>Category</span>
                  <span>{wash.Name}</span>
                </div>
                <div className={classes.info}>
                  <span className={classes.label}>Price</span>
                  <span>{wash.Price} ₪</span>
                </div>
                <div className={classes.info}>
                  <span className={classes.label}>Phone</span>
                  <span>{wash.Cust_Phone}</span>
                </div>
                <div className={classes.info}>
                  <span className={classes.label}>Date</span>
                  <span className={classes.date}>{wash.Wash_Date}</span>
                </div>

                <div className={classes.actions}>
                  {wash.Wash_Status === 0 && (
                    <>
                      <button
                        className={classes.acceptBtn}
                        onClick={() =>
                          updateStatus({ washId: wash.ID, status: 1 })
                        }
                      >
                        Accept
                      </button>
                      <button
                        className={classes.rejectBtn}
                        onClick={() =>
                          updateStatus({ washId: wash.ID, status: -1 })
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
                        updateStatus({ washId: wash.ID, status: 2 })
                      }
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
