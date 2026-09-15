//import regular expressions for text formatting
import classes from "./input.module.css";

function getHourlyTimeSlots(schedule) {
  if (!Array.isArray(schedule)) return [];

  const timeSlots = new Set();

  schedule.forEach(({ OpenTime, CloseTime }) => {
    if (!OpenTime || !CloseTime) return;

    const [openHour, openMinute] = String(OpenTime).split(":").map(Number);
    const [closeHour, closeMinute] = String(CloseTime).split(":").map(Number);
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;

    for (let minutes = openMinutes; minutes < closeMinutes; minutes += 60) {
      const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
      const minute = String(minutes % 60).padStart(2, "0");
      timeSlots.add(`${hour}:${minute}`);
    }
  });

  return [...timeSlots].sort();
}

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
  schedule,
}) {
  const isTimeInput = type?.toLowerCase() === "time";
  const timeSlots = isTimeInput ? getHourlyTimeSlots(schedule) : [];

  return (
    <div className={classes.inputField}>
      <label htmlFor={id}>{label}</label>
      {isTimeInput && timeSlots.length > 0 && (
        <datalist id="schedule">
          {timeSlots.map((time) => (
            <option key={time} value={time} />
          ))}
        </datalist>
      )}
      <input
        onBlur={setText ? handleTextChange : undefined}
        data-schedule={timeSlots.join(",")}
        id={id}
        name={name}
        type={type}
        key={key}
        placeholder={placeHolder}
        list={isTimeInput && timeSlots.length > 0 ? "schedule" : undefined}
        step={isTimeInput ? 3600 : undefined}
        disabled={isTimeInput && timeSlots.length === 0}
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
