import { Outlet, Navigate } from "react-router-dom";
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
  fetchUserData,
  axios,
}) {
  return (
    <>
      {isLoggedIn && <Header username={user.username} />}

      <main>
        <UserContext.Provider
          value={{
            setIsLoggedIn,
            isLoggedIn,
            user,
            setUser,
            axios,
            fetchUserData,
          }}
        >
          {!isLoggedIn ? <Navigate to={"/login"} /> : <Navigate to={"/"} />}

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
