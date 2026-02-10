"""
Apply migration to rename completed to is_completed in tasks table
"""

import asyncio
import asyncpg

DATABASE_URL = "postgresql://neondb_owner:npg_xV4ot9RByAGZ@ep-long-haze-aif4l1wo-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"


async def apply_migration():
    """Rename completed to is_completed in tasks table."""

    conn = None
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print("Connected to database successfully!\n")

        # Check current column name
        print("Checking current column name...")
        columns = await conn.fetch("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'tasks' AND column_name IN ('completed', 'is_completed');
        """)

        column_names = [col['column_name'] for col in columns]
        print(f"Found columns: {column_names}\n")

        if 'completed' in column_names:
            print("Renaming completed to is_completed...")
            await conn.execute("ALTER TABLE tasks RENAME COLUMN completed TO is_completed;")
            print("SUCCESS\n")
        elif 'is_completed' in column_names:
            print("Column already named is_completed - no change needed\n")
        else:
            print("ERROR: Neither completed nor is_completed found in tasks table\n")
            return

        # Verify
        print("Verifying column...")
        result = await conn.fetch("""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'tasks' AND column_name = 'is_completed';
        """)

        if result:
            print(f"Verified: {result[0]}")
            print("\nMigration completed successfully!")
        else:
            print("WARNING: is_completed column not found after migration")

    except Exception as e:
        print(f"\nMigration failed: {e}")
        import traceback
        traceback.print_exc()

    finally:
        if conn:
            await conn.close()
            print("\nDatabase connection closed.")


if __name__ == "__main__":
    asyncio.run(apply_migration())
