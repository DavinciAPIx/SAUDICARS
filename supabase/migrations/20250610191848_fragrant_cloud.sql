/*
  # Add missing user profile columns

  1. Changes
    - Add `national_id` column to users table (nullable text field)
    - Add `driver_license` column to users table (nullable text field)
    - Ensure `is_verified` column exists with proper default

  2. Security
    - No changes to existing RLS policies needed
*/

-- Add national_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'national_id'
  ) THEN
    ALTER TABLE users ADD COLUMN national_id text;
  END IF;
END $$;

-- Add driver_license column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'driver_license'
  ) THEN
    ALTER TABLE users ADD COLUMN driver_license text;
  END IF;
END $$;

-- Ensure is_verified column exists with proper default
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE users ADD COLUMN is_verified boolean DEFAULT false;
  END IF;
END $$;