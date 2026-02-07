-- Seed Shop Items

-- ============================================
-- BADGES (Fun achievement-style, NOT official qualifications)
-- ============================================
INSERT INTO shop_items (name, description, category, price, rarity, preview_data) VALUES
-- Common Badges (50-150 points)
('Rising Star', 'You''re on your way up!', 'badge', 50, 'common', '{"icon": "star", "color": "#FFD700", "bgColor": "#FFF9E6"}'),
('Whistle Rookie', 'Every expert was once a beginner', 'badge', 75, 'common', '{"icon": "whistle", "color": "#6366F1", "bgColor": "#EEF2FF"}'),
('Decision Maker', 'You make the tough calls', 'badge', 100, 'common', '{"icon": "scale", "color": "#10B981", "bgColor": "#ECFDF5"}'),
('Card Collector', 'Building your knowledge one card at a time', 'badge', 100, 'common', '{"icon": "cards", "color": "#F59E0B", "bgColor": "#FFFBEB"}'),

-- Uncommon Badges (200-350 points)
('Pitch Commander', 'You own the field', 'badge', 200, 'uncommon', '{"icon": "flag", "color": "#8B5CF6", "bgColor": "#F5F3FF"}'),
('Laws Scholar', 'Master of the rulebook', 'badge', 250, 'uncommon', '{"icon": "book", "color": "#3B82F6", "bgColor": "#EFF6FF"}'),
('Streak Hunter', 'Consistency is your strength', 'badge', 300, 'uncommon', '{"icon": "flame", "color": "#EF4444", "bgColor": "#FEF2F2"}'),
('Night Owl', 'Training at all hours', 'badge', 350, 'uncommon', '{"icon": "moon", "color": "#6366F1", "bgColor": "#EEF2FF"}'),

-- Rare Badges (500-750 points)
('Golden Whistle', 'Elite decision maker', 'badge', 500, 'rare', '{"icon": "award", "color": "#F59E0B", "bgColor": "#FEF3C7", "animated": true}'),
('Perfect Vision', 'Nothing escapes your eye', 'badge', 600, 'rare', '{"icon": "eye", "color": "#06B6D4", "bgColor": "#ECFEFF", "animated": true}'),
('Iron Will', 'Unwavering in your decisions', 'badge', 750, 'rare', '{"icon": "shield", "color": "#64748B", "bgColor": "#F1F5F9", "animated": true}'),

-- Epic Badges (1000-2000 points)
('Legend Status', 'The pinnacle of RefZone achievement', 'badge', 1500, 'epic', '{"icon": "crown", "color": "#F59E0B", "bgColor": "#FEF3C7", "animated": true, "glow": true}'),
('Centurion', 'A hundred perfect decisions', 'badge', 2000, 'epic', '{"icon": "trophy", "color": "#A855F7", "bgColor": "#FAF5FF", "animated": true, "glow": true}');

-- ============================================
-- TITLES (Display under username)
-- ============================================
INSERT INTO shop_items (name, description, category, price, rarity, preview_data) VALUES
-- Common Titles (100-200 points)
('Trainee', 'Just getting started', 'title', 100, 'common', '{"text": "Trainee", "color": "#6B7280"}'),
('Apprentice', 'Learning the ropes', 'title', 150, 'common', '{"text": "Apprentice", "color": "#6366F1"}'),
('Student of the Game', 'Always learning', 'title', 200, 'common', '{"text": "Student of the Game", "color": "#10B981"}'),

-- Uncommon Titles (300-500 points)
('Decision Specialist', 'Making the right calls', 'title', 300, 'uncommon', '{"text": "Decision Specialist", "color": "#8B5CF6"}'),
('Laws Expert', 'Deep knowledge of the rules', 'title', 400, 'uncommon', '{"text": "Laws Expert", "color": "#3B82F6"}'),
('Match Day Ready', 'Prepared for anything', 'title', 500, 'uncommon', '{"text": "Match Day Ready", "color": "#F59E0B"}'),

