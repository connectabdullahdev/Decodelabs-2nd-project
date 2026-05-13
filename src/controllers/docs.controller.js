// ============================================================
// docs.controller.js — Live API Documentation
// PDF: "If it isn't documented, it doesn't exist."
//      "Your users are other developers."
// ============================================================

const config = require('../config');

exports.apiDocs = (req, res) => {
  const docs = {
    project    : config.PROJECT,
    author     : config.AUTHOR,
    batch      : config.BATCH,
    version    : config.VERSION,
    baseUrl    : `http://localhost:${config.PORT}/api/v1`,
    description: 'A RESTful Task Manager API demonstrating backend API development principles — DecodeLabs Project 2.',
    principles : [
      'Resources are Nouns. Methods are Verbs.',
      'Never Trust the Client — validate everything server-side.',
      'Communicate state with proper HTTP status codes.',
      'JSON is the neurotransmitter — lightweight and human-readable.',
    ],
    endpoints: {
      tasks: [
        {
          method     : 'GET',
          path       : '/api/v1/tasks',
          description: 'Retrieve all tasks. Supports ?status= and ?priority= query filters.',
          queryParams: {
            status  : 'pending | in-progress | completed',
            priority: 'low | medium | high',
          },
          response: '200 OK — Array of task objects',
          example : 'GET /api/v1/tasks?status=pending&priority=high',
        },
        {
          method     : 'GET',
          path       : '/api/v1/tasks/stats',
          description: 'Get summary statistics — total counts by status and priority.',
          response   : '200 OK — Statistics object',
          example    : 'GET /api/v1/tasks/stats',
        },
        {
          method     : 'GET',
          path       : '/api/v1/tasks/:id',
          description: 'Retrieve a single task by its unique ID.',
          response   : '200 OK | 404 Not Found',
          example    : 'GET /api/v1/tasks/abc-123',
        },
        {
          method     : 'POST',
          path       : '/api/v1/tasks',
          description: 'Create a new task.',
          body: {
            title      : 'string (required, max 100 chars)',
            description: 'string (optional)',
            status     : 'pending | in-progress | completed (default: pending)',
            priority   : 'low | medium | high (default: medium)',
          },
          response: '201 Created | 400 Bad Request',
          example : 'POST /api/v1/tasks',
        },
        {
          method     : 'PUT',
          path       : '/api/v1/tasks/:id',
          description: 'Update an existing task. Send only the fields you want to change.',
          body: {
            title      : 'string (optional)',
            description: 'string (optional)',
            status     : 'pending | in-progress | completed (optional)',
            priority   : 'low | medium | high (optional)',
          },
          response: '200 OK | 400 Bad Request | 404 Not Found',
          example : 'PUT /api/v1/tasks/abc-123',
        },
        {
          method     : 'DELETE',
          path       : '/api/v1/tasks/:id',
          description: 'Delete a task permanently.',
          response   : '204 No Content | 404 Not Found',
          example    : 'DELETE /api/v1/tasks/abc-123',
        },
      ],
      users: [
        {
          method     : 'GET',
          path       : '/api/v1/users',
          description: 'Retrieve all registered users.',
          response   : '200 OK — Array of user objects',
          example    : 'GET /api/v1/users',
        },
        {
          method     : 'GET',
          path       : '/api/v1/users/:id',
          description: 'Retrieve a single user by their unique ID.',
          response   : '200 OK | 404 Not Found',
          example    : 'GET /api/v1/users/abc-123',
        },
        {
          method     : 'POST',
          path       : '/api/v1/users',
          description: 'Register a new user. Email must be unique.',
          body: {
            name : 'string (required, max 60 chars)',
            email: 'string (required, valid email format)',
          },
          response: '201 Created | 400 Bad Request | 409 Conflict (duplicate email)',
          example : 'POST /api/v1/users',
        },
      ],
      system: [
        {
          method     : 'GET',
          path       : '/health',
          description: 'Health check — confirms server is running.',
          response   : '200 OK',
        },
        {
          method     : 'GET',
          path       : '/api/v1',
          description: 'This documentation page.',
          response   : '200 OK',
        },
      ],
    },
    statusCodes: {
      200: 'OK — Request successful',
      201: 'Created — Resource created successfully',
      204: 'No Content — Deleted successfully',
      400: 'Bad Request — Validation failed',
      404: 'Not Found — Resource does not exist',
      409: 'Conflict — Duplicate resource',
      500: 'Internal Server Error — Something went wrong',
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(docs);
};
