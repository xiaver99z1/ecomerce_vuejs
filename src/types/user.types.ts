export interface User {
  id: number
  name: string
  email: string
  department?: string | null
  store_id?: number | null
  is_super_admin?: boolean
  email_verified_at?: string | null
  created_at?: string
  updated_at?: string
}

