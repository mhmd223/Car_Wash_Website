// functional component
// Rules:
// 1. the name MUST start with big letter (PascalCase)
// 2. MUST return JSX

import "./app.css";
import Login from "../components/Pages/login/Login";
import { useState, createContext } from "react";
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
      <h1>Car Wash App</h1>

      <Login
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
        fetchUserData={fetchUserData}
        axios={axios}
      />
    </div>
  );
}
