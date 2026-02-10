-- Add username column to users table
-- Database: Neon Serverless PostgreSQL
-- Date: 2026-02-10

-- Step 1: Add username column as nullable first
ALTER TABLE users
ADD COLUMN IF NOT EXISTS username VARCHAR(20);

-- Step 2: For existing users without username, generate one from email
-- (This handles migration of existing data)
UPDATE users
SET username = CONCAT('user_', SUBSTRING(CAST(id AS TEXT), 1, 8))
WHERE username IS NULL;

-- Step 3: Now make username NOT NULL and UNIQUE
ALTER TABLE users
ALTER COLUMN username SET NOT NULL;

ALTER TABLE users
ADD CONSTRAINT users_username_unique UNIQUE (username);

-- Step 4: Create index on username for fast lookup
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Verify column added
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'username';
