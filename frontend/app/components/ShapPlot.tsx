// components/ShapPlot.tsx
'use client'

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function ShapPlot({ shapValues }: { shapValues: { feature: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart layout="vertical" data={shapValues} margin={{ left: 30 }}>
        <XAxis type="number" />
        <Tooltip />
        <Bar dataKey="value" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}
