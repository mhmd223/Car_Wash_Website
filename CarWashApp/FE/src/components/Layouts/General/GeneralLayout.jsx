// Authenticated shell: navigation chrome, user context, and login redirect.
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import { roles } from "../../../../../BE/data/roles";
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
  socket,
}) {
  const location = useLocation();
  const hideHeader = location.pathname === "/account";
  const isLoginPage = location.pathname === "/login";
  const shouldRenderOutlet = isLoggedIn || isLoginPage;
  return (
    <>
      {isLoggedIn && !hideHeader && <Header username={user?.username} />}

      <main>
        <UserContext.Provider
          value={{
            setIsLoggedIn,
            isLoggedIn,
            user,
            setUser,
            axios,
            fetchUserCars,
            socket,
          }}
        >
          {!isLoggedIn && !isLoginPage && <Navigate to="/login" replace />}

          {!isLoggedIn && !isLoginPage && (
            <video className={classes.video} src={""} autoPlay loop muted />
          )}
          {shouldRenderOutlet && (
            <div
              className={isLoggedIn ? classes.outlet : classes.outletAbsolute}
            >
              <Outlet />
            </div>
          )}
        </UserContext.Provider>
      </main>
      {isLoggedIn &&
        user.role.toLowerCase() === roles.CUSTOMER.toLowerCase() && (
          <Footer user={user} />
        )}
    </>
  );
}
