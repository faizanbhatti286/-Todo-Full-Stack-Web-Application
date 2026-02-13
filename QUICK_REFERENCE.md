# Quick Reference: Production Deployment

## 🎯 Your URLs

**Backend (Hugging Face):** https://faizan-bhatti-todo-full-stack-web-application.hf.space
**Frontend (Vercel):** https://frontend-ruddy-eight-97.vercel.app

---

## ⚡ Quick Fix Steps

### 1. Hugging Face Spaces (Backend)
```
Go to: https://huggingface.co/spaces/faizan-bhatti/todo-full-stack-web-application/settings

Add these 5 environment variables:
├─ DATABASE_URL = postgresql+asyncpg://neondb_owner:npg_xV4ot9RByAGZ@ep-long-haze-aif4l1wo-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
├─ BETTER_AUTH_SECRET = 1c609094e8da2a7943363b989dd429428fcd57e9e980800af4f84dd12df88678
├─ FRONTEND_URL = https://frontend-ruddy-eight-97.vercel.app
├─ PORT = 7860
└─ HOST = 0.0.0.0

Upload these files:
├─ backend/Dockerfile ✅ Created
├─ backend/app.py ✅ Created
└─ backend/src/* (all existing files)
```

### 2. Vercel (Frontend)
```
Go to: https://vercel.com/[your-project]/settings/environment-variables

Add these 4 environment variables (Production):
├─ NEXT_PUBLIC_API_BASE_URL = https://faizan-bhatti-todo-full-stack-web-application.hf.space
├─ BETTER_AUTH_SECRET = 1c609094e8da2a7943363b989dd429428fcd57e9e980800af4f84dd12df88678
├─ NEXT_PUBLIC_APP_NAME = Todo App
└─ NEXT_PUBLIC_APP_URL = https://frontend-ruddy-eight-97.vercel.app

Then: Redeploy (Deployments → ... → Redeploy)
```

---

## 🧪 Test Commands

```bash
# Test backend health
curl https://faizan-bhatti-todo-full-stack-web-application.hf.space/health

# Test signup endpoint
curl -X POST https://faizan-bhatti-todo-full-stack-web-application.hf.space/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test123","email":"test123@example.com","password":"password123"}'

# Run full test suite
bash test-production.sh
```

---

## 🔍 Troubleshooting

### Backend Issues
- **Check logs:** HF Spaces → Logs tab
- **Database connection:** Verify DATABASE_URL has `sslmode=require`
- **Port:** Must be 7860 for HF Spaces

### Frontend Issues
- **Check console:** Browser F12 → Console tab
- **Verify API URL:** Should NOT contain "localhost"
- **CORS errors:** Check FRONTEND_URL matches exactly in backend

### Common Errors
| Error | Cause | Fix |
|-------|-------|-----|
| "unexpected error" | Backend not responding | Check HF Spaces logs |
| CORS error | FRONTEND_URL mismatch | Update backend env var |
| 500 error | Database connection failed | Check DATABASE_URL format |
| API calls to localhost | Env vars not set | Set in Vercel, redeploy |

---

## 📁 Files Created

✅ `backend/Dockerfile` - Docker configuration for HF Spaces
✅ `backend/app.py` - Entry point for HF Spaces
✅ `backend/.env` - Fixed database connection string
✅ `PRODUCTION_FIX.md` - Detailed fix instructions
✅ `README_DEPLOYMENT.md` - Full deployment guide
✅ `test-production.sh` - Automated testing script
✅ `check-deployment.sh` - Pre-deployment checklist

---

## ✅ What's Fixed Locally

- ✅ Database connection string format (ssl → sslmode)
- ✅ Dockerfile for HF Spaces deployment
- ✅ Entry point (app.py) for HF Spaces
- ✅ Deployment documentation

## ⚠️ What You Need to Do

- ⚠️ Set environment variables in HF Spaces dashboard
- ⚠️ Upload Dockerfile and app.py to HF Spaces
- ⚠️ Set environment variables in Vercel dashboard
- ⚠️ Redeploy frontend on Vercel

---

## 📞 Need Help?

1. Read `PRODUCTION_FIX.md` for detailed instructions
2. Run `bash test-production.sh` to diagnose issues
3. Check HF Spaces logs for backend errors
4. Check browser console for frontend errors
