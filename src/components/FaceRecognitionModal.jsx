import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  X,
  UserCheck,
  AlertTriangle,
  Scan,
  Maximize2,
  Video,
  VideoOff,
  Sparkles,
  Lock
} from 'lucide-react';

// 68-Point Anatomical Facial Landmark Coordinates (normalized 0-100 for SVG overlay)
const JAWLINE_POINTS = [
  [22, 38], [24, 48], [27, 58], [31, 68], [37, 77], [44, 84], [50, 86],
  [56, 84], [63, 77], [69, 68], [73, 58], [76, 48], [78, 38]
];

const LEFT_EYEBROW = [[30, 32], [34, 29], [39, 29], [44, 31], [48, 34]];
const RIGHT_EYEBROW = [[52, 34], [56, 31], [61, 29], [66, 29], [70, 32]];

const LEFT_EYE = [[33, 39], [37, 36], [42, 37], [45, 41], [41, 42], [36, 42]];
const RIGHT_EYE = [[55, 41], [58, 37], [63, 36], [67, 39], [64, 42], [59, 42]];

const NOSE_BRIDGE = [[50, 36], [50, 43], [50, 50], [50, 56]];
const NOSE_BASE = [[43, 58], [47, 59], [50, 60], [53, 59], [57, 58]];

const OUTER_LIPS = [
  [38, 69], [43, 67], [47, 66], [50, 67], [53, 66], [57, 67], [62, 69],
  [58, 74], [54, 76], [50, 76], [46, 76], [42, 74]
];

const INNER_LIPS = [
  [41, 69], [47, 68], [50, 69], [53, 68], [59, 69],
  [54, 72], [50, 73], [46, 72]
];

// Triangulation wireframe segments for high-tech biometric mesh simulation
const MESH_TRIANGLES = [
  // Forehead to nose bridge
  [[39, 29], [50, 36], [61, 29]],
  // Left eye to nose
  [[45, 41], [50, 43], [50, 50]],
  // Right eye to nose
  [[55, 41], [50, 43], [50, 50]],
  // Left cheek triangle
  [[31, 68], [43, 58], [38, 69]],
  // Right cheek triangle
  [[69, 68], [57, 58], [62, 69]],
  // Chin to mouth
  [[44, 84], [50, 76], [56, 84]],
  [[50, 76], [50, 86], [44, 84]],
  [[50, 76], [50, 86], [56, 84]],
  // Nose to upper lip
  [[47, 59], [50, 67], [53, 59]]
];

