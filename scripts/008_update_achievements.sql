-- Delete old achievements and add comprehensive new achievement catalogue
delete from public.user_achievements;
delete from public.achievements;

-- Onboarding & Basics
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) values
('First Steps', 'Complete your first scenario', 'trophy', 'scenarios', 1, 50, 'onboarding'),
('Getting Started', 'Complete 3 scenarios', 'trophy', 'scenarios', 3, 75, 'onboarding'),
('Breaking the Ice', 'Complete your first quiz', 'book-open', 'quizzes', 1, 50, 'onboarding'),
('Rule Curious', 'View 5 scenario explanations', 'target', 'scenario_views', 5, 25, 'onboarding'),
('Confidence Builder', 'Get 3 answers correct in a row', 'check-circle', 'streak_correct', 3, 100, 'onboarding');

-- Streak Achievements
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) values
('Streak Starter', '3-day training streak', 'flame', 'streak', 3, 100, 'streak'),
('Week Warrior', '7-day training streak', 'flame', 'streak', 7, 250, 'streak'),
('Fortnight Focused', '14-day training streak', 'flame', 'streak', 14, 500, 'streak'),
('Iron Ref', '30-day training streak', 'flame', 'streak', 30, 1000, 'streak'),
('Unstoppable', '60-day training streak', 'flame', 'streak', 60, 2500, 'streak'),
('Legendary Consistency', '100-day streak', 'flame', 'streak', 100, 5000, 'streak');

-- Accuracy & Performance
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) values
('Perfect Call', '100% accuracy on 5 scenarios', 'target', 'perfect_scenarios', 5, 200, 'accuracy'),
('Perfect Accuracy', '100% accuracy on 10 scenarios', 'target', 'perfect_scenarios', 10, 400, 'accuracy'),
('Sharpshooter', '90%+ accuracy across 20 scenarios', 'target', 'high_accuracy_20', 20, 300, 'accuracy'),
('Elite Decision-Maker', '95%+ accuracy across 50 scenarios', 'target', 'high_accuracy_50', 50, 800, 'accuracy'),
('No Doubt', '10 correct answers in a row', 'check-circle', 'streak_correct', 10, 300, 'accuracy');

-- Scenario Completion
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) values
('Scenario Apprentice', 'Complete 10 scenarios', 'trophy', 'scenarios', 10, 100, 'scenarios'),
('Scenario Regular', 'Complete 25 scenarios', 'trophy', 'scenarios', 25, 250, 'scenarios'),
('Scenario Master', 'Complete 50 scenarios', 'trophy', 'scenarios', 50, 500, 'scenarios'),
('Scenario Expert', 'Complete 100 scenarios', 'trophy', 'scenarios', 100, 1000, 'scenarios'),
('Scenario Legend', 'Complete 250 scenarios', 'trophy', 'scenarios', 250, 3000, 'scenarios');

-- Quiz Achievements
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) values
('Quiz Rookie', 'Complete your first quiz', 'book-open', 'quizzes', 1, 50, 'quizzes'),
('Quiz Champion', 'Complete 10 quizzes', 'book-open', 'quizzes', 10, 300, 'quizzes'),
('Quiz Veteran', 'Complete 25 quizzes', 'book-open', 'quizzes', 25, 750, 'quizzes'),
('Quiz Elite', 'Complete 50 quizzes', 'book-open', 'quizzes', 50, 1500, 'quizzes'),
('Perfect Quiz', 'Score 100% on a weekly quiz', 'star', 'perfect_quiz', 1, 200, 'quizzes'),
('Quiz Dominator', '100% on 3 quizzes', 'star', 'perfect_quiz', 3, 600, 'quizzes');

-- DecisionLab Achievements
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) values
('First Consultation', 'Use DecisionLab once', 'award', 'decisionlab_uses', 1, 50, 'decisionlab'),
('Law Explorer', 'Ask 5 DecisionLab questions', 'award', 'decisionlab_uses', 5, 150, 'decisionlab'),
('Real-World Ref', 'Submit a real match scenario', 'award', 'decisionlab_uses', 1, 100, 'decisionlab'),
('Deep Thinker', 'Complete a DecisionLab walkthrough with follow-up questions', 'award', 'decisionlab_deep', 1, 200, 'decisionlab'),
('Decision Scholar', 'Save 10 DecisionLab analyses', 'award', 'decisionlab_saves', 10, 300, 'decisionlab');

-- Match Report Builder
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) values
('Paperwork Pro', 'Generate your first report', 'trophy', 'reports', 1, 50, 'reports'),
('Send-Off Specialist', 'Create 5 send-off reports', 'trophy', 'sendoff_reports', 5, 150, 'reports'),
('Incident Analyst', 'Create 5 incident reports', 'trophy', 'incident_reports', 5, 150, 'reports'),
('Field Inspector', 'Create 5 field reports', 'trophy', 'field_reports', 5, 150, 'reports'),
('Report Perfectionist', 'Edit and finalise a report before download', 'trophy', 'edited_report', 1, 100, 'reports'),
('Admin-Ready', 'Generate 10 reports total', 'trophy', 'reports', 10, 400, 'reports');

-- Points & Progress
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) values
('Century Club', 'Earn 100 total points', 'award', 'points', 100, 100, 'points'),
('Double Century', 'Earn 200 points', 'award', 'points', 200, 150, 'points'),
('High Roller', 'Earn 500 points', 'award', 'points', 500, 250, 'points'),
('Four Figures', 'Earn 1,000 points', 'award', 'points', 1000, 500, 'points'),
('Elite Ref', 'Earn 2,500 points', 'award', 'points', 2500, 1000, 'points'),
('RefZone Icon', 'Earn 5,000 points', 'award', 'points', 5000, 2500, 'points');

-- Feedback & Community
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) values
('Helpful Ref', 'Submit feedback once', 'star', 'feedback', 1, 50, 'feedback'),
('Quality Control', 'Submit feedback on 5 scenarios', 'star', 'feedback', 5, 150, 'feedback'),
('Constructive Critic', 'Submit feedback on 10 items', 'star', 'feedback', 10, 300, 'feedback'),
('Improving the Game', 'Feedback marked as helpful by admin', 'star', 'helpful_feedback', 1, 200, 'feedback');

-- Laws of the Game Mastery
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) values
('Foul Finder', 'Correctly answer 20 foul-related scenarios', 'target', 'foul_scenarios', 20, 400, 'mastery'),
('Disciplinary Mind', 'Correctly answer 20 card scenarios', 'target', 'card_scenarios', 20, 400, 'mastery'),
('Restart Specialist', '20 correct restart decisions', 'target', 'restart_scenarios', 20, 400, 'mastery'),
('Offside Operator', '15 correct offside scenarios', 'target', 'offside_scenarios', 15, 350, 'mastery'),
('Set Piece King', '15 correct FK/PK decisions', 'target', 'setpiece_scenarios', 15, 350, 'mastery');

-- Elite / Hidden Achievements
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward, category) values
('No Hesitation', 'Answer a scenario correctly in under 10 seconds', 'check-circle', 'fast_correct', 1, 500, 'elite'),
('Clutch Call', 'Get the final quiz question correct', 'check-circle', 'clutch_quiz', 1, 300, 'elite'),
('Ref Whisperer', '50 DecisionLab uses', 'award', 'decisionlab_uses', 50, 1000, 'elite'),
('The Law Is Clear', '100% accuracy over an entire week', 'star', 'perfect_week', 1, 1500, 'elite'),
('Match Control', 'Complete a scenario, quiz, and report in one day', 'trophy', 'daily_complete', 1, 750, 'elite');
