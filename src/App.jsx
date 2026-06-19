import { useState, useRef, useCallback } from "react";

const BRAND = {
  green: "#1a3a1a",
  greenLight: "#224422",
  greenDark: "#122612",
  yellow: "#F5C842",
  yellowDim: "#c9a232",
  white: "#f5f5f0",
  gray: "#8a9a8a",
};

// ── Logo Image ──────────────────────────────────────────────────────────────
function FishiLogo({ size = 90 }) {
  return (
    <img
      src="./logo.jpg"
      alt="Fishi Stop Logo"
      width={size}
      height={size}
      style={{ objectFit: "contain", display: "block", mixBlendMode: "lighten" }}
    />
  );
}

// ── Screens ────────────────────────────────────────────────────────────────
function WelcomeScreen({ eventName, onStart }) {
  return (
    <div style={styles.screen}>
      <div style={styles.logoWrap}>
        <FishiLogo size={220} />
      </div>
      <h1 style={styles.brand}>FISHI SELFI</h1>
      <p style={styles.tagline}>by FISHI</p>
      <p style={styles.instruction}>
        Take a quick selfie — we'll find all your photos from this event instantly.
      </p>
      <button style={styles.btnPrimary} onClick={onStart}>
        Find My Photos
      </button>
      <p style={styles.footer}>
        📞 +91 80565 03037 &nbsp;|&nbsp; connect@fishistop.com
      </p>
    </div>
  );
}

