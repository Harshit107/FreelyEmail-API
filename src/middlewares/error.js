const { ERROR_CODES, ERROR_MESSAGES } = require("../constants");

class APIError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} [statusCode=500] - HTTP status code
   * @param {string} [errorCode=null] - Machine readable error code
   * @param {any} [details=null] - Additional contextual details
   */
  constructor(message, statusCode = 500, errorCode = null, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode =
      errorCode ||
      (statusCode === 400
        ? ERROR_CODES.VALIDATION_ERROR
        : statusCode === 404
        ? ERROR_CODES.ROUTE_NOT_FOUND
        : statusCode === 429
        ? ERROR_CODES.RATE_LIMIT_EXCEEDED
        : ERROR_CODES.INTERNAL_SERVER_ERROR);
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  // Handle malformed JSON body errors from express.json()
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        errorCode: ERROR_CODES.INVALID_JSON,
        message: ERROR_MESSAGES[ERROR_CODES.INVALID_JSON],
      },
    });
  }

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      data: null,
      error: {
        errorCode: ERROR_CODES.VALIDATION_ERROR,
        message: messages.join(", "),
        details: err.errors,
      },
    });
  }

  const statusCode = err.statusCode || 500;
  const errorCode =
    err.errorCode ||
    (statusCode === 400
      ? ERROR_CODES.VALIDATION_ERROR
      : statusCode === 404
      ? ERROR_CODES.ROUTE_NOT_FOUND
      : statusCode === 429
      ? ERROR_CODES.RATE_LIMIT_EXCEEDED
      : ERROR_CODES.INTERNAL_SERVER_ERROR);
  const message = err.message || ERROR_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR];

  // In production, we don't leak full 500 crash stack traces to the client
  if (statusCode === 500) {
    console.error("Internal Server Error:", err);
    try {
      const centralLogger = require("../services/centralLogger.service");
      centralLogger.logError({
        serviceName: "FreelyEmail-API",
        level: "error",
        message,
        errorCode,
        stackTrace: err.stack,
        metadata: { path: req.originalUrl, method: req.method },
      }).catch(() => {});
    } catch (_) {}
  }

  const errorPayload = {
    errorCode,
    message,
  };

  if (err.details !== undefined && err.details !== null) {
    errorPayload.details = err.details;
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    error: errorPayload,
  });
};

module.exports = {
  errorHandler,
  APIError,
};
