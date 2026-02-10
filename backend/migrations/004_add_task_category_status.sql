-- Migration: Add category and status fields to tasks table
-- Date: 2026-02-10
-- Description: Adds category (VARCHAR 50, default 'general') and status (VARCHAR 20, default 'pending') to tasks

-- Add category column
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general';

-- Add status column
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);

-- Update existing tasks to have default values
UPDATE tasks SET category = 'general' WHERE category IS NULL;
UPDATE tasks SET status = 'pending' WHERE status IS NULL;