export default function FaceRecognitionModal({
  isOpen,
  targetUser,
  onSuccess,
  onCancel
}) {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('sensor_init');
  // Phases: sensor_init | face_detected | mapping_mesh | liveness_check | db_match | verified

  const [hasWebcam, setHasWebcam] = useState(false);
  const [cameraMode, setCameraMode] = useState('auto'); // 'auto' | 'webcam' | 'simulation'
  const [cameraError, setCameraError] = useState(null);
  const [matchConfidence, setMatchConfidence] = useState(0);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Fallback student picture when camera is simulated or unavailable
  const studentPhoto = targetUser?.photo_url || '/candidates/emmanuel_ampofo.jpg';
  const studentName = targetUser?.full_name || targetUser?.name || 'Kwame Nkrumah';
  const studentId = targetUser?.student_id || targetUser?.studentId || targetUser?.staff_id || '20894512';

  // Camera initialization
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setScanProgress(0);
      setScanPhase('sensor_init');
      setMatchConfidence(0);
      return;
    }

    let isMounted = true;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            }
          });

          if (!isMounted) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }

          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }
          setHasWebcam(true);
        } else {
          setHasWebcam(false);
        }
      } catch (err) {
        console.warn('Webcam stream unavailable, using institutional biometric feed simulation:', err);
        setHasWebcam(false);
        setCameraError(err.name === 'NotAllowedError' ? 'Camera permission denied' : 'Camera not detected');
      }
    }

    initCamera();

    // ── Realistic Multi-Stage Scanning Delay Sequence (~5.5 seconds total) ──
    const totalDurationMs = 5400;
    const intervalMs = 60;
    const increment = 100 / (totalDurationMs / intervalMs);

    const timer = setInterval(() => {
      setScanProgress((prev) => {
        const next = Math.min(100, prev + increment);

        // Multi-stage phase progression
        if (next < 18) {
          setScanPhase('sensor_init');
          setMatchConfidence(0);
        } else if (next < 38) {
          setScanPhase('face_detected');
          setMatchConfidence(Math.round(next * 1.5));
        } else if (next < 70) {
          setScanPhase('mapping_mesh');
          setMatchConfidence(Math.round(60 + (next - 38) * 0.8));
        } else if (next < 88) {
          setScanPhase('liveness_check');
          setMatchConfidence(Math.round(86 + (next - 70) * 0.6));
        } else if (next < 99) {
          setScanPhase('db_match');
          setMatchConfidence(98);
        } else {
          setScanPhase('verified');
          setMatchConfidence(99.7);
          clearInterval(timer);

          // Hold the verified stamp for 1.3 seconds so the student observes the verified credential
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 1300);
        }

        return next;
      });
    }, intervalMs);

    return () => {
      isMounted = false;
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isSimulatedFeed = !hasWebcam || cameraMode === 'simulation';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden relative text-white flex flex-col">
        {/* Top Gold/Emerald University Accent Strip */}
        <div className="h-1.5 bg-gradient-to-r from-[#007A4D] via-[#D4AF37] to-[#007A4D]" />

        {/* Header Bar */}
        <div className="p-4 sm:p-5 pb-2 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Scan size={18} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-100 tracking-tight m-0">
                KNUST Biometric Facial Verification
              </h2>
              <span className="text-[11px] text-slate-400 font-mono block">
                Target: <strong className="text-[#D4AF37]">{studentName}</strong> (ID: {studentId})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Camera feed toggle */}
            {hasWebcam && (
              <button
                type="button"
                onClick={() => setCameraMode(prev => prev === 'simulation' ? 'webcam' : 'simulation')}
                className="p-1.5 px-2.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                title="Toggle between live webcam and institutional portrait feed"
              >
                {cameraMode === 'simulation' ? <Video size={12} /> : <VideoOff size={12} />}
                <span>{cameraMode === 'simulation' ? 'Use Webcam' : 'Use Photo'}</span>
              </button>
            )}

            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-xl border border-slate-700 cursor-pointer transition-colors"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Viewfinder Viewport (The Camera & Face Area) ── */}
        <div className="relative mx-4 sm:mx-6 my-3 h-72 sm:h-80 rounded-2xl overflow-hidden bg-black border-2 border-emerald-500/40 flex items-center justify-center shadow-inner">
          {/* Background Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none z-0"
            style={{
              backgroundImage: 'linear-gradient(to right, #10B981 1px, transparent 1px), linear-gradient(to bottom, #10B981 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* 1. Camera / Student Face Video Stream */}
          {!isSimulatedFeed ? (
            <video
              ref={videoRef}
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            /* Photorealistic Student Portrait Feed (with subtle breathing ambient effect) */
            <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
              <img
                src={studentPhoto}
                alt={studentName}
                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 ease-in-out scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

              {/* Simulation Mode Badge */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>INSTITUTIONAL ARCHIVE FEED</span>
              </div>
            </div>
          )}

          {/* 2. Cybernetic Facial Mesh & Landmark Simulation Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
            {/* SVG 68-Point Mesh & Triangulation Layer */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              style={{ overflow: 'visible' }}
            >
              {/* Triangulation Mesh Wireframe */}
              {scanPhase !== 'sensor_init' && (
                <g className="transition-opacity duration-500" opacity={scanPhase === 'verified' ? 0.3 : 0.65}>
                  {MESH_TRIANGLES.map((tri, i) => (
                    <polygon
                      key={`tri-${i}`}
                      points={`${tri[0][0]},${tri[0][1]} ${tri[1][0]},${tri[1][1]} ${tri[2][0]},${tri[2][1]}`}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="0.35"
                      strokeDasharray={scanPhase === 'face_detected' ? '1,1' : 'none'}
                      className="animate-pulse"
                      style={{ animationDuration: `${2 + (i % 3) * 0.5}s` }}
                    />
                  ))}
                </g>
              )}

              {/* Anatomical Contour Paths */}
              {scanPhase !== 'sensor_init' && (
                <g opacity={scanPhase === 'verified' ? 0.4 : 0.85}>
                  {/* Eyebrows */}
                  <polyline
                    points={LEFT_EYEBROW.map(p => p.join(',')).join(' ')}
                    fill="none"
                    stroke="#00E5FF"
                    strokeWidth="0.6"
                  />
                  <polyline
                    points={RIGHT_EYEBROW.map(p => p.join(',')).join(' ')}
                    fill="none"
                    stroke="#00E5FF"
                    strokeWidth="0.6"
                  />

                  {/* Eyes Contours */}
                  <polygon
                    points={LEFT_EYE.map(p => p.join(',')).join(' ')}
                    fill="rgba(0, 229, 255, 0.08)"
                    stroke="#00E5FF"
                    strokeWidth="0.5"
                  />
                  <polygon
                    points={RIGHT_EYE.map(p => p.join(',')).join(' ')}
                    fill="rgba(0, 229, 255, 0.08)"
                    stroke="#00E5FF"
                    strokeWidth="0.5"
                  />

                  {/* Nose Structure */}
                  <polyline
                    points={NOSE_BRIDGE.map(p => p.join(',')).join(' ')}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="0.5"
                  />
                  <polyline
                    points={NOSE_BASE.map(p => p.join(',')).join(' ')}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="0.5"
                  />

                  {/* Lips Contour */}
                  <polygon
                    points={OUTER_LIPS.map(p => p.join(',')).join(' ')}
                    fill="rgba(16, 185, 129, 0.08)"
                    stroke="#10B981"
                    strokeWidth="0.5"
                  />
                </g>
              )}

              {/* 68 Landmark Glowing Node Dots */}
              {scanPhase !== 'sensor_init' && (
                <g>
                  {[
                    ...JAWLINE_POINTS,
                    ...LEFT_EYEBROW,
                    ...RIGHT_EYEBROW,
                    ...LEFT_EYE,
                    ...RIGHT_EYE,
                    ...NOSE_BRIDGE,
                    ...NOSE_BASE,
                    ...OUTER_LIPS,
                    ...INNER_LIPS
                  ].map(([x, y], idx) => (
                    <circle
                      key={`pt-${idx}`}
                      cx={x}
                      cy={y}
                      r={scanPhase === 'mapping_mesh' ? 0.9 : 0.65}
                      fill={idx % 2 === 0 ? '#10B981' : '#00E5FF'}
                      className="transition-all"
                    />
                  ))}
                </g>
              )}
            </svg>

            {/* 3. Biometric Target Reticle & Corner Brackets */}
            <div className="relative w-48 h-60 sm:w-52 sm:h-64 rounded-[40px] border-2 border-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.25)] overflow-hidden">
              {/* Corner Locking Brackets */}
              <span className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]" />
              <span className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]" />
              <span className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]" />
              <span className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]" />

              {/* Sweeping Laser Scanner Bar */}
              {scanPhase !== 'verified' && (
                <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scanSweep shadow-[0_0_15px_#10B981]" />
              )}

              {/* Center Crosshair Coordinates */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-12 h-12 rounded-full border border-dashed border-emerald-400 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-400 absolute" />
              </div>

              {/* Dynamic Measurement Labels (visible during mapping) */}
              {(scanPhase === 'mapping_mesh' || scanPhase === 'liveness_check') && (
                <>
                  <div className="absolute top-12 left-3 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] font-mono text-cyan-300 border border-cyan-500/40">
                    IPD: 64.2mm
                  </div>
                  <div className="absolute bottom-16 right-3 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded text-[8px] font-mono text-emerald-300 border border-emerald-500/40">
                    SYMMETRY: 99.4%
                  </div>
                </>
              )}

              {/* 4. Match Confirmed Certification Stamp */}
              {scanPhase === 'verified' && (
                <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2.5 text-emerald-400 animate-scaleUp p-4 text-center z-20">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-xl">
                    <CheckCircle2 size={38} className="text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wider uppercase bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400 block mb-1">
                      Match 99.7% Certified
                    </span>
                    <span className="text-[11px] text-white font-bold block">
                      {studentName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      ID: {studentId} • Bio-Cleared
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Top Telemetry Strip */}
            <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[9px] font-mono text-emerald-400/90 pointer-events-none">
              <span>ROLL: 0.1° | YAW: -0.4°</span>
              <span>FPS: 60 | LUX: 385 OK</span>
            </div>

            {/* Bottom HUD Status Bar */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-300 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 shadow-md">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold uppercase">
                  {scanPhase === 'sensor_init' && 'Calibrating Camera Sensor...'}
                  {scanPhase === 'face_detected' && 'Face Position Centered...'}
                  {scanPhase === 'mapping_mesh' && 'Mapping 68 Landmark Nodes...'}
                  {scanPhase === 'liveness_check' && 'Liveness Verified (99.8%)...'}
                  {scanPhase === 'db_match' && 'Querying KNUST Registry...'}
                  {scanPhase === 'verified' && 'Identity Confirmed'}
                </span>
              </span>

              <span className="font-black text-[#D4AF37] font-mono">
                {matchConfidence > 0 ? `${matchConfidence}% MATCH` : `${Math.round(scanProgress)}%`}
              </span>
            </div>
          </div>
        </div>

        {/* ── Status Description & Multi-Stage Progress Bar ── */}
        <div className="p-4 sm:p-5 pt-1 space-y-3">
          {/* Progress Bar with Gradient */}
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-[#007A4D] via-emerald-400 to-[#D4AF37] transition-all duration-100 ease-out"
              style={{ width: `${scanProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Verification Status:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              {scanPhase === 'verified' ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Biometric Verified (Ready)</span>
                </>
              ) : (
                <>
                  <RefreshCw size={13} className="animate-spin text-emerald-400" />
                  <span>
                    {scanPhase === 'sensor_init' && 'Calibrating...'}
                    {scanPhase === 'face_detected' && 'Face Detected'}
                    {scanPhase === 'mapping_mesh' && 'Extracting Mesh Features'}
                    {scanPhase === 'liveness_check' && 'Anti-Spoofing Check'}
                    {scanPhase === 'db_match' && 'Database Cross-Match'}
                  </span>
                </>
              )}
            </span>
          </div>

          {/* Quick Skip Button for Testing */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onSuccess}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Instant Verification (Skip Delay)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
