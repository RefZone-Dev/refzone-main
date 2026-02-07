-- Add category column to achievements table
alter table public.achievements add column if not exists category text;

-- Update existing achievements with categories (will be replaced by seed data)
update public.achievements set category = 'onboarding' where requirement_type = 'scenarios' and requirement_value <= 3;
update public.achievements set category = 'streak' where requirement_type = 'streak';
update public.achievements set category = 'points' where requirement_type = 'points';
