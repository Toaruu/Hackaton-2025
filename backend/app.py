# backend/app.py
import io
import json
import uvicorn
import numpy as np
from PIL import Image
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import asyncio

app = FastAPI()

# CORS (optional for WS, but fine to keep consistent)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once
model = YOLO("last.pt")  # <-- Replace with your actual .pt path

async def run_inference_pil(pil_img: Image.Image):
    loop = asyncio.get_running_loop()
    # Offload blocking inference to a thread
    results = await loop.run_in_executor(None, model, pil_img)
    return results

def pack_results(results):
    r = results[0]
    boxes = r.boxes
    names = r.names
    detections = []

    if boxes is not None and boxes.xyxy is not None:
        xyxy = boxes.xyxy.cpu().numpy()          # [N,4]
        cls = boxes.cls.cpu().numpy().astype(int) # [N]
        conf = boxes.conf.cpu().numpy()           # [N]
        for (x1, y1, x2, y2), c, p in zip(xyxy, cls, conf):
            detections.append({
                "x1": float(x1),
                "y1": float(y1),
                "x2": float(x2),
                "y2": float(y2),
                "cls": int(c),
                "label": names[int(c)],
                "conf": float(round(p, 3)),
            })

    h, w = r.orig_shape[:2]
    return {
        "width": int(w),
        "height": int(h),
        "detections": detections,
    }

@app.websocket("/ws/detect")
async def ws_detect(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Receive binary JPEG/PNG bytes from client
            frame_bytes = await websocket.receive_bytes()

            # Decode to PIL
            pil_img = Image.open(io.BytesIO(frame_bytes)).convert("RGB")

            # Inference
            results = await run_inference_pil(pil_img)

            # Serialize and send detections
            payload = pack_results(results)
            await websocket.send_text(json.dumps(payload))
    except WebSocketDisconnect:
        pass
    except Exception as e:
        # Send error for debugging (remove in prod)
        await websocket.send_text(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    uvicorn.run("app:ws_detect", host="0.0.0.0", port=8000, reload=False)
