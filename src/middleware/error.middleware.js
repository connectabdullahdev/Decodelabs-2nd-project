// ============================================================
// error.middleware.js — Centralized Error Handling
// PDF: "Communicating State: The Server's Tone"
//      "Don't force the client to guess. Use the semantic code."
// ============================================================

const { sendError } = require('../utils/response');

/**
 * 404 Not Found Handler
 * Catches any route that doesn't match
 */
function notFound(req, res, next) {
  sendError(res, 404, `Cannot ${req.method} ${req.originalUrl} — Route not found.`);
}

/**
 * Global Error Handler (500 Internal Server Error)
 * Catches any unhandled errors thrown in controllers
 */
function errorHandler(err, req, res, next) {
  console.error(`[Error] ${err.message}`);
  console.error(err.stack);

  const statusCode = err.statusCode || err.status || 500;
  const message    = statusCode === 500
    ? 'Internal server error. Please try again later.'
    : err.message;

  sendError(res, statusCode, message);
}

module.exports = { notFound, errorHandler };
