import classes from "./confirmbuttons.module.css";
export default function ConfirmButtons({ onConfirm, onCancel, isConfirming }) {
  return (
    <div className={classes.confirmButtonsContainer}>
      <button
        className={`${classes.cancelButton} ${classes.button}`}
        onClick={onCancel}
        disabled={isConfirming}
      >
        Cancel
      </button>
      <button
        className={`${classes.confirmButton} ${classes.button}`}
        onClick={onConfirm}
        disabled={isConfirming}
      >
        {isConfirming ? "Confirming..." : "Confirm"}
      </button>
    </div>
  );
}
