-- Create shop system tables if they don't already exist
-- This ensures the user_customization, shop_items, user_inventory, and points_transactions tables are created

-- Shop Items Table
CREATE TABLE IF NOT EXISTS shop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('badge', 'title', 'theme', 'card_design', 'celebration', 'whistle_sound', 'showcase_layout')),
  price INTEGER NOT NULL DEFAULT 0,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic')) DEFAULT 'common',
  preview_data JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Inventory Table
CREATE TABLE IF NOT EXISTS user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES shop_items(id) ON DELETE CASCADE NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- User Customization Settings Table
CREATE TABLE IF NOT EXISTS user_customization (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  active_badge_id UUID REFERENCES shop_items(id) ON DELETE SET NULL,
  active_title_id UUID REFERENCES shop_items(id) ON DELETE SET NULL,
  active_theme_id UUID REFERENCES shop_items(id) ON DELETE SET NULL,
  active_card_design_id UUID REFERENCES shop_items(id) ON DELETE SET NULL,
  active_celebration_id UUID REFERENCES shop_items(id) ON DELETE SET NULL,
  active_whistle_id UUID REFERENCES shop_items(id) ON DELETE SET NULL,
  active_showcase_id UUID REFERENCES shop_items(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Points Transaction Log
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'refund', 'earned_scenario', 'earned_quiz', 'earned_achievement')),
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_customization ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shop_items (everyone can view)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'shop_items_select_all' AND tablename = 'shop_items') THEN
    CREATE POLICY "shop_items_select_all" ON shop_items FOR SELECT USING (true);
  END IF;
END $$;

-- RLS Policies for user_inventory
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_inventory_select_own' AND tablename = 'user_inventory') THEN
    CREATE POLICY "user_inventory_select_own" ON user_inventory FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_inventory_insert_own' AND tablename = 'user_inventory') THEN
    CREATE POLICY "user_inventory_insert_own" ON user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for user_customization
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_customization_select_own' AND tablename = 'user_customization') THEN
    CREATE POLICY "user_customization_select_own" ON user_customization FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_customization_insert_own' AND tablename = 'user_customization') THEN
    CREATE POLICY "user_customization_insert_own" ON user_customization FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_customization_update_own' AND tablename = 'user_customization') THEN
    CREATE POLICY "user_customization_update_own" ON user_customization FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for points_transactions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'points_transactions_select_own' AND tablename = 'points_transactions') THEN
    CREATE POLICY "points_transactions_select_own" ON points_transactions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'points_transactions_insert_own' AND tablename = 'points_transactions') THEN
    CREATE POLICY "points_transactions_insert_own" ON points_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_user_customization_user_id ON user_customization(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_shop_items_category ON shop_items(category);
