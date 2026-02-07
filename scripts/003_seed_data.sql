-- Seed sample scenarios
insert into public.scenarios (title, description, difficulty, scenario_type, correct_decision, explanation, points_value, image_url) values
('Penalty Box Challenge', 'A striker goes down in the penalty area after minimal contact with the defender. The ball was already out of play. What is your decision?', 'medium', 'foul', 'No Penalty - Simulation', 'The contact was minimal and the ball was out of play. The striker exaggerated the contact, which constitutes simulation. Show a yellow card for diving.', 15, '/placeholder.svg?height=400&width=600'),
('Offside Trap Decision', 'The attacking team plays a through ball. The striker appears level with the last defender when the ball is played. What do you call?', 'hard', 'offside', 'Play On - Level with Defender', 'When a player is level with the second-last opponent, they are not in an offside position. The benefit of the doubt goes to the attacker.', 20, '/placeholder.svg?height=400&width=600'),
('Handball or Natural Position?', 'A defender has their arm extended away from their body as they turn. The ball strikes their arm from close range. Your decision?', 'hard', 'handball', 'Penalty - Unnatural Position', 'The arm was in an unnatural position that made the body unnaturally bigger. Even though the contact was from close range, this is a handball offense.', 20, '/placeholder.svg?height=400&width=600'),
('Tactical Foul Recognition', 'A midfielder deliberately pulls back an attacker who is breaking away on a counter-attack. The foul occurs near the halfway line. What action do you take?', 'medium', 'misconduct', 'Yellow Card - SPA', 'This is Stopping a Promising Attack (SPA). The deliberate foul prevented a promising counter-attack and warrants a yellow card.', 15, '/placeholder.svg?height=400&width=600'),
('Advantage Application', 'A player is fouled but their teammate gains possession in a better attacking position. What do you do?', 'easy', 'advantage', 'Play Advantage', 'The advantage law allows play to continue when the fouled team benefits more from ongoing play than from a free kick. Signal advantage and let play continue.', 10, '/placeholder.svg?height=400&width=600'),
('VAR Review Situation', 'You award a goal but notice the VAR is checking for a possible offside in the buildup. What is your action?', 'medium', 'var', 'Wait for VAR Decision', 'When VAR is checking a potential clear and obvious error, wait for their communication before restarting play. Make the TV screen signal to indicate VAR review.', 15, '/placeholder.svg?height=400&width=600');

-- Seed sample quizzes
insert into public.quizzes (title, description, difficulty, time_limit_minutes) values
('Laws of the Game - Basics', 'Test your knowledge of fundamental football rules and regulations', 'easy', 15),
('Advanced Offside Scenarios', 'Complex offside situations that test your positioning knowledge', 'hard', 20),
('Disciplinary Decisions', 'When to show cards and how to manage player behavior', 'medium', 15);

-- Seed quiz questions for "Laws of the Game - Basics"
insert into public.quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, points_value, order_index)
select id, 'How many players minimum must a team have to start a match?', 'multiple_choice',
  '["5 players", "6 players", "7 players", "8 players"]'::jsonb,
  '["7 players"]'::jsonb,
  'A match may not start or continue if either team has fewer than seven players.',
  5, 1
from public.quizzes where title = 'Laws of the Game - Basics';

insert into public.quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, points_value, order_index)
select id, 'A goalkeeper can handle the ball anywhere in their own penalty area.', 'true_false',
  '["True", "False"]'::jsonb,
  '["True"]'::jsonb,
  'The goalkeeper is allowed to handle the ball anywhere within their own penalty area, except when receiving a deliberate back-pass from a teammate.',
  5, 2
from public.quizzes where title = 'Laws of the Game - Basics';

insert into public.quiz_questions (quiz_id, question_text, question_type, options, correct_answer, explanation, points_value, order_index)
select id, 'Which of the following are direct free kick offenses? (Select all that apply)', 'multi_select',
  '["Handball", "Offside", "Charging an opponent", "Dangerous play", "Kicking an opponent"]'::jsonb,
  '["Handball", "Charging an opponent", "Kicking an opponent"]'::jsonb,
  'Direct free kick offenses include: kicking, tripping, charging, striking, pushing, tackling, holding, handling the ball, spitting, and certain reckless challenges.',
  10, 3
from public.quizzes where title = 'Laws of the Game - Basics';

-- Seed achievements
insert into public.achievements (title, description, icon, requirement_type, requirement_value, points_reward) values
('First Steps', 'Complete your first scenario', 'trophy', 'scenarios', 1, 50),
('Streak Starter', 'Maintain a 3-day training streak', 'flame', 'streak', 3, 100),
('Week Warrior', 'Maintain a 7-day training streak', 'star', 'streak', 7, 250),
('Century Club', 'Earn 100 total points', 'award', 'points', 100, 100),
('Scenario Master', 'Complete 50 scenarios', 'target', 'scenarios', 50, 500),
('Quiz Champion', 'Complete 10 quizzes', 'book-open', 'quizzes', 10, 300),
('Perfect Accuracy', 'Achieve 100% accuracy on 10 scenarios', 'check-circle', 'accuracy', 10, 400);
