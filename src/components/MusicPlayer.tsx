import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Dreams (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cybernetic Pulse (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Horizon (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 p-4 bg-gray-900/80 border border-fuchsia-500/30 rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.15)] backdrop-blur-md">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        preload="auto"
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`p-2 rounded-full bg-fuchsia-500/20 text-fuchsia-400 ${isPlaying ? 'animate-pulse shadow-[0_0_10px_rgba(217,70,239,0.5)]' : ''}`}>
            <Music className="w-5 h-5" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Now Playing</span>
            <span className="text-sm font-bold text-cyan-100 truncate whitespace-nowrap">
              {currentTrack.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-cyan-400 transition-colors">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button
          onClick={prevTrack}
          className="p-2 text-gray-400 hover:text-fuchsia-400 transition-all hover:scale-110 active:scale-95"
        >
          <SkipBack className="w-6 h-6 fill-current" />
        </button>

        <button
          onClick={togglePlay}
          className="p-4 bg-gradient-to-br from-cyan-500 to-fuchsia-500 text-white rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(217,70,239,0.6)] transition-all hover:scale-105 active:scale-95"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-1" />
          )}
        </button>

        <button
          onClick={nextTrack}
          className="p-2 text-gray-400 hover:text-fuchsia-400 transition-all hover:scale-110 active:scale-95"
        >
          <SkipForward className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
}
