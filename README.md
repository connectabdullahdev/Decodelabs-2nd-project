# DecodeLabs — Project 2: Backend API Development
### Muhammad Abdullah | Batch 2026

---

## What Is This?

A fully functional **REST API** built with **Node.js + Express** that manages tasks and users.  
This covers every requirement from the Project 2 PDF:

| PDF Requirement | ✅ Implemented |
|---|---|
| Create API endpoints (GET / POST) | GET, POST, PUT, DELETE all working |
| Handle user input and responses | JSON request/response on all routes |
| Validate basic data | Server-side validation on all POST/PUT |
| Proper HTTP status codes | 200, 201, 204, 400, 404, 409, 500 |
| RESTful naming (Resources = Nouns) | `/tasks`, `/users` not `/getTasks` |
| Never Trust the Client | Syntactic + Semantic validation layer |
| Documented API | Full docs at `GET /api/v1` |

---

## Project Structure

```
project2/
├── src/
│   ├── server.js              ← Entry point — starts the server
│   ├── app.js                 ← Express setup — middleware + routes
│   ├── config.js              ← Port, version, constants
│   ├── store.js               ← In-memory database (no DB needed)
│   ├── routes/
│   │   ├── tasks.routes.js    ← Task route definitions
│   │   └── users.routes.js    ← User route definitions
│   ├── controllers/
│   │   ├── tasks.controller.js ← Task business logic
│   │   ├── users.controller.js ← User business logic
│   │   └── docs.controller.js  ← API documentation
│   ├── middleware/
│   │   ├── validate.middleware.js ← Input validation (Gatekeeper Rule)
│   │   └── error.middleware.js    ← 404 + 500 handlers
│   └── utils/
│       └── response.js        ← Consistent JSON response helpers
└── tests/
    └── api.test.js            ← Automated test suite
```

---

## Setup Instructions

### Step 1 — Prerequisites

Make sure you have **Node.js** installed:
```bash
node --version   # Should be v16 or higher
npm --version    # Should be v8 or higher
```

Download Node.js from: https://nodejs.org

---

### Step 2 — Install Dependencies

```bash
# Go into the project folder
cd project2

# Install all packages
npm install
```

This installs:
- **express** — web framework
- **cors** — allow cross-origin requests
- **morgan** — HTTP request logger
- **uuid** — generate unique IDs
- **nodemon** — auto-restart on file changes (dev only)

---

### Step 3 — Start the Server

```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR production mode
npm start
```

You should see:
```
╔══════════════════════════════════════════════╗
║    DecodeLabs — Backend API  |  Project 2   ║
╠══════════════════════════════════════════════╣
║  ✅  Server running on port 3000             ║
║  📡  Base URL : http://localhost:3000/api/v1 ║
╚══════════════════════════════════════════════╝
```

---

### Step 4 — Test the API

Open your browser or use a tool like **Postman** / **Thunder Client** (VS Code extension).

#### Quick Test in Browser:
Visit → `http://localhost:3000/api/v1`  
This shows the full API documentation in JSON.

---

## All API Endpoints

### Base URL: `http://localhost:3000/api/v1`

---

### TASKS

#### Get All Tasks
```
GET /api/v1/tasks
```
Response:
```json
{
  "success": true,
  "status": 200,
  "message": "3 task(s) retrieved successfully.",
  "data": [...],
  "meta": { "total": 3 }
}
```

#### Filter Tasks by Status or Priority
```
GET /api/v1/tasks?status=pending
GET /api/v1/tasks?priority=high
GET /api/v1/tasks?status=completed&priority=high
```

#### Get Task Statistics
```
GET /api/v1/tasks/stats
```
Response:
```json
{
  "data": {
    "total": 3,
    "byStatus": { "pending": 1, "inProgress": 1, "completed": 1 },
    "byPriority": { "low": 0, "medium": 2, "high": 1 }
  }
}
```

#### Get Single Task
```
GET /api/v1/tasks/:id
```

#### Create New Task
```
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "My new task",           ← REQUIRED
  "description": "Optional detail", ← optional
  "status": "pending",              ← optional: pending | in-progress | completed
  "priority": "high"                ← optional: low | medium | high
}
```
Response: **201 Created**

