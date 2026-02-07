-- Create match reports table
CREATE TABLE IF NOT EXISTS match_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('send_off', 'incident', 'field')),
  match_details JSONB NOT NULL,
  incident_details TEXT NOT NULL,
  generated_report TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_match_reports_user_id ON match_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_match_reports_created_at ON match_reports(created_at DESC);

-- Enable RLS
ALTER TABLE match_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own reports" ON match_reports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" ON match_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" ON match_reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports" ON match_reports
  FOR DELETE USING (auth.uid() = user_id);
