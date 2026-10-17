import React, { useEffect } from 'react';
import { X, BookOpen, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import { CONTRACT_ADDRESS, CHAIN_ID, BSCSCAN_TOKEN_URL } from '../services/blockchain';

interface WhitepaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const WhitepaperModal: React.FC<WhitepaperModalProps> = ({ isOpen, onClose, lang }) => {
  const t = translations[lang].whitepaper;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#070B14] border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-[#090E1F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                {t.modalTitle}
              </h2>
              <p className="text-xs font-mono text-slate-400">
                {t.docVersion}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable Document */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-slate-300 leading-relaxed text-sm">
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-amber-400 uppercase tracking-wide">
              {t.abstractTitle}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {t.abstractText}
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-amber-400 uppercase tracking-wide">
              {t.tokenomicsTitle}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {t.tokenomicsText}
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
              <div>· Target Total Supply: 100,000,000 SAR</div>
              <div>· Liquidity Reserve: 40,000,000 SAR (40%)</div>
              <div>· Ecosystem Marketing: 20,000,000 SAR (20%)</div>
              <div>· Core Engineering & Team: 15,000,000 SAR (15%)</div>
              <div>· Community Incentives: 10,000,000 SAR (10%)</div>
              <div>· Strategic Reserve: 10,000,000 SAR (10%)</div>
              <div>· Milestone Burn Allocation: 5,000,000 SAR (5%)</div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-amber-400 uppercase tracking-wide">
              {t.blockchainTitle}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {t.blockchainText}
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="text-slate-400">
                Network: <span className="text-white">BNB Smart Chain Mainnet (Chain ID: {CHAIN_ID})</span>
              </div>
              <div className="text-slate-400">
                Contract: <span className="text-amber-300 select-all">{CONTRACT_ADDRESS}</span>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h3 className="font-display text-base font-bold text-amber-400 uppercase tracking-wide">
              {t.securityTitle}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {t.securityText}
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 p-5 rounded-xl bg-[#140A10] border border-rose-900/40">
            <h3 className="font-display text-sm font-bold text-rose-300 uppercase tracking-wide">
              {t.disclaimerTitle}
            </h3>
            <p className="text-xs text-rose-300/80 leading-relaxed">
              {t.disclaimerText}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#090E1F] flex flex-wrap items-center justify-between gap-4">
          <a
            href={BSCSCAN_TOKEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Verify Contract on BscScan</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
