# 💧 Water Quality AI

An advanced real-time water quality monitoring and prediction system using environmental data, IoT sensors, and machine learning. Built with modern full-stack technologies for professional use.

![Water Quality Monitoring](https://your-image-url-if-needed.com)

---

## 📌 Project Overview

This app predicts harmful water contamination levels using:

- ✅ Environmental signals (rainfall, temperature, location, industry proximity)
- ✅ IoT sensor data from water sources (pH, turbidity, etc.)
- ✅ AI/ML models for regression and image classification
- ✅ Real-time monitoring + historical visualizations + SHAP explainability

---

## 🧠 Features

- 🌍 Interactive Map (Mapbox) with geolocated water sources
- 📈 Real-time prediction dashboard
- 🧪 Upload & classify water quality images (e.g., algae blooms, discoloration)
- 🧠 Fusion AI model (XGBoost + Image Classifier)
- 🔄 Offline-first PWA with sync when online
- 📊 Explainability with SHAP plots
- 📦 Data storage in PostgreSQL + PostGIS for geospatial queries

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- Tailwind CSS
- shadcn/ui components
- Mapbox for maps
- PWA support (offline mode)

**Backend:**
- FastAPI (Python)
- XGBoost for regression
- PyTorch / TensorFlow for image classification
- SHAP for explainability
- PostgreSQL + PostGIS
- MQTT / REST for IoT ingestion

---

## ⚙️ Installation

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/water-quality-ai.git
cd water-quality-ai
