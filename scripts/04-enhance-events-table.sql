-- Add more fields to events table for professional event management
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS location VARCHAR(500),
ADD COLUMN IF NOT EXISTS event_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS organizer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS organizer_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS organizer_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS max_participants INTEGER,
ADD COLUMN IF NOT EXISTS banner_color VARCHAR(50) DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS allow_multiple_submissions BOOLEAN DEFAULT false;

-- Add index for date queries
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON events(end_date);
