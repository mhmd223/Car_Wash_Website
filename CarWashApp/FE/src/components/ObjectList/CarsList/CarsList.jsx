import classes from "./carslist.module.css";
import Car from "../../Car/Car";
export default function CarsList({
  cars,
  removeCar,
  setIsBookFormOpen,
  setSelectedCar,
}) {
  return (
    <div className={classes.listContainer}>
      {Array.isArray(cars) &&
        cars.map((car) => (
          <Car
            key={car.License_Plate}
            car={car}
            removeCar={removeCar}
            setIsBookFormOpen={setIsBookFormOpen}
            setSelectedCar={setSelectedCar}
          />
        ))}
    </div>
  );
}
