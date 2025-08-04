"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, MapPin } from "lucide-react"

interface BookingConfirmationProps {
  location: string
  date: string
  time: string
  price: number
}

export function BookingConfirmation({ location, date, time, price }: BookingConfirmationProps) {
  return (
    <Card className="bg-green-900/20 border-green-500 text-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span>Booking Confirmed!</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm">
              {date} at {time}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <span className="font-semibold">Total Paid:</span>
          <span className="text-xl font-bold text-green-400">RM{price.toFixed(2)}</span>
        </div>

        <div className="bg-yellow-400 text-black p-3 rounded-lg">
          <h4 className="font-semibold mb-2">📱 Important Reminders:</h4>
          <ul className="text-sm space-y-1">
            <li>• Please be ready and on time</li>
            <li>• I'll message you 30 minutes before arrival</li>
            <li>• Any changes from my side will be communicated</li>
            <li>• Thank you for choosing our mobile service!</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
