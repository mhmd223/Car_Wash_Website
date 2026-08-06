// functional component
// Rules:
// 1. the name MUST start with big letter (PascalCase)
// 2. MUST return JSX

import "./app.css";
import Login from "../components/Pages/login/Login";
import GeneralLayout from "../components/Layouts/General/GeneralLayout";

import { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import axios from "axios";
import { getUserCars } from "../services/car_services";
import { useUserInfo } from "../hooks/useAccountStats";
import Home from "../components/Pages/home/Home";
import CarWashes from "../components/Pages/userWashes/CarWashes";
import UserCars from "../components/Pages/userCars/UserCars";
import Account from "../components/Pages/account/Account";
import EmployeeDashboard from "../components/Pages/employee/EmployeeDashboard";
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userCars, setUserCars] = useState([]);

  const {
    data: userInfo,
    status: userInfoStatus,
    error: userInfoError,
  } = useUserInfo(user?.id);

  const fetchUserCars = async (user_id) => {
    const data = await getUserCars(user_id);
    setUserCars(data);
    return data;
  };

  return (
    <Router>
      <Routes>
        <Route
          element={
            <GeneralLayout
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              user={userInfo ?? user}
              setUser={setUser}
              axios={axios}
              fetchUserCars={fetchUserCars}
            />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/washes" element={<CarWashes />} />
          <Route path="/cars" element={<UserCars />} />
          <Route path="/account" element={<Account />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
