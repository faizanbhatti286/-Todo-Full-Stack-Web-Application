#!/bin/bash
# Test Authentication Flow

echo "Testing Username Authentication..."
echo ""

# Test 1: Signup with new user
echo "Test 1: Signup with new user"
RANDOM_USER="testuser_$(date +%s)"
RESPONSE=$(curl -s -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$RANDOM_USER\",\"email\":\"$RANDOM_USER@test.com\",\"password\":\"testpass123\"}")

if echo "$RESPONSE" | grep -q "access_token"; then
  echo "✓ Signup successful"
  TOKEN=$(echo "$RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
  USER_ID=$(echo "$RESPONSE" | grep -o '"user_id":"[^"]*"' | cut -d'"' -f4)
  USERNAME=$(echo "$RESPONSE" | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
  echo "  - Username: $USERNAME"
  echo "  - User ID: $USER_ID"
  echo "  - Token: ${TOKEN:0:20}..."
else
  echo "✗ Signup failed"
  echo "$RESPONSE"
  exit 1
fi

echo ""

# Test 2: Login with username
echo "Test 2: Login with username"
RESPONSE=$(curl -s -X POST http://localhost:8080/auth/signin \
  -H "Content-Type: application/json" \
  -d "{\"username_or_email\":\"$USERNAME\",\"password\":\"testpass123\"}")

if echo "$RESPONSE" | grep -q "access_token"; then
  echo "✓ Login with username successful"
else
  echo "✗ Login with username failed"
  echo "$RESPONSE"
  exit 1
fi

echo ""

# Test 3: Login with email
echo "Test 3: Login with email"
RESPONSE=$(curl -s -X POST http://localhost:8080/auth/signin \
  -H "Content-Type: application/json" \
  -d "{\"username_or_email\":\"$RANDOM_USER@test.com\",\"password\":\"testpass123\"}")

if echo "$RESPONSE" | grep -q "access_token"; then
  echo "✓ Login with email successful"
else
  echo "✗ Login with email failed"
  echo "$RESPONSE"
  exit 1
fi

echo ""

# Test 4: Duplicate username
echo "Test 4: Duplicate username (should fail)"
RESPONSE=$(curl -s -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"email\":\"different@test.com\",\"password\":\"testpass123\"}")

if echo "$RESPONSE" | grep -q "Username already taken"; then
  echo "✓ Duplicate username correctly rejected"
else
  echo "✗ Duplicate username not detected"
  echo "$RESPONSE"
fi

echo ""

# Test 5: Duplicate email
echo "Test 5: Duplicate email (should fail)"
RESPONSE=$(curl -s -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"different_user\",\"email\":\"$RANDOM_USER@test.com\",\"password\":\"testpass123\"}")

if echo "$RESPONSE" | grep -q "Email already registered"; then
  echo "✓ Duplicate email correctly rejected"
else
  echo "✗ Duplicate email not detected"
  echo "$RESPONSE"
fi

echo ""
echo "========================================="
echo "All tests completed successfully! ✓"
echo "========================================="
