# Database Migrations

This directory contains SQL migration scripts for the Todo application database.

## Migration Files

1. **001_initial_schema.sql** - Initial database schema with users and tasks tables
2. **002_add_username_to_users.sql** - Adds username column to users table for username/email login

## How to Apply Migrations

### Using psql command line

If you have the DATABASE_URL environment variable set:

```bash
psql $DATABASE_URL -f migrations/002_add_username_to_users.sql
```

Or with the full connection string:

```bash
psql "postgresql://user:password@host:port/database?sslmode=require" -f migrations/002_add_username_to_users.sql
```

### Using Neon SQL Editor

1. Log in to your Neon console
2. Navigate to your database
3. Open the SQL Editor
4. Copy and paste the contents of the migration file
5. Execute the SQL

### Auto-initialization

The application uses SQLModel's `create_all()` which will automatically create tables on startup. However, for schema changes like adding columns, you need to run migrations manually.

## Migration 002: Add Username Column

This migration adds username support to the authentication system:

- Adds `username` column (VARCHAR(20), UNIQUE, NOT NULL)
- Creates index on username for fast lookups
- Handles existing users by generating temporary usernames from their user IDs
- Existing users will need to update their usernames after migration

## Rollback

To rollback migration 002:

```sql
-- Remove username column
ALTER TABLE users DROP COLUMN IF EXISTS username;

-- Remove index
DROP INDEX IF EXISTS idx_users_username;
```
