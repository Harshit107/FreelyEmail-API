const { ERROR_CODES } = require("../constants");
const { ensureValidBaseRequest } = require("../utils/validator");

/**
 * Reusable controller validation for recipient email.
 * If invalid, sends a 400 response and returns false.
 *
 * @param {string} recipient
 * @param {import("express").Response} res
 * @returns {boolean} true if valid, false if invalid
 */
const validateRecipient = (recipient, res) => {
  if (!recipient || typeof recipient !== "string" || !recipient.trim()) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        errorCode: ERROR_CODES.INVALID_RECIPIENT || "INVALID_RECIPIENT",
        message: "Recipient email is required",
      },
    });
    return false;
  }
  return true;
};

/**
 * Reusable controller validation for verification link.
 * If invalid, sends a 400 response and returns false.
 *
 * @param {string} link
 * @param {import("express").Response} res
 * @returns {boolean} true if valid, false if invalid
 */
const validateLink = (link, res) => {
  if (!link || typeof link !== "string" || !link.trim()) {
    res.status(400).json({
      success: false,
      data: null,
      error: {
        errorCode: ERROR_CODES.INVALID_LINK || "INVALID_LINK",
        message: "Verification link is required",
      },
    });
    return false;
  }
  return true;
};

module.exports = {
  validateRecipient,
  validateLink,
  ensureValidBaseRequest,
};
