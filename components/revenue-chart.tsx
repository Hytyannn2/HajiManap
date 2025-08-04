"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { Booking } from "@/lib/types"

interface RevenueChartProps {
  bookings: Booking[]
}

export function RevenueChart({ bookings }: RevenueChartProps) {
  // Calculate revenue by location
  const revenueByLocation = bookings
    .filter((b) => b.status === "completed")
    .reduce(
      (acc, booking) => {
        const location = booking.location
        acc[location] = (acc[location] || 0) + booking.price
        return acc
      },
      {} as Record<string, number>,
    )

  const chartData = Object.entries(revenueByLocation).map(([location, revenue]) => ({
    name: location,
    value: revenue,
    label: `${location} - RM${revenue.toFixed(2)}`,
  }))

  const COLORS = {
    KK12: "#fbbf24", // yellow-400
    KK11: "#3b82f6", // blue-500
    KK5: "#10b981", // emerald-500
    "OUTSIDE PASUM": "#f59e0b", // amber-500
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{data.payload.name}</p>
          <p className="text-yellow-400">Revenue: RM{data.value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null // Don't show label if slice is too small

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <p>No completed bookings yet</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#6b7280"} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => <span style={{ color: entry.color }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
