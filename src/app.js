// ============================================================
// app.js — Express Application Setup
// All middleware, routes, and error handling configured here
// ============================================================

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const taskRoutes = require('./routes/tasks.routes');
const userRoutes = require('./routes/users.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const { apiDocs } = require('./controllers/docs.controller');

const app = express();

// ── Core Middleware ──────────────────────────────────────────

// CORS — allow all origins (for development)
app.use(cors());

// Parse incoming JSON bodies — "The Neurotransmitter: JSON" (PDF)
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
app.use(morgan('dev'));

// ── API Documentation Root ───────────────────────────────────
// GET /api/v1 — returns full API documentation as JSON
app.get('/api/v1', apiDocs);

// ── Routes ───────────────────────────────────────────────────
// RESTful naming: Resources are Nouns, Methods are Verbs (PDF)
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);

// ── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status : 'ok',
    service: 'DecodeLabs Backend API',
    version: '1.0.0',
    uptime : `${Math.floor(process.uptime())}s`,
    time   : new Date().toISOString(),
  });
});

// ── 404 Handler — "Not Found" (PDF status codes) ─────────────
app.use(notFound);

// ── Global Error Handler — "500 Internal Error" (PDF) ────────
app.use(errorHandler);

module.exports = app;
