// components/MapView.tsx
'use client'
import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MapView({ sensors }: { sensors: any[] }) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current!,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [5, 52], // default
      zoom: 6,
    })

    sensors.forEach(sensor => {
      new mapboxgl.Marker()
        .setLngLat([sensor.lon, sensor.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <h3>${sensor.name}</h3>
            <p>Nitrate: ${sensor.predicted_nitrate} mg/L</p>
          `)
        )
        .addTo(map)
    })

    return () => map.remove()
  }, [sensors])

  return <div ref={mapRef} className="h-[80vh] w-full rounded-2xl shadow" />
}
