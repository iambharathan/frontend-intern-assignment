# MongoDB Atlas Setup Guide (2 Minutes)

## Quick Setup Steps:

1. **Visit**: https://www.mongodb.com/cloud/atlas/register
2. **Sign Up**: Free tier, no credit card needed
3. **Create Cluster**:
   - Click "Build a Database"
   - Choose "M0 Free" tier
   - Select your region (closest to you)
   - Click "Create"

4. **Database Access**:
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `admin`
   - Password: (create a strong password - save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Network Access**:
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

6. **Get Connection String**:
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

7. **Update .env file**:
   - Open `backend/.env`
   - Replace the MONGODB_URI with your Atlas connection string
   - Change database name in the string to `taskmanager`:
   ```
   mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
   ```

## OR Use Local MongoDB (Alternative)

If you prefer local development, you can use Docker:

```bash
# Install Docker Desktop first from: https://www.docker.com/products/docker-desktop/

# Then run MongoDB container:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Your .env will use:
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

---

## After Setup:

Run the backend server:
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
📊 Database Name: taskmanager
🚀 Server is running!
```
