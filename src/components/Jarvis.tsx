import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Minimize2,
  Maximize2,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Cpu,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { CONTRACT_ADDRESS, BSCSCAN_TOKEN_URL, PANCAKESWAP_SWAP_URL } from '../services/blockchain';

interface Message {
  id: string;
  sender: 'user' | 'jarvis';
  text: string;
  timestamp: string;
}

interface JarvisProps {
  lang: Language;
}

/**
 * Dedicated, reusable voice-selection function for JARVIS AI.
 * Selects an executive masculine-presenting voice whenever available,
 * prioritizing target session language (en or id) with graceful fallback.
 */
export function selectJarvisVoice(
  voices: SpeechSynthesisVoice[],
  lang: Language
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) {
    return null;
  }

  // Language matching predicate
  const isTargetLanguage = (voice: SpeechSynthesisVoice): boolean => {
    const vLang = (voice.lang || '').toLowerCase().replace(/_/g, '-');
    if (lang === 'id') {
      return vLang.startsWith('id') || vLang.startsWith('in'); // 'in' is historic ISO 639-1 code
    }
    return vLang.startsWith('en');
  };

  // Known masculine tokens across Windows, Edge, Chrome, macOS, iOS, Android
  const maleKeywords = [
    'male',
    'pria',
    'guy',
    'christopher',
    'eric',
    'brian',
    'ryan',
    'david',
    'george',
    'mark',
    'daniel',
    'oliver',
    'alex',
    'arthur',
    'aaron',
    'fred',
    'rishi',
    'thomas',
    'tom',
    'gordon',
    'steffan',
    'roger',
    'frank',
    'benjamin',
    // Indonesian known male voice identifiers
    'ardi',
    'andika',
    'guruh',
    'budi',
    'agus',
    'reza',
    'fajar'
  ];

  const maleRegex = new RegExp(`(^|[\\s_.\\-()])(${maleKeywords.join('|')})([\\s_.\\-()]|$)`, 'i');

  // Google / Neural male voice model code suffixes (e.g., -b, -d, -j)
  const googleMalePattern = new RegExp('(?:-b|-d|-j)(?:[\\s_().-]|$)', 'i');

  // Known feminine voice tokens to deprioritize
  const femaleKeywords = [
    'female',
    'woman',
    'wanita',
    'cewek',
    'zira',
    'hazel',
    'susan',
    'catherine',
    'jenny',
    'aria',
    'sonia',
    'libby',
    'mia',
    'natasha',
    'ava',
    'michelle',
    'damayanti',
    'gadis',
    'siti',
    'sari',
    'yuni',
    'samantha',
    'victoria',
    'karen',
    'moira',
    'tessa',
    'fiona',
    'veena',
    'serena',
    'kate',
    'allison'
  ];

  const femaleRegex = new RegExp(`(^|[\\s_.\\-()])(${femaleKeywords.join('|')})([\\s_.\\-()]|$)`, 'i');

  // Multi-tier heuristic scoring algorithm
  const scoreVoice = (voice: SpeechSynthesisVoice): number => {
    let score = 0;
    const name = voice.name || '';
    const vLang = (voice.lang || '').toLowerCase().replace(/_/g, '-');
    const targetMatch = isTargetLanguage(voice);

    // 1. Language matching is the highest baseline requirement
    if (targetMatch) {
      score += 10000;

      // Subtle preference for primary dialect accents
      if (lang === 'en') {
        if (vLang === 'en-gb') score += 250; // Iconic executive British JARVIS cadence
        else if (vLang === 'en-us') score += 180;
      } else if (lang === 'id') {
        if (vLang === 'id-id' || vLang === 'in-id') score += 250;
      }
    } else {
      // Unrelated language is heavily penalized
      score -= 6000;
    }

    // 2. Masculine indicators bonus
    if (maleRegex.test(name)) {
      score += 3500;
    }
    if (googleMalePattern.test(name)) {
      score += 2500;
    }

    // 3. Feminine indicators penalty
    if (femaleRegex.test(name)) {
      score -= 4000;
    }

    // 4. Natural / Neural / High Quality bonus
    if (/natural|neural|online|enhanced|premium|high\s*quality/i.test(name)) {
      score += 400;
    }

    // 5. System default voice tiebreaker
    if (voice.default) {
      score += 50;
    }

    return score;
  };

  // Group candidate voices matching the requested language
  const targetVoices = voices.filter(isTargetLanguage);

  if (targetVoices.length > 0) {
    // Sort matching language voices by heuristic score descending
    const rankedTarget = targetVoices
      .map((v) => ({ voice: v, score: scoreVoice(v) }))
      .sort((a, b) => b.score - a.score);

    return rankedTarget[0].voice;
  }

  // Fallback: If no voice matches the requested language, pick the best from all available voices
  const rankedAll = voices
    .map((v) => ({ voice: v, score: scoreVoice(v) }))
    .sort((a, b) => b.score - a.score);

  return rankedAll[0]?.voice || voices[0] || null;
}

