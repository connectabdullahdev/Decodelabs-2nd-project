// ============================================================
// tasks.controller.js — Task Business Logic
// PDF: IPO Model — Input → Process → Output
// HTTP Methods: GET (Retrieve) POST (Create) PUT (Update) DELETE (Remove)
// ============================================================

const Store           = require('../store');
const { sendSuccess, sendError } = require('../utils/response');

// ── GET /api/v1/tasks ────────────────────────────────────────
// Returns all tasks. Supports ?status= and ?priority= filters
exports.getAllTasks = (req, res) => {
  const { status, priority } = req.query;

  let tasks;

  if (status || priority) {
    // Filter tasks by query params
    tasks = Store.filterTasks({ status, priority });
  } else {
    tasks = Store.getAllTasks();
  }

  // Sort by createdAt descending (newest first)
  tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return sendSuccess(
    res,
    200,
    `${tasks.length} task(s) retrieved successfully.`,
    tasks,
    {
      total   : tasks.length,
      filtered: !!(status || priority),
      filters : { status: status || null, priority: priority || null },
    }
  );
};

// ── GET /api/v1/tasks/:id ────────────────────────────────────
// Returns a single task by its UUID
exports.getTaskById = (req, res) => {
  const task = Store.getTaskById(req.params.id);

  if (!task) {
    // 404 Not Found (PDF: Critical Vocabulary)
    return sendError(res, 404, `Task with id "${req.params.id}" was not found.`);
  }

  return sendSuccess(res, 200, 'Task retrieved successfully.', task);
};

// ── POST /api/v1/tasks ───────────────────────────────────────
// Creates a new task — validated by middleware first
exports.createTask = (req, res) => {
  const task = Store.createTask(req.body);

  // 201 Created (PDF: Critical Vocabulary)
  return sendSuccess(res, 201, 'Task created successfully.', task);
};

// ── PUT /api/v1/tasks/:id ────────────────────────────────────
// Updates an existing task — partial updates supported
exports.updateTask = (req, res) => {
  const existing = Store.getTaskById(req.params.id);

  if (!existing) {
    return sendError(res, 404, `Task with id "${req.params.id}" was not found.`);
  }

  const updated = Store.updateTask(req.params.id, req.body);

  return sendSuccess(res, 200, 'Task updated successfully.', updated);
};

// ── DELETE /api/v1/tasks/:id ─────────────────────────────────
// Deletes a task — returns 204 No Content (PDF: Critical Vocabulary)
exports.deleteTask = (req, res) => {
  const existing = Store.getTaskById(req.params.id);

  if (!existing) {
    return sendError(res, 404, `Task with id "${req.params.id}" was not found.`);
  }

  Store.deleteTask(req.params.id);

  // 204 No Content — deletion confirmed, no body needed
  return res.status(204).send();
};

// ── GET /api/v1/tasks/stats ──────────────────────────────────
// Returns summary statistics of all tasks
exports.getStats = (req, res) => {
  const all = Store.getAllTasks();

  const stats = {
    total     : all.length,
    byStatus  : {
      pending    : all.filter(t => t.status === 'pending').length,
      inProgress : all.filter(t => t.status === 'in-progress').length,
      completed  : all.filter(t => t.status === 'completed').length,
    },
    byPriority: {
      low   : all.filter(t => t.priority === 'low').length,
      medium: all.filter(t => t.priority === 'medium').length,
      high  : all.filter(t => t.priority === 'high').length,
    },
  };

  return sendSuccess(res, 200, 'Task statistics retrieved successfully.', stats);
};
