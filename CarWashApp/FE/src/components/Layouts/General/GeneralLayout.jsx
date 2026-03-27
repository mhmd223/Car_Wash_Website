import { Outlet, Navigate } from "react-router-dom";
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
  headerComponent,
  footerComponent,
}) {
  return (
    <UserContext.Provider
      value={{ setIsLoggedIn, isLoggedIn, user, setUser, axios, fetchUserData }}
    >
      
      {!isLoggedIn && (
        <video className={classes.video} src={""} autoPlay loop muted />
      )}
      <div className={classes.outlet}>
        <Outlet />
      </div>
    </UserContext.Provider>
  );
}
