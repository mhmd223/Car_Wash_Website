import classes from "./form.module.css";
import {
  isValidElement,
  cloneElement,
  Children,
  useState,
  useEffect,
} from "react";
import Button from "../../Button/Button.jsx";
import * as accountOperations from "../../../../services/account_services.js";
import { ToastContainer, toast } from "react-toastify";

export default function LoginForm({
  isRegistering,
  setIsRegistering,
  setSuccessFullyRegistered,
  username,
  emailOrPhone,
  phone,
  password,
  confirmPassword,
  setIsLoggedIn,
  setUser,
  buttonClass,
  children,
}) {
  const [isError, setIsError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [emailOrPhoneError, setEmailOrPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  useEffect(() => {
    if (isRegistering && isError) {
      toast.error("Please fix the errors in the form before submitting.");
      toggleAllErrorsOff();
    }
  }, [isError]);

  const checkIfPasswordsMatch = () => {
    setConfirmPasswordError(
      isRegistering &&
        (Boolean(confirmPassword.length) || Boolean(password.length)) &&
        confirmPassword !== password,
    );
  };

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      if (child.props.id === "username") {
        return cloneElement(child, {
          isError: usernameError,
          setIsError: setUsernameError,
        });
      } else if (child.props.id === "email or phone") {
        return cloneElement(child, {
          isError: emailOrPhoneError,
          setIsError: setEmailOrPhoneError,
        });
      } else if (child.props.id === "password") {
        return cloneElement(child, {
          isError: passwordError,
          setIsError: setPasswordError,
        });
      } else if (child.props.id === "confirm password") {
        return cloneElement(child, {
          isError: confirmPasswordError,
          setIsError: checkIfPasswordsMatch,
        });
      } else if (child.props.id === "phone") {
        return cloneElement(child, {
          isError: phoneError,
          setIsError: setPhoneError,
        });
      }

      return undefined;
    }
    return child;
  });

  const checkFormErrors = () => {
    setIsError(
      isRegistering
        ? !emailOrPhone ||
            emailOrPhoneError ||
            !password ||
            passwordError ||
            confirmPassword !== password ||
            !phone ||
            phoneError ||
            !username ||
            usernameError
        : !emailOrPhone || !password,
    );
  };

  const toggleAllErrorsOff = () => {
    setUsernameError(false);
    setEmailOrPhoneError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
    setPhoneError(false);
    setIsError(false);
  };

  const handleSubmit = isRegistering
    ? async (event) => {
        event.preventDefault();
        checkFormErrors();
        if (isError) {
          toast.error("Please fix the errors in the form before submitting.");
          toggleAllErrorsOff();
          return;
        }
        const response = await accountOperations.register(
          username,
          emailOrPhone,
          phone,
          password,
          confirmPassword,
        );
        if (response) {
          setSuccessFullyRegistered(true);
          setIsRegistering(false);
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }
    : async (event) => {
        event.preventDefault();

        checkFormErrors();
        const response = await accountOperations.login(emailOrPhone, password);

        if (response.loggedIn) {
          setIsLoggedIn(true);
          setUser(response.user);
          fetchUserCars(response.user.id);
          console.log(response.user);
        }
      };

  return (
    <>
      <form action="GET" className={classes.form} onSubmit={handleSubmit}>
        {childrenWithProps}

        <Button
          classN={buttonClass}
          text={isRegistering ? "Register" : "Login"}
          type="submit"
        />
        <ToastContainer />
      </form>
    </>
  );
}
