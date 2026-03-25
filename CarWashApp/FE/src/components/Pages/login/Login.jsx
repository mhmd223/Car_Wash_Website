import * as regexPatterns from "../../../data/regex/regex";
import { useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../../ContextComponents/UserContext/UserContext";
import InputField from "../../FormComponents/inputField/InputField";
import classes from "./login.module.css";
import LoginForm from "../../FormComponents/Forms/LoginForm/LoginForm.jsx";

export default function Login() {
  const axios = useContext(UserContext).axios;
  const setIsLoggedIn = useContext(UserContext).setIsLoggedIn;
  const setUser = useContext(UserContext).setUser;
  const fetchUserData = useContext(UserContext).fetchUserData;
  const buttonClass = classes.Button;

  const [isRegistering, setIsRegistering] = useState(false);
  const [successFullyRegistered, setSuccessFullyRegistered] = useState(false);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emptyAllfields = () => {
    setUsername("");
    setPhone("");
    setEmailOrPhone("");
    setPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    console.log(successFullyRegistered);
    if (successFullyRegistered) {
      toast.success("success");
      setSuccessFullyRegistered(false);

      emptyAllfields();
    }
  }, [successFullyRegistered]);

  return (
    <div className={classes.Container}>
      <h2>{isRegistering ? "Register" : "Login"}</h2>
      <span>OR</span>
      <button
        className={buttonClass}
        onClick={() => setIsRegistering((prev) => !prev)}
      >
        {isRegistering ? "Login" : "Register"}
      </button>
      <LoginForm
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        setSuccessFullyRegistered={setSuccessFullyRegistered}
        username={isRegistering ? username : undefined}
        emailOrPhone={emailOrPhone}
        phone={isRegistering ? phone : undefined}
        password={password}
        confirmPassword={isRegistering ? confirmPassword : undefined}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
        fetchUserData={fetchUserData}
        axios={axios}
        buttonClass={buttonClass}
      >
        {isRegistering && (
          <InputField
            {...{
              id: "username",
              name: "username",
              type: "text",
              label: "Username",
              placeHolder: "Enter your username",
              textFormat: isRegistering
                ? regexPatterns.usernameRegex
                : undefined,
              errorMessage: "Please enter a valid username",
              setText: setUsername,
            }}
          />
        )}

        <InputField
          {...{
            id: "email or phone",
            name: "emailOrPhone",
            type: "text",
            label: "Email or Phone",
            placeHolder: "Enter your email or phone",
            textFormat: isRegistering ? regexPatterns.emailRegex : undefined,
            errorMessage: "Please enter a valid email or phone number",
            setText: setEmailOrPhone,
          }}
        />

        {isRegistering && (
          <InputField
            {...{
              id: "phone",
              name: "phone",
              type: "phone",
              label: "Phone",
              placeHolder: "Enter your phone number",
              textFormat: isRegistering ? regexPatterns.phoneRegex : undefined,
              errorMessage: "Please enter a valid phone number",
              setText: setPhone,
            }}
          />
        )}
        <InputField
          {...{
            id: "password",
            name: "password",
            type: "password",
            label: "Password",
            placeHolder: "Enter your password",
            textFormat: isRegistering ? regexPatterns.passwordRegex : undefined,
            errorMessage:
              "Password must be at least 8 characters and include letters and numbers",

            setText: setPassword,
          }}
        />
        {isRegistering && (
          <InputField
            {...{
              id: "confirm password",
              name: "confirmPassword",
              type: "password",
              label: "Confirm Password",
              placeHolder: "Confirm your password",
              textFormat: isRegistering
                ? regexPatterns.passwordRegex
                : undefined,
              errorMessage: "Passwords do not match",
              setText: setConfirmPassword,
            }}
          />
        )}
      </LoginForm>
    </div>
  );
}
