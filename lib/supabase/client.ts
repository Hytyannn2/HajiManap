// In lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// The '!' tells TypeScript that we're certain these environment variables will exist.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This function will be imported into your client components to create a client
export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey)
