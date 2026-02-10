"""
Apply database migration script

This script reads and executes SQL migration files against the database.
"""

import asyncio
import sys
from pathlib import Path
from sqlalchemy.ext.asyncio import create_async_engine
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env file")
    sys.exit(1)

# Convert postgresql:// to postgresql+asyncpg://
if DATABASE_URL.startswith('postgresql://'):
    DATABASE_URL = DATABASE_URL.replace('postgresql://', 'postgresql+asyncpg://', 1)


async def apply_migration(migration_file: str):
    """Apply a SQL migration file to the database."""

    # Read migration file
    migration_path = Path(migration_file)
    if not migration_path.exists():
        print(f"ERROR: Migration file not found: {migration_file}")
        sys.exit(1)

    print(f"Reading migration file: {migration_file}")
    sql_content = migration_path.read_text()

    # Create engine
    engine = create_async_engine(DATABASE_URL, echo=True)

    try:
        # Execute migration
        print("\nApplying migration...")
        async with engine.begin() as conn:
            # Split SQL statements by semicolon and execute each
            statements = [s.strip() for s in sql_content.split(';') if s.strip()]

            for i, statement in enumerate(statements, 1):
                if statement:
                    print(f"\nExecuting statement {i}/{len(statements)}...")
                    result = await conn.execute(statement)

                    # Try to fetch results if it's a SELECT statement
                    if statement.strip().upper().startswith('SELECT'):
                        rows = result.fetchall()
                        if rows:
                            print(f"Results: {rows}")

        print("\n✓ Migration applied successfully!")

    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        sys.exit(1)

    finally:
        await engine.dispose()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python apply_migration.py <migration_file>")
        print("Example: python apply_migration.py migrations/002_add_username_to_users.sql")
        sys.exit(1)

    migration_file = sys.argv[1]
    asyncio.run(apply_migration(migration_file))
