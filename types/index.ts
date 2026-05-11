export interface User {
  id: string
  email: string
  name: string | null
  google_access_token: string | null
  google_refresh_token: string | null
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  folder_ids: string[]
  folder_names: string[]
  delivery_email: string
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  delivery_hour: number
  timezone: string
  personal_instructions: string | null
  onboarding_context: string | null
  is_active: boolean
  updated_at: string
}

export interface Digest {
  id: string
  user_id: string
  sent_at: string
  subject: string
  body_html: string
  body_text: string | null
  docs_read: string[]
  doc_count: number
  status: 'sent' | 'failed'
}

export interface DriveFolder {
  id: string
  name: string
}

export interface DriveDoc {
  name: string
  content: string
  modified: string
}

export interface DigestResult {
  body: string
  subject: string
}
