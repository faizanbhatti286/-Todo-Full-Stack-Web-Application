"""
Check database schema for users table
"""

import asyncio
import asyncpg

DATABASE_URL = "postgresql://neondb_owner:npg_xV4ot9RByAGZ@ep-long-haze-aif4l1wo-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"


async def check_schema():
    """Check the current schema of the users table."""

    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print("Connected to database successfully!\n")

        # Check columns in users table
        print("=== Users Table Columns ===")
        columns = await conn.fetch("""
            SELECT column_name, data_type, character_maximum_length, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position;
        """)

        for col in columns:
            print(f"  {col['column_name']}: {col['data_type']}", end="")
            if col['character_maximum_length']:
                print(f"({col['character_maximum_length']})", end="")
            print(f" - {'NULL' if col['is_nullable'] == 'YES' else 'NOT NULL'}")

        # Check constraints
        print("\n=== Users Table Constraints ===")
        constraints = await conn.fetch("""
            SELECT constraint_name, constraint_type
            FROM information_schema.table_constraints
            WHERE table_name = 'users';
        """)

        for constraint in constraints:
            print(f"  {constraint['constraint_name']}: {constraint['constraint_type']}")

        # Check indexes
        print("\n=== Users Table Indexes ===")
        indexes = await conn.fetch("""
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE tablename = 'users';
        """)

        for idx in indexes:
            print(f"  {idx['indexname']}")
            print(f"    {idx['indexdef']}")

        await conn.close()
        print("\nDatabase connection closed.")

    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(check_schema())
