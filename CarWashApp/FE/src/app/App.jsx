// functional component
// Rules:
// 1. the name MUST start with big letter (PascalCase)
// 2. MUST return JSX

import "./app.css";
import Login from "../components/Pages/login/Login";
import GeneralLayout from "../components/Layouts/General/GeneralLayout";
import socket from "../Socket/socket";
import { useEffect } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import axios from "axios";
import { useUserInfo } from "../hooks/useAccountStats";
import { useQueryClient } from "@tanstack/react-query";

import Home from "../components/Pages/home/Home";
import CarWashes from "../components/Pages/userWashes/CarWashes";
import UserCars from "../components/Pages/userCars/UserCars";
import Account from "../components/Pages/account/Account";
import EmployeeDashboard from "../components/Pages/employee/EmployeeDashboard";

export default function App() {
  const { data: [userInfo, isLoggedIn] = [], status: userInfoStatus } =
    useUserInfo();

  const queryClient = useQueryClient();

  // sync socket auth whenever the query-derived user changes
  const setUser = (data) =>
    queryClient.setQueryData(["userInfo"], data ? [data, true] : null);

  const setIsLoggedIn = (val) => {
    if (!val) queryClient.setQueryData(["userInfo"], null);
  };

  useEffect(() => {
    if (userInfo) {
      socket.auth = { userId: userInfo.id, role: userInfo.role };
      socket.connect();
      return () => {
        socket.disconnect();
      };
    }
  }, [userInfo]);

  if (userInfoStatus === "pending") return null;

  return (
    <Router>
      <Routes>
        <Route
          element={
            <GeneralLayout
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              user={userInfo}
              setUser={setUser}
              axios={axios}
              socket={socket}
            />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login queryClient={queryClient} />} />
          <Route path="/washes" element={<CarWashes />} />
          <Route path="/cars" element={<UserCars />} />
          <Route
            path="/account"
            element={<Account queryClient={queryClient} />}
          />
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
