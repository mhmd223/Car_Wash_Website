import { useContext, useState } from "react";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import { useCategories } from "../../../hooks/useCategories";
import { useUserWashes } from "../../../hooks/useUserWashes";
import { useUserCars } from "../../../hooks/useUserCars";
import classes from "./carwashes.module.css";
import WashesList from "../../ObjectList/WashesList/WashesList.jsx";
import BookForm from "../../FormComponents/Forms/BookWashForm/BookForm.jsx";

export default function CarWashes() {
  const { user } = useContext(UserContext);
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);

  const {
    status: washStatus,
    error: washError,
    data: washesData,
  } = useUserWashes(user.id);

  const { data: categoryData } = useCategories();

  const { data: carsData } = useUserCars(user.id);

  return (
    <>
      <div className={classes.Container}>
        {washStatus === "pending" && <p>Loading...</p>}
        {washStatus === "error" && <p>Error: {washError.message}</p>}
        {washStatus === "success" && <WashesList objects={washesData} />}
      </div>

      <button
        className={classes.BookWashButton}
        onClick={() => setIsBookFormOpen(true)}
      >
        Book Wash
      </button>

      {isBookFormOpen && (
        <BookForm
          user={user}
          setIsBookFormOpen={setIsBookFormOpen}
          categories={categoryData}
          cars={carsData}
        />
      )}
    </>
  );
}