function SelfieScreen({ onCapture, onBack }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [captured, setCaptured] = useState(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStreaming(true);
      setError(null);
    } catch {
      setError("Camera access denied. Please allow camera permission and try again.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
    setStreaming(false);
  }, []);

  const snap = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCaptured(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const retake = () => {
    setCaptured(null);
    startCamera();
  };

  const confirm = () => {
    onCapture(captured);
  };

  return (
    <div style={styles.screen}>
      <button style={styles.backBtn} onClick={() => { stopCamera(); onBack(); }}>← Back</button>
      <h2 style={styles.heading}>Take Your Selfie</h2>
      <p style={styles.subtext}>Face the camera clearly · Good lighting helps</p>

      <div style={styles.cameraFrame}>
        {!captured ? (
          <>
            <video
              ref={videoRef}
              style={{ ...styles.cameraView, display: streaming ? "block" : "none" }}
              playsInline
              muted
            />
            {!streaming && !error && (
              <div style={styles.cameraPlaceholder}>
                <div style={styles.cameraIcon}>📷</div>
                <p style={{ color: BRAND.gray, margin: 0 }}>Camera not started</p>
              </div>
            )}
            {error && (
              <div style={styles.cameraPlaceholder}>
                <p style={{ color: "#e05252", textAlign: "center", padding: 16 }}>{error}</p>
              </div>
            )}
          </>
        ) : (
          <img src={captured} alt="Your selfie" style={styles.cameraView} />
        )}
        <div style={styles.cameraOverlay} />
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {!captured ? (
        <>
          {!streaming && !error && (
            <button style={styles.btnPrimary} onClick={startCamera}>Open Camera</button>
          )}
          {streaming && (
            <button style={styles.btnSnap} onClick={snap}>
              <span style={styles.snapDot} />
            </button>
          )}
        </>
      ) : (
        <div style={styles.row}>
          <button style={styles.btnSecondary} onClick={retake}>Retake</button>
          <button style={styles.btnPrimary} onClick={confirm}>Find My Photos →</button>
        </div>
      )}
    </div>
  );
}

function LoadingScreen({ progress }) {
  return (
    <div style={styles.screen}>
      <FishiLogo size={60} />
      <h2 style={{ ...styles.heading, marginTop: 24 }}>Searching your photos…</h2>
      <p style={styles.subtext}>Scanning {progress.total} photos for your face</p>
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${Math.round((progress.done / progress.total) * 100)}%`,
          }}
        />
      </div>
      <p style={{ color: BRAND.yellow, fontSize: 14 }}>
        {Math.round((progress.done / progress.total) * 100)}% complete
      </p>
    </div>
  );
}

function ResultsScreen({ photos, eventName, onRetry }) {
  const [selected, setSelected] = useState([]);

  const toggle = (url) => {
    setSelected((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const downloadOne = async (url, index) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `FishiStop_${eventName || "photo"}_${index + 1}.jpg`;
    a.click();
  };

  if (photos.length === 0) {
    return (
      <div style={styles.screen}>
        <div style={{ fontSize: 64 }}>🔍</div>
        <h2 style={styles.heading}>No matches found</h2>
        <p style={styles.subtext}>
          Your face wasn't detected in the event photos.{"\n"}
          Try again in better lighting or a clearer angle.
        </p>
        <button style={styles.btnPrimary} onClick={onRetry}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ ...styles.screen, paddingBottom: 32 }}>
      <h2 style={styles.heading}>Your Photos</h2>
      <p style={styles.subtext}>{photos.length} photo{photos.length > 1 ? "s" : ""} found · Tap to select</p>

      <div style={styles.grid}>
        {photos.map((url, i) => {
          const isSelected = selected.includes(url);
          return (
            <div
              key={i}
              style={{ ...styles.photoCard, border: isSelected ? `3px solid ${BRAND.yellow}` : "3px solid transparent" }}
              onClick={() => toggle(url)}
            >
              <img src={url} alt={`Photo ${i + 1}`} style={styles.photoThumb} />
              {isSelected && (
                <div style={styles.checkBadge}>✓</div>
              )}
              <button
                style={styles.downloadBtn}
                onClick={(e) => { e.stopPropagation(); downloadOne(url, i); }}
              >
                ↓ Save
              </button>
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div style={styles.selectionBar}>
          <span style={{ color: BRAND.yellow }}>{selected.length} selected</span>
          <button
            style={styles.btnPrimary}
            onClick={() => selected.forEach((url, i) => downloadOne(url, i))}
          >
            Save All Selected
          </button>
        </div>
      )}

      <p style={{ color: BRAND.gray, fontSize: 13, marginTop: 16 }}>
        Captured by Fishi's Stop Photography
      </p>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [selfie, setSelfie] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [progress, setProgress] = useState({ done: 0, total: 100 });

  // In production: read eventId from URL params
  const eventName = new URLSearchParams(window.location.search).get("event") || "Event";

  const handleCapture = async (dataUrl) => {
    setSelfie(dataUrl);
    setScreen("loading");

    try {
      // Simulated progress (replace with real SSE/polling from backend)
      let done = 0;
      const total = 700;
      setProgress({ done, total });

      const interval = setInterval(() => {
        done += Math.floor(Math.random() * 40) + 10;
        if (done >= total) {
          done = total;
          clearInterval(interval);
        }
        setProgress({ done, total });
      }, 400);

      // Real API call to your Render backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selfie: dataUrl,
          eventId: new URLSearchParams(window.location.search).get("id"),
        }),
      });

      clearInterval(interval);
      setProgress({ done: total, total });

      const data = await res.json();
      setPhotos(data.matches || []);
      setScreen("results");
    } catch {
      setPhotos([]);
      setScreen("results");
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.card}>
        {screen === "welcome" && (
          <WelcomeScreen eventName={eventName} onStart={() => setScreen("selfie")} />
        )}
        {screen === "selfie" && (
          <SelfieScreen onCapture={handleCapture} onBack={() => setScreen("welcome")} />
        )}
        {screen === "loading" && <LoadingScreen progress={progress} />}
        {screen === "results" && (
          <ResultsScreen
            photos={photos}
            eventName={eventName}
            onRetry={() => setScreen("selfie")}
          />
        )}
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: "100vh",
    background: BRAND.green,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    background: BRAND.green,
    borderRadius: 0,
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "none",
    overflow: "hidden",
  },
  screen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    gap: 0,
    width: "100%",
    maxWidth: 480,
    margin: "0 auto",
    textAlign: "center",
  },
  logoWrap: { marginBottom: 12 },
  brand: {
    color: BRAND.yellow,
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: 8,
    margin: 0,
    fontFamily: "'Oswald', 'Anton', 'Georgia', serif",
    textTransform: "uppercase",
  },
  tagline: {
    color: BRAND.gray,
    fontSize: 13,
    letterSpacing: 6,
    textTransform: "uppercase",
    margin: "6px 0 28px",
    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
    fontStyle: "italic",
  },
  eventBadge: {
    background: BRAND.greenLight,
    borderRadius: 10,
    padding: "8px 18px",
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  eventLabel: { color: BRAND.gray, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" },
  eventName: { color: BRAND.yellow, fontSize: 16, fontWeight: 700 },
  instruction: {
    color: BRAND.white,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 1.6,
    margin: "0 0 28px",
    opacity: 0.85,
  },
  btnPrimary: {
    background: BRAND.yellow,
    color: BRAND.greenDark,
    border: "none",
    borderRadius: 12,
    padding: "14px 32px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    maxWidth: 320,
    marginTop: 8,
  },
  btnSecondary: {
    background: "transparent",
    color: BRAND.yellow,
    border: `2px solid ${BRAND.yellow}`,
    borderRadius: 12,
    padding: "12px 24px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    flex: 1,
  },
  footer: {
    color: BRAND.gray,
    fontSize: 12,
    marginTop: 32,
    textAlign: "center",
  },
  backBtn: {
    alignSelf: "flex-start",
    background: "transparent",
    border: "none",
    color: BRAND.yellow,
    fontSize: 14,
    cursor: "pointer",
    padding: 0,
    marginBottom: 16,
  },
  heading: {
    color: BRAND.yellow,
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 6px",
    textAlign: "center",
  },
  subtext: {
    color: BRAND.gray,
    fontSize: 14,
    textAlign: "center",
    margin: "0 0 20px",
    lineHeight: 1.5,
    whiteSpace: "pre-line",
  },
  cameraFrame: {
    position: "relative",
    width: "100%",
    maxWidth: 340,
    aspectRatio: "1/1",
    borderRadius: 16,
    overflow: "hidden",
    background: BRAND.greenDark,
    border: `2px solid ${BRAND.greenLight}`,
    marginBottom: 20,
  },
  cameraView: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cameraPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  cameraIcon: { fontSize: 48 },
  cameraOverlay: {
    position: "absolute",
    inset: 0,
    border: `3px solid ${BRAND.yellow}`,
    borderRadius: 16,
    pointerEvents: "none",
    opacity: 0.3,
  },
  btnSnap: {
    background: BRAND.yellow,
    border: `4px solid ${BRAND.white}`,
    borderRadius: "50%",
    width: 70,
    height: 70,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 0 0 4px ${BRAND.yellowDim}`,
  },
  snapDot: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: BRAND.white,
    display: "block",
  },
  row: {
    display: "flex",
    gap: 12,
    width: "100%",
    maxWidth: 340,
  },
  progressBar: {
    width: "100%",
    maxWidth: 300,
    height: 6,
    background: BRAND.greenLight,
    borderRadius: 99,
    overflow: "hidden",
    margin: "16px 0 8px",
  },
  progressFill: {
    height: "100%",
    background: BRAND.yellow,
    borderRadius: 99,
    transition: "width 0.3s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    width: "100%",
    marginTop: 8,
  },
  photoCard: {
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
    background: BRAND.greenDark,
    cursor: "pointer",
    aspectRatio: "3/4",
  },
  photoThumb: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    background: BRAND.yellow,
    color: BRAND.greenDark,
    borderRadius: "50%",
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 13,
  },
  downloadBtn: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "rgba(45,59,45,0.88)",
    color: BRAND.yellow,
    border: "none",
    padding: "8px 0",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    backdropFilter: "blur(4px)",
  },
  selectionBar: {
    position: "sticky",
    bottom: 16,
    background: BRAND.greenDark,
    border: `1px solid ${BRAND.greenLight}`,
    borderRadius: 14,
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",
    marginTop: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  },
};
