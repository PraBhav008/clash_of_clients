import React, { useState } from 'react';

interface ClientAvatarProps {
  src?: string;
  name: string;
  company?: string;
  className?: string;
}

export const ClientAvatar: React.FC<ClientAvatarProps> = ({
  src,
  name,
  company,
  className = 'w-10 h-10 rounded-xl'
}) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasError = Boolean(src && failedSrc === src);

  const label = (company || name || '?').trim();
  const initials = label
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('') || '?';

  if (!src || hasError) {
    return (
      <div
        aria-label={name || company}
        className={`${className} bg-gradient-to-br from-[#1B253B] to-[#0E1422] border border-[#2C3A57] flex items-center justify-center font-heading font-bold text-xs text-cyan-300 select-none shrink-0`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || company || 'Client'}
      onError={() => setFailedSrc(src)}
      className={`${className} object-cover border border-[#232D42] shrink-0`}
    />
  );
};
