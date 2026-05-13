// ============================================================
// users.controller.js — User Business Logic
// PDF: Authentication (Who are you?) & Authorization (What can you do?)
// ============================================================

const Store = require('../store');
const { sendSuccess, sendError } = require('../utils/response');

// ── GET /api/v1/users ────────────────────────────────────────
// Returns all users (passwords never exposed)
exports.getAllUsers = (req, res) => {
  const users = Store.getAllUsers();

  return sendSuccess(
    res,
    200,
    `${users.length} user(s) retrieved successfully.`,
    users,
    { total: users.length }
  );
};

// ── GET /api/v1/users/:id ────────────────────────────────────
exports.getUserById = (req, res) => {
  const user = Store.getUserById(req.params.id);

  if (!user) {
    return sendError(res, 404, `User with id "${req.params.id}" was not found.`);
  }

  return sendSuccess(res, 200, 'User retrieved successfully.', user);
};

// ── POST /api/v1/users ───────────────────────────────────────
// Registers a new user — validates email uniqueness (semantic validation)
exports.createUser = (req, res) => {
  const { email } = req.body;

  // Semantic Validation — is this email already taken?
  // PDF: "Never Trust the Client" — validate on server side
  const existing = Store.getUserByEmail(email);
  if (existing) {
    // 409 Conflict — resource already exists
    return sendError(res, 409, `A user with email "${email}" already exists.`);
  }

  const user = Store.createUser(req.body);

  // 201 Created
  return sendSuccess(res, 201, 'User registered successfully.', user);
};
