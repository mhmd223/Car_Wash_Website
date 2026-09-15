import { useState } from "react";
import { toast } from "react-toastify";
import {
  resendVerification,
  verifyEmail,
} from "../../../services/account_services.js";
import classes from "./login.module.css";

export default function VerificationPage({ email, onVerified }) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      toast.error("Enter the six-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyEmail(email, code);
      toast.success("Email verified. You can now log in.");
      onVerified();
    } catch (error) {
      toast.error(
        error.response?.data?.status || "That code is invalid or expired.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification(email);
      toast.success("A new verification code was sent.");
    } catch (error) {
      toast.error(error.response?.data?.status || "Could not resend the code.");
    }
  };

  return (
    <div className={classes.Container}>
      <h2>Verify your email</h2>
      <p>Enter the six-digit code sent to {email}.</p>
      <form className={classes.form} onSubmit={handleSubmit}>
        <label htmlFor="verification-code">Verification code</label>
        <input
          id="verification-code"
          value={code}
          onChange={(event) =>
            setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
          }
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify email"}
        </button>
        <button type="button" onClick={handleResend} disabled={isSubmitting}>
          Resend code
        </button>
      </form>
    </div>
  );
}
