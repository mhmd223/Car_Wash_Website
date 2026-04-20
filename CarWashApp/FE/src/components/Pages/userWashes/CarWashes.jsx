import { useContext } from "react";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import classes from "./carwashes.module.css";
import ObjectList from "../../ObjectList/ObjectList.jsx";
import BookForm from "../../FormComponents/Forms/BookWashForm/BookForm.jsx";
import { useState } from "react";
export default function CarWashes() {
  const user = useContext(UserContext).user;
  const bookWashText = "Book Wash";
  const [isBookFormOpen, setIsBookFormOpen] = useState(false);

  console.log(isBookFormOpen);

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
  } = useQuery({
    staleTime: 5 * 60 * 1000,
    queryKey: ["categories"],
    queryFn: async () => {
      return await fetchCategoriesData();
    },
  });
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

  const mutation = useMutation({});

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

  async function mutateWashBooking(bookingData) {
    try {
    } catch (err) {}
  }
  async function bookWash(
    Car_Plate,
    Cust_Phone,
    Wash_Date,
    Category_ID,
  ) {}
  async function fetchUserCars(userId) {
    try {
      const response = await axios.get(
        "http://localhost:5173/car" + `/${userId}`,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching user cars:", err);
    }
  }

  async function fetchCategoriesData() {
    try {
      console.log("Fetching categories data...");
      const response = await axios.get(
        "http://localhost:5173/category/get_categories",
        {
          withCredentials: true,
        },
      );

      return response.data;
    } catch (err) {
      console.error("Error fetching category data:", err);
    }
  }

  return (
    <>
      <div className={classes.Container}>
        {washStatus === "loading" && <p>Loading...</p>}
        {washStatus === "error" && <p>Error: {washError.message}</p>}
        {washStatus === "success" && <ObjectList objects={washesData} />}
      </div>

      <button
        className={classes.BookWashButton}
        onClick={() => {
          console.log("gdfgd");

          setIsBookFormOpen(true);
        }}
      >
        {bookWashText.split("").map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </button>
      {isBookFormOpen && (
        <BookForm user={user} categories={categoryData} cars={carsData} />
      )}
    </>
  );
}