-- Rare Titles (750-1000 points)
('Senior Official', 'Experienced and respected', 'title', 750, 'rare', '{"text": "Senior Official", "color": "#EF4444", "bold": true}'),
('Scenario Master', 'Conquered every challenge', 'title', 850, 'rare', '{"text": "Scenario Master", "color": "#06B6D4", "bold": true}'),
('Quiz Champion', 'Unmatched knowledge', 'title', 1000, 'rare', '{"text": "Quiz Champion", "color": "#A855F7", "bold": true}'),

-- Epic Titles (1500-3000 points)
('RefZone Elite', 'Top tier performer', 'title', 1500, 'epic', '{"text": "RefZone Elite", "color": "#F59E0B", "bold": true, "glow": true}'),
('Grandmaster', 'Peak achievement unlocked', 'title', 2500, 'epic', '{"text": "Grandmaster", "color": "#EF4444", "bold": true, "glow": true}'),
('Living Legend', 'Your name echoes through RefZone', 'title', 3000, 'epic', '{"text": "Living Legend", "color": "#A855F7", "bold": true, "glow": true, "animated": true}');

-- ============================================
-- DASHBOARD THEMES
-- ============================================
INSERT INTO shop_items (name, description, category, price, rarity, preview_data) VALUES
-- Common Themes (200-300 points)
('Classic Green', 'Traditional pitch colors', 'theme', 200, 'common', '{"primary": "#22C55E", "secondary": "#16A34A", "accent": "#4ADE80", "background": "#F0FDF4", "darkBackground": "#052E16"}'),
('Midnight Blue', 'Cool night match vibes', 'theme', 250, 'common', '{"primary": "#3B82F6", "secondary": "#1D4ED8", "accent": "#60A5FA", "background": "#EFF6FF", "darkBackground": "#1E3A5F"}'),
('Sunset Orange', 'Warm evening atmosphere', 'theme', 300, 'common', '{"primary": "#F97316", "secondary": "#EA580C", "accent": "#FB923C", "background": "#FFF7ED", "darkBackground": "#431407"}'),

-- Uncommon Themes (400-600 points)
('Royal Purple', 'Regal and distinguished', 'theme', 400, 'uncommon', '{"primary": "#8B5CF6", "secondary": "#7C3AED", "accent": "#A78BFA", "background": "#F5F3FF", "darkBackground": "#2E1065"}'),
('Arctic Frost', 'Clean and crisp', 'theme', 500, 'uncommon', '{"primary": "#06B6D4", "secondary": "#0891B2", "accent": "#22D3EE", "background": "#ECFEFF", "darkBackground": "#083344"}'),
('Forest Night', 'Deep woodland greens', 'theme', 600, 'uncommon', '{"primary": "#059669", "secondary": "#047857", "accent": "#34D399", "background": "#ECFDF5", "darkBackground": "#022C22"}'),

-- Rare Themes (800-1200 points)
('Cherry Blossom', 'Elegant pink aesthetic', 'theme', 800, 'rare', '{"primary": "#EC4899", "secondary": "#DB2777", "accent": "#F472B6", "background": "#FDF2F8", "darkBackground": "#500724"}'),
('Golden Hour', 'Luxurious gold tones', 'theme', 1000, 'rare', '{"primary": "#EAB308", "secondary": "#CA8A04", "accent": "#FACC15", "background": "#FEFCE8", "darkBackground": "#422006"}'),
('Emerald City', 'Rich gem-inspired greens', 'theme', 1200, 'rare', '{"primary": "#10B981", "secondary": "#059669", "accent": "#34D399", "background": "#D1FAE5", "darkBackground": "#064E3B"}'),

