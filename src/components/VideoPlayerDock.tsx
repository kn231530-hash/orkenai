import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Camera,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Download,
  Image as ImageIcon,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { CHAPTERS, StoryChapter, VIDEO_DURATION } from '../types/video';

interface VideoPlayerDockProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  volume: number;
  playbackSpeed: number;
  isCinematicCam: boolean;
  currentChapter: StoryChapter;
  isRecording: boolean;
  recordingProgress: number;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onRestart: () => void;
  onToggleMute: () => void;
  onVolumeChange: (vol: number) => void;
  onSpeedChange: (speed: number) => void;
  onToggleCinematicCam: () => void;
  onStartExport: () => void;
  onToggleArtworkModal: () => void;
}

export const VideoPlayerDock: React.FC<VideoPlayerDockProps> = ({
  isPlaying,
  currentTime,
  duration,
  isMuted,
  volume,
  playbackSpeed,
  isCinematicCam,
  currentChapter,
  isRecording,
  recordingProgress,
  onPlayPause,
  onSeek,
  onRestart,
  onToggleMute,
  onVolumeChange,
  onSpeedChange,
  onToggleCinematicCam,
  onStartExport,
  onToggleArtworkModal,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Format time mm:ss.s
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins.toString().padStart(2, '0')}:${Number(secs) < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  return (
    <div
      className="fixed z-30 transition-all duration-500 ease-out flex flex-col items-center"
      style={{
        bottom: isCollapsed ? '-160px' : '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(980px, 95vw)',
      }}
    >
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-2 px-3 py-1 rounded-full bg-[#050f26]/90 border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all hover:bg-cyan-950/80 cursor-pointer"
        title="Toggle Cinema / Zen Mode (H)"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Show Director Controls</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hide Controls (Cinema Mode)</span>
          </>
        )}
      </button>

      {/* Main Glass Control Dock */}
      <div className="w-full bg-[#040d24]/92 border border-cyan-500/30 rounded-2xl p-3.5 sm:p-4 shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,240,255,0.15)] backdrop-blur-xl flex flex-col gap-3">
        {/* Top: 30-Second Scrubber Bar with Chapter Segments */}
        <div className="w-full">
          <div
            onClick={handleTimelineClick}
            className="group relative h-3.5 bg-slate-900/80 rounded-full cursor-pointer flex items-center px-1 overflow-hidden border border-cyan-900/50"
          >
            {/* Progress Fill */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-600 via-cyan-400 to-sky-300 rounded-full shadow-[0_0_12px_#00f0ff] transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />

            {/* Chapter Breakpoint Ticks (every 5 seconds) */}
            {CHAPTERS.map((ch, idx) => {
              const tickLeft = (ch.startTime / VIDEO_DURATION) * 100;
              return (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 w-[1.5px] bg-cyan-200/40 z-10 hover:bg-white transition-colors"
                  style={{ left: `${tickLeft}%` }}
                  title={`${ch.title} (${ch.startTime}s)`}
                />
              );
            })}

            {/* Scrubber Knob */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-cyan-400 shadow-[0_0_10px_#00f0ff] z-20 group-hover:scale-125 transition-transform"
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          {/* Chapter Quick Labels */}
          <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400/80 mt-1.5 px-0.5">
            {CHAPTERS.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => onSeek(ch.startTime)}
                className={`truncate max-w-[65px] sm:max-w-[120px] transition-colors hover:text-white cursor-pointer ${
                  currentChapter.id === ch.id ? 'text-cyan-300 font-bold drop-shadow-[0_0_6px_#00f0ff]' : 'text-slate-400'
                }`}
              >
                {idx + 1}. {ch.focusFeature.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Control Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Playback Controls & Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={onPlayPause}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            {/* Restart */}
            <button
              onClick={onRestart}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-500/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Time readout */}
            <div className="font-mono text-xs text-slate-200 tracking-wider font-semibold pl-1">
              <span className="text-cyan-400">{formatTime(currentTime)}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Speed Toggle */}
            <div className="flex items-center bg-slate-900/80 rounded-lg p-0.5 border border-cyan-500/20 text-xs font-mono">
              {[1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => onSpeedChange(spd)}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Right: Camera, Audio, Export & Original Artwork */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Camera Mode Toggle */}
            <button
              onClick={onToggleCinematicCam}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                isCinematicCam
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Switch between Cinematic Director Camera and Free 3D Orbit Mode"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">
                {isCinematicCam ? 'Cinematic Cam' : 'Free 3D Orbit'}
              </span>
            </button>

            {/* Audio & Volume */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={onToggleMute}
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-500/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              {showVolumeSlider && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#040e26] border border-cyan-500/30 p-2 rounded-xl shadow-xl flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-20 accent-cyan-400 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Original Artwork Reference Button */}
            <button
              onClick={onToggleArtworkModal}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-cyan-500/30 text-slate-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Compare with Original ORKEN AI artwork"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Original Art</span>
            </button>

            {/* Export / Record Promo Video (WebM) */}
            <button
              onClick={onStartExport}
              disabled={isRecording}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-cyan-950 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-300 hover:text-white hover:border-cyan-300'
              }`}
              title="Record and export the 30-second promotional video as a WebM file"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isRecording ? `Recording ${recordingProgress}%` : 'Export Video'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
