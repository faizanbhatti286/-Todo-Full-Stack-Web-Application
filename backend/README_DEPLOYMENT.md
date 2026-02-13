# Production Deployment Guide

## Backend Deployment (Hugging Face Spaces)

### 1. Create a New Space
- Go to https://huggingface.co/spaces
- Click "Create new Space"
- Choose "Docker" as the SDK
- Name it (e.g., "todo-backend")

### 2. Configure Environment Variables
In your Space settings, add these secrets:

```
DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_xV4ot9RByAGZ@ep-long-haze-aif4l1wo-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require

BETTER_AUTH_SECRET=1c609094e8da2a7943363b989dd429428fcd57e9e980800af4f84dd12df88678

FRONTEND_URL=https://frontend-ruddy-eight-97.vercel.app

HOST=0.0.0.0

PORT=7860
```

### 3. Deploy Files
Upload these files to your Space:
- All files in `backend/src/`
- `backend/requirements.txt`
- `backend/app.py` (entry point)
- Create a `Dockerfile` (see below)

### 4. Dockerfile for Hugging Face Spaces

Create a `Dockerfile` in the backend directory:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 7860

# Run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

### 5. Verify Backend URL
Your backend will be available at:
```
https://YOUR-USERNAME-YOUR-SPACE-NAME.hf.space
```

---

## Frontend Deployment (Vercel)

### 1. Configure Environment Variables
In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_API_BASE_URL=https://YOUR-USERNAME-YOUR-SPACE-NAME.hf.space

BETTER_AUTH_SECRET=1c609094e8da2a7943363b989dd429428fcd57e9e980800af4f84dd12df88678

NEXT_PUBLIC_APP_NAME=Todo App

NEXT_PUBLIC_APP_URL=https://YOUR-VERCEL-APP.vercel.app
```

### 2. Redeploy
After setting environment variables, trigger a new deployment:
```bash
git push origin main
```

Or use Vercel CLI:
```bash
vercel --prod
```

---

## Troubleshooting

### Issue: "An unexpected error occurred"

**Check Backend Logs:**
1. Go to your Hugging Face Space
2. Click "Logs" tab
3. Look for errors during startup or requests

**Common Issues:**

1. **Database Connection Failed**
   - Verify DATABASE_URL is correct
   - Check Neon database is active (not paused)
   - Ensure `sslmode=require` is in the connection string

2. **CORS Error**
   - Verify FRONTEND_URL matches your Vercel domain exactly
   - Check browser console for CORS errors
   - Ensure backend has `allow_credentials=True`

3. **Environment Variables Not Set**
   - Verify all variables are set in HF Spaces settings
   - Verify all variables are set in Vercel settings
   - Redeploy after setting variables

4. **Port Mismatch**
   - HF Spaces uses port 7860 by default
   - Ensure Dockerfile and app.py use port 7860

### Testing Backend Directly

Test your backend health endpoint:
```bash
curl https://YOUR-USERNAME-YOUR-SPACE-NAME.hf.space/health
```

Should return:
```json
{"status": "healthy"}
```

Test signup:
```bash
curl -X POST https://YOUR-USERNAME-YOUR-SPACE-NAME.hf.space/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"testpass123"}'
```

### Check Frontend API URL

In browser console:
```javascript
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
```

Should show your HF Spaces URL, NOT localhost.

---

## Security Checklist

- [ ] BETTER_AUTH_SECRET is the same on frontend and backend
- [ ] DATABASE_URL uses SSL (`sslmode=require`)
- [ ] FRONTEND_URL matches your actual Vercel domain
- [ ] No secrets are committed to git
- [ ] CORS is configured with specific origins (not "*")
