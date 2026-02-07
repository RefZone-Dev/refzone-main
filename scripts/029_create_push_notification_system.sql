-- Push Notification System for Capacitor Native Apps
-- Stores push tokens and notification preferences

-- Push tokens table - stores device tokens for push notifications
CREATE TABLE IF NOT EXISTS push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  device_id TEXT, -- Optional device identifier for managing multiple devices
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_active ON push_tokens(user_id, is_active) WHERE is_active = TRUE;

-- Add notification preferences columns to profiles if they don't exist
DO $$
BEGIN
  -- Daily training reminder notification
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notify_daily_training') THEN
    ALTER TABLE profiles ADD COLUMN notify_daily_training BOOLEAN DEFAULT TRUE;
  END IF;
  
  -- Forum reply notifications
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notify_forum_replies') THEN
    ALTER TABLE profiles ADD COLUMN notify_forum_replies BOOLEAN DEFAULT TRUE;
  END IF;
  
  -- Forum like notifications
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'notify_forum_likes') THEN
    ALTER TABLE profiles ADD COLUMN notify_forum_likes BOOLEAN DEFAULT TRUE;
  END IF;
  
  -- User's timezone for scheduling notifications at local time
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'timezone') THEN
    ALTER TABLE profiles ADD COLUMN timezone TEXT DEFAULT 'Australia/Sydney';
  END IF;
  
  -- Preferred notification time (stored as HH:MM in 24h format)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'daily_notification_time') THEN
    ALTER TABLE profiles ADD COLUMN daily_notification_time TEXT DEFAULT '17:00';
  END IF;
END $$;

-- Scheduled notifications table - for tracking what notifications have been sent
CREATE TABLE IF NOT EXISTS scheduled_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('daily_training', 'forum_reply', 'forum_like', 'achievement', 'system')),
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  payload JSONB,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for scheduled notifications
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_user ON scheduled_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_pending ON scheduled_notifications(scheduled_for, status) WHERE status = 'pending';

-- RLS Policies for push_tokens
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own push tokens"
  ON push_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own push tokens"
  ON push_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own push tokens"
  ON push_tokens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own push tokens"
  ON push_tokens FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for scheduled_notifications
ALTER TABLE scheduled_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own scheduled notifications"
  ON scheduled_notifications FOR SELECT
  USING (auth.uid() = user_id);

-- System can create notifications (using service role)
CREATE POLICY "System can manage all scheduled notifications"
  ON scheduled_notifications FOR ALL
  USING (true)
  WITH CHECK (true);
