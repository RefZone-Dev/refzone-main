-- Create match_reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS match_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  match_date DATE NOT NULL,
  competition TEXT,
  home_team TEXT,
  away_team TEXT,
  score TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE match_reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports
CREATE POLICY "Users can view their own reports" ON match_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own reports
CREATE POLICY "Users can create their own reports" ON match_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update their own reports" ON match_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete their own reports" ON match_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports" ON match_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_match_reports_user_id ON match_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_match_reports_match_date ON match_reports(match_date DESC);
