// Rate-limit policies shared by the Express application routes.
import rateLimit from "express-rate-limit";

const defaultOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: "draft-8",
  retryAfter: 60, //cooldown period: Retry after 60 seconds
  legacyHeaders: false,
};

export const globalLimiter = rateLimit({
  ...defaultOptions,
  limit: 300,
});

export const loginLimiter = rateLimit({
  ...defaultOptions,
  limit: 10,

  message: { code: "LOGIN_RATE_LIMITED", status: "Too many login attempts" },
});

export const verificationLimiter = rateLimit({
  ...defaultOptions,
  limit: 10,
  message: {
    code: "VERIFICATION_RATE_LIMITED",
    status: "Too many verification attempts",
  },
});
