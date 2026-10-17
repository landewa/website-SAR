import React, { useState } from 'react';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import { 
  CONTRACT_ADDRESS, 
  BSCSCAN_TOKEN_URL, 
  PANCAKESWAP_PAIR_URL, 
  CHAIN_ID 
} from '../services/blockchain';
import {
  Wallet,
  Coins,
  ArrowRightLeft,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  PlusCircle,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';

interface HowToGetSarProps {
  lang: Language;
}

export const HowToGetSar: React.FC<HowToGetSarProps> = ({ lang }) => {
  const t = translations[lang].howToGet;
  const [copied, setCopied] = useState(false);
  const [walletMsg, setWalletMsg] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Copy Contract Address
  const handleCopy = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // 1-Click Add SAR to Web3 Wallet (MetaMask, Trust Wallet, Rabby, etc.)
  const handleAddTokenToWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const wasAdded = await (window as any).ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: CONTRACT_ADDRESS,
              symbol: 'SAR',
              decimals: 18,
              image: 'https://saadareserve.com/token-sar.png',
            },
          },
        });
        if (wasAdded) {
          setWalletMsg(t.walletAddedSuccess);
        } else {
          setWalletMsg(lang === 'id' ? 'Permintaan dibatalkan oleh pengguna.' : 'Request was cancelled by user.');
        }
      } catch (err: any) {
        setWalletMsg(err?.message || (lang === 'id' ? 'Gagal menambahkan token.' : 'Failed to add token.'));
      }
    } else {
      setWalletMsg(t.walletNotFound);
    }

    setTimeout(() => setWalletMsg(null), 5000);
  };

  const steps = [
    {
      id: 0,
      stepNumber: t.step1Number,
      title: t.step1Title,
      desc: t.step1Desc,
      icon: Wallet,
      actionLabel: lang === 'id' ? 'Rekomendasi: MetaMask / Trust Wallet' : 'Recommended: MetaMask / Trust Wallet',
      tip: lang === 'id' ? 'Selalu buat cadangan seed phrase di tempat aman' : 'Always backup your seed phrase securely offline',
    },
    {
      id: 1,
      stepNumber: t.step2Number,
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Coins,
      actionLabel: lang === 'id' ? 'Gunakan Jaringan BEP-20 (BSC)' : 'Use BEP-20 (BSC) Network',
      tip: lang === 'id' ? 'Sisakan ~0.005 BNB untuk gas fee jaringan' : 'Reserve ~0.005 BNB for network gas fees',
    },
    {
      id: 2,
      stepNumber: t.step3Number,
      title: t.step3Title,
      desc: t.step3Desc,
      icon: ArrowRightLeft,
      actionLabel: lang === 'id' ? 'Buka PancakeSwap Resmi' : 'Open Official PancakeSwap',
      tip: lang === 'id' ? 'Pastikan URL adalah pancakeswap.finance' : 'Verify URL is pancakeswap.finance',
    },
    {
      id: 3,
      stepNumber: t.step4Number,
      title: t.step4Title,
      desc: t.step4Desc,
      icon: PlusCircle,
      actionLabel: lang === 'id' ? 'Tempelkan Alamat Kontrak Resmi' : 'Paste Official Contract Address',
      tip: lang === 'id' ? 'Atur slippage 0.5% - 1.0%' : 'Set slippage 0.5% - 1.0%',
    },
    {
      id: 4,
      stepNumber: t.step5Number,
      title: t.step5Title,
      desc: t.step5Desc,
      icon: ShieldCheck,
      actionLabel: lang === 'id' ? 'Tampilkan Token di Dompet' : 'View Token in Wallet',
      tip: lang === 'id' ? 'Kini Anda resmi memiliki SAR BEP-20' : 'You now officially hold SAR BEP-20',
    },
  ];

  return (
    <section 
      id="how-to-get" 
      className="relative py-20 lg:py-28 overflow-hidden bg-[#070B16] border-b border-slate-800/80"
    >
      {/* Decorative Glow Mesh */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-emerald-600/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium text-amber-400 bg-amber-500/10 border border-amber-500/25 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.sectionBadge}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              <span className="text-gold-gradient">{t.sectionTitle}</span>
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-400 leading-relaxed">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* Quick Action Group */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={PANCAKESWAP_PAIR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/10"
            >
              <span>{t.openPancakeSwapBtn}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-mono text-xs">{t.copiedContract}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>{t.copyContractBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5-Step Progressive Tutorial Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = activeStep === idx;

            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`relative rounded-xl p-5 border flex flex-col justify-between transition-all cursor-pointer group ${
                  isCurrent
                    ? 'bg-gradient-to-b from-[#0F172A] to-[#090D1C] border-amber-500/60 shadow-xl shadow-amber-500/5 -translate-y-1'
                    : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Step Pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-800 text-amber-400 group-hover:bg-slate-700'
                  }`}>
                    {step.stepNumber}
                  </span>
                  <div className={`p-2 rounded-lg transition-colors ${
                    isCurrent ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800/80 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1">
                  <h3 className={`font-display text-base font-bold transition-colors ${
                    isCurrent ? 'text-white' : 'text-slate-200'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Micro Tip */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                  <CheckCircle2 className="w-3 h-3 text-amber-500 shrink-0" />
                  <span className="truncate">{step.tip}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Utility Deck: 1-Click Wallet Integration & Network Parameters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Quick Execution Card & 1-Click Add Asset */}
          <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0A1020] to-[#070B16] border border-slate-800 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'id' ? 'INTEGRASI CEPAT DOMPET' : 'INSTANT WALLET INTEGRATION'}</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                {lang === 'id' ? 'Tambahkan SAR ke Dompet dengan 1-Klik' : 'Add SAR to Your Wallet with 1 Click'}
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                {lang === 'id'
                  ? 'Klik tombol di bawah untuk meminta browser/ekstensi dompet Web3 Anda (MetaMask, Rabby, Trust Wallet) menambahkan token SAR secara otomatis.'
                  : 'Click the button below to prompt your Web3 browser extension (MetaMask, Rabby, Trust Wallet) to automatically track the SAR token balance.'}
              </p>
            </div>

            {/* Interactive Contract Bar */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  {t.officialContractLabel}
                </div>
                <div className="text-xs font-mono text-amber-300 truncate select-all">
                  {CONTRACT_ADDRESS}
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{lang === 'id' ? 'Tersalin' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lang === 'id' ? 'Salin Kontrak' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddTokenToWallet}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-md hover:shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.addTokenToWalletBtn}</span>
              </button>

              <a
                href={BSCSCAN_TOKEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <span>{t.inspectBscScanBtn}</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* In-app Toast / Status Message */}
            {walletMsg && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{walletMsg}</span>
              </div>
            )}
          </div>

          {/* Right: Technical Parameters & Safety Checklist */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            
            {/* Parameters Card */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.networkDetailsTitle}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase">{t.networkLabel}</div>
                  <div className="text-white font-semibold mt-0.5 truncate">{t.networkVal}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase">{t.chainIdLabel}</div>
                  <div className="text-white font-semibold mt-0.5">{CHAIN_ID} (0x38)</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase">{t.tokenSymbolLabel}</div>
                  <div className="text-amber-400 font-bold mt-0.5">SAR</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase">{t.decimalsLabel}</div>
                  <div className="text-white font-semibold mt-0.5">18</div>
                </div>
              </div>
            </div>

            {/* Beginner Anti-Scam Security Notice */}
            <div className="rounded-2xl bg-gradient-to-b from-[#180A0A]/90 to-[#0F0808]/90 border border-rose-900/40 p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{t.safetyTitle}</span>
              </div>
              <ul className="space-y-2 text-xs text-rose-300/80 leading-relaxed list-disc list-inside">
                <li>{t.safety1}</li>
                <li>{t.safety2}</li>
                <li>{t.safety3}</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