-- Epic Themes (2000-3500 points)
('Neon Nights', 'Vibrant cyberpunk style', 'theme', 2000, 'epic', '{"primary": "#E879F9", "secondary": "#A855F7", "accent": "#22D3EE", "background": "#0F0F23", "darkBackground": "#0A0A1A", "neon": true}'),
('Championship Gold', 'Winner''s celebration theme', 'theme', 3000, 'epic', '{"primary": "#F59E0B", "secondary": "#D97706", "accent": "#FCD34D", "background": "#FFFBEB", "darkBackground": "#451A03", "sparkle": true}'),
('Holographic', 'Futuristic color-shifting theme', 'theme', 3500, 'epic', '{"primary": "#8B5CF6", "secondary": "#EC4899", "accent": "#06B6D4", "background": "#FAF5FF", "darkBackground": "#1E1B4B", "holographic": true}');

-- ============================================
-- CARD DESIGNS (for scenario/quiz feedback)
-- ============================================
INSERT INTO shop_items (name, description, category, price, rarity, preview_data) VALUES
-- Common Card Designs (150-250 points)
('Classic Cards', 'Traditional yellow and red', 'card_design', 0, 'common', '{"style": "classic", "correctColor": "#22C55E", "incorrectColor": "#EF4444"}'),
('Soft Gradient', 'Gentle color transitions', 'card_design', 150, 'common', '{"style": "gradient", "correctColor": "#34D399", "incorrectColor": "#F87171"}'),
('Bold Flat', 'Clean modern design', 'card_design', 200, 'common', '{"style": "flat", "correctColor": "#10B981", "incorrectColor": "#DC2626"}'),

-- Uncommon Card Designs (350-500 points)
('Neon Glow', 'Cards that light up', 'card_design', 350, 'uncommon', '{"style": "neon", "correctColor": "#4ADE80", "incorrectColor": "#FB7185", "glow": true}'),
('Glass Effect', 'Sleek translucent look', 'card_design', 450, 'uncommon', '{"style": "glass", "correctColor": "#6EE7B7", "incorrectColor": "#FDA4AF", "blur": true}'),
('Metallic', 'Shiny metal finish', 'card_design', 500, 'uncommon', '{"style": "metallic", "correctColor": "#A7F3D0", "incorrectColor": "#FECACA", "shine": true}'),

-- Rare Card Designs (750-1000 points)
('Animated Pulse', 'Cards with pulsing animation', 'card_design', 750, 'rare', '{"style": "pulse", "correctColor": "#22C55E", "incorrectColor": "#EF4444", "animated": true}'),
('Particle Burst', 'Exploding particle effects', 'card_design', 1000, 'rare', '{"style": "particles", "correctColor": "#10B981", "incorrectColor": "#DC2626", "particles": true}'),

-- Epic Card Designs (1500-2500 points)
('Holographic Cards', 'Rainbow shifting effects', 'card_design', 1500, 'epic', '{"style": "holographic", "animated": true, "rainbow": true}'),
('Championship Edition', 'Gold-trimmed premium cards', 'card_design', 2500, 'epic', '{"style": "championship", "goldTrim": true, "animated": true, "sparkle": true}');

-- ============================================
-- CELEBRATION ANIMATIONS
-- ============================================
INSERT INTO shop_items (name, description, category, price, rarity, preview_data) VALUES
-- Common Celebrations (200-350 points)
('Classic Confetti', 'Traditional celebration', 'celebration', 0, 'common', '{"type": "confetti", "colors": ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"]}'),
('Simple Stars', 'Twinkling star effect', 'celebration', 200, 'common', '{"type": "stars", "colors": ["#FFD700", "#FFF"]}'),
('Balloon Rise', 'Floating balloons', 'celebration', 350, 'common', '{"type": "balloons", "colors": ["#EF4444", "#3B82F6", "#22C55E", "#F59E0B"]}'),

