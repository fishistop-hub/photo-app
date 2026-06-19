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

// ── Doodle Background ───────────────────────────────────────────────────────
function DoodleBg() {
  const items = [
    // Film reel top left
    { x: 2, y: 2, r: -10, size: 80, vb: "0 0 60 60", el: <g stroke="currentColor" strokeWidth="2" fill="none"><circle cx="30" cy="30" r="28"/><circle cx="30" cy="30" r="10"/><circle cx="30" cy="12" r="4"/><circle cx="30" cy="48" r="4"/><circle cx="12" cy="30" r="4"/><circle cx="48" cy="30" r="4"/><circle cx="16" cy="16" r="4"/><circle cx="44" cy="44" r="4"/><circle cx="44" cy="16" r="4"/><circle cx="16" cy="44" r="4"/></g> },
    // Clapperboard top center
    { x: 30, y: 1, r: 8, size: 80, vb: "0 0 60 55", el: <g stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="14" width="56" height="39" rx="3"/><rect x="2" y="6" width="56" height="12" rx="2"/><line x1="2" y1="6" x2="20" y2="18"/><line x1="18" y1="6" x2="36" y2="18"/><line x1="34" y1="6" x2="52" y2="18"/></g> },
    // Spotlight top right
    { x: 72, y: 2, r: 15, size: 85, vb: "0 0 65 60", el: <g stroke="currentColor" strokeWidth="2" fill="none"><polygon points="10,4 55,18 55,42 10,56"/><rect x="2" y="4" width="12" height="52" rx="3"/><line x1="55" y1="30" x2="65" y2="20"/><line x1="55" y1="30" x2="65" y2="30"/><line x1="55" y1="30" x2="65" y2="40"/></g> },
    // Video camera on tripod center-right
    { x: 62, y: 12, r: -5, size: 90, vb: "0 0 60 70", el: <g stroke="currentColor" strokeWidth="2" fill="none"><rect x="4" y="8" width="36" height="24" rx="4"/><circle cx="20" cy="20" r="8"/><circle cx="20" cy="20" r="4"/><polygon points="40,12 56,18 40,24"/><line x1="22" y1="32" x2="22" y2="44"/><line x1="22" y1="44" x2="8" y2="68"/><line x1="22" y1="44" x2="22" y2="68"/><line x1="22" y1="44" x2="36" y2="68"/></g> },
    // Studio light left
    { x: 0, y: 28, r: 10, size: 80, vb: "0 0 60 55", el: <g stroke="currentColor" strokeWidth="2" fill="none"><polygon points="4,4 52,18 52,42 4,52"/><rect x="48" y="4" width="10" height="48" rx="3"/><line x1="4" y1="28" x2="-6" y2="18"/><line x1="4" y1="28" x2="-6" y2="28"/><line x1="4" y1="28" x2="-6" y2="38"/></g> },
    // Microphone center-left
    { x: 3, y: 45, r: 0, size: 75, vb: "0 0 40 65", el: <g stroke="currentColor" strokeWidth="2" fill="none"><rect x="10" y="2" width="20" height="30" rx="10"/><path d="M4 26 Q4 46 20 46 Q36 46 36 26"/><line x1="20" y1="46" x2="20" y2="60"/><line x1="10" y1="60" x2="30" y2="60"/><line x1="14" y1="10" x2="26" y2="10"/><line x1="14" y1="16" x2="26" y2="16"/><line x1="14" y1="22" x2="26" y2="22"/></g> },
    // Star right
    { x: 82, y: 32, r: 15, size: 70, vb: "0 0 50 50", el: <g stroke="currentColor" strokeWidth="2" fill="none"><polygon points="25,2 31,18 48,18 35,29 40,46 25,36 10,46 15,29 2,18 19,18"/></g> },
    // Film projector bottom left
    { x: 2, y: 65, r: -8, size: 85, vb: "0 0 65 55", el: <g stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="8" width="38" height="30" rx="4"/><circle cx="14" cy="23" r="10"/><circle cx="14" cy="23" r="5"/><circle cx="30" cy="23" r="6"/><circle cx="30" cy="23" r="3"/><polygon points="40,18 56,12 56,34 40,28"/><line x1="20" y1="38" x2="14" y2="52"/><line x1="22" y1="38" x2="22" y2="52"/><line x1="24" y1="38" x2="30" y2="52"/></g> },
    // Curtains bottom center
    { x: 30, y: 72, r: 0, size: 85, vb: "0 0 70 60", el: <g stroke="currentColor" strokeWidth="2" fill="none"><line x1="2" y1="2" x2="68" y2="2"/><path d="M2,2 Q8,20 4,35 Q6,48 10,58"/><path d="M20,2 Q14,20 18,35 Q16,48 12,58"/><path d="M50,2 Q56,20 52,35 Q54,48 58,58"/><path d="M68,2 Q62,20 66,35 Q64,48 60,58"/><ellipse cx="16" cy="8" rx="6" ry="4"/><ellipse cx="54" cy="8" rx="6" ry="4"/></g> },
    // Trophy bottom right
    { x: 76, y: 68, r: 5, size: 80, vb: "0 0 40 65", el: <g stroke="currentColor" strokeWidth="2" fill="none"><ellipse cx="20" cy="12" rx="8" ry="10"/><line x1="14" y1="20" x2="10" y2="38"/><line x1="26" y1="20" x2="30" y2="38"/><ellipse cx="20" cy="40" rx="12" ry="4"/><rect x="12" y="44" width="16" height="6" rx="2"/><rect x="8" y="50" width="24" height="4" rx="2"/></g> },
    // Music note right
    { x: 85, y: 55, r: -10, size: 70, vb: "0 0 40 50", el: <g stroke="currentColor" strokeWidth="2" fill="none"><path d="M16 38 L16 10 L36 6 L36 18"/><ellipse cx="12" cy="40" rx="8" ry="5" transform="rotate(-15 12 40)"/><ellipse cx="32" cy="20" rx="8" ry="5" transform="rotate(-15 32 20)"/></g> },
    // Small clapperboard bottom
    { x: 52, y: 84, r: 12, size: 65, vb: "0 0 50 45", el: <g stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="10" width="46" height="33" rx="3"/><rect x="2" y="4" width="46" height="10" rx="2"/><line x1="2" y1="4" x2="16" y2="14"/><line x1="14" y1="4" x2="28" y2="14"/><line x1="28" y1="4" x2="42" y2="14"/></g> },
    // Extra film reel right middle
    { x: 80, y: 18, r: 20, size: 65, vb: "0 0 60 60", el: <g stroke="currentColor" strokeWidth="2" fill="none"><circle cx="30" cy="30" r="28"/><circle cx="30" cy="30" r="10"/><circle cx="30" cy="12" r="4"/><circle cx="30" cy="48" r="4"/><circle cx="12" cy="30" r="4"/><circle cx="48" cy="30" r="4"/></g> },
    // Spotlight left bottom
    { x: 0, y: 78, r: -15, size: 75, vb: "0 0 65 60", el: <g stroke="currentColor" strokeWidth="2" fill="none"><polygon points="10,4 55,18 55,42 10,56"/><rect x="2" y="4" width="12" height="52" rx="3"/><line x1="55" y1="30" x2="65" y2="20"/><line x1="55" y1="30" x2="65" y2="30"/><line x1="55" y1="30" x2="65" y2="40"/></g> },
    // Star small top
    { x: 55, y: 5, r: -20, size: 55, vb: "0 0 50 50", el: <g stroke="currentColor" strokeWidth="2" fill="none"><polygon points="25,2 31,18 48,18 35,29 40,46 25,36 10,46 15,29 2,18 19,18"/></g> },
    // Music note left top
    { x: 18, y: 18, r: 10, size: 60, vb: "0 0 40 50", el: <g stroke="currentColor" strokeWidth="2" fill="none"><path d="M16 38 L16 10 L36 6 L36 18"/><ellipse cx="12" cy="40" rx="8" ry="5" transform="rotate(-15 12 40)"/><ellipse cx="32" cy="20" rx="8" ry="5" transform="rotate(-15 32 20)"/></g> },
    // Microphone right bottom
    { x: 78, y: 82, r: 8, size: 65, vb: "0 0 40 65", el: <g stroke="currentColor" strokeWidth="2" fill="none"><rect x="10" y="2" width="20" height="30" rx="10"/><path d="M4 26 Q4 46 20 46 Q36 46 36 26"/><line x1="20" y1="46" x2="20" y2="60"/><line x1="10" y1="60" x2="30" y2="60"/></g> },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {items.map((item, i) => (
        <svg
          key={i}
          width={item.size}
          height={item.size}
          viewBox={item.vb}
          style={{
            position: "absolute",
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `rotate(${item.r}deg)`,
            color: "#F5C842",
            opacity: 0.1,
          }}
        >
          {item.el}
        </svg>
      ))}
    </div>
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
      <p style={styles.tagline}>by FISHI STOP</p>
      <p style={styles.instruction}>
        Snap your quick selfie — we'll find every photo of you.
      </p>
      <button style={styles.btnPrimary} onClick={onStart}>
        📸 &nbsp; Find My Photos
      </button>
      <p style={styles.footer}>
        📞 +91 80565 03037 &nbsp;|&nbsp; connect@fishistop.com
      </p>
      <p style={styles.slogan}>
        <strong style={{fontWeight:900, letterSpacing:2}}>TASTE</strong> &nbsp; the &nbsp; <strong style={{fontWeight:900, letterSpacing:2}}>TASTE</strong> &nbsp; of &nbsp; <strong style={{fontWeight:900, letterSpacing:2}}>PHOTOGRAPHY</strong>
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
      <DoodleBg />
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
    height: "100dvh",
    width: "100vw",
    background: BRAND.green,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0,
  },
  card: {
    background: BRAND.green,
    width: "100%",
    height: "100%",
    maxWidth: 480,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  screen: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 24px",
    gap: 0,
    width: "100%",
    height: "100%",
    textAlign: "center",
    overflow: "hidden",
  },
  logoWrap: { marginBottom: 6 },
  brand: {
    color: BRAND.yellow,
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: 8,
    margin: "0 0 2px",
    fontFamily: "'Oswald', 'Anton', 'Georgia', serif",
    textTransform: "uppercase",
  },
  tagline: {
    color: BRAND.gray,
    fontSize: 11,
    letterSpacing: 5,
    textTransform: "uppercase",
    margin: "0 0 16px",
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
  subCta: {
    color: BRAND.gray,
    fontSize: 11,
    marginTop: 6,
    marginBottom: 0,
    letterSpacing: 1,
  },
  divider: {
    width: 50,
    height: 1,
    background: `linear-gradient(to right, transparent, ${BRAND.yellow}, transparent)`,
    margin: "10px auto",
    opacity: 0.4,
  },
  slogan: {
    color: BRAND.yellow,
    fontSize: 14,
    fontStyle: "italic",
    letterSpacing: 1,
    margin: "12px 0 0",
    opacity: 0.85,
    textAlign: "center",
  },
  instruction: {
    color: BRAND.white,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 1.5,
    margin: "0 0 12px",
    opacity: 0.85,
  },
  btnPrimary: {
    background: BRAND.yellow,
    color: BRAND.greenDark,
    border: "none",
    borderRadius: 12,
    padding: "12px 32px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
    maxWidth: 300,
    marginTop: 4,
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
    marginTop: 16,
    marginBottom: 0,
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
