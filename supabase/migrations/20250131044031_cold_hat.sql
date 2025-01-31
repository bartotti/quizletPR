/*
  # Create questions table for quiz application

  1. New Tables
    - `questions`
      - `id` (uuid, primary key)
      - `question` (text)
      - `choices` (jsonb)
      - `correct_answer` (text)
      - `explanation` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `questions` table
    - Add policies for authenticated users to:
      - Read all questions
      - Create new questions
      - Delete their own questions
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  choices jsonb NOT NULL,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create questions"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can delete their own questions"
  ON questions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);