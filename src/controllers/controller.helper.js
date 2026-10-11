const { APIError } = require("../middlewares/error");
const { validateEmailRequest } = require("../utils/validator");
const { ERROR_CODES } = require("../constants");

/**
 * Helper to validate base email request and throw 400 if invalid
 */
const ensureValidBaseRequest = (body) => {
  const errors = validateEmailRequest(body);
  if (errors.length > 0) {
    throw new APIError(errors.join(", "), 400, ERROR_CODES.VALIDATION_ERROR, { validationErrors: errors });
  }
};

module.exports = {
  ensureValidBaseRequest,
};
