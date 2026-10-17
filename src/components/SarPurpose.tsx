import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import { Coin3D } from './Coin3D';
import { 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  Globe2, 
  Play, 
  Pause, 
  ChevronRight,
  CheckCircle2,
  Compass
} from 'lucide-react';

interface SarPurposeProps {
  lang: Language;
}

export const SarPurpose: React.FC<SarPurposeProps> = ({ lang }) => {
  const t = translations[lang].purpose;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const narrativeItems = [
    {
      id: 0,
      number: t.narrative01Number,
      title: t.narrative01Title,
      body: t.narrative01Body,
      icon: Compass,
      tag: lang === 'id' ? 'Visi Inti' : 'Core Vision',
      highlight: lang === 'id' ? 'Penghubung Digital & Fisik' : 'Digital & Real Bridge',
    },
    {
      id: 1,
      number: t.narrative02Number,
      title: t.narrative02Title,
      body: t.narrative02Body,
      icon: Building2,
      tag: lang === 'id' ? 'Utilitas Nyata' : 'Real Utility',
      highlight: lang === 'id' ? 'Penyelesaian Merchant & Smart City' : 'Merchant & Smart City Settlement',
    },
    {
      id: 2,
      number: t.narrative03Number,
      title: t.narrative03Title,
      body: t.narrative03Body,
      icon: ShieldCheck,
      tag: lang === 'id' ? 'Stabilitas Nilai' : 'Value Stability',
      highlight: lang === 'id' ? 'Target 100M & Multi-Sig Governance' : 'Target 100M & Multi-Sig Governance',
    },
    {
      id: 3,
      number: t.narrative04Number,
      title: t.narrative04Title,
      body: t.narrative04Body,
      icon: Globe2,
      tag: lang === 'id' ? 'Masa Depan' : 'Horizon',
      highlight: lang === 'id' ? 'Jaringan Finansial Terbuka di BSC' : 'Open Financial Network on BSC',
    },
  ];

  // Sequential top-to-bottom auto-cycling
  useEffect(() => {
    if (!isPlaying || reducedMotion) return;

    timerRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % narrativeItems.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, reducedMotion, narrativeItems.length]);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    // User manual interaction pauses briefly or allows continued flow
  };

  return (
    <section 
      id="purpose" 
      className="relative py-20 lg:py-28 overflow-hidden bg-[#050811] border-t border-b border-slate-800/80"
    >
      {/* Background Architectural Ambience */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.06),rgba(255,255,255,0))]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/25 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.sectionBadge}</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            <span className="text-gold-gradient">{t.sectionTitle}</span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-400 leading-relaxed">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Main 2-Column Presentation: Desktop Side-by-Side, Mobile Stacked Vertically */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Column A: Interactive 3D SAR Coin */}
          <div className="lg:col-span-5 order-1 lg:order-1 flex flex-col items-center">
            <div className="relative w-full max-w-[420px] rounded-2xl bg-gradient-to-b from-slate-900/60 to-[#070B16] border border-amber-500/20 p-4 sm:p-6 shadow-2xl shadow-amber-500/5 backdrop-blur-sm">
              {/* Corner Ornamental Accents */}
              <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-amber-500/60" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-amber-500/60" />
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-amber-500/60" />
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-amber-500/60" />

              {/* Real-Time 3D Rotating Coin */}
              <div className="w-full flex items-center justify-center">
                <Coin3D lang={lang} />
              </div>

              {/* Subtle Coin Caption & Specification */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-400/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>SAR BEP-20</span>
                </span>
                <span className="text-slate-500">Chain ID: 56</span>
              </div>
            </div>
            
            <p className="mt-3 text-xs text-slate-500 text-center font-mono">
              {t.coinCaption}
            </p>
          </div>

          {/* Column B: Sequential Animated Narrative Beside the Coin */}
          <div className="lg:col-span-7 order-2 lg:order-2 space-y-4">
            
            {/* Interactive Control Bar for Sequential Flow */}
            <div className="flex items-center justify-between gap-3 pb-2 text-xs text-slate-400">
              <span className="font-mono text-[11px] text-amber-400/80 uppercase tracking-wider">
                {t.interactiveHint}
              </span>

              {!reducedMotion && (
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 transition-colors shrink-0"
                  title={isPlaying ? 'Pause Auto Flow' : 'Play Auto Flow'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 text-amber-400" />
                      <span className="text-[11px] font-mono">{t.autoPlayLabel}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-amber-400" />
                      <span className="text-[11px] font-mono">{t.autoPlayLabel}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Narrative Cards: Sequentially animated top-to-bottom with subtle opacity & vertical translation */}
            <div className="space-y-3.5" role="list">
              {narrativeItems.map((item, idx) => {
                const isActive = activeIndex === idx;
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(idx)}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelect(idx);
                      }
                    }}
                    className={`group relative p-5 rounded-xl border transition-all cursor-pointer ${
                      reducedMotion 
                        ? '' 
                        : 'transition-all duration-500 ease-out transform'
                    } ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/[0.12] via-slate-900/95 to-slate-900/90 border-amber-500/60 shadow-lg shadow-amber-500/10 -translate-y-0.5'
                        : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {/* Left Active Indicator Bar */}
                    <div 
                      className={`absolute left-0 top-3 bottom-3 w-1 rounded-r transition-all duration-300 ${
                        isActive ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]' : 'bg-transparent'
                      }`} 
                    />

                    <div className="flex items-start gap-4">
                      {/* Icon Container */}
                      <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-amber-400 text-slate-950 font-bold' 
                          : 'bg-slate-800/90 text-amber-400 group-hover:bg-slate-800'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Number & Tag Header */}
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
                            {item.number}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            isActive 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                              : 'bg-slate-800/80 text-slate-400'
                          }`}>
                            {item.tag}
                          </span>
                        </div>

                        {/* Narrative Title */}
                        <h3 className={`font-display text-base sm:text-lg font-bold tracking-tight transition-colors ${
                          isActive ? 'text-white' : 'text-slate-200'
                        }`}>
                          {item.title}
                        </h3>

                        {/* Narrative Body Text */}
                        <p className="mt-1.5 text-sm text-slate-300/90 leading-relaxed">
                          {item.body}
                        </p>

                        {/* Active Highlight Detail */}
                        {isActive && (
                          <div className={`mt-3 pt-2.5 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono text-amber-300/90 ${
                            reducedMotion ? '' : 'animate-fadeIn'
                          }`}>
                            <span className="flex items-center gap-1.5">
                              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                              <span>{item.highlight}</span>
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {idx + 1} of {narrativeItems.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Micro-Progress Bar for Active Narrative Item */}
            {!reducedMotion && (
              <div className="pt-2 flex items-center gap-2">
                {narrativeItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className="flex-1 h-1 rounded-full overflow-hidden bg-slate-800/80 hover:bg-slate-700 transition-colors"
                    title={`Jump to item 0${i + 1}`}
                  >
                    <div 
                      className={`h-full transition-all duration-500 ${
                        activeIndex === i 
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 w-full' 
                          : activeIndex > i 
                            ? 'bg-amber-500/40 w-full' 
                            : 'w-0'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </section>
  );
};
