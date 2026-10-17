import React, { useState } from 'react';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import {
  Building2,
  Cpu,
  GraduationCap,
  Leaf,
  Coins,
  Network,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Clock,
  Lightbulb,
} from 'lucide-react';

import { RealWorldVideo } from './RealWorldVideo';

interface SaadaCityProps {
  lang: Language;
}

export const SaadaCity: React.FC<SaadaCityProps> = ({ lang }) => {
  const t = translations[lang].saadaCity;

  const pillars = [
    {
      id: 'smart-infra',
      icon: <Cpu className="w-5 h-5 text-amber-400" />,
      title: t.pillar1Title,
      desc: t.pillar1Desc,
    },
    {
      id: 'business',
      icon: <Building2 className="w-5 h-5 text-sky-400" />,
      title: t.pillar2Title,
      desc: t.pillar2Desc,
    },
    {
      id: 'education',
      icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
      title: t.pillar3Title,
      desc: t.pillar3Desc,
    },
    {
      id: 'digital',
      icon: <Network className="w-5 h-5 text-indigo-400" />,
      title: t.pillar4Title,
      desc: t.pillar4Desc,
    },
    {
      id: 'sustainable',
      icon: <Leaf className="w-5 h-5 text-teal-400" />,
      title: t.pillar5Title,
      desc: t.pillar5Desc,
    },
    {
      id: 'capital',
      icon: <Coins className="w-5 h-5 text-amber-400" />,
      title: t.pillar6Title,
      desc: t.pillar6Desc,
    },
  ];

  const phases = [
    {
      phase: 'Phase A',
      title: t.phaseA,
      status: 'Concept & Research',
      desc: t.phaseADesc,
    },
    {
      phase: 'Phase B',
      title: t.phaseB,
      status: 'Planned',
      desc: t.phaseBDesc,
    },
    {
      phase: 'Phase C',
      title: t.phaseC,
      status: 'Planned',
      desc: t.phaseCDesc,
    },
    {
      phase: 'Phase D',
      title: t.phaseD,
      status: 'Planned',
      desc: t.phaseDDesc,
    },
  ];

  const ecosystemNodes = [
    {
      name: 'SAADA Reserve (SAR)',
      role: lang === 'id' ? 'Pondasi Likuiditas & Aset Cadangan' : 'Liquidity Anchor & Digital Reserve',
      status: 'Active',
      tag: 'On-Chain Mainnet',
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    },
    {
      name: 'SAADA BUILD',
      role: lang === 'id' ? 'Infrastruktur Pembangunan & Konstruksi' : 'Development & Construction Engine',
      status: 'In Development',
      tag: 'Engineering Focus',
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    },
    {
      name: 'SAADA RIDE',
      role: lang === 'id' ? 'Mobilitas & Jaringan Logistik Perkotaan' : 'Mobility & Urban Logistics Network',
      status: 'Planned',
      tag: 'Conceptual Plan',
      color: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
    },
    {
      name: 'SAADA City',
      role: lang === 'id' ? 'Visi Metropol Terintegrasi Masa Depan' : 'Integrated Future Metropolis Vision',
      status: 'Concept',
      tag: 'Long-Term Horizon',
      color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
    },
  ];

  return (
    <section id="saada-city" className="py-24 border-t border-slate-800/80 bg-[#050811] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Future Ecosystem Horizon</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {t.sectionTitle}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Mandatory Concept Visualization Label Notice */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5 text-xs font-mono text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-bold uppercase tracking-wider">{t.conceptBadge}</span>
          </div>
          <span className="text-xs text-slate-400 italic">
            {t.conceptNotice}
          </span>
        </div>

        {/* Real-World SAR in SAADA City 16:9 Video & Scenario Simulation */}
        <RealWorldVideo lang={lang} />

        {/* Concept Visuals Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Panoramic Render (16:9 Master Concept) */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative group flex flex-col justify-end min-h-[380px]">
            <img
              src="/src/assets/images/saada_city_master_concept_1792217012267.jpg"
              alt="SAADA City Master Concept Visualization"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/40 to-transparent" />
            
            <div className="relative p-6 sm:p-8 space-y-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950/80 border border-amber-500/40 text-amber-300 backdrop-blur-md">
                {t.masterPlanLabel}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                {t.masterPlanTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                {t.masterPlanDesc}
              </p>
            </div>
          </div>

          {/* Secondary Visual (4:3 Innovation & Commercial Center) */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative group flex flex-col justify-end min-h-[380px]">
            <img
              src="/src/assets/images/saada_city_innovation_hub_1792217012154.jpg"
              alt="SAADA City Commercial and Education Hub"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/40 to-transparent" />
            
            <div className="relative p-6 sm:p-8 space-y-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-950/80 border border-sky-500/40 text-sky-300 backdrop-blur-md">
                {t.hubLabel}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                {t.hubTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t.hubDesc}
              </p>
            </div>
          </div>
        </div>

        {/* 6 Strategic Development Pillars Grid */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-bold text-white">
              {t.pillarsTitle}
            </h3>
            <span className="text-xs font-mono text-slate-500">6 Architectural Pillars</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="p-6 rounded-2xl bg-[#080D1A] border border-slate-800/90 hover:border-amber-500/30 transition-all space-y-3"
              >
                <div className="p-2.5 w-fit rounded-xl bg-slate-900 border border-slate-800">
                  {pillar.icon}
                </div>
                <h4 className="font-display text-base font-bold text-white">
                  {pillar.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Conceptual Horizon Phases */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-bold text-white">
              {t.phasesTitle}
            </h3>
            <span className="text-xs font-mono text-slate-500">{t.noDatesNotice}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {phases.map((ph, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#070B16] border border-slate-800/80 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      {ph.phase}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {ph.status}
                    </span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-white">
                    {ph.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ph.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Ecosystem Relationship Map */}
        <div className="p-8 rounded-3xl bg-[#080D1C] border border-slate-800 space-y-6">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-500">
              Coordinated Architecture
            </div>
            <h3 className="font-display text-2xl font-bold text-white">
              {t.ecosystemMapTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.ecosystemMapDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecosystemNodes.map((node, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${node.color}`}>
                      {node.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {node.tag}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white font-display">
                    {node.name}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {node.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