export const Jarvis: React.FC<JarvisProps> = ({ lang }) => {
  const t = translations[lang].jarvis;
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'jarvis',
      text: t.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Update initial message on language toggle if user hasn't started chatting yet
  useEffect(() => {
    if (messages.length === 1 && messages[0].sender === 'jarvis') {
      setMessages([
        {
          id: 'init-1',
          sender: 'jarvis',
          text: t.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [lang, t.welcomeMessage]);

  // Voice enumeration and lifecycle management
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    setSpeechSupported(true);

    const updateVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      } catch (err) {
        console.error('Failed to load voices:', err);
      }
    };

    updateVoices();

    // Standard event listener for async voice loading
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
    window.speechSynthesis.addEventListener?.('voiceschanged', updateVoices);

    return () => {
      if ('onvoiceschanged' in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
      window.speechSynthesis.removeEventListener?.('voiceschanged', updateVoices);
    };
  }, []);

  // Dedicated voice evaluation when language or available voice list updates
  useEffect(() => {
    if (availableVoices.length > 0) {
      const voice = selectJarvisVoice(availableVoices, lang);
      setSelectedVoice(voice);
    }
  }, [availableVoices, lang]);

  // Check Web Speech Recognition API capabilities
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setRecognitionSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = lang === 'id' ? 'id-ID' : 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputValue(transcript);
            handleSendMessage(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [lang]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized]);

  // Voice speech synthesis with masculine executive timbre
  const speakText = (text: string, msgId?: string) => {
    if (!speechSupported || typeof window === 'undefined') return;

    // Stop ongoing speech
    window.speechSynthesis.cancel();

    if (isSpeaking && activeSpeakingId === (msgId || 'top-hud')) {
      setIsSpeaking(false);
      setActiveSpeakingId(null);
      return;
    }

    const cleanText = text
      .replace(/[*#_`\[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/0x[a-fA-F0-9]{40}/g, 'smart contract address');

    if (!cleanText.trim()) return;

    // Identify active masculine voice or best matching fallback
    const voiceToUse =
      selectedVoice ||
      selectJarvisVoice(
        availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices(),
        lang
      );

    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (voiceToUse) {
      utterance.voice = voiceToUse;
      utterance.lang = voiceToUse.lang || (lang === 'id' ? 'id-ID' : 'en-US');
    } else {
      utterance.lang = lang === 'id' ? 'id-ID' : 'en-US';
    }

    // Executive vocal delivery settings: calm, mature, slightly deep baritone
    utterance.rate = 0.98; // Natural, composed executive cadence
    utterance.pitch = 0.90; // Modest pitch lowering for masculine resonance

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveSpeakingId(msgId || 'top-hud');
    };

    utterance.onend = () => {
      currentUtteranceRef.current = null;
      setIsSpeaking(false);
      setActiveSpeakingId(null);
    };

    utterance.onerror = () => {
      currentUtteranceRef.current = null;
      setIsSpeaking(false);
      setActiveSpeakingId(null);
    };

    // Keep reference in ref to prevent Chromium garbage-collection cutoff bug
    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      currentUtteranceRef.current = null;
      setIsSpeaking(false);
      setActiveSpeakingId(null);
    }
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (!recognitionSupported || !recognitionRef.current) {
      alert(t.speechNotSupported);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      recognitionRef.current.lang = lang === 'id' ? 'id-ID' : 'en-US';
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }
  };

  // Handle message send
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    stopSpeaking();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/jarvis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          lang,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.reply || (lang === 'id' ? 'Respons tidak tersedia.' : 'Response unavailable.');

      const jarvisMessage: Message = {
        id: `jarvis-${Date.now()}`,
        sender: 'jarvis',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, jarvisMessage]);
    } catch (error) {
      console.error('JARVIS communication error:', error);
      const fallbackMsg: Message = {
        id: `jarvis-err-${Date.now()}`,
        sender: 'jarvis',
        text:
          lang === 'id'
            ? 'Maaf, terjadi gangguan komunikasi pada backend server. Namun Anda dapat memeriksa langsung kontrak resmi SAR di BscScan: ' +
              CONTRACT_ADDRESS
            : 'Apologies, communication with the AI server encountered an error. However, you can verify official SAR parameters directly on BscScan: ' +
              CONTRACT_ADDRESS,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* HUD Floating Launch Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center group">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="relative flex items-center gap-3 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-slate-950/90 border border-amber-500/50 hover:border-amber-400 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.45)] backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label={t.openJarvis}
          >
            {/* Pulsing ring indicator */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>

            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-400 animate-pulse" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-mono font-bold tracking-wider text-amber-300">
                  {t.name}
                </span>
                <span className="text-[10px] text-slate-400 font-sans">{t.badge}</span>
              </div>
            </div>

            <Sparkles className="w-3.5 h-3.5 text-amber-400/80 hidden sm:block" />
          </button>
        </div>
      )}

      {/* JARVIS Autonomous HUD Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 w-[94vw] sm:w-[440px] md:w-[480px] bg-[#070B14]/95 border border-amber-500/40 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.2)] backdrop-blur-2xl flex flex-col transition-all duration-300 overflow-hidden ${
            isMinimized ? 'h-[68px]' : 'h-[620px] max-h-[85vh]'
          }`}
        >
          {/* Futuristic Top HUD Banner */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-950 via-[#0B1120] to-slate-950 border-b border-amber-500/20 flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <Cpu className="w-4 h-4 text-amber-400 animate-spin-slow" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-300 tracking-wider">
                    {t.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                    BSC 56
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400/90 font-mono tracking-tight flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {t.onlineStatus}
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              {speechSupported && !isMinimized && (
                <button
                  onClick={isSpeaking ? stopSpeaking : () => speakText(messages[messages.length - 1]?.text || '', 'top-hud')}
                  className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
                    isSpeaking ? 'text-amber-400 bg-amber-500/20' : 'hover:text-slate-200'
                  }`}
                  title={isSpeaking ? t.speechStop : `${t.speechSpeak} (${selectedVoice?.name || 'Masculine Voice'})`}
                >
                  {isSpeaking ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                </button>
              )}

              <button
                onClick={() => {
                  stopSpeaking();
                  setIsMinimized(!isMinimized);
                }}
                className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors"
                title={isMinimized ? t.expand : t.minimize}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded hover:bg-red-500/20 hover:text-red-400 transition-colors"
                title={t.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Chat Body */}
          {!isMinimized && (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-slate-800">
                {/* Protocol Security Notice */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{t.disclaimer}</p>
                </div>

                {/* Quick Prompts Bar */}
                {messages.length <= 2 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-amber-500" />
                      <span>Recommended Queries</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[t.quickPrompt1, t.quickPrompt2, t.quickPrompt3, t.quickPrompt4].map(
                        (prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(prompt)}
                            className="text-left px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-[11px] transition-all flex items-center justify-between group"
                          >
                            <span>{prompt}</span>
                            <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Messages Sequence */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] font-mono text-slate-400 w-full">
                      {msg.sender === 'jarvis' ? (
                        <>
                          <Bot className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-400 font-semibold">JARVIS</span>
                        </>
                      ) : (
                        <span className="text-slate-400">YOU</span>
                      )}
                      <span>·</span>
                      <span>{msg.timestamp}</span>

                      {/* Individual Message Speech Control */}
                      {msg.sender === 'jarvis' && speechSupported && (
                        <button
                          onClick={() => {
                            if (isSpeaking && activeSpeakingId === msg.id) {
                              stopSpeaking();
                            } else {
                              speakText(msg.text, msg.id);
                            }
                          }}
                          className={`ml-auto p-1 rounded transition-colors ${
                            isSpeaking && activeSpeakingId === msg.id
                              ? 'text-amber-400 bg-amber-500/20'
                              : 'text-slate-500 hover:text-amber-400'
                          }`}
                          title={isSpeaking && activeSpeakingId === msg.id ? t.speechStop : `${t.speechSpeak} (${selectedVoice?.name || 'Masculine Voice'})`}
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isSpeaking && activeSpeakingId === msg.id ? 'animate-pulse' : ''}`} />
                        </button>
                      )}
                    </div>

                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap text-[12px] ${
                        msg.sender === 'user'
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-sm shadow-md'
                          : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-sm shadow-inner'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Action pill if JARVIS references official contract */}
                    {msg.sender === 'jarvis' && msg.text.includes(CONTRACT_ADDRESS) && (
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        <a
                          href={BSCSCAN_TOKEN_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-amber-500/30 text-[10px] font-mono text-amber-400 hover:bg-amber-500/10 transition-colors"
                        >
                          <span>BscScan Verified</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                        <a
                          href={PANCAKESWAP_SWAP_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-amber-500/30 text-[10px] font-mono text-amber-400 hover:bg-amber-500/10 transition-colors"
                        >
                          <span>PancakeSwap Pool</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}

                {/* Thinking / Analyzing Indicator */}
                {isLoading && (
                  <div className="flex flex-col items-start space-y-1">
                    <div className="flex items-center gap-1.5 px-1 text-[10px] font-mono text-amber-400">
                      <Bot className="w-3 h-3 text-amber-400" />
                      <span>JARVIS</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-900/90 border border-amber-500/30 rounded-tl-sm flex items-center gap-2 text-slate-400 text-xs">
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      <span className="font-mono text-[11px] text-amber-300">{t.thinking}</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-slate-950/90 border-t border-slate-800/80">
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? t.speechListening : t.inputPlaceholder}
                    disabled={isLoading}
                    className="flex-1 bg-slate-900/90 border border-slate-700/80 focus:border-amber-500/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50"
                  />

                  {/* Mic Button for Speech-to-Text */}
                  {recognitionSupported && (
                    <button
                      onClick={toggleListening}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isListening
                          ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                          : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40'
                      }`}
                      title={isListening ? 'Stop listening' : 'Speak to JARVIS'}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  )}

                  {/* Send Button */}
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:hover:bg-amber-500 shadow-sm"
                    title={t.sendButton}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
