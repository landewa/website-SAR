import React from 'react';
import { ExternalLink, BookOpen, Send, Twitter, ShieldCheck } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import { CONTRACT_ADDRESS, BSCSCAN_TOKEN_URL, BSCSCAN_CONTRACT_URL } from '../services/blockchain';
import { OfficialLogo } from './OfficialLogo';

interface FooterProps {
  lang: Language;
  onOpenWhitepaper: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenWhitepaper,
}) => {
  const t = translations[lang].footer;

  return (
    <footer className="border-t border-slate-800/90 bg-[#04060C] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Lockup */}
          <div className="lg:col-span-2 space-y-4">
            <OfficialLogo size={44} withText={true} />

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {t.tagline}
            </p>

            <div className="pt-2 text-[11px] font-mono text-slate-500">
              {t.officialDomain}
            </div>

            {/* Official Social Badges */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://t.me/saadareserve"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-white transition-colors"
                title="SAADA Reserve Telegram"
              >
                <Send className="w-4 h-4 text-sky-400" />
              </a>

              <a
                href="https://x.com/saadareserve"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-white transition-colors"
                title="@SAADARESERVE on X"
              >
                <Twitter className="w-4 h-4 text-slate-200" />
              </a>

              <a
                href={BSCSCAN_TOKEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-white transition-colors"
                title="BscScan Token Tracker"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <div className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
              {t.quickLinks}
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#token" className="hover:text-amber-400 transition-colors">
                  Token Overview
                </a>
              </li>
              <li>
                <a href="#founder" className="hover:text-amber-400 transition-colors">
                  Founder Profile
                </a>
              </li>
              <li>
                <a href="#tokenomics" className="hover:text-amber-400 transition-colors">
                  Tokenomics
                </a>
              </li>
              <li>
                <a href="#market" className="hover:text-amber-400 transition-colors">
                  Market Dashboard
                </a>
              </li>
              <li>
                <a href="#saada-city" className="hover:text-amber-400 transition-colors">
                  SAADA City
                </a>
              </li>
              <li>
                <a href="#ecosystem" className="hover:text-amber-400 transition-colors">
                  Ecosystem
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-amber-400 transition-colors">
                  Roadmap
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div className="space-y-3">
            <div className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
              {t.resources}
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenWhitepaper}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                  <span>Technical Whitepaper</span>
                </button>
              </li>
              <li>
                <a
                  href={BSCSCAN_TOKEN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <span>{t.contractExplorer}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={BSCSCAN_CONTRACT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <span>Verified Contract Code</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Verification */}
          <div className="space-y-3">
            <div className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
              {t.legal}
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="text-[11px] font-mono text-slate-300">Contract Verification</div>
              <div className="text-[10px] font-mono text-amber-400 break-all select-all">
                {CONTRACT_ADDRESS}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>{t.copyright}</div>
          <div className="text-center sm:text-right max-w-xl">
            {t.disclaimer}
          </div>
        </div>
      </div>
    </footer>
  );
};
