/**
 * Simple request logger middleware.
 * Logs the HTTP method, URL, and timestamp for every incoming request.
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = logger;
