const errorHandler = (err, req, res, next) => {
  console.error("Error Middleware Log:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
    data: {},
  });
};

class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  APIError,
};
