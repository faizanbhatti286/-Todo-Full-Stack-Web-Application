---
name: auth-skill
description: Implement secure authentication with signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Authentication Skill

## Instructions

1. **User Signup**
   - Validate input (email, password strength)
   - Hash passwords before storing
   - Prevent duplicate accounts

2. **User Signin**
   - Verify credentials securely
   - Compare hashed passwords
   - Return auth tokens on success

3. **Password Security**
   - Use modern hashing algorithms (bcrypt, argon2)
   - Apply salting automatically
   - Never store plain-text passwords

4. **JWT Authentication**
   - Generate access tokens on login
   - Include user ID and role in payload
   - Set expiration and refresh strategy

5. **Better Auth Integration**
   - Configure providers
   - Use built-in session handling
   - Leverage adapters for database support

## Core Concepts

### Password Hashing
- One-way encryption
- Resistant to rainbow table attacks
- Adjustable cost factor for future-proofing

### JWT Tokens
- Stateless authentication
- Signed (not encrypted)
- Sent via Authorization headers or HTTP-only cookies

### Sessions vs Tokens
- Tokens scale better for APIs
- Sessions simpler for monolith apps
- Better Auth supports both

## Best Practices
- Always use HTTPS
- Store JWTs in HTTP-only cookies
- Rotate secrets regularly
- Implement rate limiting on auth routes
- Add email verification and password reset flows
- Log auth events (without sensitive data)

## Example Signup Flow
```ts
// Signup handler
const hashedPassword = await bcrypt.hash(password, 12);

await db.user.create({
  email,
  password: hashedPassword,
});