-- Uncommon Celebrations (500-750 points)
('Whistle Shower', 'Raining whistles', 'celebration', 500, 'uncommon', '{"type": "whistles", "animated": true}'),
('Card Cascade', 'Yellow and red cards falling', 'celebration', 600, 'uncommon', '{"type": "cards", "animated": true}'),
('Goal Explosion', 'Net-rippling celebration', 'celebration', 750, 'uncommon', '{"type": "goal", "animated": true, "sound": true}'),

-- Rare Celebrations (1000-1500 points)
('Fireworks Display', 'Spectacular fireworks', 'celebration', 1000, 'rare', '{"type": "fireworks", "colors": ["#FFD700", "#FF6B6B", "#A855F7", "#22D3EE"], "animated": true}'),
('Trophy Shower', 'Golden trophies raining down', 'celebration', 1250, 'rare', '{"type": "trophies", "animated": true, "sparkle": true}'),
('Lightning Storm', 'Electric celebration', 'celebration', 1500, 'rare', '{"type": "lightning", "animated": true, "flash": true}'),

-- Epic Celebrations (2000-4000 points)
('Stadium Roar', 'Full stadium celebration with crowd', 'celebration', 2000, 'epic', '{"type": "stadium", "animated": true, "crowd": true, "sound": true}'),
('Championship Moment', 'Confetti, fireworks, and trophy', 'celebration', 3000, 'epic', '{"type": "championship", "animated": true, "combo": true}'),
('Legendary Entrance', 'Spotlight and smoke effects', 'celebration', 4000, 'epic', '{"type": "legendary", "animated": true, "spotlight": true, "smoke": true}');

-- ============================================
-- WHISTLE SOUNDS (UI feedback sounds)
-- ============================================
INSERT INTO shop_items (name, description, category, price, rarity, preview_data) VALUES
('Classic Whistle', 'Traditional referee whistle', 'whistle_sound', 0, 'common', '{"sound": "classic", "file": "/sounds/whistle-classic.mp3"}'),
('Short Blast', 'Quick sharp whistle', 'whistle_sound', 100, 'common', '{"sound": "short", "file": "/sounds/whistle-short.mp3"}'),
('Double Tone', 'Two-tone whistle', 'whistle_sound', 200, 'uncommon', '{"sound": "double", "file": "/sounds/whistle-double.mp3"}'),
('Electronic', 'Modern electronic whistle', 'whistle_sound', 300, 'uncommon', '{"sound": "electronic", "file": "/sounds/whistle-electronic.mp3"}'),
('Stadium Horn', 'Full stadium horn blast', 'whistle_sound', 500, 'rare', '{"sound": "horn", "file": "/sounds/stadium-horn.mp3"}'),
('Victory Fanfare', 'Triumphant trumpet sound', 'whistle_sound', 750, 'rare', '{"sound": "fanfare", "file": "/sounds/victory-fanfare.mp3"}');

-- ============================================
-- ACHIEVEMENT SHOWCASE LAYOUTS
-- ============================================
INSERT INTO shop_items (name, description, category, price, rarity, preview_data) VALUES
('Grid View', 'Classic grid layout', 'showcase_layout', 0, 'common', '{"layout": "grid", "columns": 3}'),
('List View', 'Detailed list format', 'showcase_layout', 150, 'common', '{"layout": "list", "showDetails": true}'),
('Carousel', 'Rotating showcase of achievements', 'showcase_layout', 400, 'uncommon', '{"layout": "carousel", "autoRotate": true}'),
('Trophy Cabinet', '3D shelf display', 'showcase_layout', 800, 'rare', '{"layout": "cabinet", "3d": true, "lighting": true}'),
('Hall of Fame', 'Prestigious wall-mounted display', 'showcase_layout', 1200, 'rare', '{"layout": "hallOfFame", "spotlight": true}'),
('Holographic Display', 'Futuristic floating achievements', 'showcase_layout', 2000, 'epic', '{"layout": "holographic", "animated": true, "glow": true}');
