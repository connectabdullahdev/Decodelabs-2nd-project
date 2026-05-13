// ============================================================
// validate.middleware.js — Input Validation
// PDF: "The Gatekeeper Rule — Never Trust the Client"
// Two layers: Syntactic (format correct?) + Semantic (logic valid?)
// ============================================================

const { sendError } = require('../utils/response');

// ── Valid enum values ────────────────────────────────────────
const VALID_STATUS   = ['pending', 'in-progress', 'completed'];
const VALID_PRIORITY = ['low', 'medium', 'high'];

// ── Task Validators ──────────────────────────────────────────

/**
 * Validate POST /tasks — create new task
 * Syntactic: required fields present?
 * Semantic:  are the values logically valid?
 */
function validateCreateTask(req, res, next) {
  const errors = [];
  const { title, status, priority } = req.body;

  // Syntactic Validation — is format correct?
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Title is required and must be a non-empty string.' });
  } else if (title.trim().length > 100) {
    errors.push({ field: 'title', message: 'Title must not exceed 100 characters.' });
  }

  // Semantic Validation — is logic valid?
  if (status !== undefined && !VALID_STATUS.includes(status)) {
    errors.push({
      field  : 'status',
      message: `Status must be one of: ${VALID_STATUS.join(', ')}.`,
    });
  }

  if (priority !== undefined && !VALID_PRIORITY.includes(priority)) {
    errors.push({
      field  : 'priority',
      message: `Priority must be one of: ${VALID_PRIORITY.join(', ')}.`,
    });
  }

  if (errors.length > 0) {
    // 400 Bad Request (PDF: Critical Vocabulary)
    return sendError(res, 400, 'Validation failed. Please fix the errors below.', errors);
  }

  next();
}

/**
 * Validate PUT /tasks/:id — update existing task
 * At least one field must be provided
 */
function validateUpdateTask(req, res, next) {
  const errors = [];
  const { title, description, status, priority } = req.body;

  // At least one field required
  if (title === undefined && description === undefined && status === undefined && priority === undefined) {
    return sendError(res, 400, 'At least one field (title, description, status, priority) must be provided.');
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Title must be a non-empty string.' });
    } else if (title.trim().length > 100) {
      errors.push({ field: 'title', message: 'Title must not exceed 100 characters.' });
    }
  }

  if (status !== undefined && !VALID_STATUS.includes(status)) {
    errors.push({
      field  : 'status',
      message: `Status must be one of: ${VALID_STATUS.join(', ')}.`,
    });
  }

  if (priority !== undefined && !VALID_PRIORITY.includes(priority)) {
    errors.push({
      field  : 'priority',
      message: `Priority must be one of: ${VALID_PRIORITY.join(', ')}.`,
    });
  }

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed. Please fix the errors below.', errors);
  }

  next();
}

// ── User Validators ──────────────────────────────────────────

/**
 * Validate POST /users — register new user
 */
function validateCreateUser(req, res, next) {
  const errors = [];
  const { name, email } = req.body;

  // Name — syntactic
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required and must be a non-empty string.' });
  } else if (name.trim().length > 60) {
    errors.push({ field: 'name', message: 'Name must not exceed 60 characters.' });
  }

  // Email — syntactic + semantic
  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required.' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push({ field: 'email', message: 'Email must be a valid email address.' });
  }

  if (errors.length > 0) {
    return sendError(res, 400, 'Validation failed. Please fix the errors below.', errors);
  }

  next();
}

module.exports = {
  validateCreateTask,
  validateUpdateTask,
  validateCreateUser,
};
