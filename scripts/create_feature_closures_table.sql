-- Create feature_closures table
CREATE TABLE IF NOT EXISTS feature_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  reason TEXT,
  closed_at TIMESTAMPTZ,
  closed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE feature_closures ENABLE ROW LEVEL SECURITY;

-- Everyone can view feature closures
CREATE POLICY "Anyone can view feature closures" ON feature_closures
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can manage feature closures
CREATE POLICY "Admins can insert feature closures" ON feature_closures
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update feature closures" ON feature_closures
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete feature closures" ON feature_closures
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Insert default feature closures
INSERT INTO feature_closures (feature_name, is_active, reason) VALUES
  ('decision_lab', true, NULL),
  ('match_reports', true, NULL),
  ('video_analysis', true, NULL),
  ('quiz_system', true, NULL),
  ('performance_tracking', true, NULL)
ON CONFLICT (feature_name) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_feature_closures_feature_name ON feature_closures(feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_closures_is_active ON feature_closures(is_active);
