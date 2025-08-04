"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthError } from "@supabase/supabase-js"
import { createClient } from "./supabase/client"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName: string, telegram?: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Simple admin check - just check the email directly
  const isAdmin = user?.email === "wmuhdharith@gmail.com"

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)

          // Create user record if it doesn't exist
          const { error: userError } = await supabase.from("users").upsert({
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
            email: session.user.email || "",
            telegram: session.user.user_metadata?.telegram || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (userError) {
            console.error("Error creating user record:", userError)
          }

          // Create loyalty record if it doesn't exist
          const { error: loyaltyError } = await supabase.from("loyalty").upsert({
            user_id: session.user.id,
            cut_count: 0,
            free_cut_earned: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (loyaltyError) {
            console.error("Error creating loyalty record:", loyaltyError)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error in checkUser:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string, telegram?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName,
          telegram: telegram || null,
        },
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
