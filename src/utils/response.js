// ============================================================
// response.js — Standardised JSON Response Helpers
// PDF: "The Neurotransmitter: JSON"
//      Ensures every response has consistent structure
// ============================================================

/**
 * Send a success response
 * @param {object} res        - Express response object
 * @param {number} statusCode - HTTP status code (200, 201, 204...)
 * @param {string} message    - Human-readable message
 * @param {*}      data       - Payload (array, object, null)
 * @param {object} meta       - Optional pagination / extra info
 */
function sendSuccess(res, statusCode = 200, message, data = null, meta = null) {
  const body = {
    success: true,
    status : statusCode,
    message,
  };

  if (data  !== null) body.data = data;
  if (meta  !== null) body.meta = meta;

  body.timestamp = new Date().toISOString();

  return res.status(statusCode).json(body);
}

/**
 * Send an error response
 * @param {object} res        - Express response object
 * @param {number} statusCode - HTTP status code (400, 404, 500...)
 * @param {string} message    - Error message
 * @param {Array}  errors     - Detailed validation errors (optional)
 */
function sendError(res, statusCode = 500, message, errors = null) {
  const body = {
    success: false,
    status : statusCode,
    message,
  };

  if (errors) body.errors = errors;

  body.timestamp = new Date().toISOString();

  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess, sendError };
