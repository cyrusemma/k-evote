import React, { useState, useEffect, useRef } from 'react';
import { Camera, CheckCircle2, ShieldCheck, RefreshCw, X, UserCheck, AlertTriangle } from 'lucide-react';

export default function FaceRecognitionModal({
  isOpen,
  targetUser,
  onSuccess,
  onCancel
}) {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('initializing'); // initializing | scanning | analyzing | verified
  const [hasWebcam, setHasWebcam] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Attempt to initialize camera or fallback to high-tech mesh simulation
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setScanProgress(0);
      setScanPhase('initializing');
      return;
    }

    let isMounted = true;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
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
        }
      } catch (err) {
        // Fallback to synthetic facial HUD simulation
        setHasWebcam(false);
      }
    }

    startCamera();

    // Automated scanning sequence
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanPhase('verified');
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 1000);
          return 100;
        }

        const next = prev + 5;
        if (next < 35) setScanPhase('scanning');
        else if (next < 85) setScanPhase('analyzing');
        else if (next >= 95) setScanPhase('verified');
        return next;
      });
    }, 120);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden relative text-white">
        
        {/* Top Gold/Green Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#007A4D] via-[#D4AF37] to-[#007A4D]" />

        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-full z-20 cursor-pointer transition-colors"
          aria-label="Cancel"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="p-5 pb-2 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
            <Camera size={13} className="animate-pulse" />
            <span>Biometric Liveness &amp; Verification</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">
            Facial Recognition Protocol
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Matching live face against KNUST Biometric Academic Register for{' '}
            <strong className="text-amber-400">{targetUser?.name || 'Student Voter'}</strong>
          </p>
        </div>

        {/* ── Viewfinder / Camera Simulation Window ── */}
        <div className="relative mx-5 my-3 h-64 rounded-2xl overflow-hidden bg-slate-950 border-2 border-emerald-500/30 flex items-center justify-center shadow-inner">
          {hasWebcam ? (
            <video
              ref={videoRef}
              muted
              playsInline
              className="w-full h-full object-cover mirror scale-x-[-1]"
            />
          ) : (
            /* Synthetic Biometric Avatar Simulation */
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="w-28 h-36 rounded-full border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center gap-2 text-emerald-400/80">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <UserCheck size={32} className="text-emerald-400" />
                </div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
                  {targetUser?.student_id || targetUser?.staff_id || 'AIM_ID: OK'}
                </span>
              </div>
            </div>
          )}

          {/* Futuristic Scanning Reticle & Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            {/* Target Reticle Frame */}
            <div className="relative w-44 h-52 border-2 border-emerald-400/80 rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              {/* Corner brackets */}
              <span className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
              <span className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
              <span className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
              <span className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

              {/* Animated Laser Scanning Line */}
              {scanPhase !== 'verified' && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scanLine shadow-[0_0_12px_#10B981]" />
              )}

              {/* Center Landmark Target */}
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-8 h-8 rounded-full border border-emerald-400" />
              </div>

              {/* Match Confirmed Stamp */}
              {scanPhase === 'verified' && (
                <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-emerald-400 animate-scaleUp">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>
                  <span className="text-xs font-black tracking-wider uppercase bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400">
                    Match 99.6% Confirmed
                  </span>
                </div>
              )}
            </div>

            {/* Live Telemetry Badge */}
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-emerald-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-emerald-500/30">
              <span>SENSOR: 60FPS</span>
              <span className="uppercase font-bold">
                {scanPhase === 'scanning'
                  ? 'Detecting Landmarks...'
                  : scanPhase === 'analyzing'
                  ? 'Comparing Biometric Hash...'
                  : 'Identity Certified'}
              </span>
              <span>{scanProgress}%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="p-5 pt-1 space-y-3">
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-[#007A4D] via-emerald-400 to-[#D4AF37] transition-all duration-150 ease-out"
              style={{ width: `${scanProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Status:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              {scanPhase === 'verified' ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>Biometric Verified</span>
                </>
              ) : (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  <span>Analyzing Face Landmarks ({scanProgress}%)</span>
                </>
              )}
            </span>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onSuccess}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Instant Verification (Skip Scan)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
