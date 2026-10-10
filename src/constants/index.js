/**
 * Centralized Constants for FreelyEmail-API
 */

const API_VERSION = "v1";
const API_PREFIX = `/api/${API_VERSION}`;

const ROUTES = Object.freeze({
  API_BASE: API_PREFIX,
  HEALTH: `${API_PREFIX}/health`,
  LEGACY_CHECK_SERVER: "/checkServer",
  EMAILS: Object.freeze({
    BASE: `${API_PREFIX}/emails`,
    SEND: "/send",
    OTP_SEND: "/otp/send",
    OTP_REQUEST: "/otp/request",
    LINK_VERIFICATION: "/verification/link",
  }),
});

const DEFAULT_CONFIG = Object.freeze({
  PORT: 3000,
  SMTP_HOST: "smtp-relay.brevo.com",
  SMTP_PORT: 587,
  DEFAULT_FROM_DOMAIN: "mail.harshit107.online",
  // Change this single line (or set DEFAULT_FROM_EMAIL in .env) anytime you want to change the sender
  DEFAULT_FROM_EMAIL: "noreply@mail.harshit107.online",
});


const SUCCESS_MESSAGES = Object.freeze({
  HEALTH: "Server is working perfectly fine.",
  EMAIL_SENT: "Email dispatched successfully",
  OTP_SENT: "OTP email dispatched successfully",
  OTP_REQUESTED: "OTP generated and dispatched successfully",
  LINK_SENT: "Verification link email dispatched successfully",
});

const ERROR_CODES = Object.freeze({
  // 400 Bad Request / Validation
  INVALID_JSON: "INVALID_JSON",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  MISSING_REQUIRED_FIELDS: "MISSING_REQUIRED_FIELDS",
  INVALID_RECIPIENT: "INVALID_RECIPIENT",
  MISSING_EMAIL_CONTENT: "MISSING_EMAIL_CONTENT",
  INVALID_OTP: "INVALID_OTP",
  INVALID_LINK: "INVALID_LINK",

  // 404 Not Found
  ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",

  // 429 Too Many Requests
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",

  // 500 Internal Server Error
  SMTP_NOT_CONFIGURED: "SMTP_NOT_CONFIGURED",
  EMAIL_SEND_FAILED: "EMAIL_SEND_FAILED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
});

const ERROR_MESSAGES = Object.freeze({
  [ERROR_CODES.INVALID_JSON]: "Invalid JSON payload provided",
  [ERROR_CODES.VALIDATION_ERROR]: "Validation failed for request data",
  [ERROR_CODES.MISSING_REQUIRED_FIELDS]: "Required fields are missing in request",
  [ERROR_CODES.INVALID_RECIPIENT]: "A valid recipient email address is required",
  [ERROR_CODES.MISSING_EMAIL_CONTENT]: "Email content is required (either message or HTMLfile)",
  [ERROR_CODES.INVALID_OTP]: "A valid OTP code is required",
  [ERROR_CODES.INVALID_LINK]: "A valid verification link is required",
  [ERROR_CODES.ROUTE_NOT_FOUND]: "The requested route does not exist",
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: "Too many requests from this IP, please try again after 15 minutes",
  [ERROR_CODES.SMTP_NOT_CONFIGURED]: "Brevo SMTP credentials are not configured in environment variables.",
  [ERROR_CODES.EMAIL_SEND_FAILED]: "Failed to send email",
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "Internal Server Error",
});


module.exports = {
  API_VERSION,
  API_PREFIX,
  ROUTES,
  DEFAULT_CONFIG,
  SUCCESS_MESSAGES,
  ERROR_CODES,
  ERROR_MESSAGES,
};
