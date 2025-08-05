// app/map/page.tsx
'use client'

import { useEffect, useState } from 'react'
import MapView from '@/components/MapView'
import { api } from '@/lib/api'

export default function MapPage() {
  const [sensors, setSensors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSensors() {
      try {
        const { data } = await api.get('/sensors')
        setSensors(data)
      } catch (error) {
        console.error('Failed to fetch sensors', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSensors()
  }, [])

  return (
    <main className="p-6 max-w-7xl mx-auto h-screen">
      <h1 className="text-3xl font-bold mb-6">Real-Time Water Quality Map</h1>
      {loading ? (
        <p>Loading sensors...</p>
      ) : (
        <MapView sensors={sensors} />
      )}
    </main>
  )
}
