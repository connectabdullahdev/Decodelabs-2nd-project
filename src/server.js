// ============================================================
// server.js — Application Entry Point
// DecodeLabs Project 2 | Backend API Development | Batch 2026
// Author: Muhammad Abdullah
// ============================================================

const app    = require('./app');
const config = require('./config');

// ── Start Server ─────────────────────────────────────────────
app.listen(config.PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║    DecodeLabs — Backend API  |  Project 2   ║');
  console.log('║    Author : Muhammad Abdullah                ║');
  console.log('║    Batch  : 2026                             ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  ✅  Server running on port ${config.PORT}             ║`);
  console.log(`║  📡  Base URL : http://localhost:${config.PORT}/api/v1  ║`);
  console.log('║  📄  Docs    : GET /api/v1                   ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
});

// ── Graceful Shutdown ────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('\n[Server] SIGTERM received — shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n[Server] SIGINT received — shutting down gracefully');
  process.exit(0);
});
