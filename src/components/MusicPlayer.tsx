"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Music, VolumeX } from "lucide-react";
import { useGlobalAudio } from "@/lib/queries";

export interface MusicPlayerRef {
  playMusic: () => void;
}

const MusicPlayer = forwardRef<MusicPlayerRef>((_, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabaseAudioUrl = useGlobalAudio();

  // Expose the play function to the parent component
  useImperativeHandle(ref, () => ({
    playMusic: () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.log("Auto-play blocked:", err));
      }
    }
  }));

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio playback blocked:", err));
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        {/* Prefer Supabase audio, fallback to local file */}
        {supabaseAudioUrl && <source src={supabaseAudioUrl} type="audio/mpeg" />}
        <source src="/assets/audio/music.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={togglePlay}
        title={isPlaying ? "Couper la musique" : "Jouer la musique"}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
          isPlaying ? "text-romantic-pink shadow-[0_0_15px_rgba(255,117,140,0.3)]" : ""
        }`}
        style={isPlaying ? { animation: "spin 6s linear infinite" } : undefined}
        aria-label="Toggle background music"
      >
        {isPlaying ? <Music className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </>
  );
});

MusicPlayer.displayName = "MusicPlayer";
export default MusicPlayer;
