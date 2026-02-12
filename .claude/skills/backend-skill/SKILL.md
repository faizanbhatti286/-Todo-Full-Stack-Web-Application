---
name: backend-skill
description: Build backend APIs by generating routes, handling requests and responses, and connecting to a database.
---

# Backend Skill

## Instructions

1. **Route Definition**
   - Define RESTful endpoints
   - Organize routes by feature
   - Use proper HTTP methods (GET, POST, PUT, DELETE)

2. **Request Handling**
   - Parse request params, body, and headers
   - Validate incoming data
   - Handle authentication and middleware

3. **Response Handling**
   - Return consistent JSON responses
   - Use proper HTTP status codes
   - Handle errors gracefully

4. **Database Connection**
   - Initialize database client
   - Perform CRUD operations
   - Handle connection errors safely

5. **Business Logic**
   - Separate logic from route handlers
   - Reuse services across routes
   - Keep controllers thin

## Core Concepts

### Routes & Controllers
- Routes define API endpoints
- Controllers handle request logic
- Keep one responsibility per handler

### Middleware
- Runs before or after requests
- Used for auth, logging, validation
- Improves code reuse

### Database Access
- Use ORMs or query builders
- Avoid raw queries when possible
- Always handle async errors

## Best Practices
- Follow REST naming conventions
- Validate inputs on every request
- Never trust client data
- Use environment variables
- Centralize error handling
- Log errors without leaking secrets

## Example Route
```ts
app.get("/api/users/:id", async (req, res) => {
  const user = await db.user.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});
