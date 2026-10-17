import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language } from '../types';

interface FAQAndDisclosuresProps {
  lang: Language;
}

export const FAQAndDisclosures: React.FC<FAQAndDisclosuresProps> = ({ lang }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = translations[lang].faq;

  const faqs = [
    { q: t.q1, a: t.a1 },
    { q: t.q2, a: t.a2 },
    { q: t.q3, a: t.a3 },
    { q: t.q4, a: t.a4 },
    { q: t.q5, a: t.a5 },
    { q: t.q6, a: t.a6 },
  ];

  return (
    <section id="faq" className="py-20 border-t border-slate-800/80 bg-[#050811]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500">
            Knowledge Base
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {t.sectionTitle}
          </h2>
          <p className="text-base text-slate-400">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-xl bg-[#080D1A] border border-slate-800/90 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-slate-900/40 transition-colors"
                >
                  <span className="font-semibold text-white text-base">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Prominent Risk Disclosure Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#140D07] border border-amber-900/40 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-display text-lg font-bold text-amber-300">
              {t.riskTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
            {t.riskBody}
          </p>
        </div>
      </div>
    </section>
  );
};
