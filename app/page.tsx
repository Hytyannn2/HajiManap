"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors, Clock, MapPin, Star, Users, Calendar, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Scissors className="h-20 w-20 text-yellow-400 animate-pulse" />
              <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-xs font-bold">✓</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            HajiManap Cuts
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional mobile barber service for PASUM students. Quality haircuts delivered right to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {loading ? (
              <div className="animate-pulse bg-gray-700 h-12 w-32 rounded-lg"></div>
            ) : user ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 text-lg"
                >
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 text-lg"
                  >
                    Book Now
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-3 text-lg bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-white">Quick Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center">Fast, professional haircuts in 30 minutes or less</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <MapPin className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-white">Mobile Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center">We come to you - KK12, KK11, KK5, and beyond</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-white">Loyalty Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center">Every 5th haircut is free with our loyalty program</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-white">Professional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center">Experienced barber with quality tools and techniques</p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-8 text-white">Simple, Fair Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-yellow-400">KK12 (Home)</CardTitle>
                <CardDescription className="text-gray-300">Kolej Kediaman 12</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">RM10</div>
                <p className="text-gray-300">Best value at our home location</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 border-yellow-400">
              <CardHeader>
                <CardTitle className="text-yellow-400">KK11 & KK5</CardTitle>
                <CardDescription className="text-gray-300">Other Kolej locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">RM12</div>
                <p className="text-gray-300">Popular choice for students</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-yellow-400">Outside PASUM</CardTitle>
                <CardDescription className="text-gray-300">UKM Friends Welcome</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">RM15</div>
                <p className="text-gray-300">Extended service area</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <Users className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <p className="text-gray-300">Happy Customers</p>
          </div>
          <div className="text-center">
            <Calendar className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">1000+</div>
            <p className="text-gray-300">Haircuts Completed</p>
          </div>
          <div className="text-center">
            <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">30min</div>
            <p className="text-gray-300">Average Service Time</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-2xl p-12 border border-yellow-400/20">
          <h2 className="text-3xl font-bold text-white mb-4">Ready for a Fresh Cut?</h2>
          <p className="text-xl text-gray-300 mb-8">Join hundreds of satisfied PASUM students</p>
          {!user && (
            <Link href="/auth">
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-12 py-4 text-xl"
              >
                Get Started Today
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
