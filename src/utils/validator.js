const isValidEmail = (email) => {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const validateData = (data) => {
  if (data === undefined || data === null) return false;
  if (typeof data === "string") return data.trim().length > 0;
  return true;
};

const validateEmailRequest = (body = {}) => {
  const errors = [];
  const sender = body.sender;
  const recipient = body.recipient || body.to;
  const app = body.app || body.appName;
  const subject = body.subject;

  if (!isNonEmptyString(sender)) {
    errors.push("Sender is required");
  }

  if (!isValidEmail(recipient)) {
    errors.push("A valid recipient email address is required");
  }

  if (!isNonEmptyString(app)) {
    errors.push("App name is required");
  }

  if (!isNonEmptyString(subject)) {
    errors.push("Subject is required");
  }

  return errors;
};

const { APIError } = require("../middlewares/error");
const { ERROR_CODES } = require("../constants");

/**
 * Validates base email request payload and throws APIError if invalid
 */
const ensureValidBaseRequest = (body) => {
  const errors = validateEmailRequest(body);
  if (errors.length > 0) {
    throw new APIError(errors.join(", "), 400, ERROR_CODES.VALIDATION_ERROR, { validationErrors: errors });
  }
};

module.exports = {
  isValidEmail,
  isNonEmptyString,
  validateData,
  validateEmailRequest,
  ensureValidBaseRequest,
};
