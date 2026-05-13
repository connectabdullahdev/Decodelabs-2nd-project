// ============================================================
// tasks.routes.js — Task Resource Routes
// PDF: "Resources are Nouns. Methods are Verbs."
//      ✅ GET  /tasks       NOT ❌ GET  /getTasks
//      ✅ POST /tasks       NOT ❌ POST /createTask
// ============================================================

const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/tasks.controller');
const { validateCreateTask, validateUpdateTask } = require('../middleware/validate.middleware');

// GET  /api/v1/tasks/stats  — must come BEFORE /:id to avoid conflict
router.get('/stats', ctrl.getStats);

// GET  /api/v1/tasks        — get all tasks (with optional filters)
// POST /api/v1/tasks        — create new task
router.route('/')
  .get(ctrl.getAllTasks)
  .post(validateCreateTask, ctrl.createTask);

// GET    /api/v1/tasks/:id  — get single task
// PUT    /api/v1/tasks/:id  — update task
// DELETE /api/v1/tasks/:id  — delete task
router.route('/:id')
  .get(ctrl.getTaskById)
  .put(validateUpdateTask, ctrl.updateTask)
  .delete(ctrl.deleteTask);

module.exports = router;
