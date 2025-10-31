-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  picture TEXT,
  niche TEXT[] DEFAULT '{}',
  profile_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ai_model TEXT DEFAULT 'gemini-2.5-flash',
  api_key TEXT,
  system_prompt TEXT,
  brand_kit JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User statistics table
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  download_count INTEGER DEFAULT 0,
  carousel_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Carousels table
CREATE TABLE IF NOT EXISTS carousels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  preferences JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Slides table
CREATE TABLE IF NOT EXISTS slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  carousel_id UUID NOT NULL REFERENCES carousels(id) ON DELETE CASCADE,
  slide_order INTEGER NOT NULL,
  headline TEXT NOT NULL,
  body TEXT NOT NULL,
  visual_prompt TEXT NOT NULL,
  background_color TEXT,
  font_color TEXT,
  background_image TEXT,
  background_opacity DECIMAL,
  headline_style JSONB,
  body_style JSONB,
  headline_color TEXT,
  body_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_carousels_user_id ON carousels(user_id);
CREATE INDEX IF NOT EXISTS idx_carousels_created_at ON carousels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_slides_carousel_id ON slides(carousel_id);
CREATE INDEX IF NOT EXISTS idx_slides_order ON slides(carousel_id, slide_order);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carousels_updated_at BEFORE UPDATE ON carousels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slides_updated_at BEFORE UPDATE ON slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (clerk_user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (clerk_user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (clerk_user_id = auth.jwt()->>'sub');

-- User settings policies
CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'));

-- User stats policies
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can update their own stats" ON user_stats
  FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can insert their own stats" ON user_stats
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'));

-- Carousels policies
CREATE POLICY "Users can view their own carousels" ON carousels
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can insert their own carousels" ON carousels
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can update their own carousels" ON carousels
  FOR UPDATE USING (user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'));

CREATE POLICY "Users can delete their own carousels" ON carousels
  FOR DELETE USING (user_id IN (SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'));

-- Slides policies
CREATE POLICY "Users can view slides from their carousels" ON slides
  FOR SELECT USING (carousel_id IN (
    SELECT id FROM carousels WHERE user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  ));

CREATE POLICY "Users can insert slides to their carousels" ON slides
  FOR INSERT WITH CHECK (carousel_id IN (
    SELECT id FROM carousels WHERE user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  ));

CREATE POLICY "Users can update slides from their carousels" ON slides
  FOR UPDATE USING (carousel_id IN (
    SELECT id FROM carousels WHERE user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  ));

CREATE POLICY "Users can delete slides from their carousels" ON slides
  FOR DELETE USING (carousel_id IN (
    SELECT id FROM carousels WHERE user_id IN (
      SELECT id FROM users WHERE clerk_user_id = auth.jwt()->>'sub'
    )
  ));
