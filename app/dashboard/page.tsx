"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Scissors, Calendar, Star, Plus, LogOut, Settings, X, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Booking, Loyalty } from "@/lib/types"
import { format, isBefore, startOfDay } from "date-fns"

export default function DashboardPage() {
  const { user, loading, signOut, isAdmin } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loyalty, setLoyalty] = useState<Loyalty | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const ensureUserExists = async () => {
    if (!user) return false

    try {
      // Try to create/update user record
      const { error } = await supabase.from("users").upsert({
        id: user.id,
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
        email: user.email!,
        telegram: user.user_metadata?.telegram || null,
      })

      if (error) {
        console.error("Failed to create user:", error)
        return false
      }

      // Also create loyalty record
      const { error: loyaltyError } = await supabase.from("loyalty").upsert({
        user_id: user.id,
      })

      if (loyaltyError) {
        console.warn("Failed to create loyalty record:", loyaltyError)
      }

      return true
    } catch (error) {
      console.error("Error ensuring user exists:", error)
      return false
    }
  }

  const fetchUserData = async () => {
    try {
      console.log("Fetching user data for:", user?.id)

      // First ensure user exists
      await ensureUserExists()

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user!.id)
        .order("date", { ascending: false })

      if (bookingsError) {
        console.error("Could not fetch bookings:", bookingsError)
        toast({
          title: "Database Error",
          description: `Failed to fetch bookings: ${bookingsError.message}`,
          variant: "destructive",
        })
        setBookings([])
      } else {
        console.log("Bookings fetched:", bookingsData)
        setBookings(bookingsData || [])
      }

      // Fetch loyalty data
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from("loyalty")
        .select("*")
        .eq("user_id", user!.id)
        .single()

      if (loyaltyError) {
        console.error("Could not fetch loyalty data:", loyaltyError)
        if (loyaltyError.code !== "PGRST116") {
          toast({
            title: "Database Error",
            description: `Failed to fetch loyalty data: ${loyaltyError.message}`,
            variant: "destructive",
          })
        }
        setLoyalty(null)
      } else {
        console.log("Loyalty data fetched:", loyaltyData)
        setLoyalty(loyaltyData)
      }
    } catch (error: any) {
      console.error("Database fetch error:", error)
      toast({
        title: "Database Error",
        description: "Failed to connect to database. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const cancelBooking = async (bookingId: string) => {
    setCancellingBooking(bookingId)

    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", bookingId)
        .eq("user_id", user!.id) // Extra security check

      if (error) throw error

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      })

      // Refresh data
      fetchUserData()
    } catch (error: any) {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel booking.",
        variant: "destructive",
      })
    } finally {
      setCancellingBooking(null)
    }
  }

  const canCancelBooking = (booking: Booking) => {
    // Can only cancel if booking is still "booked" and the date hasn't passed
    return booking.status === "booked" && !isBefore(new Date(booking.date), startOfDay(new Date()))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "booked" && new Date(booking.date) >= new Date(),
  )
  const pastBookings = bookings.filter(
    (booking) =>
      booking.status === "completed" || booking.status === "cancelled" || new Date(booking.date) < new Date(),
  )

  const progressToFree = loyalty ? loyalty.cut_count % 5 : 0
  const progressPercentage = (progressToFree / 5) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user.user_metadata?.name || user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isAdmin && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black bg-transparent"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-yellow-400" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/book">
                <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book New Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Loyalty Progress */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>Loyalty Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to free cut</span>
                    <span>{progressToFree}/5</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{loyalty?.cut_count || 0}</p>
                  <p className="text-sm text-gray-400">Total cuts completed</p>
                </div>
                {loyalty?.free_cut_earned && (
                  <div className="text-center p-3 bg-yellow-400 text-black rounded-lg">
                    <p className="font-semibold">🎉 Free Cut Available!</p>
                    <p className="text-sm">Contact us to redeem your free haircut</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Bookings:</span>
                <span className="font-semibold">{bookings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Completed:</span>
                <span className="font-semibold text-green-400">
                  {bookings.filter((b) => b.status === "completed").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Upcoming:</span>
                <span className="font-semibold text-blue-400">{upcomingBookings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cancelled:</span>
                <span className="font-semibold text-red-400">
                  {bookings.filter((b) => b.status === "cancelled").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Spent:</span>
                <span className="font-semibold text-yellow-400">
                  RM
                  {bookings
                    .filter((b) => b.status === "completed")
                    .reduce((sum, b) => sum + b.price, 0)
                    .toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <Card className="bg-gray-800 border-gray-700 text-white mt-6">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription className="text-gray-300">Your scheduled haircuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Calendar className="h-8 w-8 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{booking.service}</h3>
                        <p className="text-sm text-gray-400">
                          {format(new Date(booking.date), "MMM dd, yyyy")} at {booking.time}
                        </p>
                        <p className="text-sm text-gray-400">{booking.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        <p className="text-sm text-gray-400 mt-1">RM{booking.price.toFixed(2)}</p>
                      </div>
                      {canCancelBooking(booking) && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white bg-transparent"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700 text-white">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                                <span>Cancel Booking</span>
                              </DialogTitle>
                              <DialogDescription className="text-gray-300">
                                Are you sure you want to cancel this booking? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="bg-gray-700 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2">{booking.service}</h4>
                                <p className="text-sm text-gray-400">
                                  {format(new Date(booking.date), "MMM dd, yyyy")} at {booking.time}
                                </p>
                                <p className="text-sm text-gray-400">{booking.location}</p>
                                <p className="text-sm text-gray-400">Price: RM{booking.price.toFixed(2)}</p>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="text-white border-white hover:bg-white hover:text-black bg-transparent"
                                >
                                  Keep Booking
                                </Button>
                              </DialogTrigger>
                              <Button
                                onClick={() => cancelBooking(booking.id)}
                                disabled={cancellingBooking === booking.id}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {cancellingBooking === booking.id ? "Cancelling..." : "Yes, Cancel Booking"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking History */}
        <Card className="bg-gray-800 border-gray-700 text-white mt-6">
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
            <CardDescription className="text-gray-300">Your past appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {pastBookings.length === 0 ? (
              <div className="text-center py-8">
                <Scissors className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No booking history yet</p>
                <p className="text-sm text-gray-500">Book your first appointment to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Scissors className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">{booking.service}</h3>
                        <p className="text-sm text-gray-400">
                          {format(new Date(booking.date), "MMM dd, yyyy")} at {booking.time}
                        </p>
                        <p className="text-sm text-gray-400">{booking.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      <p className="text-sm text-gray-400 mt-1">RM{booking.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                {pastBookings.length > 5 && (
                  <p className="text-center text-gray-400 text-sm">And {pastBookings.length - 5} more...</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
