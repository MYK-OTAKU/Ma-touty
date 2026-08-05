"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface CakeScreenProps {
  onComplete: () => void;
  onPrev: () => void;
}

interface CandleState {
  id: number;
  isBlown: boolean;
  left: number;
  bottom: number;
  color: string;
  flameDelay: number;
  flameDuration: number;
}

export default function CakeScreen({ onComplete, onPrev }: CakeScreenProps) {
  const [candles, setCandles] = useState<CandleState[]>([]);
  const [blownCount, setBlownCount] = useState(0);
  const [statusText, setStatusText] = useState("21 bougies allumées 🕯️");
  const [isError, setIsError] = useState(false);
  const cakeControls = useAnimation();

  // Generate 21 candles on mount
  useEffect(() => {
    const list: CandleState[] = [];
    const colors = [
      "linear-gradient(to top, #ff758c, #ffd700)",
      "linear-gradient(to top, #ff7eb3, #ff4e50)",
      "linear-gradient(to top, #f9d423, #ff4e50)",
      "linear-gradient(to top, #a8ff78, #78ffd6)",
      "linear-gradient(to top, #00c6ff, #0072ff)"
    ];

    // Back Row (10 candles)
    // Placed higher up and slightly in the back
    for (let i = 0; i < 10; i++) {
      const posX = 15 + i * 14; // spread across 130px
      // Sine wave curve to give a 3D rounded look
      const curveOffset = Math.sin((i / 9) * Math.PI) * 4;
      list.push({
        id: i,
        isBlown: false,
        left: posX,
        bottom: 82 + curveOffset, // positioned on the top layer
        color: colors[i % colors.length],
        flameDelay: Math.random() * 0.5,
        flameDuration: 0.08 + Math.random() * 0.06
      });
    }

    // Front Row (11 candles)
    // Placed lower down and slightly in the front
    for (let i = 0; i < 11; i++) {
      const posX = 8 + i * 14.5; // spread across 145px
      const curveOffset = Math.sin((i / 10) * Math.PI) * 5;
      list.push({
        id: 10 + i,
        isBlown: false,
        left: posX,
        bottom: 74 + curveOffset, // slightly lower than back row
        color: colors[(i + 2) % colors.length],
        flameDelay: Math.random() * 0.5,
        flameDuration: 0.08 + Math.random() * 0.06
      });
    }

    setCandles(list);
  }, []);

  const handleBlowCandle = (id: number) => {
    setCandles((prev) =>
      prev.map((c) => {
        if (c.id === id && !c.isBlown) {
          const updated = { ...c, isBlown: true };
          setBlownCount((count) => {
            const nextCount = count + 1;
            if (nextCount < 21) {
              setStatusText(`${21 - nextCount} bougies restantes 🕯️`);
            } else {
              setStatusText("Vœu exaucé ! 🎂✨");
              // Wait 1.8 seconds then transition to next screen
              setTimeout(onComplete, 1800);
            }
            return nextCount;
          });
          return updated;
        }
        return c;
      })
    );
  };

  const handleNextClick = () => {
    if (blownCount < 21) {
      setIsError(true);
      setStatusText("Souffle d'abord toutes les bougies ! 🎂✨");
      cakeControls.start({
        x: [0, -8, 8, -8, 8, 0],
        transition: { duration: 0.5 }
      });
      setTimeout(() => {
        setIsError(false);
        if (blownCount < 21) {
          setStatusText(`${21 - blownCount} bougies restantes 🕯️`);
        }
      }, 1500);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center px-4 py-8 z-10">
      {/* Progress Bar */}
      <div className="w-full max-w-xl bg-white/10 h-1 rounded-full overflow-hidden mb-6">
        <div
          style={{ width: `${(7 / 8) * 100}%` }}
          className="h-full bg-gradient-to-r from-romantic-pink to-romantic-rose transition-all duration-300"
        />
      </div>

      {/* Main Cake Area */}
      <div className="flex-1 w-full max-w-xl md:max-w-2xl flex flex-col justify-center items-center">
        <div className="text-center mb-6">
          <h2 className="font-romantic text-4xl md:text-5xl text-romantic-pink mb-2 drop-shadow-md">
            Fais un Vœu... ✨
          </h2>
          <p className="text-white/70 text-xs md:text-sm animate-[pulse_2s_infinite_ease-in-out]">
            Souffle les 21 bougies en tapant dessus !
          </p>
        </div>

        {/* Cake Container */}
        <motion.div
          animate={cakeControls}
          className="relative w-[240px] h-[200px] flex justify-center items-end"
        >
          {/* Pure CSS/Tailwind Cake */}
          <div className="relative w-[180px] h-[120px]">
            {/* Plate */}
            <div className="absolute -bottom-2 -left-5 w-[220px] h-3 bg-slate-200 rounded-full shadow-lg" />
            
            {/* Chocolate Bottom Layer */}
            <div className="absolute bottom-0 w-full h-[45px] bg-[#5c3a21] rounded-t-lg" />
            
            {/* Strawberry Cream Middle Layer */}
            <div className="absolute bottom-[40px] w-full h-[35px] bg-pink-400 rounded-t-md" />
            
            {/* Vanilla Cream Top Layer */}
            <div className="absolute bottom-[70px] w-full h-[30px] bg-yellow-50 rounded-t-lg" />
            
            {/* White Icing */}
            <div className="absolute bottom-[97px] w-full h-2 bg-white rounded-full" />
            
            {/* Drips */}
            <div 
              className="absolute bottom-[88px] w-full h-3 bg-repeat-x"
              style={{
                backgroundImage: "radial-gradient(circle at 8px 0, #ffffff 8px, transparent 9px)",
                backgroundSize: "16px 12px"
              }}
            />

            {/* Candles Wrapper */}
            <div className="absolute inset-0 pointer-events-auto">
              {candles.map((candle) => (
                <div
                  key={candle.id}
                  onClick={() => handleBlowCandle(candle.id)}
                  style={{
                    left: `${candle.left}px`,
                    bottom: `${candle.bottom}px`,
                    background: candle.color,
                  }}
                  className={`absolute w-[5px] h-[25px] rounded-full cursor-pointer transition-all duration-300 hover:scale-y-110 origin-bottom ${
                    candle.isBlown ? "opacity-50" : ""
                  }`}
                >
                  {/* Candle Flame */}
                  {!candle.isBlown && (
                    <motion.div
                      animate={{
                        scale: [1, 1.15, 0.95, 1.1, 1],
                        rotate: [-1, 2, -2, 1, -1]
                      }}
                      transition={{
                        duration: 0.15,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: candle.flameDelay
                      }}
                      className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-2.5 h-[11px] bg-radial from-yellow-300 via-amber-400 to-red-500 rounded-t-full rounded-b-[20%] shadow-[0_0_8px_rgba(255,215,0,0.8),0_0_15px_rgba(255,78,80,0.4)] pointer-events-none origin-bottom"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Status text */}
        <div className={`mt-8 px-5 py-2 bg-black/30 border border-white/5 rounded-full text-xs md:text-sm font-semibold transition-colors duration-300 ${
          isError ? "text-red-400 border-red-500/20 bg-red-950/20" : blownCount === 21 ? "text-romantic-gold" : "text-white/80"
        }`}>
          {statusText}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="w-full max-w-xl flex justify-between items-center mt-6">
        <button
          onClick={onPrev}
          className="p-3 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-romantic-pink hover:border-transparent hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="text-xs md:text-sm font-semibold px-4 py-2 bg-black/30 border border-white/5 rounded-full backdrop-blur-md">
          7 / 8
        </div>

        <button
          onClick={handleNextClick}
          style={{ opacity: blownCount === 21 ? 1 : 0.3 }}
          className="p-3 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md shadow-lg transition-all duration-300 hover:bg-romantic-pink hover:border-transparent hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6 rotate-180" />
        </button>
      </div>
    </div>
  );
}
