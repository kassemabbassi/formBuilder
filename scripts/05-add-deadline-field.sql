-- Add deadline field to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;

-- Add is_manually_completed field to form_submissions table
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS is_manually_completed BOOLEAN DEFAULT false;

-- Create index for deadline queries
CREATE INDEX IF NOT EXISTS idx_events_deadline ON events(deadline);
