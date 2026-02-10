"""
Apply database migration using asyncpg

Simple migration script that uses asyncpg directly.
"""

import asyncio
import sys
from pathlib import Path
import os

try:
    import asyncpg
except ImportError:
    print("ERROR: asyncpg not installed. Install with: pip install asyncpg")
    sys.exit(1)

# Database URL from environment or hardcoded
DATABASE_URL = "postgresql://neondb_owner:npg_xV4ot9RByAGZ@ep-long-haze-aif4l1wo-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require"


async def apply_migration(migration_file: str):
    """Apply a SQL migration file to the database."""

    # Read migration file
    migration_path = Path(migration_file)
    if not migration_path.exists():
        print(f"ERROR: Migration file not found: {migration_file}")
        sys.exit(1)

    print(f"Reading migration file: {migration_file}")
    sql_content = migration_path.read_text()

    # Parse connection string
    print(f"\nConnecting to database...")

    conn = None
    try:
        # Connect to database
        conn = await asyncpg.connect(DATABASE_URL)

        print("Connected successfully!")
        print("\nApplying migration...\n")

        # Split SQL statements by semicolon and execute each
        statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().startswith('--')]

        for i, statement in enumerate(statements, 1):
            if statement and not statement.strip().upper().startswith('SELECT'):
                print(f"Executing statement {i}/{len(statements)}...")
                print(f"SQL: {statement[:80]}...")
                await conn.execute(statement)
                print("SUCCESS\n")
            elif statement.strip().upper().startswith('SELECT'):
                print(f"Executing verification query...")
                rows = await conn.fetch(statement)
                print(f"Results: {rows}\n")

        print("Migration applied successfully!")

    except Exception as e:
        print(f"\nMigration failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    finally:
        if conn:
            await conn.close()
            print("\nDatabase connection closed.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python apply_migration_fixed.py <migration_file>")
        print("Example: python apply_migration_fixed.py migrations/002_add_username_to_users_v2.sql")
        sys.exit(1)

    migration_file = sys.argv[1]
    asyncio.run(apply_migration(migration_file))
