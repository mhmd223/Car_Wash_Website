import { useContext } from "react";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getUserCars } from "../../../services/car_services";
import { useCategories } from "../../../hooks/useCategories";
import { useBookWash } from "../../../hooks/useBookWash";
import classes from "./carwashes.module.css";
import WashesList from "../../ObjectList/WashesList/WashesList.jsx";
import BookForm from "../../FormComponents/Forms/BookWashForm/BookForm.jsx";
import { useState } from "react";
export default function CarWashes() {
  const user = useContext(UserContext).user;
  const bookWashText = "Book Wash";
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const mutation = useBookWash();

  const {
    status: washStatus,
    error: washError,
    isFetching: washIsFetching,
    data: washesData,
  } = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["userWashes"],

    queryFn: async () => {
      return await fetchUserData(user.id);
    },
  });
  const {
    status: categoryStatus,
    error: categoryError,
    data: categoryData,
  } = useCategories();
  const {
    status: carStatus,
    error: carError,
    data: carsData,
  } = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["userCars"],
    queryFn: async () => {
      return await fetchUserCars(user.id);
    },
  });

  async function fetchUserData(userId) {
    try {
      const response = await axios.get(
        "http://localhost:5173/wash/user_washes" + `/${userId}`,

        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }

  async function fetchUserCars(userId) {
    try {
      return await getUserCars(userId);
    } catch (err) {
      console.error("Error fetching user cars:", err);
    }
  }

  return (
    <>
      <div className={classes.Container}>
        {washStatus === "loading" && <p>Loading...</p>}
        {washStatus === "error" && <p>Error: {washError.message}</p>}
        {washStatus === "success" && <WashesList objects={washesData} />}
      </div>

      <button
        className={classes.BookWashButton}
        onClick={() => setIsBookFormOpen(true)}
      >
        {bookWashText}
      </button>

      {isBookFormOpen && (
        <BookForm
          user={user}
          mutation={mutation}
          setIsBookFormOpen={setIsBookFormOpen}
          categories={categoryData}
          cars={carsData}
        />
      )}
    </>
  );
}
