-- Complete achievements list with correct column names
-- Using: title, description, icon, requirement_type, requirement_value, points_reward, category

-- Clear existing achievements to start fresh (optional - comment out if you want to keep existing)
-- DELETE FROM public.achievements;

-- Onboarding Achievements
INSERT INTO public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('First Whistle', 'Complete your first scenario', 'trophy', 'scenarios', 1, 50, 'onboarding'),
('Quick Learner', 'Complete your first quiz', 'book', 'quizzes', 1, 50, 'onboarding'),
('Report Filed', 'Generate your first match report', 'clipboard', 'reports', 1, 50, 'onboarding'),
('Lab Coat On', 'Complete your first DecisionLab analysis', 'flask', 'decision_lab', 1, 50, 'onboarding')
ON CONFLICT (id) DO NOTHING;

-- Streak Achievements
INSERT INTO public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Streak Starter', 'Maintain a 3-day training streak', 'flame', 'streak', 3, 100, 'streak'),
('Week Warrior', 'Maintain a 7-day training streak', 'star', 'streak', 7, 250, 'streak'),
('Fortnight Force', 'Maintain a 14-day training streak', 'zap', 'streak', 14, 500, 'streak'),
('Monthly Master', 'Maintain a 30-day training streak', 'crown', 'streak', 30, 1000, 'streak'),
('Quarterly Champion', 'Maintain a 90-day training streak', 'medal', 'streak', 90, 2500, 'streak'),
('Year-Round Ref', 'Maintain a 365-day training streak', 'award', 'streak', 365, 10000, 'streak')
ON CONFLICT (id) DO NOTHING;

-- Accuracy Achievements
INSERT INTO public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Sharp Eye', 'Achieve 80% accuracy in scenarios', 'target', 'accuracy', 80, 200, 'accuracy'),
('Precision Pro', 'Achieve 90% accuracy in scenarios', 'crosshair', 'accuracy', 90, 500, 'accuracy'),
('Perfect Vision', 'Achieve 100% accuracy in a quiz', 'eye', 'accuracy', 100, 750, 'accuracy')
ON CONFLICT (id) DO NOTHING;

-- Scenario Achievements
INSERT INTO public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Scenario Rookie', 'Complete 5 scenarios', 'play', 'scenarios', 5, 100, 'scenarios'),
('Scenario Regular', 'Complete 25 scenarios', 'film', 'scenarios', 25, 300, 'scenarios'),
('Scenario Specialist', 'Complete 50 scenarios', 'video', 'scenarios', 50, 600, 'scenarios'),
('Scenario Master', 'Complete 100 scenarios', 'tv', 'scenarios', 100, 1200, 'scenarios'),
('Scenario Legend', 'Complete 250 scenarios', 'monitor', 'scenarios', 250, 3000, 'scenarios')
ON CONFLICT (id) DO NOTHING;

-- Quiz Achievements
INSERT INTO public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Quiz Taker', 'Complete 5 quizzes', 'book-open', 'quizzes', 5, 100, 'quizzes'),
('Quiz Champion', 'Complete 10 quizzes', 'bookmark', 'quizzes', 10, 300, 'quizzes'),
('Knowledge Seeker', 'Complete 25 quizzes', 'graduation-cap', 'quizzes', 25, 600, 'quizzes'),
('Quiz Master', 'Complete 50 quizzes', 'brain', 'quizzes', 50, 1200, 'quizzes')
ON CONFLICT (id) DO NOTHING;

-- Points Achievements
INSERT INTO public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Point Collector', 'Earn 500 total points', 'coins', 'points', 500, 100, 'points'),
('Point Hoarder', 'Earn 2,500 total points', 'piggy-bank', 'points', 2500, 300, 'points'),
('Point Master', 'Earn 10,000 total points', 'wallet', 'points', 10000, 750, 'points'),
('Point Legend', 'Earn 50,000 total points', 'gem', 'points', 50000, 2000, 'points'),
('Century Club', 'Earn 100,000 total points', 'diamond', 'points', 100000, 5000, 'points')
ON CONFLICT (id) DO NOTHING;

-- Match Report Achievements
INSERT INTO public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Reporter', 'Generate 5 match reports', 'file-text', 'reports', 5, 150, 'reports'),
('Documentarian', 'Generate 25 match reports', 'files', 'reports', 25, 400, 'reports'),
('Record Keeper', 'Generate 50 match reports', 'archive', 'reports', 50, 800, 'reports')
ON CONFLICT (id) DO NOTHING;

-- DecisionLab Achievements
INSERT INTO public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('Analyst', 'Complete 5 DecisionLab analyses', 'search', 'decision_lab', 5, 200, 'decision_lab'),
('Deep Thinker', 'Complete 15 DecisionLab analyses', 'lightbulb', 'decision_lab', 15, 500, 'decision_lab'),
('Decision Scientist', 'Complete 30 DecisionLab analyses', 'microscope', 'decision_lab', 30, 1000, 'decision_lab')
ON CONFLICT (id) DO NOTHING;

-- Special/Elite Achievements
INSERT INTO public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) VALUES
('All-Rounder', 'Complete at least one of each activity type', 'compass', 'special', 1, 500, 'special'),
('Dedicated Official', 'Active for 30 consecutive days', 'calendar', 'streak', 30, 1500, 'special'),
('Elite Referee', 'Earn all other achievements', 'shield', 'special', 1, 10000, 'special')
ON CONFLICT (id) DO NOTHING;
