"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Scissors, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { TIME_SLOTS, LOCATION_PRICES, LOCATIONS } from "@/lib/types"
import { format, isWeekend, isBefore, startOfDay } from "date-fns"

export default function BookPage() {
  const { user, loading } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (selectedDate) {
      const isWeekendDay = isWeekend(selectedDate)
      const slots = isWeekendDay ? TIME_SLOTS.weekend : TIME_SLOTS.weekday
      setAvailableSlots(slots)
      setSelectedTime("")

      // Fetch booked slots for the selected date
      fetchBookedSlots(selectedDate)
    }
  }, [selectedDate])

  const fetchBookedSlots = async (date: Date) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("time")
        .eq("date", format(date, "yyyy-MM-dd"))
        .eq("status", "booked")

      if (error) {
        console.warn("Could not fetch booked slots:", error.message)
        setBookedSlots([]) // Set empty array as fallback
        return
      }

      setBookedSlots(data.map((booking) => booking.time))
    } catch (error) {
      console.warn("Error fetching booked slots:", error)
      setBookedSlots([]) // Set empty array as fallback
    }
  }

  const ensureUserExists = async () => {
    if (!user) return false

    try {
      // Check if user exists in our users table
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single()

      if (checkError && checkError.code === "PGRST116") {
        // User doesn't exist, create them
        console.log("Creating user record...")
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
          email: user.email!,
          telegram: user.user_metadata?.telegram || null,
        })

        if (insertError) {
          console.error("Failed to create user:", insertError)
          return false
        }

        // Also create loyalty record
        const { error: loyaltyError } = await supabase.from("loyalty").insert({
          user_id: user.id,
        })

        if (loyaltyError) {
          console.warn("Failed to create loyalty record:", loyaltyError)
        }

        console.log("User record created successfully")
      }

      return true
    } catch (error) {
      console.error("Error ensuring user exists:", error)
      return false
    }
  }

  const handleBooking = async () => {
    if (!user || !selectedLocation || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setBookingLoading(true)

    try {
      // First ensure the user exists in our database
      const userExists = await ensureUserExists()
      if (!userExists) {
        toast({
          title: "User Setup Error",
          description: "Failed to set up your user account. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Now create the booking
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        service: "Basic Haircut",
        location: selectedLocation,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        price: LOCATION_PRICES[selectedLocation as keyof typeof LOCATION_PRICES],
        status: "booked",
      })

      if (error) {
        console.error("Booking error:", error)
        toast({
          title: "Booking Error",
          description: `Failed to create booking: ${error.message}`,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Booking Confirmed!",
        description: `Your Basic Haircut is booked for ${format(selectedDate, "MMM dd, yyyy")} at ${selectedTime}.`,
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Booking failed:", error)
      toast({
        title: "Booking Failed",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const today = startOfDay(new Date())

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
              <h1 className="text-3xl font-bold">Book Appointment</h1>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Select Your Service</CardTitle>
              <CardDescription className="text-gray-300">Choose your preferred haircut and schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Selection */}
              <div className="space-y-3">
                <Label>Select Your Location</Label>
                <div className="grid gap-3">
                  {LOCATIONS.map((location) => (
                    <Card
                      key={location.value}
                      className={`cursor-pointer transition-all ${
                        selectedLocation === location.value
                          ? "bg-yellow-400 text-black border-yellow-400"
                          : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                      }`}
                      onClick={() => setSelectedLocation(location.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{location.label}</h3>
                            <p
                              className={`text-sm ${selectedLocation === location.value ? "text-black/70" : "text-gray-400"}`}
                            >
                              {location.value === "KK12" && "My home kolej - best price!"}
                              {location.value === "KK11" && "Mobile service to your kolej"}
                              {location.value === "KK5" && "Mobile service to your kolej"}
                              {location.value === "OUTSIDE PASUM" && "Premium service for UKM friends"}
                            </p>
                          </div>
                          <span className="text-xl font-bold">RM{location.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-3">
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => isBefore(date, today)}
                  className="rounded-md border border-gray-600 bg-gray-700"
                />
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="space-y-3">
                  <Label>Available Time Slots</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        disabled={bookedSlots.includes(time)}
                        className={`${
                          selectedTime === time
                            ? "bg-yellow-400 text-black hover:bg-yellow-500"
                            : bookedSlots.includes(time)
                              ? "opacity-50 cursor-not-allowed"
                              : "text-white border-white hover:bg-white hover:text-black"
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  {selectedDate && isWeekend(selectedDate) && (
                    <p className="text-sm text-gray-400">Weekend hours: 10:00 AM - 12:00 AM</p>
                  )}
                  {selectedDate && !isWeekend(selectedDate) && (
                    <p className="text-sm text-gray-400">Weekday hours: 8:00 PM - 11:00 PM</p>
                  )}
                </div>
              )}

              {/* Book Button */}
              <Button
                onClick={handleBooking}
                disabled={!selectedLocation || !selectedDate || !selectedTime || bookingLoading}
                className="w-full bg-yellow-400 text-black hover:bg-yellow-500 disabled:opacity-50"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </Button>
            </CardContent>
          </Card>

          {/* Booking Summary */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Service:</span>
                  <span>Basic Haircut</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span>
                    {selectedLocation ? LOCATIONS.find((l) => l.value === selectedLocation)?.label : "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span>{selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span>{selectedTime || "Not selected"}</span>
                </div>
                <hr className="border-gray-600" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-yellow-400">
                    RM{selectedLocation ? LOCATION_PRICES[selectedLocation].toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
                <h4 className="font-semibold mb-2 text-red-400">⚠️ Payment Terms</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Payment must be made NOW upon booking</li>
                  <li>• No hutang (credit) accepted</li>
                  <li>• Please be on time for your appointment</li>
                  <li>• Any reschedule from my side will be informed</li>
                  <li>• Sorry for any inconvenience</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
