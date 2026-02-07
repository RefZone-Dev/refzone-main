-- Fix admin delete policies for scenarios and quizzes
-- These policies need to properly check if the user is an admin

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can delete scenarios" ON public.scenarios;
DROP POLICY IF EXISTS "Admins can delete quizzes" ON public.quizzes;
DROP POLICY IF EXISTS "Admins can delete quiz_questions" ON public.quiz_questions;

-- Recreate with proper admin check
CREATE POLICY "Admins can delete scenarios" ON public.scenarios
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete quizzes" ON public.quizzes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete quiz_questions" ON public.quiz_questions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Also ensure scenario_responses and quiz_attempts have cascade delete
-- (They should already via foreign key, but let's ensure admins can also delete them directly)
DROP POLICY IF EXISTS "Admins can delete scenario_responses" ON public.scenario_responses;
DROP POLICY IF EXISTS "Admins can delete quiz_attempts" ON public.quiz_attempts;
DROP POLICY IF EXISTS "Admins can delete quiz_answers" ON public.quiz_answers;

CREATE POLICY "Admins can delete scenario_responses" ON public.scenario_responses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete quiz_attempts" ON public.quiz_attempts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete quiz_answers" ON public.quiz_answers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );
