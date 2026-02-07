-- Complete Achievement Catalogue for RefZone
-- This replaces all existing achievements with the full catalogue

-- First, clear existing achievements (but preserve user_achievements)
DELETE FROM achievements;

-- Onboarding & Basics (category: onboarding)
INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value, category, rarity) VALUES
('First Steps', 'Complete your first scenario', 'footprints', 10, 'scenarios_completed', 1, 'onboarding', 'common'),
('Getting Started', 'Complete 3 scenarios', 'play', 25, 'scenarios_completed', 3, 'onboarding', 'common'),
('Breaking the Ice', 'Complete your first quiz', 'snowflake', 10, 'quizzes_completed', 1, 'onboarding', 'common'),
('Rule Curious', 'View 5 scenario explanations', 'eye', 15, 'explanations_viewed', 5, 'onboarding', 'common'),
('Confidence Builder', 'Get 3 answers correct in a row', 'trending-up', 20, 'correct_streak', 3, 'onboarding', 'common');

-- Streak Achievements (category: streak)
INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value, category, rarity) VALUES
('Streak Starter', '3-day training streak', 'flame', 30, 'streak_days', 3, 'streak', 'common'),
('Week Warrior', '7-day training streak', 'flame', 75, 'streak_days', 7, 'streak', 'rare'),
('Fortnight Focused', '14-day training streak', 'flame', 150, 'streak_days', 14, 'streak', 'rare'),
('Iron Ref', '30-day training streak', 'shield', 300, 'streak_days', 30, 'streak', 'epic'),
('Unstoppable', '60-day training streak', 'zap', 500, 'streak_days', 60, 'streak', 'epic'),
('Legendary Consistency', '100-day training streak', 'crown', 1000, 'streak_days', 100, 'streak', 'legendary');

-- Accuracy & Performance (category: accuracy)
INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value, category, rarity) VALUES
('Perfect Call', '100% accuracy on 5 scenarios', 'check-circle', 50, 'perfect_scenarios', 5, 'accuracy', 'common'),
('Perfect Accuracy', '100% accuracy on 10 scenarios', 'check-circle', 100, 'perfect_scenarios', 10, 'accuracy', 'rare'),
('Sharpshooter', '90%+ accuracy across 20 scenarios', 'crosshair', 150, 'high_accuracy_scenarios', 20, 'accuracy', 'rare'),
('Elite Decision-Maker', '95%+ accuracy across 50 scenarios', 'award', 400, 'elite_accuracy_scenarios', 50, 'accuracy', 'epic'),
('No Doubt', '10 correct answers in a row', 'target', 75, 'correct_streak', 10, 'accuracy', 'rare');

-- Scenario Completion (category: scenarios)
INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value, category, rarity) VALUES
('Scenario Apprentice', 'Complete 10 scenarios', 'book-open', 50, 'scenarios_completed', 10, 'scenarios', 'common'),
('Scenario Regular', 'Complete 25 scenarios', 'book-open', 100, 'scenarios_completed', 25, 'scenarios', 'common'),
('Scenario Master', 'Complete 50 scenarios', 'graduation-cap', 200, 'scenarios_completed', 50, 'scenarios', 'rare'),
('Scenario Expert', 'Complete 100 scenarios', 'medal', 400, 'scenarios_completed', 100, 'scenarios', 'epic'),
('Scenario Legend', 'Complete 250 scenarios', 'trophy', 1000, 'scenarios_completed', 250, 'scenarios', 'legendary');

-- Quiz Achievements (category: quizzes)
INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value, category, rarity) VALUES
('Quiz Rookie', 'Complete your first quiz', 'clipboard-list', 10, 'quizzes_completed', 1, 'quizzes', 'common'),
('Quiz Champion', 'Complete 10 quizzes', 'clipboard-check', 75, 'quizzes_completed', 10, 'quizzes', 'common'),
('Quiz Veteran', 'Complete 25 quizzes', 'award', 150, 'quizzes_completed', 25, 'quizzes', 'rare'),
('Quiz Elite', 'Complete 50 quizzes', 'star', 300, 'quizzes_completed', 50, 'quizzes', 'epic'),
('Perfect Quiz', 'Score 100% on a quiz', 'sparkles', 100, 'perfect_quizzes', 1, 'quizzes', 'rare'),
('Quiz Dominator', '100% on 3 quizzes', 'crown', 250, 'perfect_quizzes', 3, 'quizzes', 'epic');

