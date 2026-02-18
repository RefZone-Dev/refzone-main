import { createServiceClient } from "./service"

// Auto-create database tables if they don't exist
export async function initDatabase() {
  const supabase = createServiceClient()
  
  try {
    // Check if scenarios table exists
    const { error: checkError } = await supabase
      .from('scenarios')
      .select('id')
      .limit(1)
    
    // If no error, tables exist
    if (!checkError) {
      console.log('[DB] Database tables already exist')
      return
    }
    
    console.log('[DB] Creating database tables...')
    
    // Create tables using SQL
    const { error: sqlError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Enable UUID extension
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        -- Create profiles table
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          email TEXT UNIQUE,
          full_name TEXT,
          avatar_url TEXT,
          is_admin BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create scenarios table
        CREATE TABLE IF NOT EXISTS scenarios (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          video_url TEXT,
          ai_answer TEXT,
          law_category TEXT,
          law_section TEXT,
          scenario_type TEXT DEFAULT 'foul',
          difficulty TEXT DEFAULT 'medium',
          is_active BOOLEAN DEFAULT true,
          points_value INTEGER DEFAULT 10,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create quizzes table
        CREATE TABLE IF NOT EXISTS quizzes (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          difficulty TEXT DEFAULT 'medium',
          time_limit_minutes INTEGER DEFAULT 15,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create quiz_questions table
        CREATE TABLE IF NOT EXISTS quiz_questions (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
          question_text TEXT NOT NULL,
          question_type TEXT DEFAULT 'multiple_choice',
          options TEXT[],
          correct_answer TEXT,
          explanation TEXT,
          points_value INTEGER DEFAULT 5,
          order_index INTEGER DEFAULT 0,
          law_category TEXT,
          law_section TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create user_progress table
        CREATE TABLE IF NOT EXISTS user_progress (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id),
          scenario_id UUID REFERENCES scenarios(id),
          user_answer TEXT,
          is_correct BOOLEAN,
          confidence INTEGER,
          completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create quiz_attempts table
        CREATE TABLE IF NOT EXISTS quiz_attempts (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id),
          quiz_id UUID REFERENCES quizzes(id),
          score INTEGER,
          total_questions INTEGER,
          completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create admin_config table
        CREATE TABLE IF NOT EXISTS admin_config (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          config_key TEXT UNIQUE NOT NULL,
          config_value TEXT,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create activity_logs table
        CREATE TABLE IF NOT EXISTS activity_logs (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id),
          activity_type TEXT,
          activity_data JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Create user_stats table
        CREATE TABLE IF NOT EXISTS user_stats (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) UNIQUE,
          total_points INTEGER DEFAULT 0,
          scenarios_completed INTEGER DEFAULT 0,
          quizzes_completed INTEGER DEFAULT 0,
          current_streak INTEGER DEFAULT 0,
          longest_streak INTEGER DEFAULT 0,
          last_activity_date DATE,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        -- Enable RLS
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
        ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
        ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
        ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
        ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;
        ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
        ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

        -- Insert default config
        INSERT INTO admin_config (config_key, config_value) VALUES
          ('daily_scenario_prompt', 'Generate a realistic football refereeing scenario.'),
          ('weekly_quiz_prompt', 'Generate a football refereeing quiz with 5 questions.')
        ON CONFLICT (config_key) DO NOTHING;
      `
    })
    
    if (sqlError) {
      console.error('[DB] Error creating tables:', sqlError)
    } else {
      console.log('[DB] Database tables created successfully')
    }
  } catch (error) {
    console.error('[DB] Database initialization error:', error)
  }
}

// Set up auth trigger for auto-admin
export async function setupAuthTrigger() {
  const supabase = createServiceClient()
  
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create function to handle new user signup
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $$
        BEGIN
          INSERT INTO public.profiles (id, email, full_name, is_admin)
          VALUES (
            NEW.id, 
            NEW.email, 
            NEW.raw_user_meta_data->>'full_name',
            CASE 
              WHEN NEW.email = 'refzone.office@gmail.com' THEN true
              ELSE false
            END
          );
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Create trigger
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `
    })
    
    if (error) {
      console.error('[DB] Error setting up auth trigger:', error)
    } else {
      console.log('[DB] Auth trigger set up successfully')
    }
  } catch (error) {
    console.error('[DB] Auth trigger setup error:', error)
  }
}
