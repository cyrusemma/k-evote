import React from 'react';

/**
 * Universal Base Shimmer Block Component
 */
export function Skeleton({ className = '', variant = 'rectangular', width, height, style = {} }) {
  const baseClasses = 'relative overflow-hidden bg-slate-200/80 dark:bg-slate-800/80 sv-shimmer-sweep';
  
  const variantClasses = {
    circular: 'rounded-full',
    rounded: 'rounded-2xl',
    pill: 'rounded-full',
    text: 'rounded-md my-1 h-4',
    rectangular: 'rounded-xl'
  }[variant] || 'rounded-xl';

  const inlineStyles = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${className}`} 
      style={inlineStyles}
      aria-hidden="true"
    />
  );
}

/**
 * Digital Student Identity Card Skeleton
 */
export function StudentCardSkeleton() {
  return (
    <div className="knust-student-card mb-6 p-6 rounded-3xl bg-slate-800/90 border border-slate-700/60 shadow-xl overflow-hidden relative">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <Skeleton variant="rounded" className="w-16 h-16 shrink-0 !bg-slate-700/70" />
          <div className="space-y-2">
            <Skeleton variant="text" className="w-32 h-3 !bg-slate-700/60" />
            <Skeleton variant="text" className="w-48 h-7 !bg-slate-700/80" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton variant="pill" className="w-24 h-5 !bg-slate-700/50" />
              <Skeleton variant="pill" className="w-32 h-5 !bg-slate-700/50" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Skeleton variant="rounded" className="w-32 h-12 !bg-slate-700/60" />
          <Skeleton variant="rounded" className="w-36 h-12 !bg-slate-700/60" />
        </div>
      </div>
    </div>
  );
}

/**
 * Dashboard Election Card Skeleton
 */
export function ElectionCardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton variant="pill" className="w-24 h-6" />
              <Skeleton variant="circular" className="w-8 h-8" />
            </div>
            <Skeleton variant="text" className="w-3/4 h-6" />
            <Skeleton variant="text" className="w-full h-4" />
            <Skeleton variant="text" className="w-2/3 h-4" />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" className="w-6 h-6" />
              <Skeleton variant="text" className="w-20 h-4" />
            </div>
            <Skeleton variant="rounded" className="w-24 h-9" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Candidate Dossier Card Skeleton
 */
export function CandidateCardSkeleton({ count = 2 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4"
        >
          <div className="flex items-center gap-3.5">
            <Skeleton variant="circular" className="w-14 h-14 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton variant="text" className="w-4/5 h-5" />
              <Skeleton variant="text" className="w-1/2 h-3.5" />
            </div>
          </div>
          
          <Skeleton variant="rounded" className="w-full h-16" />

          <div className="flex items-center justify-between pt-2">
            <Skeleton variant="pill" className="w-20 h-5" />
            <Skeleton variant="rounded" className="w-28 h-9" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Telemetry & Key Metrics Grid Skeleton
 */
export function TelemetryStatSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton variant="text" className="w-20 h-3.5" />
            <Skeleton variant="circular" className="w-5 h-5" />
          </div>
          <Skeleton variant="text" className="w-28 h-7" />
          <Skeleton variant="text" className="w-36 h-3" />
        </div>
      ))}
    </div>
  );
}

/**
 * Cryptographic Audit Logs / Ledger Rows Skeleton
 */
export function AuditLogSkeleton({ count = 4 }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60"
        >
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="w-7 h-7 shrink-0" />
            <div className="space-y-1">
              <Skeleton variant="text" className="w-32 h-4" />
              <Skeleton variant="text" className="w-48 h-3" />
            </div>
          </div>
          <Skeleton variant="pill" className="w-20 h-6" />
        </div>
      ))}
    </div>
  );
}

/**
 * Election Results Breakdown Skeleton
 */
export function ResultsPortalSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Banner Skeleton */}
      <div className="p-6 rounded-3xl bg-slate-800 border border-slate-700 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <Skeleton variant="pill" className="w-28 h-5 !bg-slate-700/70" />
            <Skeleton variant="text" className="w-72 h-8 !bg-slate-700/90" />
            <Skeleton variant="text" className="w-96 h-4 !bg-slate-700/60" />
          </div>
          <div className="flex gap-3">
            <Skeleton variant="rounded" className="w-32 h-14 !bg-slate-700/80" />
            <Skeleton variant="rounded" className="w-32 h-14 !bg-slate-700/80" />
          </div>
        </div>
      </div>

      {/* Results Category Card Skeleton */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <Skeleton variant="text" className="w-40 h-6" />
          <Skeleton variant="pill" className="w-24 h-6" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" className="w-10 h-10" />
                  <div className="space-y-1">
                    <Skeleton variant="text" className="w-36 h-4" />
                    <Skeleton variant="text" className="w-24 h-3" />
                  </div>
                </div>
                <Skeleton variant="text" className="w-16 h-5" />
              </div>
              <Skeleton variant="pill" className="w-full h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
