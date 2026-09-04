import React, { useState, useEffect } from 'react';
import {
  Activity,
  Radio,
  Users,
  Vote,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  GraduationCap,
  Sparkles,
  ArrowUpRight,
  RefreshCw,
  Eye,
  ChevronRight,
  Filter
} from 'lucide-react';

const CONSTITUENCIES_DATA = [
  {
    id: 'ayeduase',
    name: 'Ayeduase Off-Campus Constituency',
    type: 'OFF_CAMPUS',
    registered: 18400,
    baseVotes: 14058,
    turnoutPct: 76.4,
    status: 'SURGE_ACTIVE',
    peakWait: '4 mins',
    velocity: '+142 votes/hr',
    topHostels: ['Frontline', 'Welfare', 'Beacon', 'Evandy'],
    color: '#007A4D'
  },
  {
    id: 'kotei_gaza',
    name: 'Kotei / Gaza Outpost Constituency',
    type: 'OFF_CAMPUS',
    registered: 14200,
    baseVotes: 10195,
    turnoutPct: 71.8,
    status: 'STEADY',
    peakWait: '3 mins',
    velocity: '+110 votes/hr',
    topHostels: ['Gaza High Rise', 'Victory Towers', 'Nyberg', 'Prestige'],
    color: '#0284C7'
  },
  {
    id: 'campus_halls',
    name: 'Campus Residential Halls (Unity, Queens, Katanga, Independence, Conti)',
    type: 'HALLS',
    registered: 12800,
    baseVotes: 10816,
    turnoutPct: 84.5,
    status: 'HIGH_TURNOUT',
    peakWait: '2 mins',
    velocity: '+98 votes/hr',
    topHostels: ['Unity Hall (Conti)', 'University Hall (Katanga)', 'Queen Elizabeth II', 'Africa Hall'],
    color: '#8B5CF6'
  },
  {
    id: 'engineering',
    name: 'College of Engineering & Science Complex',
    type: 'COLLEGE',
    registered: 9600,
    baseVotes: 7603,
    turnoutPct: 79.2,
    status: 'STEADY',
    peakWait: '3 mins',
    velocity: '+74 votes/hr',
    topHostels: ['Petroleum Building Hub', 'Electrical Lab Cluster', 'CABE Courtyard'],
    color: '#D97706'
  },
  {
    id: 'bomso_kentinkrono',
    name: 'Bomso & Kentinkrono Outposts',
    type: 'OFF_CAMPUS',
    registered: 8400,
    baseVotes: 5745,
    turnoutPct: 68.4,
    status: 'STEADY',
    peakWait: '2 mins',
    velocity: '+52 votes/hr',
    topHostels: ['Shalom', 'Crystal', 'White House', 'De-Luxe'],
    color: '#EC4899'
  },
  {
    id: 'brunei',
    name: 'Brunei Complex & Commercial Area',
    type: 'HALLS',
    registered: 5000,
    baseVotes: 4050,
    turnoutPct: 81.0,
    status: 'HIGH_TURNOUT',
    peakWait: '1 min',
    velocity: '+40 votes/hr',
    topHostels: ['Brunei Complex A, B, C', 'Commercial Quarters'],
    color: '#10B981'
  }
];

const HOURLY_VELOCITY = [
  { time: '07:00', label: 'Polls Open', count: 1840, height: 18 },
  { time: '09:00', label: 'Morning Surge', count: 7200, height: 55 },
  { time: '11:00', label: 'Mid-Morning', count: 11400, height: 75 },
  { time: '13:00', label: 'Lunch Peak', count: 14200, height: 92 },
  { time: '15:00', label: 'Afternoon Rush', count: 12100, height: 82 },
  { time: '17:00 (NOW)', label: 'Final Hours', count: 5727, height: 60, current: true },
];

