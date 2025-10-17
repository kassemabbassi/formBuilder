-- Enable Row Level Security on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_answers ENABLE ROW LEVEL SECURITY;

-- Events policies
-- Users can view their own events
CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own events
CREATE POLICY "Users can create own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own events
CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own events
CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  USING (auth.uid() = user_id);

-- Form fields policies
-- Users can view fields for their events
CREATE POLICY "Users can view own event fields"
  ON form_fields FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = form_fields.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Anyone can view fields for active events (for public form access)
CREATE POLICY "Anyone can view active event fields"
  ON form_fields FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = form_fields.event_id
      AND events.is_active = true
    )
  );

-- Users can create fields for their events
CREATE POLICY "Users can create fields for own events"
  ON form_fields FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = form_fields.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Users can update fields for their events
CREATE POLICY "Users can update fields for own events"
  ON form_fields FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = form_fields.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Users can delete fields for their events
CREATE POLICY "Users can delete fields for own events"
  ON form_fields FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = form_fields.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Form submissions policies
-- Users can view submissions for their events
CREATE POLICY "Users can view submissions for own events"
  ON form_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = form_submissions.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Anyone can create submissions for active events
CREATE POLICY "Anyone can submit to active events"
  ON form_submissions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = form_submissions.event_id
      AND events.is_active = true
    )
  );

-- Submission answers policies
-- Users can view answers for their event submissions
CREATE POLICY "Users can view answers for own event submissions"
  ON submission_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM form_submissions
      JOIN events ON events.id = form_submissions.event_id
      WHERE form_submissions.id = submission_answers.submission_id
      AND events.user_id = auth.uid()
    )
  );

-- Anyone can create answers for submissions
CREATE POLICY "Anyone can create submission answers"
  ON submission_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM form_submissions
      JOIN events ON events.id = form_submissions.event_id
      WHERE form_submissions.id = submission_answers.submission_id
      AND events.is_active = true
    )
  );
