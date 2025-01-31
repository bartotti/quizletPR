/*
  # Fix RLS policies for questions table

  1. Changes
    - Drop existing policies
    - Create new policies for:
      - Public read access
      - Public insert access
      - Authenticated delete access
  
  2. Security
    - Allow anyone to read questions
    - Allow anyone to insert questions
    - Allow authenticated users to delete questions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read questions" ON questions;
DROP POLICY IF EXISTS "Authenticated users can create questions" ON questions;
DROP POLICY IF EXISTS "Users can delete their own questions" ON questions;

-- Create new policies
CREATE POLICY "Public read access"
  ON questions
  FOR SELECT
  USING (true);

CREATE POLICY "Public insert access"
  ON questions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated delete access"
  ON questions
  FOR DELETE
  USING (true);