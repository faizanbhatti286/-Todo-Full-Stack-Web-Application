# Testing the Username Authentication Feature

## Prerequisites
- Database migration has been applied (username column added)
- Backend code updated to support username authentication
- Frontend updated to collect and send username

## Starting the Backend

1. Navigate to the backend directory:
```bash
cd "C:\Users\Admin\Desktop\hackathon-2 phase2\backend"
```

2. Start the backend server:
```bash
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8080
```

Note: Using port 8080 since port 8000 appears to be in use by another application.

## Testing Authentication Endpoints

### 1. Test Signup with Username

```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user_id": "uuid-here",
  "username": "johndoe",
  "email": "john@example.com"
}
```

### 2. Test Login with Username

```bash
curl -X POST http://localhost:8080/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username_or_email": "johndoe",
    "password": "password123"
  }'
```

### 3. Test Login with Email

```bash
curl -X POST http://localhost:8080/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "username_or_email": "john@example.com",
    "password": "password123"
  }'
```

## Frontend Testing

1. Update the frontend API base URL if using port 8080:
   - Edit `frontend/.env.local` or `frontend/.env`
   - Set: `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080`

2. Start the frontend (if not already running):
```bash
cd "C:\Users\Admin\Desktop\hackathon-2 phase2\frontend"
npm run dev
```

3. Test the flows:
   - Navigate to http://localhost:3000/signup
   - Create an account with username, email, and password
   - Logout and try logging in with username
   - Logout and try logging in with email

## Common Issues

### Issue: Port 8000 already in use
**Solution**: Use port 8080 or another available port

### Issue: Module not found errors
**Solution**: Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Issue: Database connection errors
**Solution**: Verify .env file has correct DATABASE_URL

### Issue: CORS errors in frontend
**Solution**: Ensure backend CORS settings include the frontend URL
