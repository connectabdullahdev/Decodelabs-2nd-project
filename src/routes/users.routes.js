// ============================================================
// users.routes.js — User Resource Routes
// ============================================================

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/users.controller');
const { validateCreateUser } = require('../middleware/validate.middleware');

// GET  /api/v1/users     — get all users
// POST /api/v1/users     — register new user
router.route('/')
  .get(ctrl.getAllUsers)
  .post(validateCreateUser, ctrl.createUser);

// GET  /api/v1/users/:id — get single user
router.route('/:id')
  .get(ctrl.getUserById);

module.exports = router;
