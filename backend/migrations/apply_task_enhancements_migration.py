"""
Apply task enhancements migration to add category and status fields.

This script adds category and status columns to the tasks table.
"""

import asyncio
import asyncpg
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def apply_migration():
    """Apply the task enhancements migration."""
    if not DATABASE_URL:
        print("ERROR: DATABASE_URL not found in environment variables")
        return False

    try:
        # Fix DATABASE_URL if it has +asyncpg scheme
        db_url = DATABASE_URL.replace('postgresql+asyncpg://', 'postgresql://')

        # Connect to database
        conn = await asyncpg.connect(db_url)
        print("SUCCESS: Connected to database")

        # Read migration file
        migration_file = "migrations/004_add_task_category_status.sql"
        with open(migration_file, 'r') as f:
            migration_sql = f.read()

        # Execute migration
        await conn.execute(migration_sql)
        print("SUCCESS: Migration applied successfully")

        # Verify the changes
        result = await conn.fetch("""
            SELECT column_name, data_type, column_default
            FROM information_schema.columns
            WHERE table_name = 'tasks'
            AND column_name IN ('category', 'status')
            ORDER BY column_name;
        """)

        print("\nVerification - New columns:")
        for row in result:
            print(f"  - {row['column_name']}: {row['data_type']} (default: {row['column_default']})")

        # Close connection
        await conn.close()
        print("\nSUCCESS: Migration completed successfully!")
        return True

    except Exception as e:
        print(f"ERROR: Migration failed: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(apply_migration())
    exit(0 if success else 1)
