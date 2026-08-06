import classes from "./car.module.css";
import drivinglicense from "../../assets/images/drivinglicense.png";
import { CiCircleRemove } from "react-icons/ci";
import { useState } from "react";
export default function Car({
  car,
  user,
  removeCar,
  setIsBookFormOpen,
  setSelectedCar,
}) {
  const text = `${car.Brand} ${car.Model}`;
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className={classes.carContainer}>
      <p
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        className={classes.carTitle}
      >
        {isHovered && <span>{text}</span>}
      </p>
      <div className={classes.carInfo}>
        {/* <div className={classes.carCell}>
          <img src={drivinglicense} className={classes.carImage} />
        </div> */}
        <div className={classes.carCell}>
          <CiCircleRemove
            className={classes.removeIcon}
            onClick={async () =>
              await removeCar({
                User_Id: user.id,
                License_Plate: car.License_Plate,
              })
            }
          />
        </div>
        <div className={classes.carCell}>
          <p className={classes.carPlate}>{car.License_Plate}</p>
        </div>
        
      </div>
      <div className={classes.bookWashButtonContainer}>
        <button
          className={classes.bookWashButton}
          onClick={() => {
            setSelectedCar((prevSelectedCar) => {
              return car; // Select the car if it's not already selected
            });
            setIsBookFormOpen(true);
          }}
        >
          Book Wash
        </button>
      </div>
    </div>
  );
}
