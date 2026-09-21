/**
 * Centralized error-handling middleware.
 * Catches errors passed via next(err) and any thrown/uncaught errors
 * in async route handlers wrapped with the asyncHandler utility.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

/**
 * 404 handler for routes that don't match any defined endpoint.
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
