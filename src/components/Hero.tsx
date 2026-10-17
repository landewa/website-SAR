import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ArrowRight, ShieldCheck, Database, Layers, Cpu } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import { CONTRACT_ADDRESS, BSCSCAN_TOKEN_URL } from '../services/blockchain';
import { Coin3D } from './Coin3D';

interface HeroProps {
  lang: Language;
  onOpenWhitepaper: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onOpenWhitepaper }) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang].hero;

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Architectural Mesh & Ambience */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
        <img
          src="/src/assets/images/hero_cinematic_vault_1792215134506.jpg"
          alt="SAADA Reserve Vault Ambience"
          className="w-full h-full object-cover object-center filter saturate-50 brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050811] via-[#050811]/90 to-[#050811]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Proposition, Copy, CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            {/* Quiet Unboxed Kicker (Anti-slop zero-pill) */}
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-wide">
              <span>BNB Smart Chain Mainnet</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Chain ID: 56</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>BEP-20 Standard</span>
            </div>

            {/* Display Headline */}
            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                <span className="text-gold-gradient">{t.title}</span>
              </h1>
              <p className="text-lg sm:text-xl font-medium text-slate-300">
                {t.subtitle}
              </p>
            </div>

            {/* Body Description */}
            <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
              {t.description}
            </p>

            {/* Interactive Contract Bar */}
            <div className="p-3 bg-[#090E1C] border border-slate-800 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 max-w-xl">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider shrink-0">
                  Contract:
                </span>
                <span className="text-xs font-mono text-amber-300/90 truncate select-all">
                  {CONTRACT_ADDRESS}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#token"
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                <span>{t.exploreCta}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={BSCSCAN_TOKEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
              >
                <span>{t.contractCta}</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>

              <button
                onClick={onOpenWhitepaper}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
              >
                <span>{t.whitepaperCta}</span>
              </button>
            </div>
          </div>

          {/* Right Column: 3D SAR Coin */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <Coin3D lang={lang} />
            <a
              href="#purpose"
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all shadow-sm hover:shadow-amber-500/10"
            >
              <span>{lang === 'id' ? 'Lihat Narasi Tujuan SAR ↓' : 'The Purpose of SAR Narrative ↓'}</span>
            </a>
          </div>
        </div>

        {/* 4-Item KPI Strip Below Hero Split */}
        <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Database className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.statTargetSupply}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {t.statTargetSupplyVal}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Architectural Specification</div>
          </div>

          <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.statChain}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {t.statChainVal}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Chain ID: 56 · Mainnet</div>
          </div>

          <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.statStandard}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {t.statStandardVal}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">18 Decimals · High Throughput</div>
          </div>

          <div className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.statAuditStatus}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-400">
              {t.statAuditStatusVal}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Target vs On-Chain Segregation</div>
          </div>
        </div>
      </div>
    </section>
  );
};
