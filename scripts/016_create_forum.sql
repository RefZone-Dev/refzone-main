-- Create forum_posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_replies table
CREATE TABLE IF NOT EXISTS forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_accepted_answer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_votes table (for upvoting posts and replies)
CREATE TABLE IF NOT EXISTS forum_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_post_vote UNIQUE (user_id, post_id),
  CONSTRAINT unique_reply_vote UNIQUE (user_id, reply_id),
  CONSTRAINT vote_target_check CHECK (
    (post_id IS NOT NULL AND reply_id IS NULL) OR
    (post_id IS NULL AND reply_id IS NOT NULL)
  )
);

-- Enable RLS on all tables
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for forum_posts
CREATE POLICY "Anyone can view forum posts" ON forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON forum_posts FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for forum_replies
CREATE POLICY "Anyone can view replies" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Users can create replies" ON forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own replies" ON forum_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON forum_replies FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for forum_votes
CREATE POLICY "Anyone can view votes" ON forum_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote" ON forum_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can change own votes" ON forum_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can remove own votes" ON forum_votes FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id ON forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_user_id ON forum_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_votes_post_id ON forum_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_votes_reply_id ON forum_votes(reply_id);
