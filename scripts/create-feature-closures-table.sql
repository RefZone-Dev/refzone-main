-- Create feature_closures table for temporarily closing features
CREATE TABLE IF NOT EXISTS feature_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL UNIQUE,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  message TEXT,
  recommendation_text TEXT,
  recommendation_url TEXT,
  recommendation_feature_key TEXT,
  closed_by UUID REFERENCES auth.users(id),
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE feature_closures ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read feature closures (needed to check if features are closed)
CREATE POLICY "Anyone can read feature closures"
  ON feature_closures
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert/update/delete feature closures
CREATE POLICY "Only admins can manage feature closures"
  ON feature_closures
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feature_closures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER feature_closures_updated_at
  BEFORE UPDATE ON feature_closures
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_closures_updated_at();

-- Insert default feature entries (all open by default)
INSERT INTO feature_closures (feature_key, is_closed) VALUES
  ('quizzes', false),
  ('scenarios', false),
  ('forum', false),
  ('decision_lab', false),
  ('reports', false),
  ('profile', false)
ON CONFLICT (feature_key) DO NOTHING;
