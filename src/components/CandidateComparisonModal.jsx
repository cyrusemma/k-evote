import React, { useState } from 'react';
import {
  X,
  Scale,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  TrendingUp,
  Building,
  Wifi,
  Bus,
  Coins,
  ChevronRight
} from 'lucide-react';
import CandidateAvatar from './CandidateAvatar';

// Curated policy & vetting dataset for key campus candidates
export const CANDIDATE_DOSSIERS = {
  // SRC Presidential candidates
  'cand-001': {
    name: 'Emmanuel Ampofo',
    position: 'President',
    slate: 'The Vanguard Slate',
    runningMate: 'Abena Osei Poku (Vice President)',
    vettingScore: 94.5,
    vettingRank: '1st in Vetting',
    academicStatus: 'Statutory Clearance (CWA: 72.4)',
    disciplinaryStatus: 'Clear / Zero Infractions',
    experience: 'Former CoE President, SRC General Assembly Rep',
    policies: {
      wifi: 'Deploy 8 new High-Density Wi-Fi mesh access points at CCB, Commercial Area, and major shuttle terminals; partner with university IT for Starlink redundancy.',
      housing: 'Establish an SRC-Hostel Rental Ceilings Board to negotiate legally-binding maximum annual rent increases with private hostel managers in Ayeduase and Kotei.',
      transit: 'Introduce 6 new 32-seater night shuttles running between 9 PM and 3 AM with live GPS tracking on the AIM app; establish solar-lit safety corridors.',
      welfare: 'Expand SRC Needy Student Bursary Fund by GH₵ 450,000 using corporate sponsorships and alumni endowment partnerships; subsidize end-of-semester study snacks.',
    }
  },
  'cand-002': {
    name: 'Abena Koduah',
    position: 'President',
    slate: 'Renaissance Coalition',
    runningMate: 'Kwabena Appiah (Vice President)',
    vettingScore: 91.0,
    vettingRank: '2nd in Vetting',
    academicStatus: 'Statutory Clearance (CWA: 70.8)',
    disciplinaryStatus: 'Clear / Zero Infractions',
    experience: 'SRC Judicial Committee Clerk, Women in Leadership Lead',
    policies: {
      wifi: 'Overhaul fiber connectivity to residential halls and implement unlimited midnight bandwidth tiers for academic research repositories.',
      housing: 'Create the KNUST Off-Campus Tenant Union with free legal representation for students facing wrongful eviction or exorbitant utility bills.',
      transit: 'Partner with campus transport unions to introduce subsidized fixed-rate student bus passes with cashless mobile wallet taps.',
      welfare: 'Create a 24/7 Mental Health and Stress Relief hotline integrated with university counseling; expand female sanitary hygiene dispensers in every faculty.',
    }
  },
  'cand-003': {
    name: 'Kofi Mensah',
    position: 'President',
    slate: 'Integrity Alliance',
    runningMate: 'Eunice Boateng (Vice President)',
    vettingScore: 88.0,
    vettingRank: '3rd in Vetting',
    academicStatus: 'Statutory Clearance (CWA: 68.2)',
    disciplinaryStatus: 'Clear / Zero Infractions',
    experience: 'Unity Hall Executive Member, Engineering Students Rep',
    policies: {
      wifi: 'Install outdoor solar study hubs equipped with weatherproof high-speed routers and charging stations around Botanical Gardens and Parade Grounds.',
      housing: 'Launch a verified hostel booking portal with transparent price ratings to eliminate middleman agent fraud for freshmen and continuing students.',
      transit: 'Deploy dedicated electric mini-buses for high-frequency short hops between Tech Junction, Gaza, and Faculty areas during morning lecture peaks.',
      welfare: 'Emergency Medical Expense Relief fund for students requiring immediate hospitalization or surgery, financed through transparent student union dues audit.',
    }
  },

  // WOCOM Candidates
  'cand-007': {
    name: 'Priscilla Addo',
    position: "Women's Commissioner",
    slate: 'The Vanguard Slate',
    vettingScore: 93.0,
    vettingRank: '1st in Vetting',
    academicStatus: 'Statutory Clearance (CWA: 74.1)',
    disciplinaryStatus: 'Clear / Zero Infractions',
    experience: 'Queen Elizabeth II Hall WOCOM, STEM Women Ambassador',
    policies: {
      wifi: 'Campus-wide STEM coding and digital media masterclasses for female undergraduates.',
      housing: 'Installation of high-security CCTV and solar floodlights outside female-majority off-campus hostels in Ayeduase and Kotei.',
      transit: 'Dedicated late-night safe-walk escort service and designated night-shuttle stops.',
      welfare: 'Universal Free Dignity Kits: Free biodegradable sanitary products in all faculty washrooms.'
    }
  },
  'cand-008': {
    name: 'Yaa Serwaa Bonsu',
    position: "Women's Commissioner",
    slate: 'Renaissance Coalition',
    vettingScore: 89.5,
    vettingRank: '2nd in Vetting',
    academicStatus: 'Statutory Clearance (CWA: 69.5)',
    disciplinaryStatus: 'Clear / Zero Infractions',
    experience: 'Africa Hall Secretary, Student Entrepreneurship Lead',
    policies: {
      wifi: 'Virtual entrepreneurial incubator offering funding and digital tools for student-run ventures.',
      housing: 'Hostel safety audit accreditation program with certified security ratings.',
      transit: 'Subsidized female student transit vouchers for clinical and evening internships.',
      welfare: 'Comprehensive reproductive health checkup weeks and mental wellness retreats.'
    }
  },

  // Vice President
  'cand-004': {
    name: 'Francis Mensah',
    position: 'Vice President',
    slate: 'The Vanguard Slate',
    vettingScore: 92.0,
    vettingRank: '1st in Vetting',
    academicStatus: 'Statutory Clearance (CWA: 71.3)',
    disciplinaryStatus: 'Clear / Zero Infractions',
    experience: 'SRC Academic Board Member',
    policies: {
      wifi: 'Expansion of digital e-library databases and institutional software licenses for all students.',
      housing: 'Renovation advocacy for on-campus traditional residential hall washrooms and water pressure pumps.',
      transit: 'Optimized bus dispatch schedules synced with lecture timetables to eliminate long queues.',
      welfare: 'Peer-to-peer academic tutoring clinics for students with CWA below 55.'
    }
  },
  'cand-005': {
    name: 'Eunice Boateng',
    position: 'Vice President',
    slate: 'Integrity Alliance',
    vettingScore: 89.0,
    vettingRank: '2nd in Vetting',
    academicStatus: 'Statutory Clearance (CWA: 68.7)',
    disciplinaryStatus: 'Clear / Zero Infractions',
    experience: 'Faculty of Social Sciences Rep',
    policies: {
      wifi: 'Campus-wide high-speed cloud storage for student project submissions and research repositories.',
      housing: 'Hostel tenant emergency hotline and direct mediation committee with landlords.',
      transit: 'Safe bicycle and e-scooter designated lanes on key ring roads.',
      welfare: 'Food security initiative: Subsidized pantry staples and hall dining hall discounts.'
    }
  },

  // General Secretary (Unopposed)
  'cand-006': {
    name: 'Akua Mansa Sarfo',
    position: 'General Secretary',
    slate: 'Independent',
    vettingScore: 95.0,
    vettingRank: 'Unopposed Clearance (95%)',
    academicStatus: 'Statutory Clearance (CWA: 76.5)',
    disciplinaryStatus: 'Clear / Zero Infractions',
    experience: 'SRC Deputy General Secretary, Debate Society President',
    policies: {
      wifi: 'Fully paperless digital General Assembly portal with public minute releases within 48 hours.',
      housing: 'Public repository of verified off-campus accredited hostels with real student reviews.',
      transit: 'Digital transit schedule updates broadcast directly on the AIM app dashboard.',
      welfare: 'Automated digital student petition platform with mandatory EC response thresholds.'
    }
  }
};

