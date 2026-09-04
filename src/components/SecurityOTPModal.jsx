import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Smartphone, Bell, ArrowRight, CheckCircle2, RefreshCw, AlertCircle, X } from 'lucide-react';

export default function SecurityOTPModal({
  isOpen,
  targetUser,
  generatedOtp,
  onVerify,
  onCancel,
  onResend
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef([]);

  // Trigger push alert animation after modal opens
  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setError('');
      setTimeLeft(300);
      const t = setTimeout(() => setShowPushBanner(true), 400);
      return () => clearTimeout(t);
    } else {
      setShowPushBanner(false);
    }
  }, [isOpen, generatedOtp]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timeLeft]);

  // Auto-focus first input box
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index, value) => {
    const clean = value.replace(/\D/g, '');
    const newDigits = [...digits];

    if (clean.length > 1) {
      // Pasting multi-digit code
      const pasted = clean.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newDigits[index] = clean.slice(-1);
    setDigits(newDigits);
    setError('');

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutofill = () => {
    if (!generatedOtp) return;
    const otpArr = String(generatedOtp).padStart(6, '0').split('');
    setDigits(otpArr);
    setError('');
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const entered = digits.join('');
    if (entered.length < 6) {
      setError('Please enter the complete 6-digit authorization code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (entered === String(generatedOtp)) {
        onVerify();
      } else {
        setError('Incorrect PIN. Please re-enter the code sent to your device.');
      }
    }, 600);
  };

  const formatMinutes = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* ── Simulated University SMS/Push Notification Pop-up Banner ── */}
      {showPushBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-60 w-full max-w-md px-3 animate-slideDown pointer-events-auto">
          <div className="bg-slate-900/95 dark:bg-slate-800/95 text-white border border-emerald-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
              <Bell size={18} className="animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                <span>KNUST UITS Security Alert</span>
                <span className="text-slate-400 lowercase font-normal">just now</span>
              </div>
              <p className="text-xs text-slate-200 mt-0.5 leading-snug font-medium">
                Your 6-digit election login authorization code is{' '}
                <strong className="text-amber-400 tracking-wider text-sm font-mono">{generatedOtp}</strong>.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutofill}
                  className="text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-600 px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 size={12} />
                  <span>Insert PIN Automatically</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPushBanner(false)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowPushBanner(false)}
              className="text-slate-400 hover:text-white text-sm p-1 leading-none"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Main OTP Modal Card ── */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        {/* Top Gold & Green Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#007A4D] via-[#D4AF37] to-[#007A4D]" />

        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer p-1 rounded-lg"
          aria-label="Cancel"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mt-2">
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#007A4D] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Smartphone size={26} />
          </div>
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
            Two-Factor PIN Verification
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
            A secure authorization code has been dispatched to{' '}
            <strong className="text-slate-700 dark:text-slate-300 font-semibold">
              {targetUser?.email || 'your registered mobile/email'}
            </strong>.
          </p>
        </div>

        {/* PIN Entry Boxes */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#007A4D] focus:ring-2 focus:ring-[#007A4D]/20 focus:outline-none transition-all"
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-2 justify-center animate-shake">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Timer & Resend */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
            <span>Code expires in: <strong className="font-mono text-slate-800 dark:text-slate-200">{formatMinutes(timeLeft)}</strong></span>
            <button
              type="button"
              onClick={() => {
                if (onResend) onResend();
                setShowPushBanner(true);
              }}
              className="text-[#007A4D] dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={11} />
              <span>Resend PIN</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying || digits.join('').length < 6}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-[#007A4D] hover:bg-[#075C42] disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isVerifying ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Confirm PIN</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
