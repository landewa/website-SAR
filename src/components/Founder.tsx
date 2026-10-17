import React from 'react';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import { Send, Twitter, Globe, ShieldCheck, Quote, CheckCircle2 } from 'lucide-react';
import { OfficialLogo } from './OfficialLogo';

interface FounderProps {
  lang: Language;
}

export const Founder: React.FC<FounderProps> = ({ lang }) => {
  const t = translations[lang].founder;

  return (
    <section id="founder" className="py-24 border-t border-slate-800/80 bg-[#060913] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -z-10 w-96 h-96 rounded-full bg-amber-500/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 -z-10 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500">
            Leadership & Stewardship
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {t.sectionTitle}
          </h2>
          <p className="text-base text-slate-400 max-w-2xl">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Founder Showcase Card */}
        <div className="rounded-3xl bg-gradient-to-b from-[#090E1F] to-[#070B16] border border-amber-500/30 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-12">
            
            {/* Left Column: Official Founder Portrait Frame */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 group">
                {/* Official Founder Photograph */}
                <img
                  src="/founder-zulfakkar.png"
                  alt="Zulfakkar - Founder & Vision Holder of SAADA Reserve"
                  className="w-full h-full object-contain bg-[#0a0e1c] transition-transform duration-700 group-hover:scale-102"
                />
              </div>

              {/* Sub-label under photo */}
              <div className="mt-3 text-[11px] font-mono text-slate-500 text-center flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.verifiedFounder}</span>
              </div>
            </div>

            {/* Right Column: Founder Vision & Architectural Message */}
            <div className="lg:col-span-7 space-y-6">
              {/* Organization & Title lockup */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-widest uppercase">
                  <OfficialLogo size={20} />
                  <span>SAADA RESERVE · FOUNDER & VISION HOLDER</span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  ZULFAKKAR
                </h3>
                <p className="text-sm font-semibold text-amber-300 font-mono">
                  {t.titleRole}
                </p>
              </div>

              {/* Core Quote Box */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 relative">
                <Quote className="w-8 h-8 text-amber-500/20 absolute top-4 right-4" />
                <div className="text-base sm:text-lg font-medium text-slate-200 leading-relaxed italic">
                  "{t.visionStatement}"
                </div>
                <div className="text-xs font-mono text-amber-400/90 pt-1">
                  — Zulfakkar, Founder & Vision Holder
                </div>
              </div>

              {/* Detailed Personal Narrative / Stewardship Philosophy */}
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>{t.bioParagraph1}</p>
                <p className="text-slate-400">{t.bioParagraph2}</p>
              </div>

              {/* 4 Official Community Channels from the Official Poster */}
              <div className="pt-4 border-t border-slate-800/80">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
                  {t.officialChannels}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <a
                    href="https://saadareserve.com/"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">Official Site</span>
                  </a>

                  <a
                    href="https://t.me/saadareserve"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="truncate">Telegram</span>
                  </a>

                  <a
                    href="https://x.com/saadareserve"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Twitter className="w-4 h-4 text-slate-300 shrink-0" />
                    <span className="truncate">@SAADARESERVE</span>
                  </a>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">BSC Mainnet</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
