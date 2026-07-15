import { Outlet, Navigate, useLocation } from "react-router-dom";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";

import classes from "./General.module.css";
// import videoBg from "../../../assets/videos/dododo.mp4";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";

export default function GeneralLayout({
  user,
  setUser,
  isLoggedIn,
  setIsLoggedIn,
  axios,
  fetchUserCars,
}) {
  const location = useLocation();
  const hideHeader = location.pathname === "/account";
  return (
    <>
      {isLoggedIn && !hideHeader && <Header username={user.username} />}

      <main>
        <UserContext.Provider
          value={{
            setIsLoggedIn,
            isLoggedIn,
            user,
            setUser,
            axios,
            fetchUserCars,
          }}
        >
          {!isLoggedIn && <Navigate to={"/login"} />}

          {!isLoggedIn && (
            <video className={classes.video} src={""} autoPlay loop muted />
          )}
          <div className={isLoggedIn ? classes.outlet : classes.outletAbsolute}>
            <Outlet />
          </div>
        </UserContext.Provider>
      </main>
      {isLoggedIn && <Footer />}
    </>
  );
}
