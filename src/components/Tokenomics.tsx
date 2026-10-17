import React, { useState } from 'react';
import { translations } from '../i18n/translations';
import { Language, TokenAllocation } from '../types';
import { Flame, Info } from 'lucide-react';

interface TokenomicsProps {
  lang: Language;
}

const ALLOCATIONS: TokenAllocation[] = [
  {
    id: 'liquidity',
    categoryEn: 'Liquidity',
    categoryFaId: 'Likuiditas',
    percentage: 40,
    tokens: 40_000_000,
    color: '#F59E0B', // Amber
    status: 'Planned',
    descriptionEn: 'Dedicated to decentralized (PancakeSwap) and centralized exchange liquidity pools to support transparent trading with minimal slippage.',
    descriptionId: 'Dialokasikan untuk penyediaan likuiditas pada bursa terdesentralisasi (PancakeSwap) dan bursa terpusat demi stabilitas perdagangan.',
  },
  {
    id: 'marketing',
    categoryEn: 'Marketing & Growth',
    categoryFaId: 'Pemasaran & Pertumbuhan',
    percentage: 20,
    tokens: 20_000_000,
    color: '#38BDF8', // Sky
    status: 'Planned',
    descriptionEn: 'Global outreach, institutional marketing, developer hackathons, partnerships, and brand awareness programs.',
    descriptionId: 'Jangkauan global, pemasaran institusional, hackathon pengembang, kemitraan, dan peningkatan kesadaran merek.',
  },
  {
    id: 'team',
    categoryEn: 'Core Team & Dev',
    categoryFaId: 'Tim Inti & Pengembang',
    percentage: 15,
    tokens: 15_000_000,
    color: '#818CF8', // Indigo
    status: 'Planned',
    descriptionEn: 'Core engineers, security architects, and product management subject to transparent multi-year linear vesting.',
    descriptionId: 'Para insinyur inti, arsitek keamanan, dan manajemen produk yang tunduk pada jadwal vesting linier multi-tahun.',
  },
  {
    id: 'community',
    categoryEn: 'Community & Rewards',
    categoryFaId: 'Komunitas & Reward',
    percentage: 10,
    tokens: 10_000_000,
    color: '#34D399', // Emerald
    status: 'Planned',
    descriptionEn: 'Ecosystem grants, staking rewards, community governance incentives, and testnet participation programs.',
    descriptionId: 'Hibah ekosistem, reward staking, insentif tata kelola komunitas, dan program partisipasi testnet.',
  },
  {
    id: 'reserve',
    categoryEn: 'Strategic Reserve',
    categoryFaId: 'Cadangan Strategis',
    percentage: 10,
    tokens: 10_000_000,
    color: '#A78BFA', // Purple
    status: 'Planned',
    descriptionEn: 'Treasury reserve retained for unforeseen contingencies, protocol insurance, and long-term ecosystem expansion.',
    descriptionId: 'Cadangan kas yang disimpan untuk kebutuhan tak terduga, asuransi protokol, dan ekspansi ekosistem jangka panjang.',
  },
  {
    id: 'burn',
    categoryEn: 'Planned Milestone Burn',
    categoryFaId: 'Rencana Target Burn',
    percentage: 5,
    tokens: 5_000_000,
    color: '#F43F5E', // Rose/Red
    status: 'Planned',
    descriptionEn: 'Strategic burn allocation slated for token destruction upon achieving specific ecosystem milestones with on-chain cryptographic proof.',
    descriptionId: 'Alokasi target burn yang direncanakan untuk pembakaran token secara bertahap dengan bukti kriptografis di blockchain.',
  },
];

export const Tokenomics: React.FC<TokenomicsProps> = ({ lang }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const t = translations[lang].tokenomics;

  // Donut chart math
  const size = 320;
  const strokeWidth = 44;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const activeAllocation = ALLOCATIONS.find((a) => a.id === activeId) || ALLOCATIONS[0];

  return (
    <section id="tokenomics" className="py-20 border-t border-slate-800/80 bg-[#050811]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500">
            Allocation Architecture
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {t.sectionTitle}
          </h2>
          <p className="text-base text-slate-400 max-w-3xl">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Burn Special Disclosure Notice */}
        <div className="p-5 rounded-2xl bg-[#140A10] border border-rose-900/40 flex items-start gap-3">
          <Flame className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-rose-200">
              {t.burnTitle}
            </h3>
            <p className="text-xs text-rose-300/80 leading-relaxed">
              {t.burnNotice}
            </p>
          </div>
        </div>

        {/* Interactive Chart + Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Donut Chart Visual */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-[320px] h-[320px] flex items-center justify-center">
              <svg width={size} height={size} className="transform -rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke="#1E293B"
                  strokeWidth={strokeWidth}
                  opacity="0.3"
                />
                {ALLOCATIONS.map((alloc) => {
                  const strokeDasharray = `${(alloc.percentage / 100) * circumference} ${circumference}`;
                  const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                  accumulatedPercent += alloc.percentage;
                  const isSelected = activeId === alloc.id;

                  return (
                    <circle
                      key={alloc.id}
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="transparent"
                      stroke={alloc.color}
                      strokeWidth={isSelected ? strokeWidth + 6 : strokeWidth}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="butt"
                      className="transition-all duration-300 cursor-pointer hover:opacity-100"
                      opacity={activeId ? (isSelected ? 1 : 0.35) : 0.9}
                      onMouseEnter={() => setActiveId(alloc.id)}
                      onMouseLeave={() => setActiveId(null)}
                      onClick={() => setActiveId(alloc.id)}
                    />
                  );
                })}
              </svg>

              {/* Center Infographic */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-6">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  {lang === 'id' ? activeAllocation.categoryFaId : activeAllocation.categoryEn}
                </span>
                <span className="text-3xl font-extrabold font-mono text-white mt-1">
                  {activeAllocation.percentage}%
                </span>
                <span className="text-xs font-mono text-amber-400 mt-0.5">
                  {activeAllocation.tokens.toLocaleString('en-US')} SAR
                </span>
                <span className="text-[10px] text-slate-500 mt-2 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {t.statusPlanned}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Info className="w-3.5 h-3.5" />
              <span>{t.interactiveHint}</span>
            </div>
          </div>

          {/* Allocation Breakdown Table */}
          <div className="lg:col-span-7 bg-[#080D1A] border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">
                {t.legendTitle}
              </h3>
            </div>

            <div className="divide-y divide-slate-800/80">
              {ALLOCATIONS.map((alloc) => {
                const isSelected = activeId === alloc.id;
                const categoryName = lang === 'id' ? alloc.categoryFaId : alloc.categoryEn;
                const description = lang === 'id' ? alloc.descriptionId : alloc.descriptionEn;

                return (
                  <div
                    key={alloc.id}
                    onMouseEnter={() => setActiveId(alloc.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onClick={() => setActiveId(alloc.id)}
                    className={`p-4 sm:px-6 transition-colors cursor-pointer ${
                      isSelected ? 'bg-slate-800/60' : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: alloc.color }}
                        />
                        <span className="font-semibold text-sm text-slate-200">
                          {categoryName}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="font-mono text-sm font-bold text-white">
                          {alloc.percentage}%
                        </span>
                        <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                          {alloc.tokens.toLocaleString('en-US')} SAR
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {t.statusPlanned}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 pl-6 leading-relaxed">
                      {description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