#### Update Task
```
PUT /api/v1/tasks/:id
Content-Type: application/json

{
  "status": "completed"
}
```
Send only the fields you want to change. Response: **200 OK**

#### Delete Task
```
DELETE /api/v1/tasks/:id
```
Response: **204 No Content**

---

### USERS

#### Get All Users
```
GET /api/v1/users
```

#### Get Single User
```
GET /api/v1/users/:id
```

#### Register New User
```
POST /api/v1/users
Content-Type: application/json

{
  "name": "Muhammad Abdullah",            ← REQUIRED
  "email": "connect.abdullah.dev@gmail.com" ← REQUIRED, unique
}
```
Response: **201 Created**

---

### SYSTEM

```
GET /health       ← Server health check
GET /api/v1       ← Full API documentation
```

---

## HTTP Status Codes Used

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET / PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation failed |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email |
| 500 | Internal Error | Unexpected server error |

---

## Validation Rules

### Tasks (POST/PUT)
| Field | Rule |
|-------|------|
| `title` | Required, non-empty string, max 100 chars |
| `status` | Must be: `pending`, `in-progress`, or `completed` |
| `priority` | Must be: `low`, `medium`, or `high` |

### Users (POST)
| Field | Rule |
|-------|------|
| `name` | Required, non-empty string, max 60 chars |
| `email` | Required, valid email format, must be unique |

**Validation Error Response (400):**
```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed. Please fix the errors below.",
  "errors": [
    { "field": "title", "message": "Title is required and must be a non-empty string." }
  ]
}
```

---

## Run Automated Tests

Make sure the server is running first, then:
```bash
node tests/api.test.js
```

Expected output:
```
╔══════════════════════════════════════════════╗
║   DecodeLabs API Test Suite — Project 2     ║
╚══════════════════════════════════════════════╝

🔍 [1] Health Check
  ✅ PASS — Status 200
  ✅ PASS — success is true
...
══════════════════════════════════════════════
  Results: 32 passed, 0 failed
  🎉  All tests passed!
══════════════════════════════════════════════
```

---

## Testing with Postman

1. Download Postman from https://postman.com
2. Create a new collection "DecodeLabs Project 2"
3. Add requests for each endpoint above
4. Set base URL to `http://localhost:3000`

**Or use VS Code Thunder Client extension** (easier for students):
- Install "Thunder Client" from VS Code Extensions
- Create requests directly inside VS Code

---

## Key Concepts Demonstrated (from PDF)

| PDF Concept | Implementation |
|---|---|
| IPO Model (Input → Process → Output) | Request → Controller → JSON Response |
| RESTful Naming — Resources are Nouns | `/tasks` `/users` not `/getTasks` |
| Gatekeeper Rule — Never Trust Client | `validate.middleware.js` blocks bad input |
| Syntactic Validation | Checks format (required? string? length?) |
| Semantic Validation | Checks logic (valid status? email exists?) |
| HTTP Methods Anatomy | GET=Retrieve, POST=Create, PUT=Update, DELETE=Remove |
| Critical Vocabulary (Status Codes) | 201, 204, 400, 404, 409, 500 all used correctly |
| JSON — The Neurotransmitter | All responses in clean, consistent JSON |
| Documentation & DX | Full docs at `GET /api/v1` |
| Build with Integrity | Automated test suite covers all endpoints |

---

## Part of a three-project series

| Project | Layer | Repository |
| --- | --- | --- |
| 1 | Interface: responsive frontend | [Decodelabs-1st-project](https://github.com/connectabdullahdev/Decodelabs-1st-project) |
| 2 | Engine: REST API with Node.js and Express | **this repo** |
| 3 | Memory: MongoDB Atlas with Mongoose | [Decodelabs-3rd-project](https://github.com/connectabdullahdev/Decodelabs-3rd-project) |

---

<div align="center">

Built by **Muhammad Abdullah** during the DecodeLabs full stack internship (Batch 2026) · [LinkedIn](https://www.linkedin.com/in/connectabdullahdev) · [GitHub](https://github.com/connectabdullahdev)

</div>
