-- Rename owner_id to user_id in tasks table
-- Database: Neon Serverless PostgreSQL
-- Date: 2026-02-10

-- Rename the column
ALTER TABLE tasks RENAME COLUMN owner_id TO user_id;

-- Verify the change
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tasks' AND column_name = 'user_id';
