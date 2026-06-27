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

function DoodleBg() {
  const items = [
    { x: 2, y: 2, r: -10, size: 80, vb: "0 0 60 60", el: <g stroke="currentColor" strokeWidth="2" fill="none"><circle cx="30" cy="30" r="28"/><circle cx="30" cy="30" r="10"/><circle cx="30" cy="12" r="4"/><circle cx="30" cy="48" r="4"/><circle cx="12" cy="30" r="4"/><circle cx="48" cy="30" r="4"/></g> },
    { x: 30, y: 1, r: 8, size: 80, vb: "0 0 60 55", el: <g stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="14" width="56" height="39" rx="3"/><rect x="2" y="6" width="56" height="12" rx="2"/><line x1="2" y1="6" x2="20" y2="18"/><line x1="18" y1="6" x2="36" y2="18"/><line x1="34" y1="6" x2="52" y2="18"/></g> },
    { x: 72, y: 2, r: 15, size: 85, vb: "0 0 65 60", el: <g stroke="currentColor" strokeWidth="2" fill="none"><polygon points="10,4 55,18 55,42 10,56"/><rect x="2" y="4" width="12" height="52" rx="3"/></g> },
    { x: 82, y: 32, r: 15, size: 70, vb: "0 0 50 50", el: <g stroke="currentColor" strokeWidth="2" fill="none"><polygon points="25,2 31,18 48,18 35,29 40,46 25,36 10,46 15,29 2,18 19,18"/></g> },
    { x: 3, y: 45, r: 0, size: 75, vb: "0 0 40 65", el: <g stroke="currentColor" strokeWidth="2" fill="none"><rect x="10" y="2" width="20" height="30" rx="10"/><path d="M4 26 Q4 46 20 46 Q36 46 36 26"/><line x1="20" y1="46" x2="20" y2="60"/><line x1="10" y1="60" x2="30" y2="60"/></g> },
    { x: 76, y: 68, r: 5, size: 80, vb: "0 0 40 65", el: <g stroke="currentColor" strokeWidth="2" fill="none"><ellipse cx="20" cy="12" rx="8" ry="10"/><line x1="14" y1="20" x2="10" y2="38"/><line x1="26" y1="20" x2="30" y2="38"/><ellipse cx="20" cy="40" rx="12" ry="4"/><rect x="12" y="44" width="16" height="6" rx="2"/></g> },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {items.map((item, i) => (
        <svg key={i} width={item.size} height={item.size} viewBox={item.vb} style={{ position: "absolute", left: `${item.x}%`, top: `${item.y}%`, transform: `rotate(${item.r}deg)`, color: "#F5C842", opacity: 0.1 }}>
          {item.el}
        </svg>
      ))}
    </div>
  );
}