export default function ElectionNightCenter({ navigate }) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'OFF_CAMPUS' | 'HALLS' | 'COLLEGE'
  const [pulseIncrement, setPulseIncrement] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Realistic live telemetry ticker pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIncrement(prev => prev + Math.floor(Math.random() * 3) + 1);
      setLastUpdated(new Date());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalRegistered = 68400;
  const baseTotalVotes = 52467;
  const currentTotalVotes = baseTotalVotes + pulseIncrement;
  const currentTurnoutPct = ((currentTotalVotes / totalRegistered) * 100).toFixed(1);

  const filteredConstituencies = CONSTITUENCIES_DATA.filter(c => {
    if (filterType === 'ALL') return true;
    return c.type === filterType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── Top Broadcast Command Header ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#072B1E] to-slate-900 text-white p-6 sm:p-8 border border-emerald-500/20 shadow-2xl">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                <Radio size={14} className="text-rose-400" />
                LIVE ELECTION NIGHT COMMAND CENTER
              </span>
              <span className="text-xs text-slate-400 font-mono">
                KNUST GENERAL ELECTIONS 2026
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white m-0">
              Campus-Wide Turnout &amp; Constituency Telemetry
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl m-0 leading-relaxed">
              Real-time cryptographic voter throughput across all 6 campus constituencies, student residential halls, and off-campus outposts.
            </p>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex flex-wrap md:flex-col lg:flex-row gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 px-4 border border-white/10 flex items-center gap-3">
              <Vote size={24} className="text-emerald-400" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Ballots Cast</span>
                <span className="text-xl font-black text-white font-mono tracking-wider">
                  {currentTotalVotes.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 px-4 border border-white/10 flex items-center gap-3">
              <TrendingUp size={24} className="text-[#D4AF37]" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Overall Turnout</span>
                <span className="text-xl font-black text-[#D4AF37] font-mono tracking-wider">
                  {currentTurnoutPct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Realtime Telemetry Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-emerald-400 font-bold">TELEMETRY ACTIVE:</span>
            <span>AES-256 Encrypted Node Streams</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-400">
            <span>Registered Voters: <strong className="text-white">68,400</strong></span>
            <span>•</span>
            <span>Zero-Knowledge Proofs: <strong className="text-emerald-400">100% VALID</strong></span>
            <span>•</span>
            <span>Sync: <strong className="text-slate-200">{lastUpdated.toLocaleTimeString()}</strong></span>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Overview Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Eligible Registered</span>
            <Users size={18} className="text-slate-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">68,400</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
              100% Bio-Verified Active
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Votes In Vault</span>
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#007A4D] dark:text-emerald-400 font-mono">
              {currentTotalVotes.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
              Across all 3 election tiers
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Hourly Velocity</span>
            <Activity size={18} className="text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">4,120</span>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block mt-0.5">
              Votes processed per hour
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Integrity Score</span>
            <CheckCircle2 size={18} className="text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">100.0%</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mt-0.5">
              Zero hash collisions
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard: Constituency Map Grid & Velocity Curve ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Constituency Heatmap Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white m-0">
                Constituency Turnout Heatmap
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 m-0 mt-0.5">
                Breakdown by geographic voter jurisdiction &amp; off-campus communities
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  filterType === 'ALL'
                    ? 'bg-[#007A4D] text-white border-[#007A4D]'
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                }`}
              >
                All (6)
              </button>
              <button
                type="button"
                onClick={() => setFilterType('OFF_CAMPUS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  filterType === 'OFF_CAMPUS'
                    ? 'bg-[#007A4D] text-white border-[#007A4D]'
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                }`}
              >
                Off-Campus Hostels
              </button>
              <button
                type="button"
                onClick={() => setFilterType('HALLS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  filterType === 'HALLS'
                    ? 'bg-[#007A4D] text-white border-[#007A4D]'
                    : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                }`}
              >
                Residential Halls
              </button>
            </div>
          </div>

          {/* Constituency Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredConstituencies.map(item => {
              const liveVotes = item.baseVotes + Math.floor(pulseIncrement / 6);
              const liveTurnout = ((liveVotes / item.registered) * 100).toFixed(1);

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 transition-all shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                          {item.type.replace('_', ' ')}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white m-0">
                          {item.name}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shrink-0 ${
                        item.status === 'HIGH_TURNOUT'
                          ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300'
                          : item.status === 'SURGE_ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Progress Bar & Percentage */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Turnout Progress</span>
                        <span className="text-slate-900 dark:text-white font-mono font-black">{liveTurnout}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, liveTurnout)}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">Ballots Cast</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {liveVotes.toLocaleString()} / {item.registered.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block font-bold">Avg Wait</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {item.peakWait} (Virtual Queue)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Representative Hostels Tag */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 truncate">
                      Hubs: {item.topHostels.slice(0, 2).join(', ')}...
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      {item.velocity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Hourly Voting Velocity & Demographics */}
        <div className="space-y-6">
          {/* Hourly Velocity Curve */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white m-0">
                  Voting Velocity Curve
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 m-0">Hourly turnout throughput</p>
              </div>
              <Clock size={16} className="text-slate-400" />
            </div>

            {/* Simplified Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-36 pt-4 px-1 border-b border-slate-200 dark:border-slate-700">
              {HOURLY_VELOCITY.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20">
                    {bar.count.toLocaleString()} votes
                  </div>
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      bar.current
                        ? 'bg-emerald-500 animate-pulse'
                        : 'bg-[#007A4D]/80 hover:bg-[#007A4D]'
                    }`}
                    style={{ height: `${bar.height}%` }}
                  />
                  <span className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-tighter">
                    {bar.time.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Peak surge: <strong>13:00 (Lunch)</strong></span>
              <span className="text-emerald-600 font-bold">14,200/hr max</span>
            </div>
          </div>

          {/* Academic Level Demographics */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white m-0 mb-1">
              Class Year Participation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 m-0 mb-4">
              Voter mobilization by undergraduate cohort
            </p>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Level 100 (Freshmen)</span>
                  <span className="font-mono text-emerald-600 font-black">88.4%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Level 200 (Sophomores)</span>
                  <span className="font-mono text-blue-600 font-black">82.1%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '82.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Level 300 (Penultimate)</span>
                  <span className="font-mono text-amber-600 font-black">75.6%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '75.6%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Level 400 (Finalists)</span>
                  <span className="font-mono text-purple-600 font-black">71.2%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '71.2%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 dark:from-emerald-950/40 dark:to-slate-800 border border-emerald-200 dark:border-emerald-800/60 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#007A4D] dark:text-emerald-400 font-bold text-xs">
              <Sparkles size={16} />
              <span>Election Navigation Shortcuts</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => navigate('/secure-vote')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Vote size={14} />
                <span>Cast Ballot</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/candidate-agent')}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Eye size={14} />
                <span>Observer Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
