// app/shap/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card } from '../components/ui/card'
import { ShapPlot } from '../components/ShapPlot'
import { api } from '../lib/api'


interface ShapValue {
  feature: string
  value: number
}

export default function ShapPage() {
  const [shapValues, setShapValues] = useState<ShapValue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchShap() {
      try {
        const { data } = await api.get('/predict/shap')
        setShapValues(data)
      } catch (error) {
        console.error('Failed to load SHAP values', error)
      } finally {
        setLoading(false)
      }
    }
    fetchShap()
  }, [])

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AI Explainability (SHAP Values)</h1>

      <Card className="p-4">
        {loading ? (
          <p>Loading SHAP values...</p>
        ) : shapValues.length === 0 ? (
          <p>No SHAP data available.</p>
        ) : (
          <>
            <p className="mb-4 text-gray-700">
              The SHAP chart below shows feature importance in predicting water contamination.
            </p>
            <ShapPlot shapValues={shapValues} />
          </>
        )}
      </Card>
    </main>
  )
}
