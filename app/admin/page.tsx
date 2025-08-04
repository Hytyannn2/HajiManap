"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import supabase from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Scissors, ArrowLeft, Users, Calendar, DollarSign, Star, Gift, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Booking, User, Loyalty } from "@/lib/types"
import { format } from "date-fns"
import { RevenueChart } from "@/components/revenue-chart"

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const [bookings, setBookings] = useState<(Booking & { users: User })[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loyalties, setLoyalties] = useState<Loyalty[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState("")

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/dashboard")
    }
  }, [user, loading, isAdmin, router])

  useEffect(() => {
    if (user && isAdmin) {
      fetchAdminData()
    }
  }, [user, isAdmin])

  const fetchAdminData = async () => {
    try {
      // Fetch all bookings with user data
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
          *,
          users (
            id,
            name,
            email,
            telegram
          )
        `)
        .order("date", { ascending: false })

      if (bookingsError) {
        console.warn("Could not fetch bookings:", bookingsError.message)
        setBookings([])
      } else {
        setBookings(bookingsData || [])
      }

      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })

      if (usersError) {
        console.warn("Could not fetch users:", usersError.message)
        setUsers([])
      } else {
        setUsers(usersData || [])
      }

      // Fetch all loyalty data
      const { data: loyaltiesData, error: loyaltiesError } = await supabase.from("loyalty").select("*")

      if (loyaltiesError) {
        console.warn("Could not fetch loyalty data:", loyaltiesError.message)
        setLoyalties([])
      } else {
        setLoyalties(loyaltiesData || [])
      }
    } catch (error: any) {
      console.warn("Admin data fetch error:", error)
    } finally {
      setLoadingData(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", bookingId)

      if (error) throw error

      // If marking as completed, update loyalty automatically
      if (newStatus === "completed") {
        const booking = bookings.find((b) => b.id === bookingId)
        if (booking) {
          await updateLoyaltyForCompletion(booking.user_id)
        }
      }

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${newStatus}.`,
      })

      // Refresh data
      fetchAdminData()
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update booking status.",
        variant: "destructive",
      })
    }
  }

  const updateLoyaltyForCompletion = async (userId: string) => {
    try {
      // Get current loyalty data
      const { data: currentLoyalty, error: fetchError } = await supabase
        .from("loyalty")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (fetchError) throw fetchError

      const newCutCount = currentLoyalty.cut_count + 1
      const earnedFreeCut = newCutCount % 5 === 0

      const { error } = await supabase
        .from("loyalty")
        .update({
          cut_count: newCutCount,
          free_cut_earned: earnedFreeCut || currentLoyalty.free_cut_earned,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      if (error) throw error

      if (earnedFreeCut) {
        toast({
          title: "Free Cut Earned! 🎉",
          description: "Customer has earned a free haircut!",
        })
      }
    } catch (error: any) {
      console.error("Failed to update loyalty:", error)
    }
  }

  const redeemFreeCut = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("loyalty")
        .update({
          free_cut_earned: false,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)

      if (error) throw error

      toast({
        title: "Free Cut Redeemed",
        description: "Customer's free cut has been marked as used.",
      })

      fetchAdminData()
    } catch (error: any) {
      toast({
        title: "Redemption Failed",
        description: error.message || "Failed to redeem free cut.",
        variant: "destructive",
      })
    }
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

  if (!user || !isAdmin) {
    return null
  }

  const totalRevenue = bookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + b.price, 0)
  const todayBookings = bookings.filter(
    (b) => format(new Date(b.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
  )

  const selectedUser = users.find((u) => u.id === selectedUserId)
  const selectedUserLoyalty = loyalties.find((l) => l.user_id === selectedUserId)
  const selectedUserBookings = bookings.filter((b) => b.user_id === selectedUserId)
  const completedBookings = selectedUserBookings.filter((b) => b.status === "completed").length
  const nextCutIsFree = selectedUserLoyalty?.free_cut_earned || false

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-black bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-yellow-400" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayBookings.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">RM{totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Automated Loyalty Management */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>Loyalty Status Checker</span>
              </CardTitle>
              <CardDescription className="text-gray-300">Check if customer's next cut is free</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Customer</label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => {
                      const userLoyalty = loyalties.find((l) => l.user_id === user.id)
                      return (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({userLoyalty?.cut_count || 0} cuts)
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedUser && selectedUserLoyalty && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="font-semibold mb-2">{selectedUser.name}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Total Cuts:</span>
                        <span className="ml-2 font-semibold">{selectedUserLoyalty.cut_count}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Completed:</span>
                        <span className="ml-2 font-semibold">{completedBookings}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Progress:</span>
                        <span className="ml-2 font-semibold">{selectedUserLoyalty.cut_count % 5}/5</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Next Cut:</span>
                        <span className={`ml-2 font-semibold ${nextCutIsFree ? "text-green-400" : "text-yellow-400"}`}>
                          {nextCutIsFree ? "FREE" : "PAID"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {nextCutIsFree && (
                    <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Gift className="h-5 w-5 text-green-400" />
                          <span className="font-semibold text-green-400">Free Cut Available!</span>
                        </div>
                        <Button
                          onClick={() => redeemFreeCut(selectedUserId)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark as Redeemed
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to next free cut</span>
                      <span>{selectedUserLoyalty.cut_count % 5}/5</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((selectedUserLoyalty.cut_count % 5) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                <span>Revenue Breakdown</span>
              </CardTitle>
              <CardDescription className="text-gray-300">Revenue by location and status</CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart bookings={bookings} />
            </CardContent>
          </Card>
        </div>

        {/* All Bookings */}
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription className="text-gray-300">Manage all customer bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-700 rounded-lg gap-4"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <Calendar className="h-6 w-6 text-yellow-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">{booking.service}</h3>
                        <p className="text-sm text-gray-400">
                          {booking.users?.name || "Unknown User"} ({booking.users?.email})
                        </p>
                        <p className="text-sm text-gray-400">
                          {format(new Date(booking.date), "MMM dd, yyyy")} at {booking.time}
                        </p>
                        <p className="text-sm text-gray-400">Location: {booking.location}</p>
                        {booking.users?.telegram && (
                          <p className="text-sm text-gray-400">Telegram: {booking.users.telegram}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="font-semibold">RM{booking.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">{format(new Date(booking.created_at), "MMM dd")}</p>
                      </div>
                      <Select value={booking.status} onValueChange={(value) => updateBookingStatus(booking.id, value)}>
                        <SelectTrigger className="w-32 bg-gray-600 border-gray-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="booked">Booked</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
