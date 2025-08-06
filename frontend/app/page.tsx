"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import mapboxgl from "mapbox-gl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { UploadCloud, ImagePlus, Sparkles, LoaderCircle, AlertTriangle, X } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "<YOUR_MAPBOX_TOKEN>";

type SensorReading = {
  timestamp: number;
  nitrate: number;
  temperature: number;
};

const MOCK_SENSOR_LOCATION = {
  lat: 51.5074,
  lng: -0.1278,
};

const AI_FEATURE_IMPORTANCE = [
  { feature: "Rainfall", importance: 0.35 },
  { feature: "Temperature", importance: 0.25 },
  { feature: "Industrial Activity", importance: 0.20 },
  { feature: "pH Level", importance: 0.10 },
  { feature: "Turbidity", importance: 0.10 },
];

export default function DashboardPage() {
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [simulationRunning, setSimulationRunning] = useState(false);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [imageSummary, setImageSummary] = useState<string | null>(null);

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  // Initialize Mapbox map once on mount
  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [MOCK_SENSOR_LOCATION.lng, MOCK_SENSOR_LOCATION.lat],
        zoom: 10,
      });

      new mapboxgl.Marker()
        .setLngLat([MOCK_SENSOR_LOCATION.lng, MOCK_SENSOR_LOCATION.lat])
        .setPopup(new mapboxgl.Popup().setText("Sensor Location"))
        .addTo(mapInstance.current);
    }
  }, []);

  // Start sensor simulation only when image is uploaded and AI analysis done
  useEffect(() => {
    if (!simulationRunning) return;

    // Initialize sensor data with zeros
    const initialData: SensorReading[] = [];
    const now = Date.now();
    for (let i = 10; i > 0; i--) {
      initialData.push({
        timestamp: now - i * 5000,
        nitrate: 0,
        temperature: 0,
      });
    }
    setSensorData(initialData);

    // Start interval simulation
    const interval = setInterval(() => {
      setSensorData((prev) => {
        const last = prev[prev.length - 1] || { nitrate: 0, temperature: 0 };

        const nextNitrate = Math.min(last.nitrate + Math.random() * 0.4, 12); // max 12 mg/L
        const nextTemp = Math.min(last.temperature + Math.random() * 0.3, 30); // max 30°C

        const newReading = {
          timestamp: Date.now(),
          nitrate: +nextNitrate.toFixed(2),
          temperature: +nextTemp.toFixed(2),
        };

        if (newReading.nitrate > 8) {
          setAlerts((a) => {
            if (a.find((alert) => alert.includes(newReading.nitrate.toFixed(2)))) return a;
            return [...a, `⚠️ High nitrate detected: ${newReading.nitrate} mg/L`];
          });
        }

        return [...prev.slice(-19), newReading];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [simulationRunning]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setAiResponse(null);
      setImageSummary(null);
      setAlerts([]);
      setSensorData([]);
      setSimulationRunning(false);
    }
  };

  const runAIAnalysis = async () => {
    if (!selectedImage) return;
    setLoading(true);
    setAiResponse(null);
    setImageSummary(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to analyze image");

      const data = await res.json();
      setAiResponse(data.summary);

      // Here, create a short summary (resume) from AI response or dummy text
      // For example, use first sentence or custom logic
      const firstLine = data.summary?.split("\n")[0] || "No summary available.";
      setImageSummary(firstLine);

      // Start sensor simulation after AI analysis completes
      setSimulationRunning(true);
    } catch (err) {
      setAiResponse("Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = (index: number) => {
    setAlerts((a) => a.filter((_, i) => i !== index));
  };

  const chartData = sensorData.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString(),
    nitrate: d.nitrate,
    temperature: d.temperature,
  }));

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold">🧪 Latest Nitrate Level</h3>
            <p className="text-3xl font-bold text-green-600">
              {sensorData.length ? `${sensorData[sensorData.length - 1].nitrate} mg/L` : "0 mg/L"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold">🌡️ Latest Temperature</h3>
            <p className="text-3xl font-bold">
              {sensorData.length ? `${sensorData[sensorData.length - 1].temperature} °C` : "0 °C"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold">⚠️ Active Alerts</h3>
            <p className="text-3xl font-bold text-red-600">{alerts.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Nitrate Levels Over Time (mg/L)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="time" minTickGap={20} />
                <YAxis domain={[0, 15]} />
                <Tooltip />
                <Line type="monotone" dataKey="nitrate" stroke="#22c55e" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Temperature Over Time (°C)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="time" minTickGap={20} />
                <YAxis domain={[0, 35]} />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#3b82f6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Map + Small Description */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Sensor Location Map</h3>
          <p className="text-sm mb-4 text-gray-600">
            Sensor currently located at Latitude: {MOCK_SENSOR_LOCATION.lat}, Longitude: {MOCK_SENSOR_LOCATION.lng}.
          </p>
          <div ref={mapContainer} className="w-full h-64 rounded-lg border" />
        </CardContent>
      </Card>

      {/* AI Feature Importance */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">AI Model Feature Importance</h3>
          <BarChart width={600} height={250} data={AI_FEATURE_IMPORTANCE} layout="vertical" margin={{ left: 50 }}>
            <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
            <YAxis dataKey="feature" type="category" width={120} />
            <Tooltip formatter={(v: number) => `${(v * 100).toFixed(1)}%`} />
            <Bar dataKey="importance" fill="#2563eb" />
          </BarChart>
          <p className="text-gray-600 mt-2 text-sm italic">Shows which environmental factors influence predictions most.</p>
        </CardContent>
      </Card>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-red-600">
              <AlertTriangle /> Active Alerts
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {alerts.map((alert, i) => (
                <li key={i} className="flex justify-between items-center bg-red-100 p-3 rounded">
                  <p>{alert}</p>
                  <Button variant="ghost" size="sm" onClick={() => dismissAlert(i)}>
                    <X />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Image Upload & AI Analysis */}
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ImagePlus className="w-5 h-5" /> Upload Water Image for AI Analysis
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button variant="outline">
                <UploadCloud className="w-4 h-4 mr-2" /> Choose Image
              </Button>
            </label>
          </div>

          {imagePreview && (
            <div className="rounded-lg overflow-hidden border max-h-[300px]">
              <Image
                src={imagePreview}
                alt="Preview"
                width={800}
                height={400}
                className="object-contain w-full h-full"
              />
            </div>
          )}

          {imageSummary && (
            <p className="mt-2 italic text-gray-700 text-center">{imageSummary}</p>
          )}

          {selectedImage && (
            <Button
              variant="default"
              className="self-start"
              disabled={loading}
              onClick={runAIAnalysis}
            >
              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Run AI Analysis
                </>
              )}
            </Button>
          )}

          {aiResponse && (
            <div className="mt-4 p-4 bg-gray-50 rounded border whitespace-pre-wrap text-gray-700">
              <h4 className="font-semibold mb-1">📊 AI Insight</h4>
              {aiResponse}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
