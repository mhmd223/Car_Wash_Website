import classes from "./user.module.css";
import ConfirmButtons from "../FormComponents/Forms/ConfirmButtons/ConfirmButtons";
import { useState } from "react";

// Added CSS classes for username and userIdLabel
// CSS classes should be added in user.module.css:
// .username { font-weight: bold; }
// .userIdLabel { font-style: italic; }
export function User({ user, updateUser }) {
  const savedVerified = Boolean(user.verified);
  const [draft, setDraft] = useState({
    role: user.role,
    verified: savedVerified,
  });

  const hasChanges =
    draft.role.toLowerCase() !== user.role.toLowerCase() ||
    draft.verified !== savedVerified;

  const handleRoleChange = (selectedRole) => {
    setDraft((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleVerifyUser = () => {
    setDraft((prev) => ({ ...prev, verified: true }));
  };

  const handleCancelEdit = () => {
    setDraft({ role: user.role, verified: savedVerified });
  };

  const handleConfirmEdit = async () => {
    await updateUser.mutateAsync({
      email: user.email,
      newRole: draft.role,
      verified: !savedVerified ? draft.verified : null,
    });
  };
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
              onClick={() => handleRoleChange("customer")}
              className={
                draft.role.toLowerCase() === "customer"
                  ? `${classes.role} ${classes.selectedRole}`
                  : classes.role
              }
            >
              Customer
            </p>
            <p
              onClick={() => handleRoleChange("washer")}
              className={
                draft.role.toLowerCase() === "washer"
                  ? `${classes.role} ${classes.selectedRole}`
                  : classes.role
              }
            >
              Washer
            </p>
            <p
              onClick={() => handleRoleChange("admin")}
              className={
                draft.role.toLowerCase() === "admin"
                  ? `${classes.role} ${classes.selectedRole}`
                  : classes.role
              }
            >
              Admin
            </p>
          </div>
        </div>
        <div className={classes.verifyContainer}>
          <button
            onClick={handleVerifyUser}
            disabled={draft.verified}
            className={`${classes.verifyButton} ${draft.verified ? classes.verifiedButton : ""}`}
          >
            {draft.verified ? "Verified" : "Verify User"}
          </button>
        </div>
      </div>
      <ConfirmButtons
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
        show={hasChanges}
        isConfirming={updateUser.isPending}
      />
    </div>
  );
}
