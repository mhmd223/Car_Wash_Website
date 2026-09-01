import classes from "./user.module.css";
import ConfirmButtons from "../FormComponents/Forms/ConfirmButtons/ConfirmButtons";
import { useState } from "react";

// Added CSS classes for username and userIdLabel
// CSS classes should be added in user.module.css:
// .username { font-weight: bold; }
// .userIdLabel { font-style: italic; }
export function User({ user, verifyUser, updateUserRole }) {
  console.log(user);
  const [selectedRole, setSelectedRole] = useState(user.role);
  return (
    <div className={classes.userContainer}>
      <div className={classes.userInfoContainer}>
        <div className={classes.userDetails}>
          <p>
            <span className={classes.username}>{user.username}</span>{" "}
            <span className={classes.userIdLabel}>#{user.id}</span>
          </p>
        </div>
        <div className={classes.divider}>
          <p> {user.email}</p>
          <p> {user.phone}</p>
        </div>
      </div>
      <div className={classes.actionContainer}>
        <div className={classes.roleContainer}>
          <div className={classes.roles}>
            <p
              className={
                user.role.toLowerCase() === "customer"
                  ? `${classes.role} ${classes.selectedRole}`
                  : classes.role
              }
            >
              Customer
            </p>
            <p
              className={
                user.role.toLowerCase() === "washer"
                  ? `${classes.role} ${classes.selectedRole}`
                  : classes.role
              }
            >
              Washer
            </p>
            <p
              className={
                user.role.toLowerCase() === "admin"
                  ? `${classes.role} ${classes.selectedRole}`
                  : classes.role
              }
            >
              Admin
            </p>
          </div>
          <ConfirmButtons
            onConfirm={updateUserRole}
            onCancel={() => {}}
            isConfirming={false}
          />
        </div>
        <div className={classes.verifyContainer}>
          <button
            disabled={user.verified}
            className={`${classes.verifyButton} ${user.verified ? classes.verifiedButton : ""}`}
          >
            {user.verified ? "Verified" : "Verify User"}
          </button>
          <ConfirmButtons
            onConfirm={verifyUser}
            onCancel={() => {}}
            isConfirming={false}
          />
        </div>
      </div>
    </div>
  );
}
