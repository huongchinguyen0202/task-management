# Task Management System

This project is a task management system built using Node.js, Express, PostgreSQL, React, and TypeScript. It allows users to create, read, update, and delete tasks, assign priorities and due dates, filter and search tasks, and mark tasks as complete.

## Features

- Create, read, update, and delete tasks
- Assign priorities and due dates to tasks
- Filter and search tasks based on criteria
- Mark tasks as complete

## Project Structure

```
task-management-system
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── db
│   │   ├── app.ts
│   │   └── types
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── api
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── types
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the PostgreSQL database and update the connection settings in `backend/src/db/index.ts`.

4. Start the backend server:
   ```
   npm run start
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the frontend application:
   ```
   npm run start
   ```

## License

This project is licensed under the MIT License.