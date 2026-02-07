-- Add RLS policies for admins to manage scenarios and quizzes
-- This ensures admins can create, update, and delete scenarios and quizzes

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Admins can insert scenarios" ON scenarios;
DROP POLICY IF EXISTS "Admins can update scenarios" ON scenarios;
DROP POLICY IF EXISTS "Admins can delete scenarios" ON scenarios;
DROP POLICY IF EXISTS "Admins can insert quizzes" ON quizzes;
DROP POLICY IF EXISTS "Admins can update quizzes" ON quizzes;
DROP POLICY IF EXISTS "Admins can delete quizzes" ON quizzes;
DROP POLICY IF EXISTS "Admins can insert quiz_questions" ON quiz_questions;
DROP POLICY IF EXISTS "Admins can update quiz_questions" ON quiz_questions;
DROP POLICY IF EXISTS "Admins can delete quiz_questions" ON quiz_questions;

-- Scenarios policies for admins
CREATE POLICY "Admins can insert scenarios" ON scenarios
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update scenarios" ON scenarios
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete scenarios" ON scenarios
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Quizzes policies for admins
CREATE POLICY "Admins can insert quizzes" ON quizzes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update quizzes" ON quizzes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete quizzes" ON quizzes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Quiz questions policies for admins
CREATE POLICY "Admins can insert quiz_questions" ON quiz_questions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update quiz_questions" ON quiz_questions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete quiz_questions" ON quiz_questions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );
