import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True when env vars are missing or set to placeholder values */
export const IS_MOCK_MODE =
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl === 'YOUR_SUPABASE_URL' ||
  supabaseUrl.startsWith('https://placeholder')

/**
 * Supabase client. In mock mode, this is a stub that should never be called
 * -- pages gate on IS_MOCK_MODE and use MOCK data instead.
 */
export const supabase: SupabaseClient = IS_MOCK_MODE
  ? (null as unknown as SupabaseClient)
  : createClient(supabaseUrl!, supabaseAnonKey!)
