import "./App.css";
import logo from "./assets/LOGO.png";
import earth from "./assets/earth.png";
import hands from "./assets/hand.png";

export default function App() {
  return (
    <>
      {/* ===== HERO ===== */}
      <header className="hero">
        <div className="hero-wrap">
          {/* Top: centered logo */}
          <div className="logo-row">
            <img src={logo} alt="Trash Scan Logo" className="logo-img" />
            <span className="logo-wordmark">
              TRASH <span className="accent">SCAN</span>
            </span>
          </div>

          {/* Two columns */}
          <div className="columns">
            {/* Left: layered illustration */}
            <div className="illustration">
              <div className="earth-stack" aria-label="Earth in hands">
                <img src={hands} alt="" className="hands-img" />
                <img src={earth} alt="Earth" className="earth-img" />
              </div>
            </div>

            {/* Right: messaging */}
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

          {/* colour legend */}
          <ul className="legend">
            <li><span className="dot red" /> Red = General Waste</li>
            <li><span className="dot yellow" /> Yellow = Mixed Recycling</li>
            <li><span className="dot green" /> Green/Lime = Organics (FOGO)</li>
          </ul>

          {/* steps */}
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
    </>
  );
}
