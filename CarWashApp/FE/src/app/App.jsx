// functional component
// Rules:
// 1. the name MUST start with big letter (PascalCase)
// 2. MUST return JSX

import "./app.css";
import Login from "../components/Pages/login/Login";
import GeneralLayout from "../components/Layouts/General/GeneralLayout";
import socket from "../Socket/socket";
import { useState, useEffect } from "react";

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
  // const [userCars, setUserCars] = useState([]);
  useEffect(() => {
    if (user) {
      console.log("User is logged in:", user);
      socket.auth = { userId: user.id, role: user.role };

      socket.connect();

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  const {
    data: userInfo,
    status: userInfoStatus,
    error: userInfoError,
  } = useUserInfo(user?.id, {
    enabled: !!user?.id, // Only fetch if user.id is available

    retry: false, // Disable automatic retries
  });

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
              socket={socket}
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
