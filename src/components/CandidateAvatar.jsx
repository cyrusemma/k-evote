import React, { useState } from 'react';

export default function CandidateAvatar({ src, name, sizeClass = "w-16 h-16", textSizeClass = "text-xl" }) {
  const [imgError, setImgError] = useState(false);
  const initials = (name || 'Candidate')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Candidate')}&background=004D40&color=ffffff&bold=true&size=256`;

  return (
    <div className={`${sizeClass} rounded-full overflow-hidden bg-[#004D40] text-white flex items-center justify-center ${textSizeClass} font-bold flex-shrink-0 ring-2 ring-gray-100 dark:ring-slate-700 shadow-sm select-none`}>
      {!imgError && src ? (
        <img
          src={src}
          alt={name || 'Candidate'}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          src={fallbackUrl}
          alt={name || 'Candidate'}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
