# Backend Testing Guide

## 🚀 Steps to Test Backend

### 1. Setup MongoDB

Choose one option:

**Option A: MongoDB Atlas (Recommended)**
- Follow instructions in `MONGODB_SETUP.md`
- Update `.env` with your Atlas connection string

**Option B: Use Mock/Development Mode**
- We'll use a local MongoDB URI for now
- Current `.env` is set to: `mongodb://localhost:27017/taskmanager`

### 2. Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║   🚀 Server is running!                ║
║   📍 Port: 5000                        ║
║   🌍 Environment: development          ║
║   📡 API: http://localhost:5000/api    ║
╚════════════════════════════════════════╝
```

### 3. Test with cURL Commands

#### Health Check
```bash
curl http://localhost:5000/health
```

#### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Get Profile (Protected Route)
```bash
# Replace YOUR_TOKEN with actual token from login
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create Task
```bash
# Replace YOUR_TOKEN with actual token
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build Amazing Frontend",
    "description": "Create a beautiful React dashboard",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-01-25"
  }'
```

#### Get All Tasks
```bash
# Replace YOUR_TOKEN with actual token
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Tasks with Filters
```bash
curl "http://localhost:5000/api/tasks?status=in-progress&priority=high" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Import Postman Collection

1. Open Postman
2. Click "Import"
3. Select `backend/postman_collection.json`
4. After login, copy the token
5. Set the `token` variable in Postman environment
6. Test all endpoints!

---

## 📝 Expected Response Format

### Success Response
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🐛 Common Issues

### MongoDB Connection Failed
- **Issue**: Can't connect to MongoDB
- **Solution**: 
  - Use MongoDB Atlas (see MONGODB_SETUP.md)
  - Or install Docker and run: `docker run -d -p 27017:27017 mongo`

### Port 5000 Already in Use
- **Solution**: Kill the process or change PORT in `.env`
```bash
# Find process on port 5000
lsof -ti:5000

# Kill it
kill -9 $(lsof -ti:5000)
```

### Token Invalid/Expired
- **Solution**: Login again to get a new token

---

## ✅ Backend Checklist

Before moving to frontend:
- [ ] Backend server starts without errors
- [ ] MongoDB connection successful
- [ ] Can signup a new user
- [ ] Can login and receive JWT token
- [ ] Can access protected routes with token
- [ ] Can create, read, update, delete tasks
- [ ] Search and filter works
- [ ] Error handling works (try invalid requests)

Once all checked, you're ready for **Frontend Development**! 🎉
