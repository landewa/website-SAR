import React, { useState } from 'react';
import { Copy, Check, ExternalLink, RefreshCw, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language, OnChainData } from '../types';
import { CONTRACT_ADDRESS, CHAIN_ID, BSCSCAN_TOKEN_URL, BSCSCAN_CONTRACT_URL, TARGET_SUPPLY } from '../services/blockchain';

interface TokenOverviewProps {
  lang: Language;
  onChainData: OnChainData;
  isLoadingRpc: boolean;
  onRefreshRpc: () => void;
}

export const TokenOverview: React.FC<TokenOverviewProps> = ({
  lang,
  onChainData,
  isLoadingRpc,
  onRefreshRpc,
}) => {
  const [copied, setCopied] = useState(false);
  const t = translations[lang].token;

  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="token" className="py-20 border-t border-slate-800/80 bg-[#070B14]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500">
            Audit & Transparency
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {t.sectionTitle}
          </h2>
          <p className="text-base text-slate-400 max-w-3xl">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Critical Transparency Callout Card (No thick border slop, elegant surface contrast) */}
        <div className="p-6 rounded-2xl bg-[#090E1F] border border-amber-500/25 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">
                {t.targetVsActualTitle}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t.targetVsActualNotice}
              </p>
            </div>
          </div>
        </div>

        {/* Triple Supply Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Target Supply */}
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                1. Architectural Target
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Specification
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {TARGET_SUPPLY.toLocaleString('en-US')} SAR
              </div>
              <div className="text-sm font-semibold text-amber-400">
                {t.targetSupplyLabel}
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              {t.targetSupplyDesc}
            </p>
          </div>

          {/* Card 2: On-chain Total Supply */}
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                2. On-Chain State
              </span>
              <div className="flex items-center gap-1.5">
                {onChainData.status === 'Verified' ? (
                  <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{t.statusVerified}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    <HelpCircle className="w-3 h-3 text-amber-400" />
                    <span>{t.statusVerificationPending}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {onChainData.onChainSupply ? onChainData.onChainSupply : 'Verification Pending'}
              </div>
              <div className="text-sm font-semibold text-amber-400">
                {t.onchainSupplyLabel}
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              {t.onchainSupplyDesc}
            </p>
            {onChainData.lastChecked && (
              <div className="text-[10px] font-mono text-slate-500 pt-1">
                {t.lastVerified}: {new Date(onChainData.lastChecked).toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Card 3: Circulating Supply */}
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                3. Market Float
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Liquidity Bound
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                Pool Synchronized
              </div>
              <div className="text-sm font-semibold text-amber-400">
                {t.circulatingSupplyLabel}
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              {t.circulatingSupplyDesc}
            </p>
          </div>
        </div>

        {/* Detailed Contract Parameters Table */}
        <div className="bg-[#080D1A] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">BEP-20 Verified Token Parameters</span>
              <span className="text-xs font-mono text-slate-500">· Chain ID {CHAIN_ID}</span>
            </div>
            <button
              onClick={onRefreshRpc}
              disabled={isLoadingRpc}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors self-start sm:self-auto disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRpc ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isLoadingRpc ? t.queryingRpc : t.verifyRpcBtn}</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 text-sm">
            {/* Row 1: Contract Address */}
            <div className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">
                {t.contractLabel}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <code className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs select-all">
                  {CONTRACT_ADDRESS}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={BSCSCAN_CONTRACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  <span>BscScan</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Row 2: Network */}
            <div className="p-4 sm:px-6 flex items-center justify-between">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">
                {t.chainLabel}
              </span>
              <span className="font-semibold text-white">{t.chainVal}</span>
            </div>

            {/* Row 3: Chain ID */}
            <div className="p-4 sm:px-6 flex items-center justify-between">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">
                {t.chainIdLabel}
              </span>
              <span className="font-mono text-white">{CHAIN_ID} (0x38 hex)</span>
            </div>

            {/* Row 4: Token Symbol */}
            <div className="p-4 sm:px-6 flex items-center justify-between">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">
                {t.symbolLabel}
              </span>
              <span className="font-mono font-bold text-amber-400">SAR</span>
            </div>

            {/* Row 5: Decimals */}
            <div className="p-4 sm:px-6 flex items-center justify-between">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">
                {t.decimalsLabel}
              </span>
              <span className="font-mono text-white">18</span>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <p className="text-xs text-slate-500 italic text-center">
          {t.auditDisclaimer}
        </p>
      </div>
    </section>
  );
};
