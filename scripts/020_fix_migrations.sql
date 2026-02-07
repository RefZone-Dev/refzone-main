-- Fix migration script to make all migrations idempotent
-- This script should be run to fix any failed migrations

-- 1. Drop existing policies that may conflict (friendships)
DROP POLICY IF EXISTS "Users can view their own friendships" ON friendships;
DROP POLICY IF EXISTS "Users can send friend requests" ON friendships;
DROP POLICY IF EXISTS "Users can update friendships they're part of" ON friendships;
DROP POLICY IF EXISTS "Users can delete their own friendships" ON friendships;

-- Recreate friendships policies
CREATE POLICY "Users can view their own friendships"
  ON friendships FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can send friend requests"
  ON friendships FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendships they're part of"
  ON friendships FOR UPDATE
  USING (auth.uid() = addressee_id OR auth.uid() = requester_id);

CREATE POLICY "Users can delete their own friendships"
  ON friendships FOR DELETE
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

-- 2. Drop and recreate forum_posts moderation policy
DROP POLICY IF EXISTS "Users can view approved posts or own posts" ON forum_posts;

CREATE POLICY "Users can view approved posts or own posts" ON forum_posts
FOR SELECT USING (
  moderation_status = 'approved' 
  OR auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- 3. Drop and recreate user_law_performance policies
DROP POLICY IF EXISTS "user_law_performance_select_own" ON user_law_performance;
DROP POLICY IF EXISTS "user_law_performance_insert_own" ON user_law_performance;
DROP POLICY IF EXISTS "user_law_performance_update_own" ON user_law_performance;

CREATE POLICY "user_law_performance_select_own" ON user_law_performance
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_law_performance_insert_own" ON user_law_performance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_law_performance_update_own" ON user_law_performance
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Drop and recreate daily_activity_log policies
DROP POLICY IF EXISTS "daily_activity_log_select_own" ON daily_activity_log;
DROP POLICY IF EXISTS "daily_activity_log_insert_own" ON daily_activity_log;
DROP POLICY IF EXISTS "daily_activity_log_update_own" ON daily_activity_log;

CREATE POLICY "daily_activity_log_select_own" ON daily_activity_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "daily_activity_log_insert_own" ON daily_activity_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "daily_activity_log_update_own" ON daily_activity_log
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. Fix unique_display_name constraint (only add if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_display_name'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT unique_display_name UNIQUE (display_name);
  END IF;
END $$;

-- 6. Update achievements - clear and re-insert with correct column names
-- The achievements table has 'title' not 'name', and 'points_reward' not 'points'
DELETE FROM user_achievements;
DELETE FROM achievements;

-- Drop existing check constraint if it exists
ALTER TABLE achievements DROP CONSTRAINT IF EXISTS achievements_requirement_type_check;

-- Add updated check constraint with all requirement types
ALTER TABLE achievements ADD CONSTRAINT achievements_requirement_type_check 
CHECK (requirement_type IN (
  'scenarios', 'quizzes', 'streak', 'points', 'feedback', 
  'scenarios_completed', 'quizzes_completed', 'streak_days', 'total_points',
  'feedback_submitted', 'helpful_feedback', 'decisionlab_uses', 'decisionlab_saves',
  'decisionlab_followups', 'real_scenarios_submitted', 'decisionlab_deep',
  'reports_generated', 'sendoff_reports', 'incident_reports', 'field_reports',
  'reports_edited', 'perfect_scenarios', 'high_accuracy_scenarios', 
  'elite_accuracy_scenarios', 'correct_streak', 'perfect_quizzes',
  'foul_scenarios_correct', 'card_scenarios_correct', 'restart_scenarios_correct',
  'offside_scenarios_correct', 'setpiece_scenarios_correct', 'fast_correct_answer',
  'clutch_answers', 'perfect_week', 'daily_trifecta', 'explanations_viewed',
  'scenario_views', 'streak_correct', 'high_accuracy_20', 'high_accuracy_50',
  'perfect_quiz', 'reports'
));

-- Onboarding & Basics
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('First Steps', 'Complete your first scenario', 'footprints', 'scenarios_completed', 1, 10, 'onboarding'),
('Getting Started', 'Complete 3 scenarios', 'play', 'scenarios_completed', 3, 25, 'onboarding'),
('Breaking the Ice', 'Complete your first quiz', 'snowflake', 'quizzes_completed', 1, 10, 'onboarding'),
('Rule Curious', 'View 5 scenario explanations', 'eye', 'explanations_viewed', 5, 15, 'onboarding'),
('Confidence Builder', 'Get 3 answers correct in a row', 'trending-up', 'correct_streak', 3, 20, 'onboarding');

-- Streak Achievements
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Streak Starter', '3-day training streak', 'flame', 'streak_days', 3, 30, 'streak'),
('Week Warrior', '7-day training streak', 'flame', 'streak_days', 7, 75, 'streak'),
('Fortnight Focused', '14-day training streak', 'flame', 'streak_days', 14, 150, 'streak'),
('Iron Ref', '30-day training streak', 'shield', 'streak_days', 30, 300, 'streak'),
('Unstoppable', '60-day training streak', 'zap', 'streak_days', 60, 500, 'streak'),
('Legendary Consistency', '100-day training streak', 'crown', 'streak_days', 100, 1000, 'streak');

-- Accuracy & Performance
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Perfect Call', '100% accuracy on 5 scenarios', 'check-circle', 'perfect_scenarios', 5, 50, 'accuracy'),
('Perfect Accuracy', '100% accuracy on 10 scenarios', 'check-circle', 'perfect_scenarios', 10, 100, 'accuracy'),
('Sharpshooter', '90%+ accuracy across 20 scenarios', 'crosshair', 'high_accuracy_scenarios', 20, 150, 'accuracy'),
('Elite Decision-Maker', '95%+ accuracy across 50 scenarios', 'award', 'elite_accuracy_scenarios', 50, 400, 'accuracy'),
('No Doubt', '10 correct answers in a row', 'target', 'correct_streak', 10, 75, 'accuracy');

-- Scenario Completion
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Scenario Apprentice', 'Complete 10 scenarios', 'book-open', 'scenarios_completed', 10, 50, 'scenarios'),
('Scenario Regular', 'Complete 25 scenarios', 'book-open', 'scenarios_completed', 25, 100, 'scenarios'),
('Scenario Master', 'Complete 50 scenarios', 'graduation-cap', 'scenarios_completed', 50, 200, 'scenarios'),
('Scenario Expert', 'Complete 100 scenarios', 'medal', 'scenarios_completed', 100, 400, 'scenarios'),
('Scenario Legend', 'Complete 250 scenarios', 'trophy', 'scenarios_completed', 250, 1000, 'scenarios');

-- Quiz Achievements
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Quiz Rookie', 'Complete your first quiz', 'clipboard-list', 'quizzes_completed', 1, 10, 'quizzes'),
('Quiz Champion', 'Complete 10 quizzes', 'clipboard-check', 'quizzes_completed', 10, 75, 'quizzes'),
('Quiz Veteran', 'Complete 25 quizzes', 'award', 'quizzes_completed', 25, 150, 'quizzes'),
('Quiz Elite', 'Complete 50 quizzes', 'star', 'quizzes_completed', 50, 300, 'quizzes'),
('Perfect Quiz', 'Score 100% on a quiz', 'sparkles', 'perfect_quizzes', 1, 100, 'quizzes'),
('Quiz Dominator', '100% on 3 quizzes', 'crown', 'perfect_quizzes', 3, 250, 'quizzes');

-- DecisionLab Achievements
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('First Consultation', 'Use DecisionLab once', 'message-circle', 'decisionlab_uses', 1, 15, 'decisionlab'),
('Law Explorer', 'Ask 5 DecisionLab questions', 'search', 'decisionlab_uses', 5, 40, 'decisionlab'),
('Real-World Ref', 'Submit a real match scenario', 'globe', 'real_scenarios_submitted', 1, 50, 'decisionlab'),
('Deep Thinker', 'Complete a DecisionLab walkthrough with follow-up questions', 'brain', 'decisionlab_followups', 1, 75, 'decisionlab'),
('Decision Scholar', 'Save 10 DecisionLab analyses', 'bookmark', 'decisionlab_saves', 10, 100, 'decisionlab'),
('Ref Whisperer', '50 DecisionLab uses', 'sparkles', 'decisionlab_uses', 50, 500, 'decisionlab');

-- Match Report Builder
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Paperwork Pro', 'Generate your first report', 'file-text', 'reports_generated', 1, 15, 'reports'),
('Send-Off Specialist', 'Create 5 send-off reports', 'user-x', 'sendoff_reports', 5, 50, 'reports'),
('Incident Analyst', 'Create 5 incident reports', 'alert-triangle', 'incident_reports', 5, 50, 'reports'),
('Field Inspector', 'Create 5 field reports', 'map-pin', 'field_reports', 5, 50, 'reports'),
('Report Perfectionist', 'Edit and finalise a report before download', 'edit', 'reports_edited', 1, 25, 'reports'),
('Admin-Ready', 'Generate 10 reports total', 'folder', 'reports_generated', 10, 100, 'reports');

-- Points & Progress
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Century Club', 'Earn 100 total points', 'coins', 'total_points', 100, 0, 'points'),
('Double Century', 'Earn 200 points', 'coins', 'total_points', 200, 0, 'points'),
('High Roller', 'Earn 500 points', 'gem', 'total_points', 500, 0, 'points'),
('Four Figures', 'Earn 1,000 points', 'gem', 'total_points', 1000, 0, 'points'),
('Elite Ref', 'Earn 2,500 points', 'diamond', 'total_points', 2500, 0, 'points'),
('RefZone Icon', 'Earn 5,000 points', 'crown', 'total_points', 5000, 0, 'points');

-- Feedback & Community
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Helpful Ref', 'Submit feedback once', 'message-square', 'feedback_submitted', 1, 20, 'community'),
('Quality Control', 'Submit feedback on 5 scenarios', 'clipboard', 'feedback_submitted', 5, 50, 'community'),
('Constructive Critic', 'Submit feedback on 10 items', 'pen-tool', 'feedback_submitted', 10, 100, 'community'),
('Improving the Game', 'Feedback marked as helpful by admin', 'thumbs-up', 'helpful_feedback', 1, 150, 'community');

-- Laws of the Game Mastery
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Foul Finder', 'Correctly answer 20 foul-related scenarios', 'alert-circle', 'foul_scenarios_correct', 20, 100, 'lotg'),
('Disciplinary Mind', 'Correctly answer 20 card scenarios', 'credit-card', 'card_scenarios_correct', 20, 100, 'lotg'),
('Restart Specialist', '20 correct restart decisions', 'refresh-cw', 'restart_scenarios_correct', 20, 100, 'lotg'),
('Offside Operator', '15 correct offside scenarios', 'flag', 'offside_scenarios_correct', 15, 100, 'lotg'),
('Set Piece King', '15 correct FK/PK decisions', 'target', 'setpiece_scenarios_correct', 15, 100, 'lotg');

-- Elite / Hidden Achievements
INSERT INTO achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('No Hesitation', 'Answer a scenario correctly in under 10 seconds', 'zap', 'fast_correct_answer', 10, 75, 'elite'),
('Clutch Call', 'Get the final quiz question correct', 'target', 'clutch_answers', 1, 50, 'elite'),
('The Law Is Clear', '100% accuracy over an entire week', 'scale', 'perfect_week', 1, 500, 'elite'),
('Match Control', 'Complete a scenario, quiz, and report in one day', 'layout', 'daily_trifecta', 1, 100, 'elite');
