# ♻️ TrashScan: AI-Powered Waste Classification Web App

*TrashScan* is a full-stack web application that uses real-time object detection to help users identify and properly dispose of waste. Built with React and FastAPI, it connects a live camera feed to a YOLO-based backend model to classify items into recyclable, biodegradable, or non-biodegradable categories, all with an intuitive, educational interface.

---

## 🚀 Features

•⁠  ⁠📷 Live camera feed with real-time object detection
•⁠  ⁠🧠 YOLOv8 backend model served via FastAPI
•⁠  ⁠🔌 WebSocket integration for low-latency frame streaming
•⁠  ⁠🎯 Bounding boxes with bin classification

---

## 🧱 Tech Stack

| Layer      | Tech                     |
|------------|--------------------------|
| Frontend   | React, Vite, CSS Modules |
| Backend    | FastAPI, Python, Ultralytics YOLO |
| Realtime   | WebSocket (custom protocol) |
| AI Model   | YOLOv8 ⁠ .pt ⁠ file (custom-trained) |
| Styling    | Responsive layout, semantic HTML |

---

## 🛠️ Setup Instructions

```bash
### 1. Clone the repo
git clone https://github.com/Toaruu/Hackaton-2025.git
cd Hackaton-2025

### 2. Backend
cd backend
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000

### 3. Frontend
cd frontend
npm install
npm run dev

### 4. Project Structure
HACKATHON-2025/
├── backend/
│   ├── app.py
│   ├── last.pt
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   └── components/
│   └── package.json
└── README.md

### 5. Environmental Impact
Trashscan is designed to promote responsible waste disposal by making classification intuitive and educational. By helping users identify items correctly, we aim to reduce contamination in recycling streams and encourage composting of organic waste.

### 6. TODO
•⁠  ⁠Add sound cues for detection feedback

•⁠  ⁠Integrate backend bin mapping from training metadata

•⁠  ⁠Deploy to cloud (e.g. Render, Vercel)

•⁠  ⁠Train the YOLO model to classify more object classes
