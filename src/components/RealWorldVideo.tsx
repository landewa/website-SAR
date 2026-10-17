import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../i18n/translations';
import { Language, RealWorldScenario } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Link,
  Check,
  ShoppingBag,
  Train,
  Zap,
  ShieldCheck,
  Clock,
  Layers,
  ArrowRight,
  ChevronRight,
  Info
} from 'lucide-react';

import retailPaymentImg from '../assets/images/saada_city_retail_payment_1792221319507.jpg';
import smartTransitImg from '../assets/images/saada_city_smart_transit_1792221320905.jpg';
import cleanEnergyImg from '../assets/images/saada_city_clean_energy_1792221320929.jpg';
import reserveVaultImg from '../assets/images/ecosystem_reserve_liquidity_1792215134811.jpg';

interface RealWorldVideoProps {
  lang: Language;
}

export const RealWorldVideo: React.FC<RealWorldVideoProps> = ({ lang }) => {
  const t = translations[lang].saadaCity;
  const containerRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(60); // 60s total loop (15s per scene)
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Custom Video source state
  const [customVideoUrl, setCustomVideoUrl] = useState<string>('');
  const [appliedVideoUrl, setAppliedVideoUrl] = useState<string>('');
  const [isCustomUrlOpen, setIsCustomUrlOpen] = useState(false);

  // 4 Core Real-World Scenarios
  const scenarios: RealWorldScenario[] = [
    {
      id: 'retail-payments',
      timestamp: 0,
      duration: 15,
      titleEn: t.scene1Title,
      titleId: t.scene1Title,
      descEn: t.scene1Desc,
      descId: t.scene1Desc,
      tagEn: t.scene1Tag,
      tagId: t.scene1Tag,
      image: retailPaymentImg,
      fallbackImage: '/images/saada_city_retail_payment_1792221319507.jpg',
      telemetryEn: 'POS #041 · SAR Instant Tap-to-Pay · Gas: 0.0001 BNB · Finality: 0.4s',
      telemetryId: 'Kasir #041 · Pembayaran Ritel Cepat SAR · Biaya Gas Rendah · Finalitas: 0.4d',
      amountSar: '18.50 SAR',
      merchantOrNode: 'Boutique Gallerie · SAADA Commercial Core',
    },
    {
      id: 'smart-transit',
      timestamp: 15,
      duration: 15,
      titleEn: t.scene2Title,
      titleId: t.scene2Title,
      descEn: t.scene2Desc,
      descId: t.scene2Desc,
      tagEn: t.scene2Tag,
      tagId: t.scene2Tag,
      image: smartTransitImg,
      fallbackImage: '/images/saada_city_smart_transit_1792221320905.jpg',
      telemetryEn: 'SAADA RIDE Gate #07 · Autonomous Concourse · Micro-Tx Verified',
      telemetryId: 'Gerbang SAADA RIDE #07 · Koridor Otonom · Transaksi Mikro Terverifikasi',
      amountSar: '2.40 SAR',
      merchantOrNode: 'Central SkyRail Concourse · Marina Line',
    },
    {
      id: 'clean-energy',
      timestamp: 30,
      duration: 15,
      titleEn: t.scene3Title,
      titleId: t.scene3Title,
      descEn: t.scene3Desc,
      descId: t.scene3Desc,
      tagEn: t.scene3Tag,
      tagId: t.scene3Tag,
      image: cleanEnergyImg,
      fallbackImage: '/images/saada_city_clean_energy_1792221320929.jpg',
      telemetryEn: 'SolarGrid Node 42-B · 142 kWh P2P Clearing · Smart Contract Executed',
      telemetryId: 'Node SolarGrid 42-B · Kliring 142 kWh P2P · Smart Contract Tereksekusi',
      amountSar: '34.20 SAR',
      merchantOrNode: 'GreenTower MicroGrid · Energy Protocol',
    },
    {
      id: 'reserve-vault',
      timestamp: 45,
      duration: 15,
      titleEn: t.scene4Title,
      titleId: t.scene4Title,
      descEn: t.scene4Desc,
      descId: t.scene4Desc,
      tagEn: t.scene4Tag,
      tagId: t.scene4Tag,
      image: reserveVaultImg,
      fallbackImage: '/images/ecosystem_reserve_liquidity_1792215134811.jpg',
      telemetryEn: 'Multi-Sig Reserve Vault · Liquidity Rebalance · Proof of Reserve Verified',
      telemetryId: 'Brankas Cadangan Multi-Sig · Rebalancing Likuiditas · Bukti Cadangan Terverifikasi',
      amountSar: '2,500.00 SAR',
      merchantOrNode: 'SAADA Institutional Reserve · Vault Alpha',
    },
  ];

  // Active scenario determined by currentTime
  const currentScenarioIndex = Math.min(
    Math.floor((currentTime % duration) / 15),
    scenarios.length - 1
  );
  const currentScenario = scenarios[currentScenarioIndex];

  // Scene progress within current 15s window (0 to 1)
  const sceneProgress = ((currentTime % 15) / 15);

  // Simulation timer loop (when not using an external video element)
  useEffect(() => {
    if (appliedVideoUrl) return; // External video drives time

    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1 * playbackSpeed;
          return next >= duration ? 0 : next;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, duration, appliedVideoUrl]);

  // Ambient sound synthesizer for immersive futuristic experience
  const toggleAudio = () => {
    if (isMuted) {
      try {
        if (!audioContextRef.current) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioContextClass();
          audioContextRef.current = ctx;

          // Warm low-frequency ambient pad
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2

          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(165, ctx.currentTime); // E3

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, ctx.currentTime);

          gain.gain.setValueAtTime(0.04 * volume, ctx.currentTime);
          gainNodeRef.current = gain;

          osc1.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();
        } else if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }

        if (gainNodeRef.current && audioContextRef.current) {
          gainNodeRef.current.gain.setValueAtTime(0.04 * volume, audioContextRef.current.currentTime);
        }

        setIsMuted(false);
      } catch {
        setIsMuted(false);
      }
    } else {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      }
      setIsMuted(true);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Jump to specific scenario
  const jumpToScenario = (scenario: RealWorldScenario) => {
    setCurrentTime(scenario.timestamp);
    setIsPlaying(true);
    if (videoElementRef.current && appliedVideoUrl) {
      videoElementRef.current.currentTime = scenario.timestamp;
      videoElementRef.current.play().catch(() => {});
    }
  };

  // Handle Scrubbing
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pos * duration;
    setCurrentTime(newTime);
    if (videoElementRef.current && appliedVideoUrl) {
      videoElementRef.current.currentTime = newTime;
    }
  };

  // Handle custom URL load
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customVideoUrl.trim()) {
      setAppliedVideoUrl(customVideoUrl.trim());
      setIsCustomUrlOpen(false);
      setIsPlaying(true);
    }
  };

  const handleResetSource = () => {
    setAppliedVideoUrl('');
    setCustomVideoUrl('');
    setIsCustomUrlOpen(false);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Auto-hide controls when mouse is still
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3200);
  };

  return (
    <div className="space-y-8 pt-8">
      {/* Sub-Header with exact prompt title & description */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.videoBadge}</span>
        </div>
        <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          {t.videoTitle}
        </h3>
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          {t.videoSubtitle}
        </p>
      </div>

      {/* 16:9 Custom Video Player Card Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group select-none flex flex-col justify-between"
      >
        {/* VIDEO DISPLAY AREA */}
        {appliedVideoUrl ? (
          <video
            ref={videoElementRef}
            src={appliedVideoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            playsInline
            muted={isMuted}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={() => {
              setCurrentTime(0);
              setIsPlaying(false);
            }}
          />
        ) : (
          /* Built-in Cinematic AI Animation Engine */
          <div className="absolute inset-0 overflow-hidden">
            {scenarios.map((sc, idx) => {
              const isCurrent = idx === currentScenarioIndex;
              return (
                <div
                  key={sc.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isCurrent ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={sc.image}
                    alt={sc.titleEn}
                    onError={(e) => {
                      if (sc.fallbackImage && e.currentTarget.src !== sc.fallbackImage) {
                        e.currentTarget.src = sc.fallbackImage;
                      }
                    }}
                    style={{
                      transform: isCurrent
                        ? `scale(${1.02 + sceneProgress * 0.06}) translate(${
                            (idx % 2 === 0 ? 1 : -1) * sceneProgress * 8
                          }px, ${sceneProgress * 4}px)`
                        : 'scale(1)',
                      transition: 'transform 0.15s linear',
                    }}
                    className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
                  />
                  {/* Cinematic Grading & Vignette Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-[#050811]/60" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050811]/40 via-transparent to-[#050811]/40" />
                </div>
              );
            })}
          </div>
        )}

        {/* TOP HUD OVERLAY (Always visible or gentle fade) */}
        <div className="relative z-20 p-4 sm:p-6 flex items-center justify-between gap-4 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-950/80 border border-amber-500/40 backdrop-blur-md text-amber-300 text-xs font-mono font-semibold">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>{appliedVideoUrl ? 'CUSTOM VIDEO STREAM' : 'SAR DIGITAL CITY SIMULATION'}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-800 backdrop-blur-md text-slate-300 text-[11px] font-mono">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>CH 0{currentScenarioIndex + 1} / 04</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="hidden md:inline-block text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-slate-950/70 border border-slate-800 text-slate-400 backdrop-blur-md">
              BEP-20 SETTLEMENT RAIL: ACTIVE
            </span>
            <button
              onClick={() => setIsCustomUrlOpen(!isCustomUrlOpen)}
              title={t.videoCustomUrl}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-amber-300 transition-colors backdrop-blur-md"
            >
              <Link className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CUSTOM VIDEO URL DRAWER / POPOVER */}
        {isCustomUrlOpen && (
          <div className="absolute top-16 right-4 sm:right-6 z-30 w-80 sm:w-96 p-4 rounded-2xl bg-[#090E1F]/95 border border-amber-500/40 shadow-2xl backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400">
              <span className="font-bold">{t.videoCustomUrl}</span>
              <button
                onClick={() => setIsCustomUrlOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleApplyCustomUrl} className="space-y-2">
              <input
                type="url"
                value={customVideoUrl}
                onChange={(e) => setCustomVideoUrl(e.target.value)}
                placeholder="https://.../saada-city.mp4"
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold font-mono transition-colors"
                >
                  {t.videoApplyUrl}
                </button>
                {appliedVideoUrl && (
                  <button
                    type="button"
                    onClick={handleResetSource}
                    className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* CENTER PLAY/PAUSE BIG TRIGGER BUTTON (Fades out when playing) */}
        {(!isPlaying || showControls) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="pointer-events-auto p-5 sm:p-6 rounded-full bg-slate-950/80 hover:bg-amber-500 border-2 border-amber-400/80 text-amber-300 hover:text-slate-950 shadow-2xl backdrop-blur-md transition-all transform hover:scale-110 active:scale-95"
            >
              {isPlaying ? <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-current" /> : <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current translate-x-0.5" />}
            </button>
          </div>
        )}

        {/* BOTTOM HUD & REAL-TIME SETTLEMENT TELEMETRY */}
        <div className="relative z-20 p-4 sm:p-6 space-y-3 pointer-events-none">
          {/* Active Scenario Card Preview Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 max-w-2xl">
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/85 border border-amber-500/30 backdrop-blur-md space-y-1">
              <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{lang === 'id' ? currentScenario.tagId : currentScenario.tagEn}</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400 font-extrabold">{currentScenario.amountSar}</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white">
                {lang === 'id' ? currentScenario.titleId : currentScenario.titleEn}
              </div>
              <div className="text-[11px] font-mono text-slate-400 truncate">
                ⚡ {lang === 'id' ? currentScenario.telemetryId : currentScenario.telemetryEn}
              </div>
            </div>
          </div>

          {/* PLAYER CONTROLS DOCK */}
          <div
            className={`pointer-events-auto p-3 rounded-2xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-xl space-y-2.5 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 sm:opacity-40 hover:opacity-100'
            }`}
          >
            {/* Scrubber Timeline Bar */}
            <div
              onClick={handleScrub}
              className="relative w-full h-2.5 rounded-full bg-slate-800/80 cursor-pointer group/bar flex items-center"
            >
              {/* Scene Segment Markers */}
              <div className="absolute inset-0 flex justify-between pointer-events-none px-0.5">
                {[0, 15, 30, 45].map((mark) => (
                  <span
                    key={mark}
                    style={{ left: `${(mark / duration) * 100}%` }}
                    className="absolute w-0.5 h-full bg-slate-600/70"
                  />
                ))}
              </div>

              {/* Progress Fill */}
              <div
                style={{ width: `${(currentTime / duration) * 100}%` }}
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 relative transition-all duration-75"
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow border-2 border-amber-500 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Bottom Controls Strip */}
            <div className="flex items-center justify-between flex-wrap gap-3 text-xs font-mono text-slate-300">
              {/* Left Transport buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-white transition-colors"
                  title={isPlaying ? t.videoPause : t.videoPlay}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title={t.videoReplay}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Time Display */}
                <div className="px-2 text-slate-400">
                  <span className="text-white font-bold">{formatTime(currentTime)}</span>
                  <span className="text-slate-600"> / </span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Chapter selector quick-jumps */}
              <div className="hidden lg:flex items-center gap-1.5">
                {scenarios.map((sc, idx) => (
                  <button
                    key={sc.id}
                    onClick={() => jumpToScenario(sc)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                      currentScenarioIndex === idx
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    CH 0{idx + 1}
                  </button>
                ))}
              </div>

              {/* Right Controls: Audio, Speed, Fullscreen */}
              <div className="flex items-center gap-2">
                {/* Audio Synth Toggle */}
                <button
                  onClick={toggleAudio}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  title={isMuted ? t.videoUnmute : t.videoMute}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  <span className="text-[10px] hidden sm:inline">
                    {isMuted ? 'Muted' : 'Audio On'}
                  </span>
                </button>

                {/* Speed Switcher */}
                <button
                  onClick={() => {
                    const next = playbackSpeed === 1 ? 1.5 : playbackSpeed === 1.5 ? 0.75 : 1;
                    setPlaybackSpeed(next);
                  }}
                  className="px-2 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-[11px]"
                >
                  {playbackSpeed}x
                </button>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title={isFullscreen ? t.videoExitFullscreen : t.videoFullscreen}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 INTERACTIVE SCENARIO DEEP-DIVE CARDS */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Interactive Real-World SAR Scenarios</span>
          </div>
          <span className="text-xs font-mono text-amber-500">
            Click scenario to jump playback
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenarios.map((sc, idx) => {
            const isActive = currentScenarioIndex === idx;
            return (
              <div
                key={sc.id}
                onClick={() => jumpToScenario(sc)}
                className={`group cursor-pointer p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'bg-gradient-to-b from-[#0B1226] to-[#070D1D] border-2 border-amber-500/70 shadow-lg shadow-amber-500/10'
                    : 'bg-[#070B16] border border-slate-800/90 hover:border-amber-500/40'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Thumbnail snippet */}
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-800">
                    <img
                      src={sc.image}
                      alt={sc.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold">
                      CH 0{idx + 1}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/90 text-emerald-400 text-[10px] font-mono font-extrabold border border-emerald-500/30">
                      {sc.amountSar}
                    </div>
                  </div>

                  {/* Tag */}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {lang === 'id' ? sc.tagId : sc.tagEn}
                  </span>

                  {/* Title */}
                  <h4 className="font-display text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {lang === 'id' ? sc.titleId : sc.titleEn}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {lang === 'id' ? sc.descId : sc.descEn}
                  </p>
                </div>

                {/* Footer cue */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="truncate">{sc.merchantOrNode.split('·')[0]}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400 translate-x-0.5' : 'text-slate-600'} transition-transform`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mandatory Conceptual Simulation Notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.videoNotice}
        </p>
      </div>
    </div>
  );
};
