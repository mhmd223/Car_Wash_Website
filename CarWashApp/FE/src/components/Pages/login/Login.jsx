import { useContext, useState } from "react";
import InputField from "../../FormComponents/inputField/InputField";
import classes from "./login.module.css";
import LoginForm from "../../FormComponents/Forms/LoginForm/LoginForm.jsx";
export default function Login({
  setIsLoggedIn,
  setUser,
  fetchUserData,
  axios,
}) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className={classes.Container}>
      <h2>Login</h2>
      <LoginForm
         emailOrPhone={emailOrPhone}
         password={password}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
        fetchUserData={fetchUserData}
        axios={axios}
      >
        <InputField
          {...{
            id: "email or phone",
            name: "emailOrPhone",
            type: "text",
            label: "Email or Phone",
            placeHolder: "Enter your email or phone",
            textFormat:
              /^[^\s@]+@[^\s@]+\.[^\s@]+$|^((\+\d{3})?[\s]?(\d{3}[\s-]?){2}(\d{4}))$/,
            errorMessage: "Please enter a valid email or phone number",
            setText: setEmailOrPhone,
          }}
        />
        <InputField
          {...{
            id: "password",
            name: "password",
            type: "password",
            label: "Password",
            placeHolder: "Enter your password",
            setText: setPassword,
          }}
        />
      </LoginForm>
    </div>
  );
}
