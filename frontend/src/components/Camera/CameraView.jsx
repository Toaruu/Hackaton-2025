import React, { useEffect, useRef, useState, useCallback } from "react";
import "./CameraView.css";

export default function CameraView() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // overlay = null | { bin: 'green'|'yellow'|'red', img: dataURL }
    const [overlay, setOverlay] = useState(null);

    useEffect(() => {
        let stream;
        (async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }, // swap to "user" for front cam
                    audio: false,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                }
            } catch (e) {
                console.error("Camera error:", e);
            }
        })();
        return () => {
            stream?.getTracks()?.forEach((t) => t.stop());
        };
    }, []);

    const captureFrame = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return null;

        const vw = video.videoWidth || 1280;
        const vh = video.videoHeight || 720;
        canvas.width = vw;
        canvas.height = vh;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, vw, vh);
        return canvas.toDataURL("image/jpeg", 0.9);
    }, []);

    const openOverlay = (bin) => {
        const shot = captureFrame();
        setOverlay({ bin, img: shot });
    };

    const closeOverlay = () => setOverlay(null);

    const copy = {
        green: {
            title: "Plastic bottle detected.",
            pill: "Green bin open — drop recyclables.",
        },
        yellow: {
            title: "Cardboard detected.",
            pill: "Yellow bin open — drop mixed recycling.",
        },
        red: {
            title: "Landfill item detected.",
            pill: "Red bin open — general waste only.",
        },
    };

    const current = overlay ? copy[overlay.bin] : null;

    return (
        <section className="camera-section" id="camera">
            <div className="camera-wrap">
                {/* Camera box */}
                <div className="camera-box">
                    {/* VIDEO fills the white inner rectangle exactly */}
                    <video
                        className="camera-video"
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                    />

                    {/* Figma-style inset corners + crosshair */}
                    <span className="corner tl" aria-hidden />
                    <span className="corner tr" aria-hidden />
                    <span className="corner bl" aria-hidden />
                    <span className="corner br" aria-hidden />
                    <span className="crosshair" aria-hidden />

                    {/* Result card (overlay) */}
                    {overlay && (
                        <div
                            className={`result-card is-${overlay.bin}`}
                            role="dialog"
                            aria-live="polite"
                        >
                            <button
                                aria-label="Close"
                                className="card-close"
                                onClick={closeOverlay}
                            >
                                ×
                            </button>

                            <div className="result-inner">
                                {overlay.img ? (
                                    <img
                                        className="result-img"
                                        src={overlay.img}
                                        alt="Captured item"
                                    />
                                ) : (
                                    <div className="result-img result-img--placeholder" />
                                )}

                                <div className="result-copy">
                                    <div className="match">Match found</div>
                                    <h3 className="result-title">{current.title}</h3>

                                    <div className="result-pill">
                                        {current.pill}
                                    </div>

                                    <div className="result-foot">
                                        Not your item?{" "}
                                        <button className="rescan" onClick={closeOverlay}>
                                            Click here to rescan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* offscreen canvas for snapshot */}
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>

                {/* Bin legend (click to trigger overlay) */}
                <ul className="bin-legend">
                    <li className="bin red" onClick={() => openOverlay("red")}>
                        <span className="bin-circle">🗑️</span>
                        <span>General</span>
                    </li>
                    <li className="bin yellow" onClick={() => openOverlay("yellow")}>
                        <span className="bin-circle">🗑️</span>
                        <span>Recycling</span>
                    </li>
                    <li className="bin green" onClick={() => openOverlay("green")}>
                        <span className="bin-circle">🗑️</span>
                        <span>Organics</span>
                    </li>
                </ul>
            </div>
        </section>
    );
}
