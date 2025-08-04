"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Scissors,
  Clock,
  MapPin,
  Star,
  Users,
  Calendar,
  Shield,
  Zap,
  Sparkles,
  Award,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"

export default function HomePage() {
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    { icon: Clock, title: "Quick Service", desc: "Professional cuts in 30 minutes" },
    { icon: MapPin, title: "Mobile Service", desc: "We come to your kolej" },
    { icon: Star, title: "Loyalty Rewards", desc: "Every 5th cut is free" },
    { icon: Shield, title: "Professional", desc: "2+ years experience" },
  ]

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Scissors className="h-6 w-6 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                HajiManap Barbershop
              </h1>
              <p className="text-xs text-gray-400">Professional Mobile Service</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse bg-gray-700 h-10 w-24 rounded-lg"></div>
            ) : user ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-semibold px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth?mode=signup">
                  <Button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-semibold px-6 py-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo and Brand */}
          <div className="mb-12">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl mb-6 mx-auto transform hover:scale-110 transition-all duration-500">
                <Scissors className="h-16 w-16 text-black animate-pulse" />
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl blur-xl animate-pulse"></div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-amber-300 bg-clip-text text-transparent leading-tight">
              HajiManap
              <span className="block text-4xl md:text-6xl bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Barbershop
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Professional mobile barber service for PASUM students. Quality haircuts delivered right to your doorstep
              with 2+ years of experience.
            </p>

            <div className="flex items-center justify-center space-x-6 mb-8">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Available Now
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2 text-sm">
                <Star className="w-4 h-4 mr-2" />
                2+ Years Experience
              </Badge>
            </div>
          </div>

          {/* Interactive Feature Showcase */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="grid md:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`text-center p-6 rounded-2xl transition-all duration-500 cursor-pointer ${
                      currentFeature === index
                        ? "bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-400/30 scale-105"
                        : "bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30"
                    }`}
                    onClick={() => setCurrentFeature(index)}
                  >
                    <feature.icon
                      className={`h-12 w-12 mx-auto mb-4 transition-all duration-300 ${
                        currentFeature === index ? "text-yellow-400 scale-110" : "text-gray-400"
                      }`}
                    />
                    <h3
                      className={`font-semibold mb-2 transition-all duration-300 ${
                        currentFeature === index ? "text-white" : "text-gray-300"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-sm transition-all duration-300 ${
                        currentFeature === index ? "text-gray-200" : "text-gray-400"
                      }`}
                    >
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            {!user && (
              <>
                <Link href="/auth?mode=signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold px-12 py-4 text-lg rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                  >
                    <Sparkles className="h-6 w-6 mr-3 group-hover:animate-spin" />
                    Book Your Cut
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white hover:border-gray-400 px-12 py-4 text-lg rounded-2xl backdrop-blur-sm transition-all duration-300 bg-transparent"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Premium Pricing Cards */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Transparent Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* KK12 - Premium Card */}
            <Card className="bg-gradient-to-br from-yellow-400/10 to-amber-500/10 border-2 border-yellow-400/30 backdrop-blur-xl shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-amber-500 text-black px-4 py-2 text-sm font-bold rounded-bl-2xl">
                POPULAR
              </div>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-2xl text-yellow-400 mb-2">KK12 (Home)</CardTitle>
                <CardDescription className="text-gray-300">Kolej Kediaman 12</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-5xl font-bold text-white mb-4">RM10</div>
                <p className="text-gray-300 mb-6">Best value at our home location</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Professional haircut</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>At your doorstep</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Loyalty points included</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KK11 & KK5 */}
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-blue-400 mb-2">KK11 & KK5</CardTitle>
                <CardDescription className="text-gray-300">Other Kolej locations</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-5xl font-bold text-white mb-4">RM12</div>
                <p className="text-gray-300 mb-6">Mobile service to your kolej</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Professional service</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Travel included</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Same quality service</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outside PASUM */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-purple-400 mb-2">Outside PASUM</CardTitle>
                <CardDescription className="text-gray-300">UKM Friends Welcome</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-5xl font-bold text-white mb-4">RM15</div>
                <p className="text-gray-300 mb-6">Extended service area</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Extended travel</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Same quality service</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>Flexible arrangements</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-3xl p-12 border border-gray-700/30 shadow-2xl mb-20">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-all duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">100+</div>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-all duration-300">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">200+</div>
              <p className="text-gray-300">Haircuts Completed</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-all duration-300">
                <Award className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">2+</div>
              <p className="text-gray-300">Years Experience</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        {!user && (
          <div className="text-center bg-gradient-to-r from-yellow-400/10 via-amber-500/10 to-orange-500/10 rounded-3xl p-12 border border-yellow-400/20 backdrop-blur-xl shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">Ready for a Premium Cut?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our growing community of satisfied PASUM students who trust us with their style.
            </p>
            <Link href="/auth?mode=signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold px-16 py-6 text-xl rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                <Zap className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                Book Your First Cut
                <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 backdrop-blur-xl py-12 border-t border-gray-800/50">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Scissors className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              HajiManap Barbershop
            </span>
          </div>
          <p className="text-gray-400 mb-4">Professional mobile barber service for PASUM students</p>
          <p className="text-gray-500 text-sm">© 2024 HajiManap Barbershop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
