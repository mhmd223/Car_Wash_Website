import classes from "./editaccount.module.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function EditAccForm({ onSubmit, userData, setEditMode }) {
  const [missingPassword, setMissingPassword] = useState(false);
  useEffect(() => {
    if (missingPassword) {
      const timer = setTimeout(() => {
        setMissingPassword(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [missingPassword]);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");
    const id = userData.id;

    if (!password) {
      setMissingPassword(true);
      toast.error("Enter your current password to save changes.");
      return;
    }

    await onSubmit(id, username, email, phone, password);
    setEditMode(false);
  }
  return (
    <div
      className={classes.editAccFormContainer}
      onClick={() => setEditMode(false)}
    >
      <form
        onSubmit={handleSubmit}
        className={classes.editAccForm}
        onClick={(e) => e.stopPropagation()}
      >
        <label>
          Username
          <input
            type="text"
            name="username"
            defaultValue={userData?.username ?? ""}
            autoComplete="username"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            defaultValue={userData?.email ?? ""}
            autoComplete="email"
          />
        </label>
        <label>
          Phone
          <input
            type="tel"
            name="phone"
            defaultValue={userData?.phone ?? ""}
            autoComplete="tel"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
          />
        </label>
        <button type="submit" className={classes.editAccFormButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
