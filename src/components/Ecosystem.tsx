import React, { useState } from 'react';
import { translations } from '../i18n/translations';
import { Language, EcosystemProduct } from '../types';
import { Shield, CreditCard, Landmark, Lock, ArrowUpRight } from 'lucide-react';

interface EcosystemProps {
  lang: Language;
}

export const Ecosystem: React.FC<EcosystemProps> = ({ lang }) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'In Development' | 'Planned'>('All');
  const t = translations[lang].ecosystem;

  const products: (EcosystemProduct & { icon: React.ReactNode })[] = [
    {
      id: 'reserve-vault',
      name: t.vaultTitle,
      status: 'In Development',
      descriptionEn: t.vaultDesc,
      descriptionId: t.vaultDesc,
      specs: ['Cold Collateral Buffer', 'On-Chain Proof of Reserve', 'Multi-Sig Governance'],
      image: '/src/assets/images/ecosystem_reserve_liquidity_1792215134811.jpg',
      icon: <Shield className="w-5 h-5 text-amber-400" />,
    },
    {
      id: 'governance',
      name: t.governanceTitle,
      status: 'In Development',
      descriptionEn: t.governanceDesc,
      descriptionId: t.governanceDesc,
      specs: ['DAO Voting Logic', 'Treasury Allocation Quorum', 'Timelock Execution'],
      image: '/src/assets/images/ecosystem_governance_portal_1792215134777.jpg',
      icon: <Landmark className="w-5 h-5 text-indigo-400" />,
    },
    {
      id: 'pay-gateway',
      name: t.gatewayTitle,
      status: 'Planned',
      descriptionEn: t.gatewayDesc,
      descriptionId: t.gatewayDesc,
      specs: ['Micro-Fee Routing', 'Sub-Second Finality', 'Merchant SDKs'],
      image: '/src/assets/images/hero_cinematic_vault_1792215134506.jpg',
      icon: <CreditCard className="w-5 h-5 text-sky-400" />,
    },
    {
      id: 'custody',
      name: t.custodyTitle,
      status: 'Planned',
      descriptionEn: t.custodyDesc,
      descriptionId: t.custodyDesc,
      specs: ['Hardware Security Module', 'Institutional Compliance', 'Disaster Recovery'],
      image: '/token-sar.png',
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
    },
  ];

  const filteredProducts = filter === 'All'
    ? products
    : products.filter((p) => p.status === filter);

  return (
    <section id="ecosystem" className="py-20 border-t border-slate-800/80 bg-[#050811]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-500">
              Infrastructure Map
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {t.sectionTitle}
            </h2>
            <p className="text-base text-slate-400 max-w-2xl">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* Filter Tabs (Interactive buttons allowed by design constitution) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium self-start md:self-auto">
            {(['All', 'Active', 'In Development', 'Planned'] as const).map((tab) => {
              const label =
                tab === 'All'
                  ? t.filterAll
                  : tab === 'Active'
                  ? t.filterActive
                  : tab === 'In Development'
                  ? t.filterInDev
                  : t.filterPlanned;

              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    filter === tab
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="group rounded-2xl bg-[#080D1A] border border-slate-800/90 overflow-hidden hover:border-amber-500/30 transition-all flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={prod.image}
                  alt={prod.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080D1A] via-transparent to-transparent opacity-80" />
                
                {/* Status indicator unboxed in corner */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-mono font-medium backdrop-blur-md ${
                      prod.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : prod.status === 'In Development'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800/80 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {prod.status === 'Active' ? t.statusActive : prod.status === 'In Development' ? t.statusInDev : t.statusPlanned}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    {prod.icon}
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {prod.name}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {lang === 'id' ? prod.descriptionId : prod.descriptionEn}
                  </p>
                </div>

                {/* Specs list */}
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs font-mono text-slate-400">
                  {prod.specs.map((spec, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className="text-amber-500">·</span>
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
