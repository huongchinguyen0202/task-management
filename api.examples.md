# Example HTTP Requests and Responses for Task Management API

---

## 1. Register

### Request
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass123"
}

### Response
201 Created
Content-Type: application/json

{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2025-07-01T10:00:00Z"
}

---

## 2. Login

### Request
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass123"
}

### Response
200 OK
Content-Type: application/json

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

---

## 3. Create Task

### Request
POST /tasks
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "title": "Finish project",
  "description": "Complete the API documentation",
  "priority": "High",
  "dueDate": "2025-07-10",
  "categoryId": 2
}

### Response
201 Created
Content-Type: application/json

{
  "id": 10,
  "user_id": 1,
  "category_id": 2,
  "priority_id": 3,
  "title": "Finish project",
  "description": "Complete the API documentation",
  "due_date": "2025-07-10",
  "completed": false,
  "created_at": "2025-07-01T10:05:00Z",
  "updated_at": "2025-07-01T10:05:00Z"
}

---

## 4. Update Task

### Request
PUT /tasks/10
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "title": "Finish project (updated)",
  "completed": true
}

### Response
200 OK
Content-Type: application/json

{
  "id": 10,
  "user_id": 1,
  "category_id": 2,
  "priority_id": 3,
  "title": "Finish project (updated)",
  "description": "Complete the API documentation",
  "due_date": "2025-07-10",
  "completed": true,
  "created_at": "2025-07-01T10:05:00Z",
  "updated_at": "2025-07-01T11:00:00Z"
}

---

## 5. Error: Unauthorized

### Request
GET /tasks

### Response
401 Unauthorized
Content-Type: application/json

{
  "message": "Authentication required",
  "code": 401
}

---

## 6. Error: Validation

### Request
POST /tasks
Authorization: Bearer <JWT>
Content-Type: application/json

{
  "title": "",
  "priority": "Urgent"
}

### Response
400 Bad Request
Content-Type: application/json

{
  "message": "Title is required and priority must be one of: Low, Medium, High",
  "code": 400
}