export default function CandidateComparisonModal({
  isOpen,
  onClose,
  position = 'President',
  candidates = [],
  selectedCandidateId,
  onSelectCandidate
}) {
  const [activeTab, setActiveTab] = useState('policies'); // 'policies' | 'vetting'

  if (!isOpen) return null;

  // Filter or match candidates for this position
  const currentCandidates = candidates.length > 0
    ? candidates
    : [
        { candidate_id: 'cand-001', full_name: 'Emmanuel Ampofo', photo_url: '/candidates/emmanuel_ampofo.jpg' },
        { candidate_id: 'cand-002', full_name: 'Abena Koduah', photo_url: '/candidates/abena_koduah.jpg' },
        { candidate_id: 'cand-003', full_name: 'Kofi Mensah', photo_url: '/candidates/kofi_mensah.jpg' },
      ];

  // Resolve dossier entries for the candidates
  const candidateDossiers = currentCandidates.map(cand => {
    const matched = CANDIDATE_DOSSIERS[cand.candidate_id] || {
      name: cand.full_name,
      position: position,
      slate: cand.slate || 'Independent Coalition',
      vettingScore: 90.0,
      vettingRank: 'Statutory Approved',
      academicStatus: 'Statutory Clearance (CWA: Verified ≥ 60.0)',
      disciplinaryStatus: 'Clear / Zero Infractions',
      experience: 'Verified Student Leadership Service',
      policies: {
        wifi: 'Upgrade campus digital access points and university-wide portal stability.',
        housing: 'Advocate for transparent hostel pricing and student safety agreements.',
        transit: 'Improve morning and evening shuttle frequency to student residential hubs.',
        welfare: 'Support welfare grants and academic assistance programs for all students.'
      }
    };
    return {
      ...cand,
      dossier: matched
    };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-[#007A4D] dark:text-emerald-400 flex items-center justify-center border border-emerald-300 dark:border-emerald-800 shadow-sm shrink-0">
              <Scale size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  Candidate Policy &amp; Vetting Dossier
                </h2>
                <span className="bg-[#007A4D] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                  {position}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium m-0 mt-0.5">
                Official Electoral Commission comparative evaluation for informed voter choice
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setActiveTab('policies')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === 'policies'
                ? 'bg-[#007A4D] text-white border-[#007A4D] shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            📋 Policy Manifestos Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vetting')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
              activeTab === 'vetting'
                ? 'bg-[#007A4D] text-white border-[#007A4D] shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            🛡️ EC Vetting Scores &amp; Clearance
          </button>
        </div>

        {/* Body Matrix (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Candidates Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {candidateDossiers.map(item => {
              const isSelected = selectedCandidateId === item.candidate_id;
              return (
                <div
                  key={item.candidate_id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CandidateAvatar
                      src={item.photo_url}
                      name={item.full_name}
                      sizeClass="w-14 h-14"
                      textSizeClass="text-base"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-wider block">
                        {item.dossier.slate}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate m-0">
                        {item.full_name}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block truncate">
                        {item.dossier.runningMate || `${position} Nominee`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Award size={15} className="text-[#D4AF37]" />
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        {item.dossier.vettingScore}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        Vetting
                      </span>
                    </div>

                    {onSelectCandidate && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectCandidate(position, item.candidate_id);
                          onClose();
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-[#007A4D] hover:text-white hover:border-[#007A4D]'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Vote This Candidate'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* TAB 1: Policy Manifestos Comparison Matrix */}
          {activeTab === 'policies' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 m-0">
                  Key Policy Domains Comparison
                </h3>
              </div>

              {/* Policy Category 1: Wi-Fi & Infrastructure */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400">
                    <Wifi size={16} />
                  </div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white m-0">
                    Wi-Fi &amp; Digital Campus Infrastructure
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {candidateDossiers.map(c => (
                    <div key={c.candidate_id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{c.full_name}</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed m-0">
                        {c.dossier.policies.wifi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Category 2: Hostel Price Regulation */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400">
                    <Building size={16} />
                  </div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white m-0">
                    Hostel Price Regulation &amp; Accommodation
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {candidateDossiers.map(c => (
                    <div key={c.candidate_id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{c.full_name}</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed m-0">
                        {c.dossier.policies.housing}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Category 3: Campus Shuttles & Transport */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400">
                    <Bus size={16} />
                  </div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white m-0">
                    Campus Shuttles &amp; Night Safety Corridors
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {candidateDossiers.map(c => (
                    <div key={c.candidate_id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{c.full_name}</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed m-0">
                        {c.dossier.policies.transit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Category 4: Bursaries & Student Welfare */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-400">
                    <Coins size={16} />
                  </div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white m-0">
                    Bursaries, Emergency Aid &amp; Student Welfare
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {candidateDossiers.map(c => (
                    <div key={c.candidate_id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{c.full_name}</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed m-0">
                        {c.dossier.policies.welfare}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EC Vetting Scores & Clearance Records */}
          {activeTab === 'vetting' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3">
                <ShieldCheck size={20} className="text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-xs text-amber-900 dark:text-amber-200 font-medium m-0">
                  Official statutory vetting conducted by the <strong>KNUST Electoral Commission Vetting Committee</strong> in accordance with Article 16 of the SRC Constitution.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {candidateDossiers.map(c => (
                  <div
                    key={c.candidate_id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black uppercase text-slate-800 dark:text-white">
                          {c.full_name}
                        </span>
                        <span className="text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-lg">
                          {c.dossier.vettingScore}%
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Academic Standing</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                            {c.dossier.academicStatus}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Disciplinary Record</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                            <ShieldCheck size={13} className="text-emerald-600 dark:text-emerald-400" />
                            {c.dossier.disciplinaryStatus}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Prior Leadership Service</span>
                          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block mt-0.5">
                            {c.dossier.experience}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                      <span>Rank:</span>
                      <span className="text-[#007A4D] dark:text-emerald-400 font-extrabold">{c.dossier.vettingRank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-850/90 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            💡 Compare manifestos thoroughly to choose the candidate who best represents your priorities.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#007A4D] hover:bg-[#075C42] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border-none shadow-sm"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
}
