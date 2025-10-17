-- Create appusers table to store user profile information
CREATE TABLE IF NOT EXISTS appusers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_appusers_user_id ON appusers(user_id);
CREATE INDEX IF NOT EXISTS idx_appusers_email ON appusers(email);

-- Add trigger to appusers table
CREATE TRIGGER update_appusers_updated_at
  BEFORE UPDATE ON appusers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE appusers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appusers
CREATE POLICY "Users can view their own profile"
  ON appusers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON appusers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON appusers FOR UPDATE
  USING (auth.uid() = user_id);
