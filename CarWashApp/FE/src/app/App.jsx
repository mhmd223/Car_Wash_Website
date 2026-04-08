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
import Home from "../components/Pages/home/Home";
import CarWashes from "../components/Pages/userWashes/CarWashes";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route
          element={
            <GeneralLayout
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              user={user}
              setUser={setUser}
              axios={axios}
            />
          }
        >
          
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/washes" element={<CarWashes />} />
        </Route>
      </Routes>
    </Router>
  );
}
