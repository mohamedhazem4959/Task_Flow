TaskFlow API 🚀
A robust task management REST API built with Node.js, Express, TypeScript, and MongoDB. Features real-time updates via Socket.IO, Redis caching, email notifications, and JWT-based authentication.

📋 Project Overview
TaskFlow is a full-featured task management system designed for teams and individuals. It enables users to create projects, assign tasks, track progress, and collaborate in real-time. The API follows RESTful principles and implements industry-standard security practices.
Key Highlights

Real-time collaboration using Socket.IO
Secure authentication with JWT (access & refresh tokens)
Email verification system for new users
Redis caching for improved performance
Type-safe development with TypeScript
Production-ready logging with Winston
Scalable architecture with clear separation of concerns


🛠️ Tech Stack
Core Technologies

Runtime: Node.js (v18+)
Framework: Express.js v5
Language: TypeScript
Database: MongoDB with Mongoose ODM
Caching: Redis
Real-time: Socket.IO

Authentication & Security

JWT (JSON Web Tokens)
Bcrypt for password hashing
Cookie-based session management
CORS configuration

Developer Tools

Validation: Zod
Logging: Winston & Pino
Email: Nodemailer
API Documentation: Swagger (via swagger-jsdoc & swagger-ui-express)
Development: Nodemon, ts-node

```
🏗️ Architecture
The project follows a layered architecture pattern:
┌─────────────────────────────────────┐
│         Routes Layer                │  ← HTTP endpoints
├─────────────────────────────────────┤
│       Controllers Layer             │  ← Request handling
├─────────────────────────────────────┤
│        Services Layer               │  ← Business logic
├─────────────────────────────────────┤
│         Models Layer                │  ← Data models
├─────────────────────────────────────┤
│    Database (MongoDB + Redis)       │  ← Data persistence
└─────────────────────────────────────┘
```
```

### Design Patterns Used
- **MVC Pattern**: Separation of concerns
- **Middleware Pattern**: Authentication, validation, role-based access
- **Repository Pattern**: Data access abstraction through services
- **Factory Pattern**: Used in JWT utilities

---

## ✨ Features

### 👤 User Management
- User registration with email verification
- Secure login with JWT authentication
- Password hashing with bcrypt
- Session management with refresh tokens
- Role-based access control (Admin/User)

### 📂 Project Management
- Create and manage projects
- Add project members with role assignment
- Update project details
- Admin-only access controls
- Email notifications for new members

### ✅ Task Management
- Create tasks within projects
- Assign tasks to project members
- Update task status (pending/working/completed)
- Real-time task updates via Socket.IO
- Task filtering and retrieval
- Delete tasks (admin only)

### 🔄 Real-time Features
- Socket.IO integration for live updates
- Project-based room connections
- Real-time task creation/update notifications
- Automatic client synchronization

### 📧 Email Notifications
- Email verification on registration
- Project membership notifications
- Task assignment notifications
- Customizable HTML email templates

### 🔐 Security Features
- JWT access and refresh tokens
- HTTP-only cookies for refresh tokens
- Token expiration handling
- Middleware-based authentication
- Project admin authorization checks

---

## 📁 Folder Structure
```
```
TaskFlow/
├── config/
│   └── default.ts              # Configuration settings
├── src/
│   ├── app.ts                  # Application entry point
│   ├── controllers/            # Request handlers
│   │   ├── project.controller.ts
│   │   ├── session.controller.ts
│   │   ├── tasks.controller.ts
│   │   └── user.controller.ts
│   ├── middleware/             # Custom middleware
│   │   ├── authentication.middleware.ts
│   │   ├── isProjectAdmin.middleware.ts
│   │   ├── role.middleware.ts
│   │   └── validateResource.ts
│   ├── models/                 # Database schemas
│   │   ├── projects.model.ts
│   │   ├── session.model.ts
│   │   ├── tasks.model.ts
│   │   └── user.model.ts
│   ├── routes/                 # API routes
│   │   ├── healthCheck.routes.ts
│   │   ├── project.routes.ts
│   │   ├── tasks.routes.ts
│   │   └── user.routes.ts
│   ├── schema/                 # Validation schemas
│   │   ├── project.schema.ts
│   │   ├── session.schema.ts
│   │   ├── tasks.schema.ts
│   │   └── user.schema.ts
│   ├── services/               # Business logic
│   │   ├── project.service.ts
│   │   ├── session.service.ts
│   │   ├── tasks.service.ts
│   │   └── user.service.ts
│   ├── types/                  # TypeScript types
│   │   └── request.types.ts
│   └── utils/                  # Utilities
│       ├── connect.ts          # MongoDB connection
│       ├── jwt.utils.ts        # JWT helpers
│       ├── logger.ts           # Logger setup
│       ├── redisClient.ts      # Redis connection
│       └── sendMail.ts         # Email utilities
├── .env                        # Environment variables
├── package.json
└── tsconfig.json              # TypeScript config
```
🚀 How to Run the Project
Prerequisites

