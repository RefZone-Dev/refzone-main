-- Fix the scenario_type check constraint to include 'penalty' and 'other'
-- The UI offers these options but they were missing from the original constraint

ALTER TABLE scenarios
  DROP CONSTRAINT IF EXISTS scenarios_scenario_type_check;

ALTER TABLE scenarios
  ADD CONSTRAINT scenarios_scenario_type_check
  CHECK (scenario_type IN ('foul', 'offside', 'handball', 'misconduct', 'advantage', 'var', 'penalty', 'other'));
