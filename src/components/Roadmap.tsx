import React from 'react';
import { translations } from '../i18n/translations';
import { Language, RoadmapPhase } from '../types';
import { CheckCircle2, Clock, Compass } from 'lucide-react';

interface RoadmapProps {
  lang: Language;
}

export const Roadmap: React.FC<RoadmapProps> = ({ lang }) => {
  const t = translations[lang].roadmap;

  const phases: RoadmapPhase[] = [
    {
      phase: 'Phase 01',
      titleEn: t.phase1Title,
      titleId: t.phase1Title,
      status: 'Completed',
      itemsEn: [t.phase1Item1, t.phase1Item2, t.phase1Item3],
      itemsId: [t.phase1Item1, t.phase1Item2, t.phase1Item3],
    },
    {
      phase: 'Phase 02',
      titleEn: t.phase2Title,
      titleId: t.phase2Title,
      status: 'In Progress',
      itemsEn: [t.phase2Item1, t.phase2Item2, t.phase2Item3],
      itemsId: [t.phase2Item1, t.phase2Item2, t.phase2Item3],
    },
    {
      phase: 'Phase 03',
      titleEn: t.phase3Title,
      titleId: t.phase3Title,
      status: 'Upcoming',
      itemsEn: [t.phase3Item1, t.phase3Item2, t.phase3Item3],
      itemsId: [t.phase3Item1, t.phase3Item2, t.phase3Item3],
    },
    {
      phase: 'Phase 04',
      titleEn: t.phase4Title,
      titleId: t.phase4Title,
      status: 'Upcoming',
      itemsEn: [t.phase4Item1, t.phase4Item2, t.phase4Item3],
      itemsId: [t.phase4Item1, t.phase4Item2, t.phase4Item3],
    },
  ];

  return (
    <section id="roadmap" className="py-20 border-t border-slate-800/80 bg-[#070B14]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500">
            Strategic Milestones
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {t.sectionTitle}
          </h2>
          <p className="text-base text-slate-400 max-w-2xl">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Honest Milestone Policy Banner */}
        <div className="px-5 py-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
          <Compass className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{t.notice}</span>
        </div>

        {/* Roadmap Phases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {phases.map((phase) => {
            const isCompleted = phase.status === 'Completed';
            const isInProgress = phase.status === 'In Progress';
            const items = lang === 'id' ? phase.itemsId : phase.itemsEn;
            const title = lang === 'id' ? phase.titleId : phase.titleEn;

            return (
              <div
                key={phase.phase}
                className={`p-6 rounded-2xl flex flex-col justify-between space-y-6 transition-all ${
                  isInProgress
                    ? 'bg-[#0A0F22] border-2 border-amber-500/40 shadow-xl shadow-amber-500/5'
                    : isCompleted
                    ? 'bg-slate-900/60 border border-emerald-500/30'
                    : 'bg-slate-900/40 border border-slate-800/80'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                      {phase.phase}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : isInProgress ? (
                      <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Active Focus</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500">
                        Planned
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-white">
                    {title}
                  </h3>

                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500/80 mt-0.5">·</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
