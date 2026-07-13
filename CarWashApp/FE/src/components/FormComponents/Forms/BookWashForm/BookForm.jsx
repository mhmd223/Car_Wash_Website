import classes from "./BookForm.module.css";
import InputField from "../../inputField/InputField.jsx";
import { data } from "react-router-dom";
export default function BookForm({
  user,
  setIsBookFormOpen,
  categories,
  cars,
  car,
  mutation,
}) {
  let selectedCar = car ? car.License_Plate : null;
  let selectedCategory = null;

  console.log("User cars:", cars);
    function getFullDate(time) {
    const date = new Date();
    const [hours, minutes] = time.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);
    const pad = (n) => String(n).padStart(2, "0");
    return (
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      ` ${pad(date.getHours())}:${pad(date.getMinutes())}:00`
    );
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      Car_Plate: selectedCar,
      Cust_ID: user.id,
      Wash_Date: getFullDate(formData.get("Time")),
      Category_ID: selectedCategory,
    };
    setIsBookFormOpen(false);
    await mutation.mutateAsync(data);
  }
  return (
    <div
      className={classes.Modal}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsBookFormOpen(false);
        }
      }}
    >
      <div className={classes.FormContainer}>
        <form onSubmit={handleSubmit} id="bookForm" className={classes.form}>
          {car ? (
            <input
              className={classes.selectedCarInput}
              type="text"
              value={car.License_Plate + " | " + car.Brand + " " + car.Model}
              readOnly
            ></input>
          ) : (
            <select
              onChange={(e) => {
                selectedCar = e.target.value;
              }}
              key="car"
              name="car"
              id="car"
            >
              <option value="">Select a car</option>
              {Array.isArray(cars) ? (
                cars.map((car) => (
                  <option key={car.ID} value={car.License_Plate}>
                    {car.License_Plate}{" "}
                    <span className={classes.seperator}>|</span> {car.Brand}{" "}
                    {car.Model}
                  </option>
                ))
              ) : (
                <option value="">
                  Add a car to your profile to book a wash.
                </option>
              )}
            </select>
          )}

          <select
            onChange={(e) => {
              selectedCategory = e.target.value;
            }}
            key="category"
            name="category"
            id="category"
          >
            <option value="">Select a wash category</option>
            {Array.isArray(categories) ? (
              categories.map((category) => (
                <option
                  key={category.ID}
                  value={category.ID}
                  className={classes.categoryName}
                >
                  <span> {category.Name}</span>-{category.Price}
                </option>
              ))
            ) : (
              <option value="">No categories available.</option>
            )}
          </select>

          <InputField
            id={"time"}
            type={"time"}
            key={"time"}
            label={"Time"}
            name={"Time"}
            placeHolder={"Select a time"}
            textFormat={/^\d{2}:\d{2}$/}
            errorMessage={"Time should be in HH:MM format."}
          />
          <button
            key={"submitButton"}
            type="submit"
            className={classes.submitButton}
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}
