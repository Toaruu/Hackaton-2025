import React, { useRef, useEffect } from "react";

const CameraView = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const getCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                alert("Could not access camera: " + err);
            }
        };
        getCamera();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #e9f5f2 0%, #f6f8fc 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif"
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 32,
                    boxShadow: "0 8px 32px rgba(60,60,60,0.10)",
                    padding: "48px 40px 40px 40px",
                    minWidth: 380,
                    maxWidth: 420,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 24
                }}
            >
                <div
                    style={{
                        background: "linear-gradient(135deg, #b2f0e6 0%, #e0eafc 100%)",
                        borderRadius: "50%",
                        width: 72,
                        height: 72,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 8,
                        boxShadow: "0 2px 8px rgba(60,60,60,0.07)"
                    }}
                >
                    <span role="img" aria-label="camera" style={{ fontSize: 36, color: "#2e7d6b" }}>
                        📷
                    </span>
                </div>
                <h1 style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#2e7d6b",
                    margin: 0,
                    letterSpacing: "-1px"
                }}>
                    Smart Bin Camera
                </h1>
                <p style={{
                    color: "#6b7a8f",
                    fontSize: 16,
                    margin: 0,
                    textAlign: "center"
                }}>
                    Place an item in front of your camera to see if it's recyclable or general waste.
                </p>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                        width: "320px",
                        height: "240px",
                        border: "2px solid #b2f0e6",
                        borderRadius: 18,
                        background: "#e9f5f2",
                        marginTop: 8,
                        marginBottom: 8,
                        boxShadow: "0 2px 12px rgba(60,60,60,0.07)"
                    }}
                />
                <div
                    style={{
                        marginTop: 8,
                        padding: "14px 0",
                        background: "#f6f8fc",
                        borderRadius: 12,
                        width: "100%",
                        textAlign: "center",
                        color: "#2e7d6b",
                        fontWeight: 500,
                        fontSize: 17,
                        letterSpacing: "0.2px",
                        boxShadow: "0 1px 4px rgba(60,60,60,0.03)"
                    }}
                >
                    <em>Detection results will appear here...</em>
                </div>
            </div>
        </div>
    );
};

export default CameraView;
