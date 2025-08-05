// app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { ChartView } from '@/components/ChartView'
import { Card } from '@/components/ui/card'

interface SensorReading {
  timestamp: string
  predicted_nitrate: number
}

export default function DashboardPage() {
  const [readings, setReadings] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReadings() {
      try {
        const { data } = await api.get('/readings?limit=50&sort=desc')
        setReadings(data)
      } catch (error) {
        console.error('Failed to load readings', error)
      } finally {
        setLoading(false)
      }
    }
    fetchReadings()
  }, [])

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Water Quality Dashboard</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Nitrate Levels</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ChartView
              data={readings.map(r => ({
                timestamp: new Date(r.timestamp).toLocaleString(),
                predicted_nitrate: r.predicted_nitrate,
              }))}
            />
          )}
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <ul className="space-y-2 text-gray-700">
            <li>
              Total Readings: <strong>{readings.length}</strong>
            </li>
            <li>
              Latest Nitrate Level:{' '}
              <strong>
                {readings.length > 0
                  ? readings[0].predicted_nitrate.toFixed(2) + ' mg/L'
                  : 'N/A'}
              </strong>
            </li>
            {/* Add more stats here as needed */}
          </ul>
        </Card>
      </section>
    </main>
  )
}
