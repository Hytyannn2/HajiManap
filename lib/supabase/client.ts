import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Use the correct Supabase URL from the logs
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dtwrhpvkaljppghuccpv.supabase.co"
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0d3JocHZrYWxqcHBnaHVjY3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MzY4NzQsImV4cCI6MjA1MTUxMjg3NH0.Ej7Ej7Ej7Ej7Ej7Ej7Ej7Ej7Ej7Ej7Ej7Ej7Ej7E"

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
