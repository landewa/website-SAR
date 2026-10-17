import React, { useState, useEffect } from 'react';
import { Language, MarketData, OnChainData } from './types';
import { fetchOnChainSupply, fetchMarketData, TARGET_SUPPLY } from './services/blockchain';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SarPurpose } from './components/SarPurpose';
import { HowToGetSar } from './components/HowToGetSar';
import { TokenOverview } from './components/TokenOverview';
import { Founder } from './components/Founder';
import { Tokenomics } from './components/Tokenomics';
import { MarketDashboard } from './components/MarketDashboard';
import { SaadaCity } from './components/SaadaCity';
import { Ecosystem } from './components/Ecosystem';
import { Roadmap } from './components/Roadmap';
import { FAQAndDisclosures } from './components/FAQAndDisclosures';
import { Footer } from './components/Footer';
import { WhitepaperModal } from './components/WhitepaperModal';
import { Jarvis } from './components/Jarvis';

export default function App() {
  // Initialize language from URL query or localStorage, defaulting to 'en'
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang === 'id' || urlLang === 'en') {
        return urlLang;
      }
      const savedLang = localStorage.getItem('saada_lang');
      if (savedLang === 'id' || savedLang === 'en') {
        return savedLang;
      }
    }
    return 'en';
  });

  // Modal state
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState(false);

  // Blockchain and Market Data States
  const [onChainData, setOnChainData] = useState<OnChainData>({
    targetSupply: TARGET_SUPPLY,
    onChainSupply: null,
    decimals: 18,
    name: 'SAADA Reserve',
    symbol: 'SAR',
    status: 'Verification Pending',
    lastChecked: null,
  });
  const [isLoadingRpc, setIsLoadingRpc] = useState(false);

  const [marketData, setMarketData] = useState<MarketData>({
    priceUsd: null,
    priceChange24h: null,
    volume24h: null,
    liquidityUsd: null,
    marketCapUsd: null,
    pairAddress: null,
    dexName: 'PancakeSwap (v2/v3)',
    status: 'Unavailable',
    lastUpdated: null,
    source: 'DEX Screener / BSC RPC',
    priceHistory: [],
  });
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);

  // Language change handler with URL update & storage persistence
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('saada_lang', newLang);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.replaceState({}, '', url.toString());
      document.documentElement.lang = newLang;
    }
  };

  // Trigger On-Chain Supply query
  const loadOnChainSupply = async () => {
    setIsLoadingRpc(true);
    try {
      const data = await fetchOnChainSupply();
      setOnChainData(data);
    } catch {
      // Retain verification pending state
    } finally {
      setIsLoadingRpc(false);
    }
  };

  // Trigger DEX Market Data query
  const loadMarketData = async () => {
    setIsLoadingMarket(true);
    try {
      const data = await fetchMarketData();
      setMarketData(data);
    } catch {
      // Retain honest unavailable state
    } finally {
      setIsLoadingMarket(false);
    }
  };

  // Initial load on mount
  useEffect(() => {
    loadOnChainSupply();
    loadMarketData();

    // 60-second periodic telemetry polling
    const interval = setInterval(() => {
      loadMarketData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Bar Contract Navbar */}
      <Navbar
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onOpenWhitepaper={() => setIsWhitepaperOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Cinematic Hero with 3D SAR Coin */}
        <Hero
          lang={lang}
          onOpenWhitepaper={() => setIsWhitepaperOpen(true)}
        />

        {/* Feature 1: The Purpose of SAR — Animated Narrative beside 3D Rotating Coin */}
        <SarPurpose lang={lang} />

        {/* Feature 2: How to Get SAR — Beginner-Friendly Tutorial & 1-Click Web3 Import */}
        <HowToGetSar lang={lang} />

        {/* Token Overview & Transparent Supply Delineation */}
        <TokenOverview
          lang={lang}
          onChainData={onChainData}
          isLoadingRpc={isLoadingRpc}
          onRefreshRpc={loadOnChainSupply}
        />

        {/* Official Founder Section: Zulfakkar */}
        <Founder lang={lang} />

        {/* Target 100M SAR Tokenomics */}
        <Tokenomics lang={lang} />

        {/* Real-time DEX Market Dashboard */}
        <MarketDashboard
          lang={lang}
          marketData={marketData}
          isLoading={isLoadingMarket}
          onRefresh={loadMarketData}
        />

        {/* SAADA City — Long-term Future Vision & Concept Visualization */}
        <SaadaCity lang={lang} />

        {/* Ecosystem Pillars */}
        <Ecosystem lang={lang} />

        {/* Development Roadmap */}
        <Roadmap lang={lang} />

        {/* FAQ & Risk Disclosures */}
        <FAQAndDisclosures lang={lang} />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenWhitepaper={() => setIsWhitepaperOpen(true)}
      />

      {/* In-App Interactive Whitepaper Reader */}
      <WhitepaperModal
        isOpen={isWhitepaperOpen}
        onClose={() => setIsWhitepaperOpen(false)}
        lang={lang}
      />

      {/* JARVIS AI Protocol Concierge & Autonomous Assistant */}
      <Jarvis lang={lang} />
    </div>
  );
}
