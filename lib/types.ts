export type FieldType =
  | "text"
  | "email"
  | "number"
  | "tel"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "time"
  | "url"
  | "file"
  | "rating"
  | "slider"
  | "color"
  | "datetime"
  | "month"
  | "week"
  | "range"
  | "password"
  | "multiselect"
  | "yesno"
  | "scale"
  | "matrix"

export interface AppUser {
  id: string
  user_id: string
  email: string
  display_name: string
  created_at: string
  updated_at: string
}

export interface FormField {
  id: string
  event_id: string
  field_type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[] // For select, radio, checkbox
  validation?: {
    min?: number
    max?: number
    pattern?: string
    minLength?: number
    maxLength?: number
  }
  order_index: number
  created_at: string
}

export interface Event {
  id: string
  user_id: string
  title: string
  description?: string
  slug: string
  is_active: boolean
  start_date?: string
  end_date?: string
  location?: string
  event_type?: string
  organizer_name?: string
  organizer_email?: string
  organizer_phone?: string
  max_participants?: number
  banner_color?: string
  allow_multiple_submissions?: boolean
  created_at: string
  updated_at: string
}

export interface FormSubmission {
  id: string
  event_id: string
  submitted_at: string
  ip_address?: string
  user_agent?: string
}

export interface SubmissionAnswer {
  id: string
  submission_id: string
  field_id: string
  answer: string
  created_at: string
}

export interface SubmissionWithAnswers extends FormSubmission {
  answers: (SubmissionAnswer & { field: FormField })[]
}
