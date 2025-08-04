import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Create a singleton instance
export const supabase = createSupabaseClient()

export default supabase
