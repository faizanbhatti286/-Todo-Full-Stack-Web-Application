# Frontend Testing Guide - Username Authentication

## Prerequisites
✅ Backend running on port 8080
✅ Frontend running on port 3000
⚠️ Frontend needs restart to connect to backend on port 8080

## Step 1: Restart Frontend

The frontend needs to be restarted to pick up the environment variable changes.

**Option A - Stop and Restart Manually:**
1. Find the terminal running `npm run dev`
2. Press `Ctrl+C` to stop it
3. Run `npm run dev` again

**Option B - Use the restart script:**
```bash
cd "C:\Users\Admin\Desktop\hackathon-2 phase2\frontend"
restart_frontend.bat
```

## Step 2: Test Signup Flow

### 2.1 Open Signup Page
Navigate to: http://localhost:3000/signup

### 2.2 Fill in the Form
- **Username:** `frontendtest` (3-20 chars, letters/numbers/underscore)
- **Email:** `frontend@test.com`
- **Password:** `testpass123` (min 8 chars)
- **Confirm Password:** `testpass123`

### 2.3 Expected Behavior
✅ Form validates input (shows errors for invalid data)
✅ On submit, shows success message
✅ Redirects to `/tasks` page
✅ User is logged in

### 2.4 Check Browser Console
Press F12 to open DevTools and check:
- Network tab: Should see POST to `http://localhost:8080/auth/signup`
- Console: Should not have errors
- Response: Should include `access_token`, `username`, `email`

## Step 3: Test Login with Username

### 3.1 Logout First
If logged in, logout from the app

### 3.2 Open Login Page
Navigate to: http://localhost:3000/login

### 3.3 Fill in the Form
- **Username or Email:** `frontendtest` (use the username)
- **Password:** `testpass123`

### 3.4 Expected Behavior
✅ On submit, shows success message
✅ Redirects to `/tasks` page
✅ User is logged in

### 3.5 Check Browser Console
- Network tab: Should see POST to `http://localhost:8080/auth/signin`
- Payload should include: `{"username_or_email":"frontendtest","password":"testpass123"}`

## Step 4: Test Login with Email

### 4.1 Logout Again
Logout from the app

### 4.2 Open Login Page
Navigate to: http://localhost:3000/login

### 4.3 Fill in the Form
- **Username or Email:** `frontend@test.com` (use the email)
- **Password:** `testpass123`

### 4.4 Expected Behavior
✅ On submit, shows success message
✅ Redirects to `/tasks` page
✅ User is logged in

## Step 5: Test Validation Errors

### 5.1 Test Invalid Username
On signup page, try:
- Username with spaces: `test user` → Should show error
- Username too short: `ab` → Should show error
- Username with special chars: `test@user` → Should show error

### 5.2 Test Invalid Email
- Invalid format: `notanemail` → Should show error

### 5.3 Test Password Mismatch
- Password: `password123`
- Confirm Password: `different123` → Should show error

### 5.4 Test Duplicate Username
Try to signup with username `frontendtest` again → Should show "Username already taken"

### 5.5 Test Duplicate Email
Try to signup with email `frontend@test.com` again → Should show "Email already registered"

## Troubleshooting

### Issue: "Network Error" or "Failed to fetch"
**Cause:** Frontend not connecting to backend
**Solution:**
1. Verify backend is running: `curl http://localhost:8080/health`
2. Check `.env.local` has: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`
3. Restart frontend to pick up environment variables

### Issue: CORS Error in Console
**Cause:** Backend CORS not configured for frontend
**Solution:** Backend should already have CORS configured for `http://localhost:3000`

### Issue: "Invalid credentials" on login
**Cause:** User doesn't exist or wrong password
**Solution:**
1. Try signup first to create the user
2. Verify password is correct

### Issue: Validation errors not showing
**Cause:** Frontend validation not working
**Solution:** Check browser console for JavaScript errors

## Expected API Calls

### Signup Request
```
POST http://localhost:8080/auth/signup
Content-Type: application/json

{
  "username": "frontendtest",
  "email": "frontend@test.com",
  "password": "testpass123"
}
```

### Signup Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "uuid-here",
  "username": "frontendtest",
  "email": "frontend@test.com"
}
```

### Login Request
```
POST http://localhost:8080/auth/signin
Content-Type: application/json

{
  "username_or_email": "frontendtest",
  "password": "testpass123"
}
```

### Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "uuid-here",
  "username": "frontendtest",
  "email": "frontend@test.com"
}
```

## Success Checklist

- [ ] Frontend restarted and connecting to port 8080
- [ ] Can create new account with username
- [ ] Can login with username
- [ ] Can login with email
- [ ] Validation errors show correctly
- [ ] Duplicate username/email errors show correctly
- [ ] JWT token stored in sessionStorage
- [ ] User redirects to /tasks after login
- [ ] No console errors in browser

## Quick Test Commands

Test backend is accessible from frontend:
```bash
curl http://localhost:8080/health
# Should return: {"status":"healthy"}
```

Check if frontend environment is correct:
```bash
cat frontend/.env.local | grep API_BASE_URL
# Should show: NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Next Steps After Testing

Once frontend testing is complete:
1. Test the complete user flow (signup → login → tasks)
2. Test logout functionality
3. Test protected routes (accessing /tasks without login)
4. Test token expiration (after 7 days)

---

**Current Status:**
- ✅ Backend: Running on port 8080
- ✅ Frontend: Running on port 3000
- ⚠️ Action Required: Restart frontend to connect to backend

**Start Testing:**
1. Restart frontend
2. Open http://localhost:3000/signup
3. Follow the test steps above
