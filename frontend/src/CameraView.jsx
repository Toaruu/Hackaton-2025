import React, { useEffect, useRef, useState } from "react";
import "./CameraView.css";

export default function CameraView() {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [status, setStatus] = useState("idle"); // idle | starting | live | blocked | error
    const [errorMsg, setErrorMsg] = useState("");

    async function startCamera() {
        try {
            setStatus("starting");
            // Prefer rear camera if available; fall back to any video.
            const constraints = {
                video: {
                    facingMode: { ideal: "environment" },
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // play() may require a gesture on some browsers—catch and show button
                await videoRef.current.play().catch(() => {
                    setStatus("blocked");
                });
                if (status !== "blocked") setStatus("live");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
            setErrorMsg(
                err?.name === "NotAllowedError"
                    ? "Camera permission was denied. Allow access to use the demo."
                    : err?.name === "NotFoundError"
                        ? "No camera device found."
                        : err?.message || "Could not start the camera."
            );
        }
    }

    function stopCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }
    }

    useEffect(() => {
        // Try to start immediately (works on most desktop browsers & Android).
        if (navigator.mediaDevices?.getUserMedia) {
            startCamera();
        } else {
            setStatus("error");
            setErrorMsg("Your browser does not support camera access.");
        }

        return () => stopCamera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section id="camera" className="camera-section">
            <div className="camera-wrap">
                {/* Camera box with live video */}
                <div className="camera-box">
                    <video
                        ref={videoRef}
                        className="camera-video"
                        autoPlay
                        playsInline
                        muted
                    // poster can be added if you have a placeholder image
                    />

                    {/* Overlays */}
                    <span className="corner tl" />
                    <span className="corner tr" />
                    <span className="corner bl" />
                    <span className="corner br" />
                    <span className="crosshair" />

                    {/* Permission / error UI */}
                    {(status === "blocked" || status === "error") && (
                        <div className="camera-overlay-msg">
                            <p className="overlay-text">
                                {status === "blocked"
                                    ? "Tap to enable the camera."
                                    : errorMsg}
                            </p>
                            {status !== "error" && (
                                <button className="cta" onClick={startCamera}>
                                    <span className="cta-icon">🎥</span>
                                    Enable camera
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Bin legend */}
                <ul className="bin-legend">
                    <li className="bin red">
                        <div className="bin-circle">🗑️</div>
                        <p>General</p>
                    </li>
                    <li className="bin yellow">
                        <div className="bin-circle">♻️</div>
                        <p>Recycling</p>
                    </li>
                    <li className="bin green">
                        <div className="bin-circle">🌱</div>
                        <p>Organics</p>
                    </li>
                </ul>
            </div>
        </section>
    );
}
