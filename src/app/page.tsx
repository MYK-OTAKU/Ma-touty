"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginScreen from "@/components/LoginScreen";
import LoadingScreen from "@/components/LoadingScreen";
import StoryScreen from "@/components/StoryScreen";
import CakeScreen from "@/components/CakeScreen";
import FinalScreen from "@/components/FinalScreen";
import MusicPlayer, { MusicPlayerRef } from "@/components/MusicPlayer";
import Confetti from "@/components/Confetti";

type AppStep = "login" | "loading" | "story" | "cake" | "final";

interface HeartParticle {
  id: number;
  left: number;
  duration: number;
  scale: number;
  delay: number;
  symbol: string;
  bottom?: number;
}

const heartSymbols = ["❤️", "💖", "💓", "💕", "💘", "🌸"];

export default function Home() {
  const [step, setStep] = useState<AppStep>("login");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const musicPlayerRef = useRef<MusicPlayerRef>(null);

  // Generate floating background hearts
  useEffect(() => {
    // Generate pre-populated hearts at random heights
    const initialHearts: HeartParticle[] = [];
    for (let i = 0; i < 15; i++) {
      const duration = 5 + Math.random() * 6;
      initialHearts.push({
        id: Math.random(),
        left: Math.random() * 100,
        bottom: Math.random() * 80,
        duration: duration,
        scale: 0.5 + Math.random() * 0.8,
        delay: 0,
        symbol: heartSymbols[Math.floor(Math.random() * heartSymbols.length)],
      });
    }
    setHearts(initialHearts);

    const heartInterval = setInterval(() => {
      if (document.hidden) return;

      const duration = 5 + Math.random() * 6;
      const newHeart: HeartParticle = {
        id: Math.random(),
        left: Math.random() * 100,
        duration: duration,
        scale: 0.5 + Math.random() * 0.8,
        delay: Math.random() * 2,
        symbol: heartSymbols[Math.floor(Math.random() * heartSymbols.length)],
      };

      setHearts((prev) => [...prev, newHeart]);

      // Cleanup heart
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, (duration + newHeart.delay) * 1000);
    }, 600);

    return () => clearInterval(heartInterval);
  }, []);

  const handleLoginSuccess = () => {
    // Play music (user interaction requirement fulfilled)
    if (musicPlayerRef.current) {
      musicPlayerRef.current.playMusic();
    }
    setStep("loading");
  };

  const handleLoadingComplete = () => {
    setStep("story");
  };

  const handleStoryComplete = () => {
    setStep("cake");
  };

  const handleCakeComplete = () => {
    setStep("final");
  };

  return (
    <div className="relative w-full h-full min-h-screen flex justify-center items-center overflow-hidden">
      {/* Background Hearts */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            style={{
              left: `${heart.left}vw`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              transform: `scale(${heart.scale})`,
              ...(heart.bottom !== undefined ? { bottom: `${heart.bottom}vh` } : {}),
            }}
            className="heart-particle"
          >
            {heart.symbol}
          </div>
        ))}
      </div>

      {/* Floating Music Player */}
      <MusicPlayer ref={musicPlayerRef} />

      {/* Canvas Confetti (active on final screen) */}
      <Confetti active={step === "final"} />

      {/* Screen Routing with Transitions */}
      <main className="w-full h-full flex justify-center items-center relative z-10">
        <AnimatePresence mode="wait">
          {step === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center"
            >
              <LoginScreen onSuccess={handleLoginSuccess} />
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center animate-fade-in"
            >
              <LoadingScreen onComplete={handleLoadingComplete} />
            </motion.div>
          )}

          {step === "story" && (
            <motion.div
              key="story"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex justify-center"
            >
              <StoryScreen
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
                onNextScreen={handleStoryComplete}
              />
            </motion.div>
          )}

          {step === "cake" && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex justify-center"
            >
              <CakeScreen
                onComplete={handleCakeComplete}
                onPrev={() => setStep("story")}
              />
            </motion.div>
          )}

          {step === "final" && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-full flex justify-center"
            >
              <FinalScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
