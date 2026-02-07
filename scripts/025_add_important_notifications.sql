-- Add is_important column to notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_important BOOLEAN DEFAULT FALSE;

-- Create table to track which users have seen important notifications
CREATE TABLE IF NOT EXISTS user_seen_important_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, notification_id)
);

-- RLS policies for user_seen_important_notifications
ALTER TABLE user_seen_important_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own seen notifications"
  ON user_seen_important_notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own seen notifications"
  ON user_seen_important_notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
