import React, { useState } from 'react';
import { 
  Vote, 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  Hash, 
  Key, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  Camera, 
  Smartphone,
  Building2
} from 'lucide-react';
import { DEMO_PROFILES, EC_OFFICER_PROFILES, authenticateStudent, authenticateOfficer } from '../lib/demoProfiles';
import SecurityOTPModal from './SecurityOTPModal';
import FaceRecognitionModal from './FaceRecognitionModal';
import '../styles/SecureVote.css';

export default function KNUSTLogin({ onLoginSuccess, navigate }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'ec-officer'
  
  // Student inputs
  const [studentIdentifier, setStudentIdentifier] = useState('knkrumah@st.knust.edu.gh');
  const [studentIndex, setStudentIndex] = useState('20894512');
  const [studentPassword, setStudentPassword] = useState('knustpassword');
  
  // EC Officer inputs
  const [officerIdentifier, setOfficerIdentifier] = useState('EC-KNUST-01');
  const [officerPin, setOfficerPin] = useState('2145221');
  const [officerJurisdiction, setOfficerJurisdiction] = useState('central-ec');

  // Security toggles
  const [enableOtp, setEnableOtp] = useState(true);
  const [enableFaceScan, setEnableFaceScan] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Modal states & active verification
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isFaceOpen, setIsFaceOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [pendingUser, setPendingUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 1-Click Quick-Fill helper for student profiles
  const handleQuickFillStudent = (profileKey) => {
    const profile = DEMO_PROFILES[profileKey];
    if (profile) {
      setStudentIdentifier(profile.email);
      setStudentIndex(profile.student_id);
      setStudentPassword(profile.password);
      setErrorMessage('');
    }
  };

  // 1-Click Quick-Fill helper for EC officer profiles
  const handleQuickFillOfficer = (officerKey) => {
    const officer = EC_OFFICER_PROFILES[officerKey];
    if (officer) {
      setOfficerIdentifier(officer.staff_id);
      setOfficerPin(officer.pin);
      setOfficerJurisdiction(officer.jurisdiction?.id || 'central-ec');
      setErrorMessage('');
    }
  };

  // Initial Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (activeTab === 'student') {
      const authResult = authenticateStudent(studentIdentifier || studentIndex, studentPassword);
      if (!authResult.success) {
        setErrorMessage(authResult.error);
        return;
      }

      setPendingUser(authResult.user);
      initiateSecurityFlow(authResult.user);
    } else {
      const authResult = authenticateOfficer(officerIdentifier, officerPin);
      if (!authResult.success) {
        setErrorMessage(authResult.error);
        return;
      }

      setPendingUser(authResult.user);
      initiateSecurityFlow(authResult.user);
    }
  };

  // Start Step 2 (OTP) & Step 3 (Biometrics)
  const initiateSecurityFlow = (user) => {
    if (enableOtp) {
      // Generate realistic 6-digit random code
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      setGeneratedOtp(otpCode);
      setIsOtpOpen(true);
    } else if (enableFaceScan) {
      setIsFaceOpen(true);
    } else {
      finalizeLogin(user);
    }
  };

  // OTP verified callback
  const handleOtpVerified = () => {
    setIsOtpOpen(false);
    if (enableFaceScan) {
      setTimeout(() => setIsFaceOpen(true), 300);
    } else {
      finalizeLogin(pendingUser);
    }
  };

  // Face recognition verified callback
  const handleFaceVerified = () => {
    setIsFaceOpen(false);
    finalizeLogin(pendingUser);
  };

  // Finalize authentication & redirect
  const finalizeLogin = (user) => {
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(user);
    } else if (typeof navigate === 'function') {
      if (user.isEcOfficer) {
        navigate('/ec-admin');
      } else {
        navigate('/');
      }
    } else {
      window.location.href = user.isEcOfficer ? '/ec-admin' : '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#072418] via-[#0A3D2A] to-[#111827] text-white flex flex-col justify-between relative overflow-hidden p-4 sm:p-6 md:p-8 select-none">
      {/* Background KNUST Crest Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0">
        <img src="/logo.png" alt="KNUST Crest Watermark" className="w-[650px] h-[650px] object-contain" />
      </div>

      {/* Top University Brand Bar */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md p-1.5 border border-[#D4AF37]/50 flex items-center justify-center shadow-lg">
            <img src="/logo.png" alt="KNUST Crest" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-[11px] sm:text-xs font-black tracking-widest text-[#D4AF37] uppercase block">
              KNUST Electoral Commission
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight m-0">
              AIM Portal Single Sign-On Gateway
            </h1>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs text-emerald-200">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
          <span>AES-256 Verified Session</span>
        </div>
      </header>

      {/* ── Main Authentication Box ── */}
      <main className="relative z-10 w-full max-w-lg mx-auto my-6">
        <div className="bg-slate-900/90 dark:bg-slate-900/95 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden p-6 sm:p-8">
          
          {/* Top Gold Accent Stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#007A4D] via-[#D4AF37] to-[#007A4D] -mt-6 sm:-mt-8 -mx-6 sm:-mx-8 mb-6" />

          {/* Portal Tabs */}
          <div className="flex rounded-2xl bg-black/40 p-1.5 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('student');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-[#007A4D] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User size={15} />
              <span>Student Voter</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('ec-officer');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'ec-officer'
                  ? 'bg-[#007A4D] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck size={15} />
              <span>EC Official</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-2 animate-shake">
              <AlertCircle size={15} className="shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ── Form Inputs ── */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {activeTab === 'student' ? (
              <>
                {/* Student Webmail / Username */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Student Webmail or Username
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. knkrumah@st.knust.edu.gh"
                      value={studentIdentifier}
                      onChange={(e) => setStudentIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#007A4D] focus:ring-2 focus:ring-[#007A4D]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Student Index Number or Reference Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Student Index Number / Reference Number
                  </label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 20894512 or 8945120"
                      value={studentIndex}
                      onChange={(e) => setStudentIndex(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#007A4D] focus:ring-2 focus:ring-[#007A4D]/20 transition-all"
                    />
                  </div>
                </div>

                {/* AIM Portal Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    AIM Portal Password
                  </label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter AIM password"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#007A4D] focus:ring-2 focus:ring-[#007A4D]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Quick-Fill Chips for Student Test Personas */}
                <div className="pt-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5 flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>Quick-Fill Test Personas:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickFillStudent('A')}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-semibold text-emerald-300 transition-colors cursor-pointer"
                    >
                      ⚡ Kwame (L100 Resident)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFillStudent('B')}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-semibold text-emerald-300 transition-colors cursor-pointer"
                    >
                      ⚡ Akosua (L300 Off-Campus)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFillStudent('C')}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-semibold text-emerald-300 transition-colors cursor-pointer"
                    >
                      ⚡ Emmanuel (L400 Kotei)
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* EC Commission Officer ID / Staff Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Commission Staff ID or Official Email
                  </label>
                  <div className="relative">
                    <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. EC-KNUST-01 or ec.appiah@knust.edu.gh"
                      value={officerIdentifier}
                      onChange={(e) => setOfficerIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#007A4D] focus:ring-2 focus:ring-[#007A4D]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Officer Security Passcode / PIN */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Officer Passcode / PIN
                  </label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="Enter security passcode"
                      value={officerPin}
                      onChange={(e) => setOfficerPin(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#007A4D] focus:ring-2 focus:ring-[#007A4D]/20 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Assigned Commission Jurisdiction */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300">
                    Assigned Jurisdiction Desk
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      value={officerJurisdiction}
                      onChange={(e) => setOfficerJurisdiction(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-xs sm:text-sm font-medium focus:outline-none focus:border-[#007A4D] appearance-none cursor-pointer"
                    >
                      <option value="central-ec" className="bg-slate-900 text-white">Central Electoral Commission (University-wide)</option>
                      <option value="coe-ec" className="bg-slate-900 text-white">College of Engineering (CoE Returning Desk)</option>
                      <option value="unity-ec" className="bg-slate-900 text-white">Unity Hall Presiding Desk</option>
                    </select>
                  </div>
                </div>

                {/* Quick-Fill Chips for EC Officers */}
                <div className="pt-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] mb-1.5 flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>Quick-Fill Officer Presets:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickFillOfficer('EC1')}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-semibold text-amber-300 transition-colors cursor-pointer"
                    >
                      ⚡ Commissioner Kwame Appiah
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFillOfficer('EC2')}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-semibold text-amber-300 transition-colors cursor-pointer"
                    >
                      ⚡ Officer Joyce Baah (CoE)
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Layered Security Checkboxes */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="block text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                Multi-Layer Verification Security:
              </span>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableOtp}
                    onChange={(e) => setEnableOtp(e.target.checked)}
                    className="w-4 h-4 rounded text-[#007A4D] focus:ring-0 cursor-pointer accent-[#007A4D]"
                  />
                  <Smartphone size={13} className="text-[#D4AF37]" />
                  <span>2FA PIN Code</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableFaceScan}
                    onChange={(e) => setEnableFaceScan(e.target.checked)}
                    className="w-4 h-4 rounded text-[#007A4D] focus:ring-0 cursor-pointer accent-[#007A4D]"
                  />
                  <Camera size={13} className="text-[#D4AF37]" />
                  <span>Biometric Face Scan</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-[#007A4D] to-[#075C42] hover:from-[#075C42] hover:to-[#007A4D] shadow-lg hover:shadow-emerald-900/40 transition-all cursor-pointer flex items-center justify-center gap-2 border border-emerald-400/30"
              >
                <span>Authenticate &amp; Access Portal</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Branding & Disclaimer */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full text-center text-xs text-slate-400 pt-4 border-t border-white/10 space-y-1">
        <p className="font-semibold text-slate-300">
          Kwame Nkrumah University of Science &amp; Technology • University Information Technology Services (UITS)
        </p>
        <p className="text-[11px] text-slate-400">
          All voter ballots and authentication tokens are certified with end-to-end zero-knowledge encryption.
        </p>
      </footer>

      {/* ── Security Modals ── */}
      <SecurityOTPModal
        isOpen={isOtpOpen}
        targetUser={pendingUser}
        generatedOtp={generatedOtp}
        onVerify={handleOtpVerified}
        onCancel={() => setIsOtpOpen(false)}
        onResend={() => {
          const newCode = Math.floor(100000 + Math.random() * 900000);
          setGeneratedOtp(newCode);
        }}
      />

      <FaceRecognitionModal
        isOpen={isFaceOpen}
        targetUser={pendingUser}
        onSuccess={handleFaceVerified}
        onCancel={() => setIsFaceOpen(false)}
      />
    </div>
  );
}
