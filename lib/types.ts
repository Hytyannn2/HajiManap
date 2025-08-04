export interface User {
  id: string
  name: string
  email: string
  telegram?: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  service: "Basic Haircut"
  location: "KK12" | "KK11" | "KK5" | "OUTSIDE PASUM"
  date: string
  time: string
  status: "booked" | "completed" | "cancelled"
  price: number
  created_at: string
  updated_at: string
  users?: User
}

export interface Loyalty {
  user_id: string
  cut_count: number
  free_cut_earned: boolean
  created_at: string
  updated_at: string
}

export const LOCATION_PRICES = {
  KK12: 10.0, // Home location - cheaper
  KK11: 12.0, // Other locations - higher price
  KK5: 12.0, // Other locations - higher price
  "OUTSIDE PASUM": 15.0, // Outside campus - highest price
} as const

export const LOCATIONS = [
  { value: "KK12", label: "Kolej Kediaman 12 (KK12)", price: 10 },
  { value: "KK11", label: "Kolej Kediaman 11 (KK11)", price: 12 },
  { value: "KK5", label: "Kolej Kediaman 5 (KK5)", price: 12 },
  { value: "OUTSIDE PASUM", label: "Outside PASUM (UKM Friends)", price: 15 },
] as const

export const TIME_SLOTS = {
  weekday: ["20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"],
  weekend: [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ],
} as const
