# Vercel Deployment Guide

## Backend Deployment

### 1. Create Vercel Project
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import from GitHub: `iambharathan/frontend-intern-assignment`
4. Configure:
   - **Project Name**: `taskflow-pro-backend`
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

### 2. Set Environment Variables
Go to Settings → Environment Variables and add:

```
MONGODB_URI=mongodb+srv://iambharathan:Bharathan@cluster0.vvejp.mongodb.net/taskflow?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d
NODE_ENV=production
```

### 3. Deploy
Click "Deploy"

### 4. Get Backend URL
After deployment, copy the URL (e.g., `https://taskflow-pro-backend.vercel.app`)

---

## Frontend Deployment

### 1. Create Vercel Project
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import from GitHub: `iambharathan/frontend-intern-assignment`
4. Configure:
   - **Project Name**: `taskflow-pro`
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2. Set Environment Variables
Go to Settings → Environment Variables and add:

```
NEXT_PUBLIC_API_URL=https://taskflow-pro-backend.vercel.app
```

**Important**: Do NOT include `/api` at the end - it's added automatically in the code.

### 3. Deploy
Click "Deploy"

---

## Testing

### Test Backend
```bash
# Health check
curl https://taskflow-pro-backend.vercel.app/health

# Should return:
# {"success":true,"message":"Server is running","timestamp":"..."}
```

### Test Frontend
1. Open your frontend URL
2. Try to register a new user
3. Try to login
4. Create/edit/delete tasks

---

## Common Issues

### Issue: Login returns 404
**Solution**: Make sure frontend `NEXT_PUBLIC_API_URL` is set to backend URL WITHOUT `/api`

### Issue: CORS errors
**Solution**: Backend `app.js` already includes Vercel domain wildcards in CORS config

### Issue: MongoDB buffering timeout
**Solution**: Already fixed with global connection caching in `config/db.js`

### Issue: 500 errors on cold starts
**Solution**: Backend uses cached MongoDB connections to prevent timeouts
