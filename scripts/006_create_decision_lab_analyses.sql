-- Create decision lab analyses table
CREATE TABLE IF NOT EXISTS decision_lab_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_description TEXT NOT NULL,
  conversation JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_decision_lab_user_id ON decision_lab_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_decision_lab_created_at ON decision_lab_analyses(created_at DESC);

-- Enable RLS
ALTER TABLE decision_lab_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own analyses" ON decision_lab_analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses" ON decision_lab_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses" ON decision_lab_analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses" ON decision_lab_analyses
  FOR DELETE USING (auth.uid() = user_id);
