import { useRef, useState, useEffect } from "react";

import "./App.css";
import logo from "./assets/LOGO.png";
import earth from "./assets/earth.png";
import hands from "./assets/hand.png";

export default function App() {
  // --- webcam + UI state ---
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [highlight, setHighlight] = useState(null); // 'red' | 'yellow' | 'green'
  const [result, setResult] = useState(null);       // { bin, title, cta, photo }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      const v = videoRef.current;
      if (v) {
        v.srcObject = stream;
        await new Promise((resolve) => {
          v.onloadedmetadata = () => resolve(v.play());
        });
      }
      setCameraOn(true);
    } catch (e) {
      console.error(e);
      alert("Camera access failed. You can still demo the UI without video.");
    }
  }

  useEffect(() => {
    startCamera();

    // iOS tap-to-play fallback
    const tryPlay = () => videoRef.current?.play?.();
    document.addEventListener("touchend", tryPlay, { once: true });

    return () => {
      document.removeEventListener("touchend", tryPlay);
      const stream = videoRef.current?.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // --- snapshot + messages ---
  function captureFrame(videoEl) {
    if (!videoEl || !videoEl.videoWidth) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.92);
  }

  const MESSAGES = {
    red:    { title: "Tissue detected.",         cta: "Red bin open — drop general waste." },
    yellow: { title: "Plastic bottle detected.", cta: "Yellow bin open — drop recyclables." },
    green:  { title: "Food scraps detected.",    cta: "Green bin open — drop organics." },
  };

  function handleBinClick(bin) {
    setHighlight(bin);
    const photo = captureFrame(videoRef.current);
    const { title, cta } = MESSAGES[bin];
    setResult({ bin, title, cta, photo });
  }

  function dismissResult() {
    setResult(null);
  }

  return (
    <>
      {/* ===== HERO ===== */}
      <header className="hero">
        <div className="hero-wrap">
          <div className="logo-row">
            <img src={logo} alt="Trash Scan Logo" className="logo-img" />
          </div>

          <div className="columns">
            <div className="illustration">
              <div className="earth-stack" aria-label="Earth in hands">
                <img src={hands} alt="" className="hands-img" />
                <img src={earth} alt="Earth" className="earth-img" />
              </div>
            </div>

            <div className="content">
              <h1 className="headline">
                Scan. Sort.<br />
                <span className="underline">Save the PLANET.</span>
              </h1>
              <p className="subhead">
                Your camera. Our AI. A planet-first solution to waste sorting.
              </p>
              <a href="#how-it-works" className="cta">
                <span className="cta-icon">↓</span>
                How the demo works
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ===== HOW IT WORKS ===== */}
      <main id="how-it-works" className="how">
        <div className="how-wrap">
          <p className="eyebrow">Demo Prototype</p>
          <h2 className="how-title">How this demo works</h2>
          <p className="how-lead">
            This is a <strong>prototype</strong>. In the real product, a camera module is
            mounted on each bin. When an object is brought near a bin, our YOLO
            model classifies it, and the screen (or bin indicator) lights up the
            correct colour.
          </p>
          <ul className="legend">
            <li><span className="dot red" /> Red = General Waste</li>
            <li><span className="dot yellow" /> Yellow = Mixed Recycling</li>
            <li><span className="dot green" /> Green/Lime = Organics (FOGO)</li>
          </ul>
          <ol className="steps">
            <li>
              <h3>1) Grant camera access</h3>
              <p>When prompted, allow camera permissions so the model can see the object.</p>
            </li>
            <li>
              <h3>2) Hold an item up</h3>
              <p>Move the item into view. When it’s close and steady, the model runs detection.</p>
            </li>
            <li>
              <h3>3) Watch the signal</h3>
              <p>
                The on-screen background flashes the recommended bin colour. In hardware,
                the corresponding bin’s light strip would also illuminate.
              </p>
            </li>
            <li>
              <h3>4) Drop it in</h3>
              <p>Place the item into the highlighted bin. Repeat to test multiple items.</p>
            </li>
          </ol>
          <div className="note">
            <strong>Heads up:</strong> the model here is tuned for a demo environment.
            Real-world deployments will add continuous re-training and contamination checks.
          </div>
          <a href="#top" className="back-top">Back to top ↑</a>
        </div>
      </main>

      {/* ===== SCANNING SECTION ===== */}
      <section id="scan" className="scan-sec">
        <div className="scan-top">
          <img src={logo} alt="Trash Scan" className="scan-logo" />
          <div className="spacer" />
        </div>

        <div className="stage-wrap">
          <div className="stage">
            {/* Always render the video so the ref exists */}
            <video
              ref={videoRef}
              className="cam"
              playsInline
              muted
              autoPlay
            />

            {/* Center plus */}
            <div className="aim" aria-hidden="true">+</div>

            {/* Result overlay */}
            {result && (
              <div className={`result ${result.bin}`} role="status" aria-live="polite">
                <div className="result-img-wrap">
                  {result.photo ? (
                    <img src={result.photo} alt="Captured item" />
                  ) : (
                    <div className="noimg">No preview</div>
                  )}
                </div>
                <div className="result-copy">
                  <div className="eyebrow">Match found</div>
                  <h3>{result.title}</h3>
                  <div className="pill">{result.cta}</div>
                  <button className="rescan" onClick={dismissResult}>
                    Not your item? Click to rescan
                  </button>
                </div>
              </div>
            )}

            {/* Corners */}
            <div className="corner tl" />
            <div className="corner tr" />
            <div className="corner bl" />
            <div className="corner br" />
          </div>
        </div>

        {/* Bins */}
        <div className="bins-row">
          <button
            className={`bin red ${highlight === "red" ? "active" : ""}`}
            aria-label="General waste"
            onClick={() => handleBinClick("red")}
            title="General waste"
          >
            <TrashIcon />
          </button>
          <button
            className={`bin yellow ${highlight === "yellow" ? "active" : ""}`}
            aria-label="Mixed recycling"
            onClick={() => handleBinClick("yellow")}
            title="Mixed recycling"
          >
            <TrashIcon />
          </button>
          <button
            className={`bin green ${highlight === "green" ? "active" : ""}`}
            aria-label="Organics / FOGO"
            onClick={() => handleBinClick("green")}
            title="Organics / FOGO"
          >
            <TrashIcon />
          </button>
        </div>
      </section>
    </>
  );
}

/* tiny inline icon component */
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2z" fill="currentColor"/>
      <path d="M6 9h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9z" fill="currentColor"/>
      <rect x="9" y="11" width="2" height="8" rx="1" fill="#fff"/>
      <rect x="13" y="11" width="2" height="8" rx="1" fill="#fff"/>
    </svg>
  );
}
