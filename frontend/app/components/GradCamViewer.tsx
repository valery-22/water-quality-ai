// components/GradCamViewer.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";


export default function GradCamViewer() {
  const [image, setImage] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [gradcamPath, setGradcamPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    const res = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setPrediction(data.prediction);
    setConfidence(data.confidence);
    setGradcamPath(`http://localhost:8000/${data.gradcam_path}`);
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Water Contamination Prediction</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <Button onClick={handleUpload} disabled={!image || loading}>
          {loading ? "Analyzing..." : "Analyze Image"}
        </Button>

        {prediction && (
          <div className="mt-4">
            <p className="text-lg font-medium">Prediction: {prediction}</p>
            <p className="text-sm text-gray-600">
              Confidence: {(confidence! * 100).toFixed(2)}%
            </p>
          </div>
        )}

        {gradcamPath && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Grad-CAM Explanation</h3>
            <img
              src={gradcamPath}
              alt="Grad-CAM Visualization"
              className="rounded-lg border w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
