// app/alerts/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card } from '../components/ui/card'
import { api } from '../lib/api'


interface Alert {
  id: string
  sensor_id: string
  timestamp: string
  risk_level: string
  message: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const { data } = await api.get('/alerts?limit=50&sort=desc')
        setAlerts(data)
      } catch (error) {
        console.error('Failed to fetch alerts', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Alerts Center</h1>

      {loading ? (
        <p>Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p>No alerts at this time.</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map(alert => (
            <Card key={alert.id} className="p-4">
              <p>
                <strong>{alert.risk_level.toUpperCase()}</strong> alert from sensor{' '}
                <em>{alert.sensor_id}</em> at{' '}
                {new Date(alert.timestamp).toLocaleString()}
              </p>
              <p className="mt-2">{alert.message}</p>
            </Card>
          ))}
        </ul>
      )}
    </main>
  )
}
