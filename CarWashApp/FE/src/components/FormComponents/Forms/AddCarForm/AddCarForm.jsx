import classes from "./AddCarForm.module.css";
import InputField from "../../inputField/InputField.jsx";
import { toast } from "react-toastify";

export default function AddCarForm({ setIsAddCarFormOpen, mutation, userId }) {
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log("Form Data:", Object.fromEntries(formData.entries()));
    const data = {
      License_Plate: formData.get("License_Plate"),
      User_Id: userId,
    };
    try {
      await mutation.mutateAsync(data);
      setIsAddCarFormOpen(false);
      toast.success("Car added successfully.");
    } catch (error) {
      const code = error.response?.data?.code;
      const messages = {
        INVALID_CAR_PLATE: "Enter a valid license plate number.",
        CAR_NOT_FOUND_OR_ALREADY_ADDED:
          "That car could not be found or is already on your account.",
      };
      toast.error(messages[code] || "Couldn't add the car. Please try again.");
    }
  }

  return (
    <div
      className={classes.Modal}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsAddCarFormOpen(false);
        }
      }}
    >
      <div className={classes.FormContainer}>
        <h2 className={classes.FormTitle}>Add a Car</h2>
        <form onSubmit={handleSubmit} id="addCarForm" className={classes.form}>
          <InputField
            id={"License_Plate"}
            type={"text"}
            key={"License_Plate"}
            label={"License Plate"}
            name={"License_Plate"}
            placeHolder={"e.g. 12-345-67"}
          />
          <div className={classes.actions}>
            <button
              type="button"
              className={classes.cancelButton}
              onClick={() => setIsAddCarFormOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className={classes.submitButton}>
              Add Car
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
