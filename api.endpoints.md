# RESTful API Endpoints for Task Management System

## Authentication

POST /auth/register
- Register a new user
- Request: { email, password }
- Response: 201 Created or error

POST /auth/login
- Log in and receive JWT
- Request: { email, password }
- Response: { token } or error

---

## Tasks

POST /tasks
- Create a new task (requires JWT)
- Request: { title, description, priority, dueDate, categoryId }
- Response: 201 Created with task object

GET /tasks
- Get all tasks for authenticated user
- Query params: page, limit (optional for pagination)
- Response: [ ...tasks ]

GET /tasks/:id
- Get a single task by ID (must belong to user)
- Response: 200 OK with task object

PUT /tasks/:id
- Update a task (must belong to user)
- Request: { title, description, priority, dueDate, categoryId, completed }
- Response: 200 OK with updated task

PATCH /tasks/:id/complete
- Mark a task as complete/incomplete
- Request: { completed: true|false }
- Response: 200 OK with updated task

DELETE /tasks/:id
- Delete a task (must belong to user)
- Response: 204 No Content

---

## Filtering & Search

GET /tasks/filter
- Filter tasks by priority, due date, completed status, and keyword
- Query params:
    - priority=Low|Medium|High
    - dueDate=YYYY-MM-DD
    - completed=true|false
    - q=keyword
- Response: [ ...filtered tasks ]

---

## Categories

GET /categories
- List all categories for the user

POST /categories
- Create a new category

PUT /categories/:id
- Update a category

DELETE /categories/:id
- Delete a category

---

## Priorities

GET /priorities
- List all priorities (Low, Medium, High)

---

# Notes
- All endpoints (except register/login/priorities) require JWT authentication.
- Validation and error handling should follow REST best practices (400, 401, 403, 404, 500, etc.).
