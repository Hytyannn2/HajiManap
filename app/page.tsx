"use client"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors, Star, Clock, Shield, MapPin, Zap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { EnvCheck } from "@/components/env-check"

export default function HomePage() {
  const { user, loading: authLoading } = useAuth()
  const [envReady, setEnvReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if environment variables are available
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      setEnvReady(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (envReady && !authLoading && user) {
      router.push("/dashboard")
    }
  }, [user, authLoading, router, envReady])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  // Show environment setup if not ready
  if (!envReady) {
    return <EnvCheck />
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-yellow-400" />
            <h1 className="text-2xl font-bold">Hajimanap Cuts</h1>
          </div>
          <div className="space-x-4">
            <Link href="/auth">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black bg-transparent"
              >
                Login
              </Button>
            </Link>
            <Link href="/auth?mode=signup">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left Content */}
          <div className="space-y-8 z-10 relative">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Mobile Barber
                <span className="text-yellow-400 block">Service</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl">
                Professional haircuts delivered to your kolej! Based in KK12, serving KK11 and KK5. Book your
                appointment and I'll come to you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth?mode=signup">
                <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 w-full sm:w-auto">
                  <Zap className="h-5 w-5 mr-2" />
                  Book Now
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black bg-transparent w-full sm:w-auto"
                >
                  Login
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">RM10</div>
                <div className="text-sm text-gray-400">Starting Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">4</div>
                <div className="text-sm text-gray-400">Locations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">5:1</div>
                <div className="text-sm text-gray-400">Loyalty Ratio</div>
              </div>
            </div>
          </div>

          {/* Right Hero Image/Visual */}
          <div className="h-[400px] md:h-[500px] lg:h-[600px] relative">
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl">
              <div className="text-center space-y-6">
                <Scissors className="h-32 w-32 text-yellow-400 mx-auto animate-pulse" />
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-yellow-400">Hajimanap</div>
                  <div className="text-3xl font-bold text-white">Cuts</div>
                  <div className="text-lg text-gray-300">Professional Mobile Barber</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <Card className="bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <Scissors className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle>Professional Cuts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Expert barbers with years of experience in modern and classic styles.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle>Loyalty Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Earn a free haircut for every 5 completed services. Track your progress easily.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle>Flexible Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Evening slots on weekdays (8-11PM) and extended weekend hours (10AM-12AM).
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle>Easy Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Simple online booking system with instant confirmation and booking management.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <div className="text-center mt-20">
          <h3 className="text-3xl md:text-4xl font-bold mb-8">Our Services</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-yellow-400">KK12 (Home Base)</CardTitle>
                </div>
                <CardDescription className="text-3xl font-bold text-white">RM10</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Professional haircut at your doorstep</p>
                <p className="text-sm text-yellow-400 mt-2">✓ Lowest price - my home kolej!</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-yellow-400">KK11</CardTitle>
                </div>
                <CardDescription className="text-3xl font-bold text-white">RM12</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Mobile service to your kolej</p>
                <p className="text-sm text-gray-400 mt-2">Includes travel to your location</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-yellow-400">KK5</CardTitle>
                </div>
                <CardDescription className="text-3xl font-bold text-white">RM12</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Mobile service to your kolej</p>
                <p className="text-sm text-gray-400 mt-2">Includes travel to your location</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                  <CardTitle className="text-yellow-400">Outside PASUM</CardTitle>
                </div>
                <CardDescription className="text-3xl font-bold text-white">RM15</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Service for UKM friends</p>
                <p className="text-sm text-gray-400 mt-2">Premium service outside campus</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Scissors className="h-6 w-6 text-yellow-400" />
            <span className="text-xl font-bold">Hajimanap Cuts</span>
          </div>
          <p className="text-gray-400">© 2024 Hajimanap Cuts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
