// Customer wash history page with live status updates and booking entry point.
import { useContext, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import useSocket from "../../../Socket/useSocket";
import { WASH_EVENTS } from "../../../../../shared/events";
import { useCategories } from "../../../hooks/useCategories";
import { useUserWashes } from "../../../hooks/useUserWashes";
import { useUserCars } from "../../../hooks/useUserCars";
import classes from "./carwashes.module.css";
import WashesList from "../../ObjectList/WashesList/WashesList.jsx";
import BookForm from "../../FormComponents/Forms/BookWashForm/BookForm.jsx";
import { useSchedule } from "../../../hooks/useSchedule.js";
export default function CarWashes() {
  const { user, socket } = useContext(UserContext);
  const queryClient = useQueryClient();
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);

  const {
    status: washStatus,
    data: washesData,
    refetch: refetchWashes,
  } = useUserWashes(user.id, {
    retry: false,
  });

  const { data: categoryData } = useCategories();

  const { data: carsData } = useUserCars(user.id);

  const { scheduleQuery } = useSchedule();

  useSocket(socket, WASH_EVENTS.WASH_STATUS_UPDATED, ({ washId, status }) => {
    queryClient.setQueryData(["userWashes", user.id], (oldData) => {
      console.log("Received WASH_STATUS_UPDATED event:", {
        washId,
        status,
        user,
      });
      if (!oldData) {
        console.warn("No old data found for user washes.");
        return [];
      }
      return oldData.map((wash) =>
        wash.ID === washId ? { ...wash, Wash_Status: status } : wash,
      );
    });
  });

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
            <button type="button" onClick={() => refetchWashes()}>
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
          cars={carsData}
          schedule={scheduleQuery.data}
        />
      )}
    </>
  );
}
