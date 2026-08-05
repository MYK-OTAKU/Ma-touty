"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const loaderPhrases = [
  "Ouverture de mon cœur... 🔑",
  "Chargement de nos plus beaux souvenirs... ✨"
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => {
        if (prev < loaderPhrases.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 150); // Instant smooth transition
          return prev;
        }
      });
    }, 350);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="text-center z-10 flex flex-col items-center justify-center px-4 py-8">
      {/* Romantic Spinner */}
      <div className="relative w-20 h-20 mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-3 border-transparent border-t-red-500 rounded-full"
        />
        <motion.div
          animate={{ scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-red-500"
        >
          <Heart className="w-8 h-8 fill-current drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
        </motion.div>
      </div>

      {/* Phrases transition — generous min-height and padding so icons like 🔑 are never clipped */}
      <div className="min-h-[4rem] flex items-center justify-center py-2 overflow-visible">
        <AnimatePresence mode="wait">
          <motion.h2
            key={phraseIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="font-serif text-lg md:text-xl text-pink-200 font-medium px-4 leading-normal text-center"
          >
            {loaderPhrases[phraseIndex]}
          </motion.h2>
        </AnimatePresence>
      </div>
    </div>
  );
}
