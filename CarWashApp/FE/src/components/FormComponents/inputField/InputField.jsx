//import regular expressions for text formatting
import { useState } from "react";
import classes from "./input.module.css";

export default function InputField({
  id,
  type,
  label,
  name,
  key,
  placeHolder,
  textFormat,
  errorMessage,
  isError,
  setIsError,
  setText,
}) {
  return (
    <div className={classes.inputField}>
      <label htmlFor={id}>{label}</label>

      <input
        onBlur={setText ? handleTextChange : undefined}
        id={id}
        name={name}
        type={type}
        key={key}
        placeholder={placeHolder}
      />

      {isError && <span className={classes.error}>{errorMessage}</span>}
    </div>
  );

  function handleTextChange(event) {
    const value = event.target.value;
    setText(value);
    validateInput(value);
  }

  function validateInput(value) {
    setIsError(value && textFormat && !textFormat.test(value));
  }
}
