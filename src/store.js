// ============================================================
// store.js — In-Memory Data Store
// Simulates a database (no DB required for Project 2)
// PDF: "Before you scale into complex databases..."
// ============================================================

const { v4: uuidv4 } = require('uuid');

// ── Initial seed data ────────────────────────────────────────
const tasks = [
  {
    id       : uuidv4(),
    title    : 'Complete DecodeLabs Project 1',
    description: 'Build a responsive frontend interface with HTML5, CSS3 & Vanilla JS',
    status   : 'completed',
    priority : 'high',
    createdAt: new Date('2026-05-01').toISOString(),
    updatedAt: new Date('2026-05-07').toISOString(),
  },
  {
    id       : uuidv4(),
    title    : 'Complete DecodeLabs Project 2',
    description: 'Build a Backend REST API with Node.js and Express',
    status   : 'in-progress',
    priority : 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id       : uuidv4(),
    title    : 'Study RESTful API design principles',
    description: 'Learn HTTP methods, status codes, and RESTful naming conventions',
    status   : 'completed',
    priority : 'medium',
    createdAt: new Date('2026-04-28').toISOString(),
    updatedAt: new Date('2026-04-30').toISOString(),
  },
];

const users = [
  {
    id       : uuidv4(),
    name     : 'Muhammad Abdullah',
    email    : 'connect.abdullah.dev@gmail.com',
    role     : 'admin',
    createdAt: new Date().toISOString(),
  },
];

// ── Store API ────────────────────────────────────────────────

const Store = {
  // ── TASKS ──
  getAllTasks() {
    return [...tasks];
  },

  getTaskById(id) {
    return tasks.find(t => t.id === id) || null;
  },

  createTask(data) {
    const task = {
      id         : uuidv4(),
      title      : data.title.trim(),
      description: (data.description || '').trim(),
      status     : data.status || 'pending',
      priority   : data.priority || 'medium',
      createdAt  : new Date().toISOString(),
      updatedAt  : new Date().toISOString(),
    };
    tasks.push(task);
    return task;
  },

  updateTask(id, data) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...(data.title       !== undefined && { title      : data.title.trim() }),
      ...(data.description !== undefined && { description: data.description.trim() }),
      ...(data.status      !== undefined && { status     : data.status }),
      ...(data.priority    !== undefined && { priority   : data.priority }),
      updatedAt: new Date().toISOString(),
    };
    return tasks[index];
  },

  deleteTask(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
  },

  filterTasks({ status, priority }) {
    return tasks.filter(t => {
      if (status   && t.status   !== status)   return false;
      if (priority && t.priority !== priority) return false;
      return true;
    });
  },

  // ── USERS ──
  getAllUsers() {
    return users.map(({ ...u }) => { delete u.password; return u; });
  },

  getUserById(id) {
    const user = users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
  },

  getUserByEmail(email) {
    return users.find(u => u.email === email.toLowerCase()) || null;
  },

  createUser(data) {
    const user = {
      id       : uuidv4(),
      name     : data.name.trim(),
      email    : data.email.toLowerCase().trim(),
      role     : 'user',
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    const { password, ...safe } = user;
    return safe;
  },
};

module.exports = Store;
