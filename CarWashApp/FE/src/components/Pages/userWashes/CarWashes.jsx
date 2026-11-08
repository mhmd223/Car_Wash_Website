// Customer wash history page with live status updates and booking entry point.
import { useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import useSocket from "../../../Socket/useSocket";
import { WASH_EVENTS } from "../../../../../shared/events";
import { useCategories } from "../../../hooks/useCategories";
import { useVehicleTypes } from "../../../hooks/useVehicleTypes";
import { useUserWashes } from "../../../hooks/useUserWashes";
import { useUserCars } from "../../../hooks/useUserCars";
import classes from "./carwashes.module.css";
import WashesList from "../../ObjectList/WashesList/WashesList.jsx";
import BookForm from "../../FormComponents/Forms/BookWashForm/BookForm.jsx";
import { useSchedule } from "../../../hooks/useSchedule.js";
import { toast } from "react-toastify";
export default function CarWashes() {
  const { user, socket } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const userId = user?.id;

  const {
    status: washStatus,
    data: washesData,
    refetch: refetchWashes,
  } = useUserWashes(userId, { enabled: Boolean(userId), retry: false });

  const { data: categoryData, isError: categoriesError } = useCategories();
  const { data: vehicleTypesData } = useVehicleTypes();

  const { data: carsData } = useUserCars(userId, {
    enabled: Boolean(userId),
  });

  const { scheduleQuery } = useSchedule();

  useEffect(() => {
    if (categoriesError) toast.error("Could not load wash categories.");
    if (scheduleQuery.isError) {
      toast.error("Could not load the wash schedule.");
    }
  }, [categoriesError, scheduleQuery.isError]);

  useSocket(socket, WASH_EVENTS.WASH_STATUS_UPDATED, ({ washId, status }) => {
    if (!userId) return;

    queryClient.setQueryData(["userWashes", userId], (oldData) => {
      if (!oldData) {
        console.warn("No old data found for user washes.");
        return [];
      }
      return oldData.map((wash) =>
        wash.ID === washId ? { ...wash, Wash_Status: status } : wash,
      );
    });
  });

  useSocket(socket, WASH_EVENTS.CATEGORY_UPDATED, ({ id, name, price }) => {
    queryClient.setQueryData(["categories"], (oldData) => {
      const updatedCategory = { ID: id, Name: name, Price: price };
      const categoryExists = oldData.some((category) => category.ID === id);
      if (!oldData) return [];
      if (!categoryExists) return [...oldData, updatedCategory];
      return oldData.map((category) =>
        category.ID === id ? { ...category, ...updatedCategory } : category,
      );
    });
  });

  const handleRetryWashes = async () => {
    const result = await refetchWashes();
    if (result.isError) {
      toast.error("Could not load your washes. Please try again.");
      return;
    }
    toast.success("Washes loaded successfully.");
  };

  return (
    <>
      <div className={classes.Container}>
        {washStatus === "pending" && (
          <div className={classes.statusCard} role="status">
            <span className={classes.spinner} />
            <p>Loading your washes...</p>
          </div>
        )}
        {washStatus === "error" && (
          <div className={classes.statusCard} role="alert">
            <p>We could not load your washes.</p>
            <button type="button" onClick={handleRetryWashes}>
              Try again
            </button>
          </div>
        )}
        {washStatus === "success" && <WashesList objects={washesData} />}
      </div>

      <button
        className={classes.BookWashButton}
        onClick={() => setIsBookFormOpen(true)}
        title="Book a wash"
        aria-label="Book a wash"
      >
        Book Wash
      </button>

      {isBookFormOpen && (
        <BookForm
          user={user}
          setIsBookFormOpen={setIsBookFormOpen}
          categories={categoryData}
          vehicleTypes={vehicleTypesData}
          cars={carsData}
          schedule={scheduleQuery.data}
        />
      )}
    </>
  );
}
