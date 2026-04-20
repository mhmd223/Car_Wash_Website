import classes from "./BookForm.module.css";
import InputField from "../../inputField/InputField.jsx";
export default function BookForm({ user, categories, cars }) {
  return (
    <div className={classes.Modal}>
      <div className={classes.FormContainer}>
        <form action="POST" id="bookForm" className={classes.form}>
          <InputField
            id={"name"}
            type={"text"}
            label={"Name"}
            name={"ClientName"}
            placeHolder={"Enter your name"}
            textFormat={/^[a-zA-Z]+\s[a-zA-Z]+$/}
            errorMessage={"Name should only contain letters and spaces."}
          />
          <select name="car" id="car">
            <option value="">Select a car</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.License_Plate} {car.Brand} {car.Model}
              </option>
            ))}
          </select>

          <select name="category" id="category">
            <option value="">Select a wash category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.Name} - {category.Price}
              </option>
            ))}
          </select>

          <InputField
            id={"time"}
            type={"time"}
            label={"Time"}
            name={"Time"}
            placeHolder={"Select a time"}
            textFormat={/^\d{2}:\d{2}$/}
            errorMessage={"Time should be in HH:MM format."}
          />
          <button type="submit" className={classes.submitButton}>
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}
