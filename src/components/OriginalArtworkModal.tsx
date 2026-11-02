import React from 'react';
import { X, CheckCircle, Sparkles, ExternalLink } from 'lucide-react';

interface OriginalArtworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalArtworkModal: React.FC<OriginalArtworkModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-2xl w-full bg-[#050f28] border border-cyan-400/50 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,240,255,0.3)] flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-['Outfit'] text-lg font-bold text-white">
                Original ORKEN AI Source Artwork
              </h3>
              <p className="text-xs font-mono text-cyan-300/80">
                Faithful 3D adaptation into a 30-second cinematic promo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image Preview & Highlights */}
        <div className="mt-4 flex flex-col md:flex-row gap-5 items-center">
          <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.2)] bg-black/50 relative group">
            <img
              src="/assets/aistudio/Orken_AI__Neon_Orb_Assistant_623bb0f2.png"
              alt="Original Orken AI Neon Orb Assistant"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-black/75 px-3 py-1 rounded-lg text-[10px] font-mono text-cyan-300 border border-cyan-500/30 text-center">
              Original Reference Artwork
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-3 text-xs text-slate-300 font-['Plus_Jakarta_Sans']">
            <h4 className="text-sm font-semibold text-white font-['Outfit'] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              Verified Artwork Elements
            </h4>

            <div className="flex flex-col gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20">
                <span className="text-cyan-400 font-bold">1. Brand & Logo:</span>
                <p className="text-slate-300 mt-0.5">
                  The original stylized triangular cyan ribbon emblem, "Orken AI" brand name, and exact "Powered by Groq" text are preserved unchanged.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20">
                <span className="text-cyan-400 font-bold">2. Blue Robot Orb:</span>
                <p className="text-slate-300 mt-0.5">
                  Animated with 3D levitation physics, glowing smiling eyes (`⌒ ⌒`), blinking, specular gloss, and two rotating orbital plasma rings.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/20">
                <span className="text-cyan-400 font-bold">3. Voice & Interfaces:</span>
                <p className="text-slate-300 mt-0.5">
                  Floating frosted glass chatbot bubbles (User & Assistant) and glowing microphone with real-time reactive audio frequency wave bars.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-cyan-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
          >
            Return to 3D Cinema
          </button>
        </div>
      </div>
    </div>
  );
};
