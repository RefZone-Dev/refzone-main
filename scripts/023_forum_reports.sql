-- Create forum_reports table to track user reports on posts
CREATE TABLE IF NOT EXISTS forum_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE forum_reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports
CREATE POLICY "Users can create reports" ON forum_reports
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own reports
CREATE POLICY "Users can view own reports" ON forum_reports
  FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports" ON forum_reports
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Admins can update reports
CREATE POLICY "Admins can update reports" ON forum_reports
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_forum_reports_post_id ON forum_reports(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_reports_status ON forum_reports(status);
CREATE INDEX IF NOT EXISTS idx_forum_reports_created_at ON forum_reports(created_at DESC);
