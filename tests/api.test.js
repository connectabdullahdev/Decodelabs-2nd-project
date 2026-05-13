// ============================================================
// api.test.js — Manual API Test Suite
// Run: node tests/api.test.js  (server must be running)
// PDF: "Build with Integrity. Validate Everything."
// ============================================================

const http = require('http');

const BASE = 'http://localhost:3000';
let   createdTaskId = null;
let   createdUserId = null;
let   passed        = 0;
let   failed        = 0;

// ── HTTP Helper ──────────────────────────────────────────────
function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const url     = new URL(BASE + path);

    const options = {
      hostname: url.hostname,
      port    : url.port || 80,
      path    : url.pathname + url.search,
      method,
      headers : {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ── Assertion Helper ─────────────────────────────────────────
function assert(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ PASS — ${label}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL — ${label}${detail ? ` | ${detail}` : ''}`);
    failed++;
  }
}

// ── Test Suites ──────────────────────────────────────────────

async function testHealth() {
  console.log('\n🔍 [1] Health Check');
  const r = await request('GET', '/health');
  assert('Status 200',         r.status === 200);
  assert('success is true',    r.body.status === 'ok');
}

async function testApiDocs() {
  console.log('\n🔍 [2] API Documentation');
  const r = await request('GET', '/api/v1');
  assert('Status 200',             r.status === 200);
  assert('Has endpoints property', !!r.body.endpoints);
  assert('Has statusCodes',        !!r.body.statusCodes);
}

async function testGetAllTasks() {
  console.log('\n🔍 [3] GET /api/v1/tasks — get all tasks');
  const r = await request('GET', '/api/v1/tasks');
  assert('Status 200',        r.status === 200);
  assert('success is true',   r.body.success === true);
  assert('data is array',     Array.isArray(r.body.data));
  assert('meta.total exists', r.body.meta && typeof r.body.meta.total === 'number');
}

async function testFilterTasks() {
  console.log('\n🔍 [4] GET /api/v1/tasks?status=completed — filter by status');
  const r = await request('GET', '/api/v1/tasks?status=completed');
  assert('Status 200',          r.status === 200);
  assert('All have status=completed',
    r.body.data.every(t => t.status === 'completed'));
}

async function testCreateTask() {
  console.log('\n🔍 [5] POST /api/v1/tasks — create new task');
  const r = await request('POST', '/api/v1/tasks', {
    title      : 'Test Task from api.test.js',
    description: 'This task was created by the automated test suite.',
    priority   : 'high',
  });
  assert('Status 201',        r.status === 201,     `got ${r.status}`);
  assert('success is true',   r.body.success === true);
  assert('Has id',            !!r.body.data?.id);
  assert('Title matches',     r.body.data?.title === 'Test Task from api.test.js');
  assert('Default status=pending', r.body.data?.status === 'pending');

  if (r.body.data?.id) createdTaskId = r.body.data.id;
}

async function testCreateTaskValidation() {
  console.log('\n🔍 [6] POST /api/v1/tasks — validation (400 Bad Request)');

  // Missing title
  const r1 = await request('POST', '/api/v1/tasks', { description: 'No title!' });
  assert('Missing title → 400',       r1.status === 400, `got ${r1.status}`);
  assert('Returns errors array',      Array.isArray(r1.body.errors));

  // Invalid status value
  const r2 = await request('POST', '/api/v1/tasks', { title: 'X', status: 'INVALID' });
  assert('Bad status value → 400',    r2.status === 400, `got ${r2.status}`);

  // Invalid priority value
  const r3 = await request('POST', '/api/v1/tasks', { title: 'X', priority: 'ultra' });
  assert('Bad priority value → 400',  r3.status === 400, `got ${r3.status}`);
}

async function testGetTaskById() {
  console.log('\n🔍 [7] GET /api/v1/tasks/:id — get single task');
  if (!createdTaskId) return console.log('  ⚠️  Skipped — no task created yet');

  const r = await request('GET', `/api/v1/tasks/${createdTaskId}`);
  assert('Status 200',     r.status === 200);
  assert('ID matches',     r.body.data?.id === createdTaskId);
}

async function testUpdateTask() {
  console.log('\n🔍 [8] PUT /api/v1/tasks/:id — update task');
  if (!createdTaskId) return console.log('  ⚠️  Skipped — no task created yet');

  const r = await request('PUT', `/api/v1/tasks/${createdTaskId}`, {
    status  : 'in-progress',
    priority: 'medium',
  });
  assert('Status 200',           r.status === 200);
  assert('Status updated',       r.body.data?.status === 'in-progress');
  assert('Priority updated',     r.body.data?.priority === 'medium');
}

async function testGetTaskStats() {
  console.log('\n🔍 [9] GET /api/v1/tasks/stats — statistics');
  const r = await request('GET', '/api/v1/tasks/stats');
  assert('Status 200',            r.status === 200);
  assert('Has byStatus',          !!r.body.data?.byStatus);
  assert('Has byPriority',        !!r.body.data?.byPriority);
  assert('total is number',       typeof r.body.data?.total === 'number');
}

async function testNotFound() {
  console.log('\n🔍 [10] GET /api/v1/tasks/nonexistent-id — 404');
  const r = await request('GET', '/api/v1/tasks/this-id-does-not-exist');
  assert('Status 404',        r.status === 404, `got ${r.status}`);
  assert('success is false',  r.body.success === false);
}

async function testCreateUser() {
  console.log('\n🔍 [11] POST /api/v1/users — create user');
  const r = await request('POST', '/api/v1/users', {
    name : 'Test User',
    email: 'test.user@decodelabs.test',
  });
  assert('Status 201',       r.status === 201,   `got ${r.status}`);
  assert('Has id',           !!r.body.data?.id);
  assert('Email matches',    r.body.data?.email === 'test.user@decodelabs.test');

  if (r.body.data?.id) createdUserId = r.body.data.id;
}

async function testDuplicateUser() {
  console.log('\n🔍 [12] POST /api/v1/users — duplicate email (409 Conflict)');
  const r = await request('POST', '/api/v1/users', {
    name : 'Duplicate',
    email: 'test.user@decodelabs.test',
  });
  assert('Status 409',       r.status === 409, `got ${r.status}`);
  assert('success is false', r.body.success === false);
}

async function testDeleteTask() {
  console.log('\n🔍 [13] DELETE /api/v1/tasks/:id — delete task');
  if (!createdTaskId) return console.log('  ⚠️  Skipped — no task created yet');

  const r = await request('DELETE', `/api/v1/tasks/${createdTaskId}`);
  assert('Status 204',   r.status === 204, `got ${r.status}`);

  // Verify it's gone
  const check = await request('GET', `/api/v1/tasks/${createdTaskId}`);
  assert('Task gone → 404', check.status === 404);
}

async function testRouteNotFound() {
  console.log('\n🔍 [14] GET /api/v1/invalid-route — 404');
  const r = await request('GET', '/api/v1/this-route-does-not-exist');
  assert('Status 404',        r.status === 404);
  assert('success is false',  r.body.success === false);
}

// ── Run All Tests ────────────────────────────────────────────
async function run() {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   DecodeLabs API Test Suite — Project 2     ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`📡  Testing: ${BASE}`);

  try {
    await testHealth();
    await testApiDocs();
    await testGetAllTasks();
    await testFilterTasks();
    await testCreateTask();
    await testCreateTaskValidation();
    await testGetTaskById();
    await testUpdateTask();
    await testGetTaskStats();
    await testNotFound();
    await testCreateUser();
    await testDuplicateUser();
    await testDeleteTask();
    await testRouteNotFound();

    console.log('\n══════════════════════════════════════════════');
    console.log(`  Results: ${passed} passed, ${failed} failed`);
    console.log(failed === 0
      ? '  🎉  All tests passed!'
      : '  ⚠️   Some tests failed — check the output above.');
    console.log('══════════════════════════════════════════════\n');

  } catch (err) {
    console.error('\n❌ Test runner error:', err.message);
    console.error('   Is the server running? Run: npm run dev');
  }
}

run();
