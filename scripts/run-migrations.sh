#!/bin/bash

# Run the first migration to add new fields and copy data
echo "Running first migration to add new fields and copy data..."
psql "$DIRECT_URL" -f prisma/migrations/20240720_update_user_model.sql

# Generate Prisma client with updated schema
echo "Generating Prisma client with updated schema..."
npx prisma generate

# After verifying data migration, run the second migration to remove the teenPhoto column
echo "To complete the migration and remove the teenPhoto column, run:"
echo "psql \"$DIRECT_URL\" -f prisma/migrations/20240721_remove_teenphoto.sql"
echo "npx prisma generate"

echo "Migration completed successfully!" 