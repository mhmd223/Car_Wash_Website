import InputField from "../../FormComponents/inputField/InputField";
import classes from "./login.module.css";
export default function Login({ setIsLoggedIn, setUser }) {
  return (
    <div className={classes.Container}>
      <InputField 
       {...{
        id:"email or phone",
        type:"text",
        label:"Email or Phone",
        placeHolder:"Enter your email or phone",
        textFormat:/^[^\s@]+@[^\s@]+\.[^\s@]+$|^((\+\d{3})?[\s]?(\d{3}[\s-]?){2}(\d{4}))$/,
        errorMessage:"Please enter a valid email or phone number"

       }}
      />
      <InputField />
    </div>
  );
}
