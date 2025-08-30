// src/components/Camera/CameraViewWS.jsx
import React, { useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:8000/ws/detect"; // change for your backend

export default function CameraViewWS() {
  const videoRef = useRef(null);
  const captureRef = useRef(null);   // offscreen capture canvas
  const overlayRef = useRef(null);   // overlay canvas for boxes
  const wsRef = useRef(null);
  const sendingRef = useRef(false);  // prevent overlapping sends
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let stream;
    const init = async () => {
      // Camera
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Match canvases to video
      const setupCanvasSizes = () => {
        const w = videoRef.current.videoWidth || 640;
        const h = videoRef.current.videoHeight || 480;
        [captureRef.current, overlayRef.current].forEach((c) => {
          if (!c) return;
          c.width = w;
          c.height = h;
        });
      };
      videoRef.current.onloadedmetadata = setupCanvasSizes;
      setupCanvasSizes();

      // WebSocket
      wsRef.current = new WebSocket(WS_URL);
      wsRef.current.onopen = () => setConnected(true);
      wsRef.current.onclose = () => setConnected(false);
      wsRef.current.onerror = () => setConnected(false);

      wsRef.current.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          if (data.detections && overlayRef.current) drawDetections(data);
        } catch (e) {
          console.error("WS parse error", e);
        }
      };

      // Start send loop (throttled)
      startSendLoop(10); // FPS cap
    };

    init();

    return () => {
      try { wsRef.current?.close(); } catch { }
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const drawDetections = (data) => {
    const ctx = overlayRef.current.getContext("2d");
    const { detections, width, height } = data;

    // Clear
    ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);

    // Scale from model's orig size to canvas size
    const sx = overlayRef.current.width / width;
    const sy = overlayRef.current.height / height;

    ctx.lineWidth = 2;
    ctx.font = "14px Poppins, sans-serif";
    detections.forEach((d) => {
      const x = d.x1 * sx;
      const y = d.y1 * sy;
      const w = (d.x2 - d.x1) * sx;
      const h = (d.y2 - d.y1) * sy;

      // Box
      ctx.strokeStyle = "hsl(10, 89%, 55%)"; // accent coral
      ctx.strokeRect(x, y, w, h);

      // Label
      const label = `${d.label} ${Math.round(d.conf * 100)}%`;
      const pad = 4;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      const tw = ctx.measureText(label).width + pad * 2;
      const th = 18 + pad * 2;
      ctx.fillRect(x, Math.max(0, y - th), tw, th);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, x + pad, Math.max(14 + pad, y - th + 14 + pad - 2));
    });
  };

  const startSendLoop = (fps = 8) => {
    const interval = Math.max(1, Math.floor(1000 / fps));
    const loop = async () => {
      if (wsRef.current?.readyState === WebSocket.OPEN && !sendingRef.current) {
        try {
          sendingRef.current = true;
          const blob = await captureFrameBlob();
          if (blob) {
            const buf = await blob.arrayBuffer();
            wsRef.current.send(buf);
          }
        } catch (e) {
          // swallow send errors; will retry next tick
        } finally {
          sendingRef.current = false;
        }
      }
      setTimeout(loop, interval);
    };
    loop();
  };

  const captureFrameBlob = () => {
    const video = videoRef.current;
    const canvas = captureRef.current;
    if (!video || !canvas) return null;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.6); // compress for bandwidth
    });
  };

  return (
    <div
      id="camera"
      style={{ position: "relative", width: "min(100%, 1300px)", margin: "0 auto", padding: "100px", height: "780px" }}
    >
      <div style={{ position: "relative" }}>
        <video ref={videoRef} playsInline muted style={{ width: "100%", borderRadius: 12 }} />
        <canvas
          ref={overlayRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      </div>
      {/* Offscreen capture canvas */}
      <canvas ref={captureRef} style={{ display: "none" }} />
    </div>
  );
}
