import React, { useState } from 'react';
import { Menu, X, ExternalLink, BookOpen } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import { BSCSCAN_TOKEN_URL } from '../services/blockchain';
import { OfficialLogo } from './OfficialLogo';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenWhitepaper: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  onOpenWhitepaper,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang].nav;

  const navLinks = [
    { href: '#purpose', label: t.purpose },
    { href: '#how-to-get', label: t.howToGet },
    { href: '#token', label: t.token },
    { href: '#founder', label: t.founder },
    { href: '#tokenomics', label: t.tokenomics },
    { href: '#market', label: t.market },
    { href: '#saada-city', label: t.saadaCity },
    { href: '#ecosystem', label: t.ecosystem },
    { href: '#roadmap', label: t.roadmap },
    { href: '#faq', label: t.faq },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050811]/90 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Official Brand Logo & Wordmark */}
        <a href="#" className="flex items-center gap-3 shrink-0 group">
          <OfficialLogo size={42} withText={true} />
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onOpenWhitepaper}
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>{t.whitepaper}</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Language Toggle + Primary Action) */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === 'en'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('id')}
              className={`px-2.5 py-1 rounded transition-colors ${
                lang === 'id'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ID
            </button>
          </div>

          {/* Primary CTA Button */}
          <a
            href={BSCSCAN_TOKEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
          >
            <span>{t.viewContract}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 xl:hidden">
          {/* Mobile Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded ${
                lang === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('id')}
              className={`px-2 py-1 rounded ${
                lang === 'id' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              ID
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070B14] border-b border-slate-800 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-amber-400 py-1.5 border-b border-slate-800/50"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWhitepaper();
              }}
              className="flex items-center gap-2 text-base font-medium text-amber-400 py-1.5 border-b border-slate-800/50 text-left"
            >
              <BookOpen className="w-5 h-5" />
              <span>{t.whitepaper}</span>
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <a
              href={BSCSCAN_TOKEN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg text-center"
            >
              <span>{t.viewContract}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
