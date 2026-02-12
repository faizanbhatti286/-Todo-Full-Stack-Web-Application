---
name: database-skill
description: Design relational database schemas, create tables, and manage migrations with best practices.
---

# Database Skill

## Instructions

1. **Schema Design**
   - Identify entities and relationships
   - Normalize data where appropriate
   - Define primary and foreign keys

2. **Table Creation**
   - Choose correct data types
   - Apply constraints (NOT NULL, UNIQUE)
   - Add indexes for performance

3. **Migrations**
   - Create versioned migration files
   - Apply schema changes incrementally
   - Support rollback and re-runs safely

4. **Relationships**
   - One-to-one
   - One-to-many
   - Many-to-many (join tables)

5. **Data Integrity**
   - Enforce referential integrity
   - Use cascading rules carefully
   - Prevent orphaned records

## Core Concepts

### Tables & Columns
- Each table represents a single entity
- Columns should be atomic and meaningful
- Avoid storing derived data unless necessary

### Primary & Foreign Keys
- Primary keys uniquely identify rows
- Foreign keys define relationships
- Use indexes on foreign keys

### Migrations
- Track schema changes over time
- Keep migrations small and reversible
- Never edit applied migrations

## Best Practices
- Use snake_case for table and column names
- Prefer UUIDs for distributed systems
- Add timestamps (`created_at`, `updated_at`)
- Index frequently queried columns
- Avoid over-normalization
- Test migrations in staging before production

## Example Table Schema
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
