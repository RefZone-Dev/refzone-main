-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  experience_level text not null check (experience_level in ('beginner', 'intermediate', 'advanced', 'professional')),
  total_points integer default 0,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Create scenarios table
create table if not exists public.scenarios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  scenario_type text not null check (scenario_type in ('foul', 'offside', 'handball', 'misconduct', 'advantage', 'var')),
  video_url text,
  image_url text,
  correct_decision text not null,
  explanation text not null,
  points_value integer not null default 10,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.scenarios enable row level security;

create policy "scenarios_select_all" on public.scenarios for select using (is_active = true);

-- Create scenario responses table
create table if not exists public.scenario_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id uuid not null references public.scenarios(id) on delete cascade,
  user_decision text not null,
  is_correct boolean not null,
  time_taken_seconds integer not null,
  points_earned integer not null default 0,
  created_at timestamptz default now()
);

alter table public.scenario_responses enable row level security;

create policy "scenario_responses_select_own" on public.scenario_responses for select using (auth.uid() = user_id);
create policy "scenario_responses_insert_own" on public.scenario_responses for insert with check (auth.uid() = user_id);

-- Create quizzes table
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  time_limit_minutes integer,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.quizzes enable row level security;

create policy "quizzes_select_all" on public.quizzes for select using (is_active = true);

-- Create quiz questions table
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_text text not null,
  question_type text not null check (question_type in ('multiple_choice', 'true_false', 'multi_select')),
  options jsonb not null,
  correct_answer jsonb not null,
  explanation text not null,
  points_value integer not null default 5,
  order_index integer not null,
  created_at timestamptz default now()
);

alter table public.quiz_questions enable row level security;

create policy "quiz_questions_select_all" on public.quiz_questions for select using (true);

-- Create quiz attempts table
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  score integer not null default 0,
  total_possible integer not null,
  percentage numeric(5,2) not null,
  time_taken_seconds integer,
  completed_at timestamptz default now()
);

alter table public.quiz_attempts enable row level security;

create policy "quiz_attempts_select_own" on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "quiz_attempts_insert_own" on public.quiz_attempts for insert with check (auth.uid() = user_id);

-- Create quiz answers table
create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  user_answer jsonb not null,
  is_correct boolean not null,
  points_earned integer not null default 0,
  created_at timestamptz default now()
);

alter table public.quiz_answers enable row level security;

create policy "quiz_answers_select_own" on public.quiz_answers 
  for select using (
    auth.uid() in (
      select user_id from public.quiz_attempts where id = attempt_id
    )
  );
create policy "quiz_answers_insert_via_attempt" on public.quiz_answers 
  for insert with check (
    auth.uid() in (
      select user_id from public.quiz_attempts where id = attempt_id
    )
  );

-- Create achievements table
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null,
  requirement_type text not null check (requirement_type in ('streak', 'points', 'scenarios', 'quizzes', 'accuracy')),
  requirement_value integer not null,
  points_reward integer not null default 0,
  created_at timestamptz default now()
);

alter table public.achievements enable row level security;

create policy "achievements_select_all" on public.achievements for select using (true);

-- Create user achievements table
create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at timestamptz default now(),
  unique(user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "user_achievements_select_own" on public.user_achievements for select using (auth.uid() = user_id);
create policy "user_achievements_insert_own" on public.user_achievements for insert with check (auth.uid() = user_id);

-- Create reports table
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_type text not null check (report_type in ('weekly', 'monthly', 'custom')),
  date_from date not null,
  date_to date not null,
  total_scenarios integer not null default 0,
  total_quizzes integer not null default 0,
  average_accuracy numeric(5,2) not null default 0,
  total_points_earned integer not null default 0,
  strengths jsonb,
  weaknesses jsonb,
  recommendations jsonb,
  generated_at timestamptz default now()
);

alter table public.reports enable row level security;

create policy "reports_select_own" on public.reports for select using (auth.uid() = user_id);
create policy "reports_insert_own" on public.reports for insert with check (auth.uid() = user_id);

-- Create indexes for performance
create index idx_scenario_responses_user on public.scenario_responses(user_id);
create index idx_scenario_responses_scenario on public.scenario_responses(scenario_id);
create index idx_quiz_attempts_user on public.quiz_attempts(user_id);
create index idx_quiz_attempts_quiz on public.quiz_attempts(quiz_id);
create index idx_user_achievements_user on public.user_achievements(user_id);
create index idx_reports_user_date on public.reports(user_id, date_from, date_to);
