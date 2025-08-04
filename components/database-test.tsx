"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DatabaseTest() {
  const { user } = useAuth()
  const [testResult, setTestResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setTestResult("Testing connection...")

    try {
      const supabase = createClient()

      // Test basic connection
      const { data, error } = await supabase.from("users").select("count").limit(1)

      if (error) {
        setTestResult(`❌ Connection Error: ${error.message}`)
      } else {
        setTestResult("✅ Database connection successful!")
      }
    } catch (err: any) {
      setTestResult(`❌ Connection failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testUserCreation = async () => {
    if (!user) {
      setTestResult("❌ No user logged in")
      return
    }

    setLoading(true)
    setTestResult("Testing user creation...")

    try {
      const supabase = createClient()

      // Try to create/update user record
      const { data, error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
          email: user.email!,
          telegram: user.user_metadata?.telegram || null,
        })
        .select()

      if (error) {
        setTestResult(`❌ User creation failed: ${error.message}`)
      } else {
        setTestResult(`✅ User record created/updated successfully!`)

        // Also create loyalty record
        const { error: loyaltyError } = await supabase.from("loyalty").upsert({
          user_id: user.id,
        })

        if (loyaltyError) {
          setTestResult((prev) => prev + `\n⚠️ Loyalty creation warning: ${loyaltyError.message}`)
        } else {
          setTestResult((prev) => prev + `\n✅ Loyalty record created!`)
        }
      }
    } catch (err: any) {
      setTestResult(`❌ Failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testBookingCreation = async () => {
    if (!user) {
      setTestResult("❌ No user logged in")
      return
    }

    setLoading(true)
    setTestResult("Testing booking creation...")

    try {
      const supabase = createClient()

      // Try to create a test booking
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          user_id: user.id,
          service: "Basic Haircut",
          location: "KK12",
          date: "2024-12-31",
          time: "20:00",
          price: 10.0,
          status: "booked",
        })
        .select()

      if (error) {
        setTestResult(`❌ Booking creation failed: ${error.message}`)
      } else {
        setTestResult(`✅ Test booking created successfully!`)

        // Clean up the test booking
        if (data && data[0]) {
          await supabase.from("bookings").delete().eq("id", data[0].id)
          setTestResult((prev) => prev + `\n✅ Test booking cleaned up`)
        }
      }
    } catch (err: any) {
      setTestResult(`❌ Failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Button onClick={testConnection} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            Test Connection
          </Button>
          <Button onClick={testUserCreation} disabled={loading || !user} className="bg-green-600 hover:bg-green-700">
            Create User
          </Button>
          <Button
            onClick={testBookingCreation}
            disabled={loading || !user}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Test Booking
          </Button>
        </div>

        {user && (
          <div className="text-sm text-gray-400">
            <p>Logged in as: {user.email}</p>
            <p>User ID: {user.id}</p>
          </div>
        )}

        {testResult && (
          <div className="p-3 bg-gray-700 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
