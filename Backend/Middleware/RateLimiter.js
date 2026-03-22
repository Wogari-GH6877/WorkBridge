import rateLimit from "express-rate-limit";

export const signupLimiter = rateLimit({
  windowMs: 15*60 * 1000,
  max: 10,
  statusCode: 429,
  message: {
    success: false,
    message: "Too many requests"
  }
});

export const loginLimiter = rateLimit({
  windowMs: 10*60 * 1000, // 15 minutes
  max: 5, // only 5 attempts allowed
  statusCode: 429,
  message: {
    success: false,
    message: "Too many login attempts. Try again after 15 minutes"
  }
});