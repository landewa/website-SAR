import React, { useState } from 'react';
import { RefreshCw, ExternalLink, Activity, AlertCircle, BarChart3 } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language, MarketData } from '../types';
import { BSCSCAN_TOKEN_URL, TARGET_SUPPLY } from '../services/blockchain';

interface MarketDashboardProps {
  lang: Language;
  marketData: MarketData;
  isLoading: boolean;
  onRefresh: () => void;
}

export const MarketDashboard: React.FC<MarketDashboardProps> = ({
  lang,
  marketData,
  isLoading,
  onRefresh,
}) => {
  const [activeTimeframe, setActiveTimeframe] = useState<'1H' | '24H' | '7D' | '30D'>('24H');
  const t = translations[lang].market;

  const isLive = marketData.status === 'Live';
  const hasHistory = marketData.priceHistory && marketData.priceHistory.length > 1;

  // Determine SVG polyline points for chart if live data exists
  const chartWidth = 700;
  const chartHeight = 220;
  const padding = 20;

  let pointsString = '';
  let minPrice = 0;
  let maxPrice = 0;

  if (hasHistory) {
    const prices = marketData.priceHistory.map((p) => p.price);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice || 0.0001;

    pointsString = marketData.priceHistory
      .map((p, idx) => {
        const x = padding + (idx / (marketData.priceHistory.length - 1)) * (chartWidth - padding * 2);
        const y = chartHeight - padding - ((p.price - minPrice) / range) * (chartHeight - padding * 2);
        return `${x},${y}`;
      })
      .join(' ');
  }

  return (
    <section id="market" className="py-20 border-t border-slate-800/80 bg-[#070B14]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-500">
              On-Chain DEX Telemetry
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {t.sectionTitle}
            </h2>
            <p className="text-base text-slate-400 max-w-2xl">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* Refresh & Status Header Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
              <span className="text-slate-500">Status:</span>
              {isLive ? (
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{t.statusLive}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{t.statusUnavailable}</span>
                </span>
              )}
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>{t.refreshBtn}</span>
            </button>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Metric 1: Price */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {t.priceLabel}
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {marketData.priceUsd !== null ? `$${marketData.priceUsd.toFixed(6)}` : '—'}
            </div>
            <div className="text-xs font-mono">
              {marketData.priceChange24h !== null ? (
                <span className={marketData.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {marketData.priceChange24h >= 0 ? '+' : ''}{marketData.priceChange24h.toFixed(2)}% (24h)
                </span>
              ) : (
                <span className="text-slate-500">Liquidity Pending</span>
              )}
            </div>
          </div>

          {/* Metric 2: 24h Volume */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {t.volume24hLabel}
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {marketData.volume24h !== null ? `$${marketData.volume24h.toLocaleString('en-US')}` : '—'}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {marketData.dexName}
            </div>
          </div>

          {/* Metric 3: Pool Liquidity */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {t.liquidityLabel}
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {marketData.liquidityUsd !== null ? `$${marketData.liquidityUsd.toLocaleString('en-US')}` : '—'}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              BNB Smart Chain Pool
            </div>
          </div>

          {/* Metric 4: Market Cap */}
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              {t.marketCapLabel}
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
              {marketData.marketCapUsd !== null
                ? `$${marketData.marketCapUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                : `${(TARGET_SUPPLY).toLocaleString('en-US')} SAR Float`}
            </div>
            <div className="text-[11px] text-slate-500">
              {t.marketCapNote}
            </div>
          </div>
        </div>

        {/* Interactive Chart Container */}
        <div className="bg-[#080D1A] border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-white text-base">SAR / USD Price Action</span>
              <span className="text-xs font-mono text-slate-500">· {marketData.source}</span>
            </div>

            {/* Timeframe Tabs */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono self-start sm:self-auto">
              {(['1H', '24H', '7D', '30D'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeTimeframe === tf
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Canvas or Honest Empty State */}
          {isLive && hasHistory ? (
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference grid lines */}
                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#1E293B" strokeDasharray="3 3" />
                <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#1E293B" strokeDasharray="3 3" />
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#1E293B" />
                
                {/* Area under line */}
                <polygon
                  points={`${padding},${chartHeight - padding} ${pointsString} ${chartWidth - padding},${chartHeight - padding}`}
                  fill="url(#chartGradient)"
                />
                {/* Stroke line */}
                <polyline
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsString}
                />
              </svg>
            </div>
          ) : (
            /* Honest Zero-Synthetic Empty / Initializing State */
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-lg">
                <h4 className="text-base font-semibold text-white">
                  {t.chartEmptyTitle}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t.chartEmptyDesc}
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={BSCSCAN_TOKEN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span>BscScan Liquidity Tracker</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Footer Metadata & Policy */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-3 border-t border-slate-800/60 font-mono">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500/80" />
              <span>{t.warningNoSynthetic}</span>
            </div>
            {marketData.lastUpdated && (
              <div>
                {t.lastUpdated}: {new Date(marketData.lastUpdated).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
