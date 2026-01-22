# Task Manager Backend API

A secure and scalable REST API built with Node.js, Express, and MongoDB for task management.

## 🚀 Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ CRUD operations on tasks
- ✅ User profile management
- ✅ Search and filter functionality
- ✅ Task statistics
- ✅ Error handling and validation
- ✅ MongoDB with Mongoose ODM

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Environment Variables**: dotenv

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` file and update the values
   - Set your MongoDB URI (MongoDB Atlas or local)
   - Set a strong JWT secret

3. Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## 🔐 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### User Profile
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Tasks (All Protected)
- `GET /api/tasks` - Get all tasks (with filters & search)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

### Query Parameters for GET /api/tasks
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `search` - Search in title and description
- `sortBy` - Sort by field (default: createdAt)
- `order` - Sort order (asc, desc)

## 🔒 Security Features

- Password hashing before saving to database
- JWT token-based authentication
- Protected routes with auth middleware
- Input validation and sanitization
- Error handling middleware
- CORS configuration

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── authController.js  # Auth logic
│   ├── userController.js  # User profile logic
│   └── taskController.js  # Task CRUD logic
├── middleware/
│   ├── auth.js            # JWT verification
│   └── errorHandler.js    # Global error handler
├── models/
│   ├── User.js            # User schema
│   └── Task.js            # Task schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── userRoutes.js      # User endpoints
│   └── taskRoutes.js      # Task endpoints
├── utils/
│   └── jwt.js             # JWT helper functions
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── server.js              # Entry point
```

## 🧪 Testing with Postman

Import the Postman collection (see `postman_collection.json`) to test all endpoints.

## 🚀 Deployment

Can be deployed to:
- **Render** (recommended for free tier)
- **Railway**
- **Heroku**
- **AWS EC2**

Database: **MongoDB Atlas** (free tier available)

## 📝 Notes

- All protected routes require `Authorization: Bearer <token>` header
- Tokens expire after 7 days (configurable)
- Each user can only access their own tasks
- Task search is case-insensitive
