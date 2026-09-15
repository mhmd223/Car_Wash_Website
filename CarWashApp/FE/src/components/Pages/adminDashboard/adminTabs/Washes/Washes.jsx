import classes from "./washes.module.css";
import WashesList from "../../../../ObjectList/WashesList/WashesList.jsx";

export default function Washes({ washes, status, error, updateWashStatus }) {
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <p className={classes.eyebrow}>Operations</p>
        <h2 className={classes.title}>Manage washes</h2>
        <p className={classes.subtitle}>
          Review incoming bookings and update their status.
        </p>
      </div>
      {status === "pending" && (
        <p className={classes.message}>Loading washes...</p>
      )}
      {status === "error" && (
        <p className={classes.message} role="alert">
          Unable to load washes: {error?.message || "Unknown error"}
        </p>
      )}
      {status === "success" && (
        <WashesList
          objects={washes || []}
          filterToday
          renderActions={(wash) => (
            <div className={classes.actions}>
              {wash.Wash_Status === 0 && (
                <>
                  <button
                    className={classes.acceptButton}
                    onClick={() =>
                      updateWashStatus({
                        washId: wash.ID,
                        status: 1,
                        custId: wash.Cust_ID,
                      })
                    }
                  >
                    Accept
                  </button>
                  <button
                    className={classes.rejectButton}
                    onClick={() =>
                      updateWashStatus({
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
                  className={classes.completeButton}
                  onClick={() =>
                    updateWashStatus({
                      washId: wash.ID,
                      status: 2,
                      custId: wash.Cust_ID,
                    })
                  }
                >
                  Mark complete
                </button>
              )}
            </div>
          )}
        />
      )}
    </div>
  );
}
