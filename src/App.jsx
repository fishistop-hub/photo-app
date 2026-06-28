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
    <img src="./logo.jpg" alt="Fishi Stop Logo" width={size} height={size}
      style={{ objectFit: "contain", display: "block", mixBlendMode: "lighten" }} />
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
        <svg key={i} width={item.size} height={item.size} viewBox={item.vb}
          style={{ position: "absolute", left: `${item.x}%`, top: `${item.y}%`, transform: `rotate(${item.r}deg)`, color: "#F5C842", opacity: 0.1 }}>
          {item.el}
        </svg>
      ))}
    </div>
  );
}

function WelcomeScreen({ onStart }) {
  return (
    <div style={styles.screen}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Cormorant+Garamond:wght@700&display=swap" rel="stylesheet" />
      <div style={styles.logoWrap}><FishiLogo size={200} /></div>
      <div style={styles.brandWrap}>
        <h1 style={styles.brand}>FISHI</h1>
        <h1 style={styles.brandSub}>SELFI</h1>
      </div>
      <p style={styles.tagline}>by FISHI STOP PHOTOGRAPHY</p>
      <div style={styles.divider} />
      <p style={styles.instruction}>Snap your quick selfie — we'll find every photo of you from the event.</p>
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
  const [flash, setFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } }
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
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    setStreaming(false);
  }, []);

  const snap = useCallback(() => {
    // Flash effect
    if (flashOn) {
      setFlash(true);
      setTimeout(() => {
        setFlash(false);
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Mirror flip fix — draw un-mirrored
        const ctx = canvas.getContext("2d");
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        setCaptured(canvas.toDataURL("image/jpeg", 0.85));
        stopCamera();
      }, 300);
    } else {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      setCaptured(canvas.toDataURL("image/jpeg", 0.85));
      stopCamera();
    }
  }, [stopCamera, flashOn]);

  return (
    <div style={styles.screen}>
      {/* Flash overlay */}
      {flash && <div style={styles.flashOverlay} />}

      <button style={styles.backBtn} onClick={() => { stopCamera(); onBack(); }}>← Back</button>
      <h2 style={styles.heading}>Take Your Selfie</h2>
      <p style={styles.subtext}>Face the camera clearly · Good lighting helps</p>

      <div style={styles.cameraFrame}>
        {!captured ? (
          <>
            <video
              ref={videoRef}
              style={{ ...styles.cameraView, display: streaming ? "block" : "none", transform: "scaleX(-1)" }}
              playsInline muted
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
            <div style={styles.snapRow}>
              {/* Flash toggle */}
              <button
                style={{ ...styles.flashBtn, background: flashOn ? BRAND.yellow : "transparent", color: flashOn ? BRAND.greenDark : BRAND.yellow }}
                onClick={() => setFlashOn(f => !f)}
              >
                {flashOn ? "⚡ On" : "⚡ Off"}
              </button>
              {/* Snap button */}
              <button style={styles.btnSnap} onClick={snap}>
                <span style={styles.snapDot} />
              </button>
              <div style={{ width: 60 }} />
            </div>
          )}
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
      <FishiLogo size={140} />
      <h2 style={{ ...styles.heading, marginTop: 24 }}>Fishi Stop Searching your photos...</h2>
      <p style={styles.subtext}>Scanning {progress.total} photos for your face</p>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${Math.round((progress.done / progress.total) * 100)}%` }} />
      </div>
      <p style={{ color: BRAND.yellow, fontSize: 14 }}>{Math.round((progress.done / progress.total) * 100)}% complete</p>
    </div>
  );
}

function Lightbox({ matches, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex);
  const touchStartX = useRef(null);

  const getImageUrl = (match) => `https://drive.google.com/thumbnail?id=${match.file_id}&sz=w1200`;
  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : matches.length - 1));
  const next = () => setCurrent((c) => (c < matches.length - 1 ? c + 1 : 0));

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div style={styles.lightboxOverlay} onClick={onClose}>
      <div style={styles.lightboxBox} onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <button style={styles.lbClose} onClick={onClose}>✕</button>
        <div style={styles.lbCounter}>{current + 1} / {matches.length}</div>
        <img src={getImageUrl(matches[current])} alt={`Photo ${current + 1}`} style={styles.lbImage} />
        {matches.length > 1 && (
          <>
            <button style={{ ...styles.lbArrow, left: 8 }} onClick={prev}>‹</button>
            <button style={{ ...styles.lbArrow, right: 8 }} onClick={next}>›</button>
          </>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({ matches, eventName, folderId, onRetry }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [folderStatus, setFolderStatus] = useState("idle");
  const [folderLink, setFolderLink] = useState(null);
  const guestCounter = useRef(Math.floor(Math.random() * 900) + 100);

  const getImageUrl = (match) => `https://drive.google.com/thumbnail?id=${match.file_id}&sz=w800`;

  const handleGetMyPhotos = async () => {
    setFolderStatus("creating");
    try {
      const res = await fetch("https://fishistop-selfi-backend.onrender.com/create-guest-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_ids: matches.map(m => m.file_id),
          guest_number: guestCounter.current,
          event_name: eventName || "Event",
          parent_folder_id: folderId,
        }),
      });
      const data = await res.json();
      if (data.folder_link) {
        setFolderLink(data.folder_link);
        setFolderStatus("ready");
        window.open(data.folder_link, "_blank");
      } else {
        setFolderStatus("error");
      }
    } catch {
      setFolderStatus("error");
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
      {lightboxIndex !== null && (
        <Lightbox matches={matches} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      <div style={styles.resultsHeader}>
        <h2 style={styles.heading}>Your Photos</h2>
        <p style={styles.subtext}>{matches.length} photo{matches.length > 1 ? "s" : ""} found · Tap to view</p>
      </div>

      <div style={styles.scrollGrid}>
        {matches.map((match, i) => (
          <div key={i} style={styles.photoCard} onClick={() => setLightboxIndex(i)}>
            <img src={getImageUrl(match)} alt={`Photo ${i + 1}`} style={styles.photoThumb}
              onError={(e) => { e.target.style.opacity = "0.3"; }} />
            <div style={styles.viewOverlay}>👁 View</div>
          </div>
        ))}
      </div>

      <div style={styles.bottomSection}>
        {folderStatus === "idle" && (
          <button style={styles.btnPrimary} onClick={handleGetMyPhotos}>
            📁 Get My Photos
          </button>
        )}

        {folderStatus === "creating" && (
          <div style={styles.creatingBox}>
            <div style={{ fontSize: 32 }}>⏳</div>
            <p style={styles.creatingText}>
              Wait —   F I S H I   is creating your folder.{"\n"}It'll open automatically.
            </p>
          </div>
        )}

        {folderStatus === "ready" && folderLink && (
          <div style={styles.readyBox}>
            <p style={styles.readyText}>✅ Your folder is ready!</p>
            <button style={styles.btnPrimary} onClick={() => window.open(folderLink, "_blank")}>
              📂 Open My Photos in Drive
            </button>
            <p style={styles.hintText}>In Google Drive — tap ⋮ → Download to save to your phone</p>
          </div>
        )}

        {folderStatus === "error" && (
          <div style={styles.readyBox}>
            <p style={{ color: "#e05252", fontSize: 14 }}>Something went wrong. Try again.</p>
            <button style={styles.btnSecondary} onClick={() => setFolderStatus("idle")}>Try Again</button>
          </div>
        )}

        <button style={{ ...styles.btnSecondary, marginTop: 8 }} onClick={onRetry}>Search Again</button>
        <p style={{ color: BRAND.gray, fontSize: 12, marginTop: 8 }}>Captured by Fishi Stop Photography</p>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [matches, setMatches] = useState([]);
  const [progress, setProgress] = useState({ done: 0, total: 995 });

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
        {screen === "results" && <ResultsScreen matches={matches} eventName={eventName} folderId={folderId} onRetry={() => setScreen("selfie")} />}
      </div>
    </div>
  );
}

const styles = {
  app: { height: "100dvh", width: "100vw", background: BRAND.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', 'Segoe UI', sans-serif", overflow: "hidden", position: "fixed", top: 0, left: 0 },
  card: { background: BRAND.green, width: "100%", height: "100%", maxWidth: 480, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  screen: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 24px", gap: 0, width: "100%", height: "100%", textAlign: "center", overflow: "hidden" },
  resultsContainer: { display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden" },
  resultsHeader: { padding: "16px 16px 0", textAlign: "center", flexShrink: 0 },
  scrollGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "8px 16px", overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch" },
  bottomSection: { padding: "12px 16px 16px", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  creatingBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px", background: BRAND.greenLight, borderRadius: 12, width: "100%" },
  creatingText: { color: BRAND.yellow, fontSize: 15, fontWeight: 700, textAlign: "center", whiteSpace: "pre-line", margin: 0 },
  readyBox: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" },
  readyText: { color: BRAND.yellow, fontSize: 16, fontWeight: 700, margin: 0 },
  hintText: { color: BRAND.gray, fontSize: 12, textAlign: "center", margin: 0 },
  logoWrap: { marginBottom: 8 },
  brandWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 0, marginBottom: 4 },
  brand: { color: BRAND.yellow, fontSize: 52, fontWeight: 900, letterSpacing: 16, margin: 0, fontFamily: "'Playfair Display', 'Georgia', serif", textTransform: "uppercase", lineHeight: 1, textShadow: `0 2px 20px ${BRAND.yellowDim}` },
  brandSub: { color: BRAND.white, fontSize: 28, fontWeight: 700, letterSpacing: 24, margin: 0, fontFamily: "'Cormorant Garamond', 'Georgia', serif", textTransform: "uppercase", lineHeight: 1, opacity: 0.9 },
  tagline: { color: BRAND.gray, fontSize: 10, letterSpacing: 4, textTransform: "uppercase", margin: "4px 0 12px", fontStyle: "italic" },
  divider: { width: 60, height: 1, background: `linear-gradient(to right, transparent, ${BRAND.yellow}, transparent)`, margin: "8px auto 12px", opacity: 0.5 },
  instruction: { color: BRAND.white, textAlign: "center", fontSize: 13, lineHeight: 1.5, margin: "0 0 16px", opacity: 0.85 },
  btnPrimary: { background: BRAND.yellow, color: BRAND.greenDark, border: "none", borderRadius: 12, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", maxWidth: 320, marginTop: 4 },
  btnSecondary: { background: "transparent", color: BRAND.yellow, border: `2px solid ${BRAND.yellow}`, borderRadius: 12, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", maxWidth: 320 },
  footer: { color: BRAND.gray, fontSize: 12, marginTop: 12, marginBottom: 0, textAlign: "center" },
  backBtn: { alignSelf: "flex-start", background: "transparent", border: "none", color: BRAND.yellow, fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 16 },
  heading: { color: BRAND.yellow, fontSize: 22, fontWeight: 700, margin: "0 0 6px", textAlign: "center" },
  subtext: { color: BRAND.gray, fontSize: 14, textAlign: "center", margin: "0 0 8px", lineHeight: 1.5 },
  cameraFrame: { position: "relative", width: "100%", maxWidth: 340, aspectRatio: "1/1", borderRadius: 16, overflow: "hidden", background: BRAND.greenDark, border: `2px solid ${BRAND.greenLight}`, marginBottom: 16 },
  cameraView: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  cameraPlaceholder: { width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 },
  cameraIcon: { fontSize: 48 },
  cameraOverlay: { position: "absolute", inset: 0, border: `3px solid ${BRAND.yellow}`, borderRadius: 16, pointerEvents: "none", opacity: 0.3 },
  snapRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 20, width: "100%" },
  btnSnap: { background: BRAND.yellow, border: `4px solid ${BRAND.white}`, borderRadius: "50%", width: 70, height: 70, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 4px ${BRAND.yellowDim}` },
  snapDot: { width: 28, height: 28, borderRadius: "50%", background: BRAND.white, display: "block" },
  flashBtn: { border: `2px solid ${BRAND.yellow}`, borderRadius: 20, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", width: 70 },
  flashOverlay: { position: "fixed", inset: 0, background: "white", zIndex: 999, opacity: 0.95 },
  row: { display: "flex", gap: 12, width: "100%", maxWidth: 340 },
  progressBar: { width: "100%", maxWidth: 300, height: 6, background: BRAND.greenLight, borderRadius: 99, overflow: "hidden", margin: "16px 0 8px" },
  progressFill: { height: "100%", background: BRAND.yellow, borderRadius: 99, transition: "width 0.3s ease" },
  photoCard: { position: "relative", borderRadius: 10, overflow: "hidden", background: BRAND.greenDark, cursor: "pointer", aspectRatio: "3/4" },
  photoThumb: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  viewOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(18,38,18,0.85)", color: BRAND.yellow, padding: "6px 0", fontSize: 12, fontWeight: 600, textAlign: "center" },
  lightboxOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  lightboxBox: { position: "relative", width: "95vw", height: "85vh", maxWidth: 500, display: "flex", alignItems: "center", justifyContent: "center" },
  lbImage: { width: "100%", height: "100%", objectFit: "contain" },
  lbClose: { position: "absolute", top: -44, right: 0, background: "transparent", border: "none", color: BRAND.yellow, fontSize: 28, cursor: "pointer", zIndex: 10 },
  lbCounter: { position: "absolute", top: -44, left: 0, color: BRAND.yellow, fontSize: 14 },
  lbArrow: { position: "absolute", top: "50%", transform: "translateY(-50%)", background: "rgba(245,200,66,0.2)", border: `1px solid ${BRAND.yellow}`, color: BRAND.yellow, borderRadius: "50%", width: 40, height: 40, fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
};
