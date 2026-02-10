"""
Apply migration to add updated_at column to tasks table
"""

import asyncio
import asyncpg

DATABASE_URL = "postgresql://neondb_owner:npg_xV4ot9RByAGZ@ep-long-haze-aif4l1wo-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"


async def apply_migration():
    """Add updated_at column to tasks table."""

    conn = None
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print("Connected to database successfully!\n")

        # Check if updated_at exists
        print("Checking if updated_at column exists...")
        columns = await conn.fetch("""
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'tasks' AND column_name = 'updated_at';
        """)

        if columns:
            print("Column updated_at already exists - no change needed\n")
            return

        print("Adding updated_at column...")
        await conn.execute("""
            ALTER TABLE tasks
            ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
        """)
        print("SUCCESS\n")

        # Create or recreate the trigger
        print("Creating trigger for auto-updating updated_at...")
        await conn.execute("""
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        """)

        await conn.execute("""
            DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
        """)

        await conn.execute("""
            CREATE TRIGGER update_tasks_updated_at
                BEFORE UPDATE ON tasks
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        """)
        print("SUCCESS\n")

        # Verify
        print("Verifying column...")
        result = await conn.fetch("""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'tasks' AND column_name = 'updated_at';
        """)

        if result:
            print(f"Verified: {result[0]}")
            print("\nMigration completed successfully!")
        else:
            print("WARNING: updated_at column not found after migration")

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
