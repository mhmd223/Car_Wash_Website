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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userWashes, setUserWashes] = useState(null);

  async function fetchUserData(userId) {
    try {
      const response = await axios.get(
        `http://localhost:5173/wash/user_washes/${userId}`,
        {
          withCredentials: true,
        },
      );

      setUserWashes(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }

  return (
    <div className="Container">
      <main>
        <Router>
          <Routes>
            <Route
              element={
                <GeneralLayout
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  fetchUserData={fetchUserData}
                  user={user}
                  setUser={setUser}
                  axios={axios}
                />
              }
            >
              <Route index element={<Login />} />
            </Route>
          </Routes>
        </Router>
      </main>
    </div>
  );
}
