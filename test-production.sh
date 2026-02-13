#!/bin/bash

# Quick Deployment Test Script
# Tests if your production backend is working correctly

BACKEND_URL="https://faizan-bhatti-todo-full-stack-web-application.hf.space"
FRONTEND_URL="https://frontend-ruddy-eight-97.vercel.app"

echo "🧪 Testing Production Deployment"
echo "================================"
echo ""

# Test 1: Backend Health Check
echo "1️⃣ Testing Backend Health..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/health" 2>/dev/null)
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Backend is healthy"
    echo "   Response: $BODY"
else
    echo "   ❌ Backend health check failed (HTTP $HTTP_CODE)"
    echo "   Response: $BODY"
    exit 1
fi

echo ""

# Test 2: Backend Root Endpoint
echo "2️⃣ Testing Backend Root..."
ROOT_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/" 2>/dev/null)
HTTP_CODE=$(echo "$ROOT_RESPONSE" | tail -n1)
BODY=$(echo "$ROOT_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Backend root endpoint working"
    echo "   Response: $BODY"
else
    echo "   ❌ Backend root failed (HTTP $HTTP_CODE)"
fi

echo ""

# Test 3: CORS Preflight
echo "3️⃣ Testing CORS Configuration..."
CORS_RESPONSE=$(curl -s -I -X OPTIONS "$BACKEND_URL/auth/signup" \
    -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" 2>/dev/null)

if echo "$CORS_RESPONSE" | grep -q "access-control-allow-origin"; then
    echo "   ✅ CORS is configured"
    ALLOWED_ORIGIN=$(echo "$CORS_RESPONSE" | grep -i "access-control-allow-origin" | cut -d' ' -f2 | tr -d '\r')
    echo "   Allowed Origin: $ALLOWED_ORIGIN"
else
    echo "   ⚠️  CORS headers not found (may need to check backend logs)"
fi

echo ""

# Test 4: Signup Endpoint (without actually creating user)
echo "4️⃣ Testing Signup Endpoint..."
SIGNUP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/auth/signup" \
    -H "Content-Type: application/json" \
    -H "Origin: $FRONTEND_URL" \
    -d '{"username":"","email":"","password":""}' 2>/dev/null)
HTTP_CODE=$(echo "$SIGNUP_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "400" ] || [ "$HTTP_CODE" = "422" ]; then
    echo "   ✅ Signup endpoint is responding (validation working)"
elif [ "$HTTP_CODE" = "500" ]; then
    echo "   ❌ Signup endpoint returning 500 (check backend logs for database errors)"
else
    echo "   ⚠️  Unexpected response code: $HTTP_CODE"
fi

echo ""

# Test 5: Frontend Accessibility
echo "5️⃣ Testing Frontend..."
FRONTEND_RESPONSE=$(curl -s -w "\n%{http_code}" "$FRONTEND_URL" 2>/dev/null)
HTTP_CODE=$(echo "$FRONTEND_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Frontend is accessible"
else
    echo "   ❌ Frontend returned HTTP $HTTP_CODE"
fi

echo ""
echo "================================"
echo "✅ Basic tests complete!"
echo ""
echo "Next steps:"
echo "1. If all tests passed, try signup/login in browser"
echo "2. If tests failed, check PRODUCTION_FIX.md for troubleshooting"
echo "3. Check browser console (F12) for any client-side errors"
