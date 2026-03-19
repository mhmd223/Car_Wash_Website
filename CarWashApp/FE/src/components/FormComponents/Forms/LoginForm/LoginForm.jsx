import classes from "./form.module.css";
import { isValidElement, cloneElement, Children, useState } from "react";
import Button from "../../Button/Button.jsx";
import axios from "axios";

export default function LoginForm({
  emailOrPhone,
  password,
  setIsLoggedIn,
  setUser,
  fetchUserData,
  children,
}) {
  const [isError, setIsError] = useState(false);

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { isError, setIsError });
    }
    return child;
  });

  async function handleSubmit(event) {
    event.preventDefault();
   

    if (!emailOrPhone || !password) {
      console.error("Email/Phone and password are required");
      setIsError(true);
      return;
    }
    const response = await axios.post(
      "http://localhost:5173/account/login",
      {
        email: emailOrPhone,
        password,
      },
      {
        withCredentials: true,
      },
    );

    if (response.data.loggedIn) {
      console.log("Login successful:", response.data);
      setIsLoggedIn(true);
      setUser(response.data.user);
      await fetchUserData(response.data.user.id);
    }
  }
  return (
    <form action="GET" className={classes.form} onSubmit={handleSubmit}>
      {childrenWithProps}

      <Button text="Login" type="submit" />
    </form>
  );
}
