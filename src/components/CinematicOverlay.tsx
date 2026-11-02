import React, { useMemo } from 'react';
import { StoryChapter } from '../types/video';
import { Sparkles, Cpu, Mic, MessageSquare, Code2, Film, Network, Volume2, ShieldCheck, Zap } from 'lucide-react';

interface CinematicOverlayProps {
  currentTime: number;
  duration: number;
  currentChapter: StoryChapter;
  audioData: Uint8Array;
  onOrbClick?: () => void;
  showOriginalOverlay?: boolean;
}

export const CinematicOverlay: React.FC<CinematicOverlayProps> = ({
  currentTime,
  currentChapter,
  audioData,
  onOrbClick,
}) => {
  // Compute average voice wave heights from Web Audio analyser
  const waveHeights = useMemo(() => {
    const bars = 8;
    const heights = [];
    for (let i = 0; i < bars; i++) {
      const val = audioData[i * 2] || 0;
      const height = Math.max(12, (val / 255) * 48);
      heights.push(height);
    }
    return heights;
  }, [audioData]);

  // Dynamic chat dialog based on chapter
  const chatDialog = useMemo(() => {
    switch (currentChapter.focusFeature) {
      case 'genesis':
        return {
          user: 'Hello, Orken AI. Initialize autonomous neural core.',
          robot: 'Neural cognition active. Running on Groq LPUs at maximum throughput.',
        };
      case 'chat':
        return {
          user: 'Compare latency across 10,000 parallel enterprise inference requests.',
          robot: 'Resolved in 18ms. Ultra-low latency sustained without throttling.',
        };
      case 'webdev':
        return {
          user: 'Build and deploy a responsive high-frequency trading platform with live WebSockets.',
          robot: 'Synthesized React + Vite + Tailwind + Backend microservices. Architecture deployed.',
        };
      case 'media':
        return {
          user: 'Generate a 4K photorealistic cinematic trailer of deep space orbital station.',
          robot: '60 FPS neural motion frames rendered. Chromatic depth applied.',
        };
      case 'automation':
        return {
          user: 'Orchestrate global inventory, autonomous customer support, and financial reporting.',
          robot: 'Executing across 4,200 nodes. Autonomous agents dispatched with zero human intervention.',
        };
      case 'finale':
      default:
        return {
          user: 'What is the ceiling of human and machine potential?',
          robot: 'There are no limits. Welcome to the era of Orken AI.',
        };
    }
  }, [currentChapter.focusFeature]);

  const isFinale = currentChapter.focusFeature === 'finale';

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between overflow-hidden">
      {/* Cinematic Top Letterbox Bar & Brand Header */}
      <div className="w-full bg-gradient-to-b from-[#01040f]/90 via-[#01040f]/50 to-transparent pt-4 pb-12 px-6 sm:px-12 flex items-center justify-between">
        {/* Exact Authentic ORKEN AI Brand & Logo */}
        <div className="flex items-center gap-4 pointer-events-auto select-none">
          {/* Logo Glyph (Ribbon styled triangular icon) */}
          <div className="relative w-11 h-11 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 blur-md" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[2px] shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <div className="w-full h-full bg-[#03091e] rounded-[10px] flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-7 h-7 text-cyan-400 fill-current drop-shadow-[0_0_8px_#00f0ff]">
                  <path d="M 50 15 C 32 15 18 35 22 58 C 26 80 48 88 68 82 C 86 76 90 55 82 40 C 75 27 60 15 50 15 Z M 48 34 C 55 34 65 42 66 52 C 67 62 58 68 50 67 C 40 66 36 55 38 46 C 40 38 44 34 48 34 Z" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Outfit'] text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                Orken <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">AI</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 tracking-wider font-semibold">
                v3.8 Neo
              </span>
            </div>
            {/* Exactly preserving the "Powered by Groq" text with clean lines */}
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-cyan-500/60" />
              <span className="text-xs font-medium text-slate-300 tracking-wide flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                Powered by <strong className="text-cyan-300 font-bold tracking-normal">Groq</strong>
              </span>
              <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-cyan-500/60" />
            </div>
          </div>
        </div>

        {/* Global Keynote Broadcast Badge & Live Metrics */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/40 border border-cyan-500/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
            <span className="text-xs font-mono font-medium text-cyan-200 uppercase tracking-widest">
              Cinematic Showcase • 30S
            </span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-300 font-semibold">
              {currentChapter.badge}
            </span>
          </div>
        </div>
      </div>

      {/* Center Cinematic Stage Overlays */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col justify-between py-2">
        {/* Top-Mid Feature Title & Tagline */}
        <div className="text-center transition-all duration-700 transform">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono tracking-wider font-semibold shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            {currentChapter.title}
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight font-['Outfit'] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {currentChapter.subtitle}
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100/80 max-w-xl mx-auto mt-0.5 font-['Plus_Jakarta_Sans'] font-medium">
            {currentChapter.tagline}
          </p>
        </div>

        {/* Floating Chatbot Message Interfaces (Faithful to original artwork) */}
        {!isFinale && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 items-center pointer-events-auto my-auto">
            {/* Left Glass Bubble: User Chat Card */}
            <div className="justify-self-start max-w-sm sm:max-w-md w-full bg-[#0a1533]/85 hover:bg-[#0c1a40]/90 border border-cyan-500/40 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,180,255,0.18)] backdrop-blur-md transition-all duration-500 hover:scale-[1.02] relative group">
              {/* Glass shine edge */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
              <div className="flex items-start gap-3">
                {/* User avatar circle matching image */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                  <div className="w-full h-full rounded-full bg-[#05112c] flex items-center justify-center">
                    <svg className="w-4 h-4 text-cyan-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                      User Prompt
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      0:{(currentTime % 60).toFixed(1)}s
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-100 font-medium mt-1 leading-snug">
                    {chatDialog.user}
                  </p>
                  {/* Subtle placeholder line bars from original image */}
                  <div className="flex flex-col gap-1.5 mt-2.5 opacity-60">
                    <div className="h-1.5 w-3/4 rounded-full bg-cyan-400/40" />
                    <div className="h-1.5 w-1/2 rounded-full bg-cyan-400/25" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Glass Bubble: Orken AI Assistant Reply Card */}
            <div className="justify-self-end max-w-sm sm:max-w-md w-full bg-[#06122e]/90 hover:bg-[#09183d]/95 border border-cyan-400/50 rounded-2xl p-4 shadow-[0_0_35px_rgba(0,240,255,0.25)] backdrop-blur-md transition-all duration-500 hover:scale-[1.02] relative group">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
              <div className="flex items-start gap-3">
                {/* Robot Assistant avatar circle matching image */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[1.5px] shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.7)] animate-pulse">
                  <div className="w-full h-full rounded-full bg-[#040e24] flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                      <circle cx="12" cy="5" r="2" />
                      <path d="M12 7v4" />
                      <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" />
                      <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" />
                    </svg>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      Orken AI Response
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                      Groq LPU
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-cyan-50 font-medium mt-1 leading-snug">
                    {chatDialog.robot}
                  </p>
                  <div className="flex flex-col gap-1.5 mt-2.5 opacity-70">
                    <div className="h-1.5 w-5/6 rounded-full bg-cyan-300/50" />
                    <div className="h-1.5 w-2/3 rounded-full bg-cyan-300/30" />
                    <div className="h-1.5 w-1/3 rounded-full bg-cyan-300/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Microphone & Dynamic Real-Time Voice Waveform Badge (Matching image) */}
        {!isFinale && (
          <div className="self-end flex items-center gap-3 bg-[#05112e]/85 border border-cyan-400/50 rounded-full px-4 py-2 shadow-[0_0_25px_rgba(0,240,255,0.3)] backdrop-blur-md pointer-events-auto select-none transition-transform hover:scale-105">
            {/* Glowing Microphone Orb */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-400 to-sky-300 p-[2px] shadow-[0_0_15px_#00f0ff] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#040e26] flex items-center justify-center">
                <Mic className="w-5 h-5 text-white drop-shadow-[0_0_6px_#00f0ff]" />
              </div>
            </div>

            {/* Real-time Frequency Voice Bars */}
            <div className="flex items-center gap-1 h-8 px-1">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full bg-gradient-to-t from-blue-500 via-cyan-400 to-white shadow-[0_0_6px_rgba(0,240,255,0.6)] transition-all duration-75"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            <div className="hidden sm:block pl-1 pr-2">
              <div className="text-[10px] font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                Voice Assistant
              </div>
              <div className="text-[9px] font-mono text-slate-400">
                Ultra-low latency
              </div>
            </div>
          </div>
        )}

        {/* GRAND FINALE CLIMAX OVERLAY (25s - 30s) */}
        {isFinale && (
          <div className="w-full my-auto flex flex-col items-center justify-center text-center animate-fadeIn pointer-events-auto">
            {/* Glowing Orken AI Mega Emblem */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-3xl transform scale-150 animate-pulse" />
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[3px] shadow-[0_0_60px_rgba(0,240,255,0.7)] flex items-center justify-center">
                <div className="w-full h-full bg-[#020718] rounded-[22px] flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400 fill-current drop-shadow-[0_0_20px_#00f0ff]">
                    <path d="M 50 15 C 32 15 18 35 22 58 C 26 80 48 88 68 82 C 86 76 90 55 82 40 C 75 27 60 15 50 15 Z M 48 34 C 55 34 65 42 66 52 C 67 62 58 68 50 67 C 40 66 36 55 38 46 C 40 38 44 34 48 34 Z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* User Mandated Finale Title: "ORKEN AI – Intelligence Beyond Limits" */}
            <h1 className="text-3xl sm:text-6xl font-black font-['Outfit'] text-white tracking-tight uppercase drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">
              ORKEN AI
            </h1>
            <div className="mt-2 text-xl sm:text-3xl font-bold font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 tracking-wide drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]">
              Intelligence Beyond Limits
            </div>

            {/* Preserving "Powered by Groq" text faithfully */}
            <div className="flex items-center gap-3 mt-4">
              <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-cyan-400" />
              <span className="text-sm sm:text-base font-semibold text-slate-200 tracking-wider font-['Plus_Jakarta_Sans']">
                Powered by <strong className="text-cyan-300 font-bold text-base sm:text-lg">Groq</strong>
              </span>
              <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-cyan-400" />
            </div>

            <p className="mt-4 text-xs sm:text-sm text-cyan-100/70 max-w-lg font-mono">
              Intelligent Assistants • Autonomous Web Dev • AI Video & Images • Enterprise Automation
            </p>
          </div>
        )}

        {/* Feature Stat Pill & Chapter Description (Bottom edge of stage) */}
        {!isFinale && (
          <div className="w-full flex items-center justify-between text-xs font-mono text-cyan-300/80 pt-2 border-t border-cyan-500/20">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{currentChapter.captions.description}</span>
            </div>
            <div className="hidden sm:block font-bold text-white bg-cyan-950/60 px-3 py-1 rounded border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
              {currentChapter.captions.stat}
            </div>
          </div>
        )}
      </div>

      {/* Subtle bottom letterbox spacer (Control Dock sits over this) */}
      <div className="h-24 w-full bg-gradient-to-t from-[#01040f] via-[#01040f]/60 to-transparent" />
    </div>
  );
};
