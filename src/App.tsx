/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CHAPTERS, StoryChapter, VIDEO_DURATION } from './types/video';
import { soundEngine } from './audio/soundEngine';
import { OrkenHeroScene } from './components/OrkenHeroScene';
import { CinematicOverlay } from './components/CinematicOverlay';
import { VideoPlayerDock } from './components/VideoPlayerDock';
import { OriginalArtworkModal } from './components/OriginalArtworkModal';

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isCinematicCam, setIsCinematicCam] = useState<boolean>(true);
  const [showArtworkModal, setShowArtworkModal] = useState<boolean>(false);
  const [hasStartedAudio, setHasStartedAudio] = useState<boolean>(false);

  // Video recording export state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingProgress, setRecordingProgress] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Real-time audio analyser byte data for voice waves
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(32));

  // Determine current chapter
  const currentChapter: StoryChapter =
    CHAPTERS.find((ch) => currentTime >= ch.startTime && currentTime < ch.endTime) ||
    CHAPTERS[CHAPTERS.length - 1];

  // User gesture starts audio context
  const ensureAudioStarted = useCallback(() => {
    if (!hasStartedAudio) {
      soundEngine.startSoundtrack();
      setHasStartedAudio(true);
    }
  }, [hasStartedAudio]);

  // Main playback timer loop
  useEffect(() => {
    let animFrame: number;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const deltaSec = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + deltaSec * playbackSpeed;
          if (next >= VIDEO_DURATION) {
            // Replay or loop back to start
            soundEngine.updateTimeline(0);
            return 0;
          }
          soundEngine.updateTimeline(next);
          return next;
        });

        // Update audio frequency bars
        const freqData = soundEngine.getAnalyserData();
        setAudioData(freqData);
      }

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, playbackSpeed]);

  // Play / Pause toggle
  const handlePlayPause = () => {
    ensureAudioStarted();
    if (isPlaying) {
      soundEngine.stopSoundtrack();
      setIsPlaying(false);
    } else {
      soundEngine.startSoundtrack();
      setIsPlaying(true);
    }
  };

  // Seek to specific timecode
  const handleSeek = (time: number) => {
    ensureAudioStarted();
    setCurrentTime(time);
    soundEngine.updateTimeline(time);
  };

  // Restart video from 0s
  const handleRestart = () => {
    ensureAudioStarted();
    setCurrentTime(0);
    soundEngine.updateTimeline(0);
    if (!isPlaying) {
      soundEngine.startSoundtrack();
      setIsPlaying(true);
    }
  };

  // Mute / Unmute
  const handleToggleMute = () => {
    ensureAudioStarted();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  // Volume change
  const handleVolumeChange = (vol: number) => {
    ensureAudioStarted();
    setVolume(vol);
    soundEngine.setVolume(vol);
    if (isMuted && vol > 0) {
      setIsMuted(false);
      soundEngine.setMuted(false);
    }
  };

  // Playback speed
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  // Toggle Camera
  const handleToggleCinematicCam = () => {
    setIsCinematicCam((prev) => !prev);
    soundEngine.playUiClick();
  };

  // Interactive click on orb
  const handleOrbClick = () => {
    ensureAudioStarted();
    soundEngine.playRobotVoicePing();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'KeyR') {
        handleRestart();
      } else if (e.code === 'KeyM') {
        handleToggleMute();
      } else if (e.code === 'KeyC') {
        handleToggleCinematicCam();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, isCinematicCam, hasStartedAudio]);

  // Video Export / MediaRecorder implementation
  const handleStartExport = () => {
    if (!canvasRef.current || isRecording) return;
    ensureAudioStarted();

    try {
      const canvas = canvasRef.current;
      const canvasStream = canvas.captureStream(60);

      // Combine video stream with Web Audio stream
      const combinedStream = new MediaStream();
      canvasStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track));

      const audioStream = soundEngine.getMediaStream();
      if (audioStream) {
        audioStream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));
      }

      // Check supported mime type
      const mimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ];
      const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 8000000, // 8 Mbps high-quality bitrate
      });

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ORKEN_AI_Cinematic_Promo_${new Date().toISOString().slice(0, 10)}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setRecordingProgress(0);
      };

      // Restart video from 0 for clean recording
      setCurrentTime(0);
      setIsPlaying(true);
      soundEngine.updateTimeline(0);

      recorder.start(500);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      // Track progress across 30 seconds
      const startTime = Date.now();
      const exportTimer = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(100, Math.round((elapsed / VIDEO_DURATION) * 100));
        setRecordingProgress(progress);

        if (elapsed >= VIDEO_DURATION) {
          clearInterval(exportTimer);
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
        }
      }, 500);
    } catch (err) {
      console.error('Failed to export video:', err);
      setIsRecording(false);
    }
  };

  return (
    <div
      onClick={ensureAudioStarted}
      className="relative w-screen h-screen overflow-hidden bg-[#020512] text-white font-['Plus_Jakarta_Sans'] select-none flex flex-col justify-between"
    >
      {/* 3D WebGL Canvas Layer */}
      <OrkenHeroScene
        currentTime={currentTime}
        currentChapter={currentChapter}
        isCinematicCam={isCinematicCam}
        audioLevel={(audioData[0] || 0) / 255}
        onCanvasReady={(c) => {
          canvasRef.current = c;
        }}
        onOrbClick={handleOrbClick}
      />

      {/* Cinematic HUD & Authentic ORKEN AI Overlays */}
      <CinematicOverlay
        currentTime={currentTime}
        duration={VIDEO_DURATION}
        currentChapter={currentChapter}
        audioData={audioData}
        onOrbClick={handleOrbClick}
      />

      {/* Collapsible Unified Director Dock (Bottom Center) */}
      <VideoPlayerDock
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={VIDEO_DURATION}
        isMuted={isMuted}
        volume={volume}
        playbackSpeed={playbackSpeed}
        isCinematicCam={isCinematicCam}
        currentChapter={currentChapter}
        isRecording={isRecording}
        recordingProgress={recordingProgress}
        onPlayPause={handlePlayPause}
        onSeek={handleSeek}
        onRestart={handleRestart}
        onToggleMute={handleToggleMute}
        onVolumeChange={handleVolumeChange}
        onSpeedChange={handleSpeedChange}
        onToggleCinematicCam={handleToggleCinematicCam}
        onStartExport={handleStartExport}
        onToggleArtworkModal={() => setShowArtworkModal(true)}
      />

      {/* Original Artwork Inspection Modal */}
      <OriginalArtworkModal
        isOpen={showArtworkModal}
        onClose={() => setShowArtworkModal(false)}
      />

      {/* Audio start hint on first load */}
      {!hasStartedAudio && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-200 text-xs font-mono backdrop-blur-md shadow-lg pointer-events-none animate-bounce">
          Click anywhere to activate spatial futuristic audio score 🔊
        </div>
      )}
    </div>
  );
}
