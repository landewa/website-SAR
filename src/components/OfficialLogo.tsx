import React from 'react';

interface OfficialLogoProps {
  className?: string;
  size?: number;
  withText?: boolean;
}

export const OfficialLogo: React.FC<OfficialLogoProps> = ({
  className = '',
  size = 40,
  withText = false,
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        style={{ width: size, height: size }}
        className="shrink-0 flex items-center justify-center relative"
      >
        <img
          src="/logo-sar.png"
          alt="Official SAADA Reserve Logo"
          className="w-full h-full object-contain rounded-full drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)]"
          onError={(e) => {
            // Graceful fallback display if file is awaiting placement in /public
            const target = e.currentTarget;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.logo-fallback')) {
              const fallback = document.createElement('div');
              fallback.className = 'logo-fallback w-full h-full rounded-lg border border-amber-500/40 bg-slate-950 flex items-center justify-center font-display font-bold text-amber-400 text-xs';
              fallback.innerText = 'SAR';
              parent.appendChild(fallback);
            }
          }}
        />
      </div>

      {withText && (
        <div className="flex flex-col select-none">
          <span className="font-display font-extrabold tracking-wider text-white text-base leading-tight">
            SAADA
          </span>
          <span className="font-mono text-[9px] tracking-[0.25em] text-amber-400 uppercase font-semibold">
            RESERVE
          </span>
        </div>
      )}
    </div>
  );
};
