// Customer car management page and car-specific booking entry point.
import classes from "./usercars.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUserCar } from "../../../services/car_services";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import { GrAdd } from "react-icons/gr";
import { FaCar } from "react-icons/fa6";
import { useUserCars } from "../../../hooks/useUserCars.js";
import { removeUserCar } from "../../../services/car_services";
import { useCategories } from "../../../hooks/useCategories";
import { useBookWash } from "../../../hooks/useBookWash";
import { useSchedule } from "../../../hooks/useSchedule";
import { toast } from "react-toastify";

import CarsList from "../../ObjectList/CarsList/CarsList";
import AddCarForm from "../../FormComponents/Forms/AddCarForm/AddCarForm.jsx";
import BookForm from "../../FormComponents/Forms/BookWashForm/BookForm.jsx";
export default function UserCars() {
  const user = useContext(UserContext).user;
  const queryClient = useQueryClient();
  const bookWashMutation = useBookWash();
  const { scheduleQuery } = useSchedule();
  const [isCarFormOpen, setIsCarFormOpen] = useState(false);
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const { data: categoryData, isError: categoriesError } = useCategories();

  useEffect(() => {
    if (categoriesError) toast.error("Could not load wash categories.");
    if (scheduleQuery.isError) {
      toast.error("Could not load the wash schedule.");
    }
  }, [categoriesError, scheduleQuery.isError]);

  const {
    status: carsStatus,
    data: carsData,
    refetch: refetchCars,
  } = useUserCars(user.id);

  const handleRetryCars = async () => {
    const result = await refetchCars();
    if (result.isError) {
      toast.error("Could not load your cars. Please try again.");
      return;
    }
    toast.success("Cars loaded successfully.");
  };
  // const {
  //   data: carsData,
  //   isFetching: carsFetching,
  //   error: carsError,
  // } = useQuery({
  //   queryFn: async () => {
  //     return await fetchUserCars(user.id);
  //   },
  //   staleTime: 5 * 60 * 1000,
  //   queryKey: ["userCars"],
  // });

  const Addmutation = useMutation({
    mutationFn: mutateAddCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCars"] });
    },
  });

  const RemoveMutation = useMutation({
    mutationFn: mutateRemoveCar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCars"] });
      toast.success("Car removed successfully.");
    },
    onError: () => {
      toast.error("Could not remove the car.");
    },
  });

  async function mutateAddCar({ License_Plate, User_Id }) {
    try {
      return await addUserCar(User_Id, License_Plate);
    } catch (error) {
      console.error("Error adding car:", error);
      throw error;
    }
  }
  async function mutateRemoveCar({ User_Id, License_Plate }) {
    try {
      return await removeUserCar(User_Id, License_Plate);
    } catch (error) {
      console.error("Error removing car:", error);
      throw error;
    }
  }

  return (
    <>
      <div className={classes.Container}>
        {carsStatus === "pending" && (
          <div className={classes.statusCard} role="status">
            <span className={classes.spinner} />
            <p>Loading your cars...</p>
          </div>
        )}
        {carsStatus === "error" && (
          <div className={classes.statusCard} role="alert">
            <p>We could not load your cars.</p>
            <button type="button" onClick={handleRetryCars}>
              Try again
            </button>
          </div>
        )}
        {carsStatus === "success" && carsData && (
          <CarsList
            setSelectedCar={setSelectedCar}
            setIsBookFormOpen={setIsBookFormOpen}
            cars={carsData}
            user={user}
            removeCar={RemoveMutation.mutateAsync}
          />
        )}
      </div>

      <button
        className={classes.BookWashButton}
        onClick={() => {
          setIsCarFormOpen(true);
        }}
        title="Add a car"
        aria-label="Add a car"
      >
        <span className={classes.ButtonIcons}>
          <GrAdd className={classes.AddIcon} size={40} />
          <FaCar className={classes.CarIcon} size={40} />
        </span>
      </button>

      {isCarFormOpen && (
        <AddCarForm
          setIsAddCarFormOpen={setIsCarFormOpen}
          mutation={Addmutation}
          userId={user.id}
        />
      )}
      {isBookFormOpen && (
        <BookForm
          setIsBookFormOpen={setIsBookFormOpen}
          mutation={bookWashMutation}
          user={user}
          categories={categoryData}
          car={selectedCar}
          schedule={scheduleQuery.data}
        />
      )}
    </>
  );
}
