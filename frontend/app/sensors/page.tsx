// app/sensors/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Card } from '@/components/ui/card'
import { ChartView } from '@/components/ChartView'

interface Sensor {
  id: string
  name: string
  lat: number
  lon: number
  predicted_nitrate: number
}

export default function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSensors() {
      try {
        const { data } = await api.get('/sensors')
        setSensors(data)
      } catch (error) {
        console.error('Failed to load sensors', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSensors()
  }, [])

  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sensors Overview</h1>

      {loading ? (
        <p>Loading sensors...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <ul className="space-y-3 max-h-[70vh] overflow-auto border rounded p-4">
              {sensors.map(sensor => (
                <li
                  key={sensor.id}
                  className={`cursor-pointer p-3 rounded ${
                    selectedSensor?.id === sensor.id
                      ? 'bg-emerald-100'
                      : 'hover:bg-emerald-50'
                  }`}
                  onClick={() => setSelectedSensor(sensor)}
                >
                  <p className="font-semibold">{sensor.name}</p>
                  <p className="text-sm text-gray-600">
                    Nitrate: {sensor.predicted_nitrate.toFixed(2)} mg/L
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            {selectedSensor ? (
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">
                  Sensor: {selectedSensor.name}
                </h2>
                {/* Fetch and show trend data for selected sensor */}
                <SensorTrend sensorId={selectedSensor.id} />
              </Card>
            ) : (
              <p>Select a sensor to see trends.</p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

function SensorTrend({ sensorId }: { sensorId: string }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrend() {
      try {
        const { data } = await api.get(`/readings?sensor_id=${sensorId}&limit=50&sort=desc`)
        setData(
          data.map((r: any) => ({
            timestamp: new Date(r.timestamp).toLocaleString(),
            predicted_nitrate: r.predicted_nitrate,
          }))
        )
      } catch (error) {
        console.error('Failed to load sensor trend', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTrend()
  }, [sensorId])

  if (loading) return <p>Loading trend data...</p>
  if (data.length === 0) return <p>No trend data available.</p>

  return <ChartView data={data} />
}
