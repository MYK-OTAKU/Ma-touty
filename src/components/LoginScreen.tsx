"use client";

import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Heart } from "lucide-react";
import { useSettings } from "@/lib/queries";

interface LoginScreenProps {
  onSuccess: () => void;
}

export default function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [code, setCode] = useState("");
  const [isError, setIsError] = useState(false);
  const cardControls = useAnimation();
  const heartControls = useAnimation();

  // Load secret code and name from Supabase settings
  const { settings, loading } = useSettings();
  const SECRET_CODE = settings["secret_code"] || "0608";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.trim() === SECRET_CODE) {
      setIsError(false);
      await heartControls.start({
        scale: [1, 1.3, 0.8, 15],
        opacity: [1, 1, 0.8, 0],
        transition: { duration: 0.8, ease: "easeInOut" }
      });
      onSuccess();
    } else {
      setIsError(true);
      setCode("");
      cardControls.start({
        x: [0, -10, 10, -10, 10, -5, 5, 0],
        transition: { duration: 0.5 }
      });
    }
  };

  return (
    <div className="w-full max-w-md px-4 z-10">
      <motion.div
        animate={cardControls}
        className="w-full rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-2xl text-center flex flex-col items-center"
      >
        {/* Pulsating heart lock */}
        <motion.div animate={heartControls} className="mb-6">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="p-5 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-red-700 border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.5)] text-white flex items-center justify-center"
          >
            <Heart className="w-12 h-12 fill-current" />
          </motion.div>
        </motion.div>

        <h1 className="font-romantic text-5xl md:text-6xl text-romantic-pink mb-2 drop-shadow-md">
          For My Queen
        </h1>

        <p className="text-white/70 text-sm md:text-base mb-8 max-w-xs leading-relaxed">
          {loading ? "..." : "Entre notre date spéciale pour ouvrir mon cœur..."}
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <div className="w-full mb-6">
            <input
              type="password"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Indice : Jour & Mois (JJMM)"
              required
              className="w-full py-4 px-6 text-center text-lg bg-white/5 border border-white/10 rounded-full text-white outline-none placeholder:text-white/30 placeholder:tracking-normal tracking-[0.2em] focus:bg-white/10 focus:border-romantic-pink focus:shadow-[0_0_15px_rgba(255,117,140,0.25)] transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-8 rounded-full font-semibold text-white bg-gradient-to-r from-romantic-pink to-romantic-rose hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_6px_20px_rgba(255,117,140,0.35)] shadow-md transition-all duration-300 cursor-pointer disabled:opacity-60"
          >
            Déverrouiller la magie ✨
          </button>
        </form>

        {isError && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-red-400 text-xs md:text-sm font-light"
          >
            Ce n'est pas le bon code, réessaie mon cœur... ❤️
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
