//import regular expressions for text formatting
import { useState } from "react";
import classes from "./input.module.css";

export default function InputField({
  id,
  type,
  label,
  placeHolder,
  textFormat,
  errorMessage,
}) {
  const [isError, setIsError] = useState(false);

  return (
    <div className={classes.inputField}>
      <label htmlFor={id}>{label}</label>
      <input
        onChange={handleTextChange}
        id={id}
        type={type}
        placeholder={placeHolder}
      />
      {isError && <span className={classes.error}>{errorMessage}</span>}
    </div>
  );

  function handleTextChange(event) {
    const value = event.target.value;
    validateInput(value);
  }

  function validateInput(value) {
    setIsError(value && !textFormat.test(value));
  }
}