function WelcomeScreen({ onStart }) {
  return (
    <div style={styles.screen}>
      <div style={styles.logoWrap}><FishiLogo size={220} /></div>
      <h1 style={styles.brand}>FISHI SELFI</h1>
      <p style={styles.tagline}>by FISHI STOP</p>
      <p style={styles.instruction}>Snap your quick selfie — we'll find every photo of you.</p>
      <button style={styles.btnPrimary} onClick={onStart}>📸 &nbsp; Find My Photos</button>
      <p style={styles.footer}>📞 +91 80565 03037 &nbsp;|&nbsp; connect@fishistop.com</p>
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } } });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStreaming(true);
      setError(null);
    } catch {
      setError("Camera access denied. Please allow camera permission and try again.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    setStreaming(false);
  }, []);

  const snap = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setCaptured(canvas.toDataURL("image/jpeg", 0.85));
    stopCamera();
  }, [stopCamera]);

  return (
    <div style={styles.screen}>
      <button style={styles.backBtn} onClick={() => { stopCamera(); onBack(); }}>← Back</button>
      <h2 style={styles.heading}>Take Your Selfie</h2>
      <p style={styles.subtext}>Face the camera clearly · Good lighting helps</p>
      <div style={styles.cameraFrame}>
        {!captured ? (
          <>
            <video ref={videoRef} style={{ ...styles.cameraView, display: streaming ? "block" : "none" }} playsInline muted />
            {!streaming && !error && <div style={styles.cameraPlaceholder}><div style={styles.cameraIcon}>📷</div><p style={{ color: BRAND.gray, margin: 0 }}>Camera not started</p></div>}
            {error && <div style={styles.cameraPlaceholder}><p style={{ color: "#e05252", textAlign: "center", padding: 16 }}>{error}</p></div>}
          </>
        ) : (
          <img src={captured} alt="Your selfie" style={styles.cameraView} />
        )}
        <div style={styles.cameraOverlay} />
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {!captured ? (
        <>
          {!streaming && !error && <button style={styles.btnPrimary} onClick={startCamera}>Open Camera</button>}
          {streaming && <button style={styles.btnSnap} onClick={snap}><span style={styles.snapDot} /></button>}
        </>
      ) : (
        <div style={styles.row}>
          <button style={styles.btnSecondary} onClick={() => { setCaptured(null); startCamera(); }}>Retake</button>
          <button style={styles.btnPrimary} onClick={() => onCapture(captured)}>Find My Photos →</button>
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
        <div style={{ ...styles.progressFill, width: `${Math.round((progress.done / progress.total) * 100)}%` }} />
      </div>
      <p style={{ color: BRAND.yellow, fontSize: 14 }}>{Math.round((progress.done / progress.total) * 100)}% complete</p>
    </div>
  );
}

function ResultsScreen({ matches, eventName, onRetry }) {
  const [lightbox, setLightbox] = useState(null);

  const getImageUrl = (match) => {
    return `https://drive.google.com/thumbnail?id=${match.file_id}&sz=w800`;
  };

  const downloadPhoto = async (match, index) => {
    try {
      const url = `https://drive.google.com/uc?export=download&id=${match.file_id}`;
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.download = `FishiStop_${eventName || "photo"}_${index + 1}.jpg`;
      a.click();
    } catch (e) {
      window.open(`https://drive.google.com/file/d/${match.file_id}/view`, "_blank");
    }
  };

  if (!matches || matches.length === 0) {
    return (
      <div style={styles.screen}>
        <div style={{ fontSize: 64 }}>🔍</div>
        <h2 style={styles.heading}>No matches found</h2>
        <p style={styles.subtext}>Try again in better lighting or a clearer angle.</p>
        <button style={styles.btnPrimary} onClick={onRetry}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={styles.resultsContainer}>
      {/* Lightbox */}
      {lightbox !== null && (
        <div style={styles.lightbox} onClick={() => setLightbox(null)}>
          <div style={styles.lightboxContent} onClick={e => e.stopPropagation()}>
            <img
              src={getImageUrl(matches[lightbox])}
              alt="Full photo"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            <button style={styles.lightboxClose} onClick={() => setLightbox(null)}>✕</button>
            <button style={styles.lightboxDownload} onClick={() => downloadPhoto(matches[lightbox], lightbox)}>
              ↓ Download
            </button>
          </div>
        </div>
      )}

      <div style={styles.resultsHeader}>
        <h2 style={styles.heading}>Your Photos</h2>
        <p style={styles.subtext}>{matches.length} photo{matches.length > 1 ? "s" : ""} found · Tap to view</p>
      </div>

      <div style={styles.scrollGrid}>
        {matches.map((match, i) => (
          <div key={i} style={styles.photoCard} onClick={() => setLightbox(i)}>
            <img
              src={getImageUrl(match)}
              alt={`Photo ${i + 1}`}
              style={styles.photoThumb}
              onError={(e) => { e.target.src = ""; e.target.style.display = "none"; }}
            />
            <button
              style={styles.downloadBtn}
              onClick={(e) => { e.stopPropagation(); downloadPhoto(match, i); }}
            >
              ↓ Save
            </button>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "16px", flexShrink: 0 }}>
        <button style={{ ...styles.btnSecondary, width: "auto", padding: "10px 24px" }} onClick={onRetry}>
          Search Again
        </button>
        <p style={{ color: BRAND.gray, fontSize: 12, marginTop: 12 }}>Captured by Fishi Stop Photography</p>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [matches, setMatches] = useState([]);
  const [progress, setProgress] = useState({ done: 0, total: 100 });

  const eventName = new URLSearchParams(window.location.search).get("event") || "Event";
  const folderId = new URLSearchParams(window.location.search).get("id") || "1PQbv3xUfeC6LNZ1q3Qacf30qOIw5HS2E";

  const handleCapture = async (dataUrl) => {
    setScreen("loading");
    let done = 0;
    const total = 995;
    setProgress({ done, total });

    const interval = setInterval(() => {
      done += Math.floor(Math.random() * 60) + 20;
      if (done >= total) { done = total; clearInterval(interval); }
      setProgress({ done, total });
    }, 300);

    try {
      const res = await fetch("https://fishistop-selfi-backend.onrender.com/find-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selfie: dataUrl, event_folder_id: folderId }),
      });
      clearInterval(interval);
      setProgress({ done: total, total });
      const data = await res.json();
      setMatches(data.matches || []);
      setScreen("results");
    } catch {
      clearInterval(interval);
      setMatches([]);
      setScreen("results");
    }
  };

  return (
    <div style={styles.app}>
      <DoodleBg />
      <div style={styles.card}>
        {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("selfie")} />}
        {screen === "selfie" && <SelfieScreen onCapture={handleCapture} onBack={() => setScreen("welcome")} />}
        {screen === "loading" && <LoadingScreen progress={progress} />}
        {screen === "results" && <ResultsScreen matches={matches} eventName={eventName} onRetry={() => setScreen("selfie")} />}
      </div>
    </div>
  );
}

const styles = {
  app: { height: "100dvh", width: "100vw", background: BRAND.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', 'Segoe UI', sans-serif", overflow: "hidden", position: "fixed", top: 0, left: 0 },
  card: { background: BRAND.green, width: "100%", height: "100%", maxWidth: 480, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  screen: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 24px", gap: 0, width: "100%", height: "100%", textAlign: "center", overflow: "hidden" },
  resultsContainer: { display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden" },
  resultsHeader: { padding: "16px 24px 0", textAlign: "center", flexShrink: 0 },
  scrollGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "8px 16px", overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch" },
  logoWrap: { marginBottom: 6 },
  brand: { color: BRAND.yellow, fontSize: 32, fontWeight: 900, letterSpacing: 8, margin: "0 0 2px", textTransform: "uppercase" },
  tagline: { color: BRAND.gray, fontSize: 11, letterSpacing: 5, textTransform: "uppercase", margin: "0 0 16px", fontStyle: "italic" },
  instruction: { color: BRAND.white, textAlign: "center", fontSize: 13, lineHeight: 1.5, margin: "0 0 12px", opacity: 0.85 },
  btnPrimary: { background: BRAND.yellow, color: BRAND.greenDark, border: "none", borderRadius: 12, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", maxWidth: 300, marginTop: 4 },
  btnSecondary: { background: "transparent", color: BRAND.yellow, border: `2px solid ${BRAND.yellow}`, borderRadius: 12, padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", flex: 1 },
  footer: { color: BRAND.gray, fontSize: 12, marginTop: 16, marginBottom: 0, textAlign: "center" },
  backBtn: { alignSelf: "flex-start", background: "transparent", border: "none", color: BRAND.yellow, fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 16 },
  heading: { color: BRAND.yellow, fontSize: 22, fontWeight: 700, margin: "0 0 6px", textAlign: "center" },
  subtext: { color: BRAND.gray, fontSize: 14, textAlign: "center", margin: "0 0 20px", lineHeight: 1.5 },
  cameraFrame: { position: "relative", width: "100%", maxWidth: 340, aspectRatio: "1/1", borderRadius: 16, overflow: "hidden", background: BRAND.greenDark, border: `2px solid ${BRAND.greenLight}`, marginBottom: 20 },
  cameraView: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  cameraPlaceholder: { width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 },
  cameraIcon: { fontSize: 48 },
  cameraOverlay: { position: "absolute", inset: 0, border: `3px solid ${BRAND.yellow}`, borderRadius: 16, pointerEvents: "none", opacity: 0.3 },
  btnSnap: { background: BRAND.yellow, border: `4px solid ${BRAND.white}`, borderRadius: "50%", width: 70, height: 70, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 4px ${BRAND.yellowDim}` },
  snapDot: { width: 28, height: 28, borderRadius: "50%", background: BRAND.white, display: "block" },
  row: { display: "flex", gap: 12, width: "100%", maxWidth: 340 },
  progressBar: { width: "100%", maxWidth: 300, height: 6, background: BRAND.greenLight, borderRadius: 99, overflow: "hidden", margin: "16px 0 8px" },
  progressFill: { height: "100%", background: BRAND.yellow, borderRadius: 99, transition: "width 0.3s ease" },
  photoCard: { position: "relative", borderRadius: 10, overflow: "hidden", background: BRAND.greenDark, cursor: "pointer", aspectRatio: "3/4" },
  photoThumb: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  downloadBtn: { position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(18,38,18,0.9)", color: BRAND.yellow, border: "none", padding: "8px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  lightbox: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  lightboxContent: { position: "relative", width: "90vw", height: "80vh", maxWidth: 500 },
  lightboxClose: { position: "absolute", top: -40, right: 0, background: "transparent", border: "none", color: BRAND.yellow, fontSize: 24, cursor: "pointer" },
  lightboxDownload: { position: "absolute", bottom: -48, left: "50%", transform: "translateX(-50%)", background: BRAND.yellow, color: BRAND.greenDark, border: "none", borderRadius: 10, padding: "10px 32px", fontWeight: 700, fontSize: 15, cursor: "pointer" },
};