Node.js (v18 or higher)
MongoDB (local or Atlas)
Redis server
Gmail account (for email notifications)

Installation Steps

Clone the repository

bashgit clone https://github.com/yourusername/taskflow.git
cd taskflow

Install dependencies

bashnpm install

Set up environment variables

Create a .env file in the root directory:
env# JWT Keys
ACCESS_KEY=your_access_secret_key
REFRESH_KEY=your_refresh_secret_key
JWT_LIFE_TIME=15m
REFRESH_LIFE_TIME=7d

# Database
MONGODB_URI=mongodb://localhost:27017/TaskFlow

# Redis
REDIS_URL=redis://localhost:6379

# Email Configuration
APP_PASSWORD=your_gmail_app_password

Start MongoDB

bash# For local MongoDB
mongod

Start Redis

bash# For local Redis
redis-server

Run the application

Development mode:
bashnpm run dev
Production mode:
bashnpm run build
npm start
The server will start at http://localhost:1337
Testing the API
Use tools like Postman, Thunder Client, or cURL to test endpoints:
bash# Health check
GET http://localhost:1337/api/health-check

# Register user
POST http://localhost:1337/api/user/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "passwordConfirmation": "SecurePass123"
}

📝 API Endpoints
Authentication
MethodEndpointDescriptionPOST/api/user/usersRegister new userGET/api/user/verifyVerify emailPOST/api/user/sessionsLoginGET/api/user/getSessionsGet active sessionsPUT/api/user/deleteSessionLogout
Projects
MethodEndpointDescriptionPOST/api/v1/projects/addProjectCreate projectPUT/api/v1/projects/updateProject/:projectIdUpdate projectPUT/api/v1/projects/addMember/:projectIdAdd member
Tasks
MethodEndpointDescriptionPOST/api/tasks/add-taskCreate taskGET/api/tasks/get-tasksGet all tasksGET/api/tasks/single-task/:taskIdGet task by IDPUT/api/tasks/update-admin-task/:taskIdUpdate task (admin)

🧪 Testing
Manual Testing

Register a new user and check email for verification link
Login and receive JWT tokens
Create a project
Add members to the project
Create and assign tasks
Update task status
Monitor real-time updates via Socket.IO

Socket.IO Testing
Use a Socket.IO client to connect:
javascriptconst socket = io('http://localhost:1337');
socket.emit('joinProject', 'projectId');
socket.on('taskCreated', (task) => console.log(task));

🔮 Future Improvements

 Add comprehensive unit and integration tests (Jest/Mocha)
 Implement task comments and attachments
 Add task priority levels and due dates
 Create notification center for users
 Implement task filtering and search
 Implement file upload for tasks
 Implement OAuth (Google, GitHub)
 Add two-factor authentication
 Set up CI/CD pipeline
 Add API rate limiting

Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
