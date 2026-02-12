# Quick Start Guide - Username Authentication Testing

## ✅ Completed Setup

All code changes have been implemented:
- ✅ Database migration applied (username column added)
- ✅ Backend updated to support username/email login
- ✅ Frontend updated with username fields
- ✅ Configuration files created

## 🚀 Starting the Application

### Step 1: Start the Backend

**Option A - Using the batch file (Windows):**
```bash
cd "C:\Users\Admin\Desktop\hackathon-2 phase2\backend"
start_backend.bat
```

**Option B - Manual command:**
```bash
cd "C:\Users\Admin\Desktop\hackathon-2 phase2\backend"
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8080
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8080
INFO:     Application startup complete.
```

**Verify Backend:**
```bash
curl http://localhost:8080/health
```
Should return: `{"status":"healthy"}`

### Step 2: Restart the Frontend

The frontend needs to be restarted to pick up the new API URL (port 8080).

**Stop the current frontend** (Ctrl+C in the terminal where it's running)

**Start it again:**
```bash
cd "C:\Users\Admin\Desktop\hackathon-2 phase2\frontend"
npm run dev
```

**Expected Output:**
```
- Local:        http://localhost:3000
- Ready in X.Xs
```

## 🧪 Testing the Authentication Flow

### Test 1: Create a New Account

1. **Open browser:** http://localhost:3000/signup

2. **Fill in the form:**
   - Username: `testuser` (3-20 chars, letters/numbers/underscore only)
   - Email: `test@example.com`
   - Password: `password123` (min 8 chars)
   - Confirm Password: `password123`

3. **Click "Sign Up"**

4. **Expected Result:**
   - ✅ Success message appears
   - ✅ Redirects to `/tasks` page
   - ✅ User is logged in

### Test 2: Login with Username

1. **Logout** (if logged in)

2. **Open browser:** http://localhost:3000/login

3. **Fill in the form:**
   - Username or Email: `testuser` (enter the username)
   - Password: `password123`

4. **Click "Sign In"**

5. **Expected Result:**
   - ✅ Success message appears
   - ✅ Redirects to `/tasks` page
   - ✅ User is logged in

### Test 3: Login with Email

1. **Logout** (if logged in)

2. **Open browser:** http://localhost:3000/login

3. **Fill in the form:**
   - Username or Email: `test@example.com` (enter the email)
   - Password: `password123`

4. **Click "Sign In"**

5. **Expected Result:**
   - ✅ Success message appears
   - ✅ Redirects to `/tasks` page
   - ✅ User is logged in

### Test 4: Validation Errors

**Test invalid username:**
- Try username with spaces: `test user` → Should show error
- Try username too short: `ab` → Should show error
- Try username with special chars: `test@user` → Should show error

**Test invalid email:**
- Try invalid format: `notanemail` → Should show error

**Test password mismatch:**
- Enter different passwords in signup → Should show error

**Test duplicate username:**
- Try to signup with existing username → Should show "Username already taken"

**Test duplicate email:**
- Try to signup with existing email → Should show "Email already registered"

## 🔍 Debugging

### Backend Not Starting?

**Check if port 8080 is available:**
```bash
netstat -ano | grep ":8080"
```

**Check Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

**Check database connection:**
- Verify `.env` file exists in backend directory
- Verify `DATABASE_URL` is correct

### Frontend Not Connecting?

**Check environment variable:**
```bash
cat frontend/.env.local
```
Should show: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`

**Check browser console:**
- Open DevTools (F12)
- Look for CORS errors or network errors
- Verify API calls are going to `localhost:8080`

**Restart frontend after .env changes:**
- Frontend must be restarted to pick up environment variable changes

### CORS Errors?

**Update backend CORS settings:**
Edit `backend/src/main.py` and ensure:
```python
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

## 📊 API Testing (Optional)

### Test Signup Endpoint Directly

```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apitest",
    "email": "apitest@example.com",
    "password": "testpass123"
  }'
```

**Expected Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user_id": "uuid-here",
  "username": "apitest",
  "email": "apitest@example.com"
}
```

### Test Signin Endpoint with Username

```bash
curl -X POST http://localhost:8080/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username_or_email": "apitest",
    "password": "testpass123"
  }'
```

### Test Signin Endpoint with Email

```bash
curl -X POST http://localhost:8080/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username_or_email": "apitest@example.com",
    "password": "testpass123"
  }'
```

## ✅ Success Checklist

- [ ] Backend starts successfully on port 8080
- [ ] Frontend starts successfully on port 3000
- [ ] Can create new account with username
- [ ] Can login with username
- [ ] Can login with email
- [ ] Validation errors show correctly
- [ ] Duplicate username/email errors show correctly
- [ ] JWT token includes username
- [ ] User redirects to /tasks after login

## 📝 Notes

- **Port Configuration:** Backend uses port 8080 (not 8000) because port 8000 is occupied
- **Environment Variables:** Frontend must be restarted after changing .env.local
- **Database:** Migration has been applied, username column exists
- **JWT Tokens:** Include user_id, username, and email in payload
- **Session Storage:** Auth tokens stored in browser sessionStorage

## 🎉 What's Working

The username authentication feature is fully implemented with:
- Username-based signup and login
- Email-based login (alternative to username)
- Client-side validation (format, length, matching passwords)
- Server-side validation (uniqueness, format)
- JWT token generation with username
- Secure password hashing with bcrypt
- Database constraints (unique username and email)
- Proper error messages for all scenarios

Ready to test! 🚀
