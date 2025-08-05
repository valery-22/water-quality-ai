// components/ChartView.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ChartView({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="timestamp" />
        <YAxis domain={[0, 'dataMax + 5']} />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="predicted_nitrate"
          stroke="#10B981"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