-- DecisionLab Achievements (category: decisionlab)
INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value, category, rarity) VALUES
('First Consultation', 'Use DecisionLab once', 'message-circle', 15, 'decisionlab_uses', 1, 'decisionlab', 'common'),
('Law Explorer', 'Ask 5 DecisionLab questions', 'search', 40, 'decisionlab_uses', 5, 'decisionlab', 'common'),
('Real-World Ref', 'Submit a real match scenario', 'globe', 50, 'real_scenarios_submitted', 1, 'decisionlab', 'rare'),
('Deep Thinker', 'Complete a DecisionLab walkthrough with follow-up questions', 'brain', 75, 'decisionlab_followups', 1, 'decisionlab', 'rare'),
('Decision Scholar', 'Save 10 DecisionLab analyses', 'bookmark', 100, 'decisionlab_saves', 10, 'decisionlab', 'rare'),
('Ref Whisperer', '50 DecisionLab uses', 'sparkles', 500, 'decisionlab_uses', 50, 'decisionlab', 'legendary');

-- Match Report Builder (category: reports)
INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value, category, rarity) VALUES
('Paperwork Pro', 'Generate your first report', 'file-text', 15, 'reports_generated', 1, 'reports', 'common'),
('Send-Off Specialist', 'Create 5 send-off reports', 'user-x', 50, 'sendoff_reports', 5, 'reports', 'common'),
('Incident Analyst', 'Create 5 incident reports', 'alert-triangle', 50, 'incident_reports', 5, 'reports', 'common'),
('Field Inspector', 'Create 5 field reports', 'map-pin', 50, 'field_reports', 5, 'reports', 'common'),
('Report Perfectionist', 'Edit and finalise a report before download', 'edit', 25, 'reports_edited', 1, 'reports', 'common'),
('Admin-Ready', 'Generate 10 reports total', 'folder', 100, 'reports_generated', 10, 'reports', 'rare');

-- Points & Progress (category: points)
INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value, category, rarity) VALUES
('Century Club', 'Earn 100 total points', 'coins', 0, 'total_points', 100, 'points', 'common'),
('Double Century', 'Earn 200 points', 'coins', 0, 'total_points', 200, 'points', 'common'),
('High Roller', 'Earn 500 points', 'gem', 0, 'total_points', 500, 'points', 'rare'),
('Four Figures', 'Earn 1,000 points', 'gem', 0, 'total_points', 1000, 'points', 'rare'),
('Elite Ref', 'Earn 2,500 points', 'diamond', 0, 'total_points', 2500, 'points', 'epic'),
('RefZone Icon', 'Earn 5,000 points', 'crown', 0, 'total_points', 5000, 'points', 'legendary');

-- Feedback & Community (category: community)
INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value, category, rarity) VALUES
('Helpful Ref', 'Submit feedback once', 'message-square', 20, 'feedback_submitted', 1, 'community', 'common'),
('Quality Control', 'Submit feedback on 5 scenarios', 'clipboard', 50, 'feedback_submitted', 5, 'community', 'common'),
('Constructive Critic', 'Submit feedback on 10 items', 'pen-tool', 100, 'feedback_submitted', 10, 'community', 'rare'),
('Improving the Game', 'Feedback marked as helpful by admin', 'thumbs-up', 150, 'helpful_feedback', 1, 'community', 'epic');

-- Laws of the Game Mastery (category: lotg)
INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value, category, rarity) VALUES
('Foul Finder', 'Correctly answer 20 foul-related scenarios', 'alert-circle', 100, 'foul_scenarios_correct', 20, 'lotg', 'rare'),
('Disciplinary Mind', 'Correctly answer 20 card scenarios', 'credit-card', 100, 'card_scenarios_correct', 20, 'lotg', 'rare'),
('Restart Specialist', '20 correct restart decisions', 'refresh-cw', 100, 'restart_scenarios_correct', 20, 'lotg', 'rare'),
('Offside Operator', '15 correct offside scenarios', 'flag', 100, 'offside_scenarios_correct', 15, 'lotg', 'rare'),
('Set Piece King', '15 correct FK/PK decisions', 'target', 100, 'setpiece_scenarios_correct', 15, 'lotg', 'rare');

-- Elite / Hidden Achievements (category: elite)
INSERT INTO achievements (name, description, icon, points, requirement_type, requirement_value, category, rarity) VALUES
('No Hesitation', 'Answer a scenario correctly in under 10 seconds', 'zap', 75, 'fast_correct_answer', 10, 'elite', 'rare'),
('Clutch Call', 'Get the final quiz question correct', 'target', 50, 'clutch_answers', 1, 'elite', 'rare'),
('The Law Is Clear', '100% accuracy over an entire week', 'scale', 500, 'perfect_week', 1, 'elite', 'legendary'),
('Match Control', 'Complete a scenario, quiz, and report in one day', 'layout', 100, 'daily_trifecta', 1, 'elite', 'epic');
