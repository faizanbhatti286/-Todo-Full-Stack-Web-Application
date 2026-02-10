"""
Apply database migration with detailed logging
"""

import asyncio
import asyncpg

DATABASE_URL = "postgresql://neondb_owner:npg_xV4ot9RByAGZ@ep-long-haze-aif4l1wo-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"


async def apply_migration():
    """Apply migration to add username column."""

    conn = None
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print("Connected to database successfully!\n")

        # Step 1: Add username column as nullable
        print("Step 1: Adding username column...")
        await conn.execute("""
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS username VARCHAR(20);
        """)
        print("SUCCESS\n")

        # Step 2: Update existing users with generated usernames
        print("Step 2: Updating existing users with generated usernames...")
        result = await conn.execute("""
            UPDATE users
            SET username = CONCAT('user_', SUBSTRING(CAST(id AS TEXT), 1, 8))
            WHERE username IS NULL;
        """)
        print(f"Updated {result} rows\n")

        # Step 3: Make username NOT NULL
        print("Step 3: Making username NOT NULL...")
        await conn.execute("""
            ALTER TABLE users
            ALTER COLUMN username SET NOT NULL;
        """)
        print("SUCCESS\n")

        # Step 4: Add UNIQUE constraint
        print("Step 4: Adding UNIQUE constraint...")
        await conn.execute("""
            ALTER TABLE users
            ADD CONSTRAINT users_username_key UNIQUE (username);
        """)
        print("SUCCESS\n")

        # Step 5: Create index
        print("Step 5: Creating index on username...")
        await conn.execute("""
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        """)
        print("SUCCESS\n")

        # Verify
        print("Verifying username column...")
        rows = await conn.fetch("""
            SELECT column_name, data_type, character_maximum_length, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users' AND column_name = 'username';
        """)

        if rows:
            print("Username column details:")
            for row in rows:
                print(f"  {row}")
        else:
            print("WARNING: Username column not found!")

        print("\nMigration completed successfully!")

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
