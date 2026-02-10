"""
Apply migration to rename owner_id to user_id in tasks table
"""

import asyncio
import asyncpg

DATABASE_URL = "postgresql://neondb_owner:npg_xV4ot9RByAGZ@ep-long-haze-aif4l1wo-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"


async def apply_migration():
    """Rename owner_id to user_id in tasks table."""

    conn = None
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print("Connected to database successfully!\n")

        # Check if owner_id exists
        print("Checking current column name...")
        columns = await conn.fetch("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'tasks' AND column_name IN ('owner_id', 'user_id');
        """)

        column_names = [col['column_name'] for col in columns]
        print(f"Found columns: {column_names}\n")

        if 'owner_id' in column_names:
            print("Renaming owner_id to user_id...")
            await conn.execute("ALTER TABLE tasks RENAME COLUMN owner_id TO user_id;")
            print("SUCCESS\n")
        elif 'user_id' in column_names:
            print("Column already named user_id - no change needed\n")
        else:
            print("ERROR: Neither owner_id nor user_id found in tasks table\n")
            return

        # Verify
        print("Verifying column...")
        result = await conn.fetch("""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'tasks' AND column_name = 'user_id';
        """)

        if result:
            print(f"Verified: {result[0]}")
            print("\nMigration completed successfully!")
        else:
            print("WARNING: user_id column not found after migration")

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
