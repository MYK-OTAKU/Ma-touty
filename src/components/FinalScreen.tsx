"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useSettings } from "@/lib/queries";

export default function FinalScreen() {
  const { settings } = useSettings();
  const name = settings["birthday_name"] || "N'Deye Fatou Diop";
  const age = settings["birthday_age"] || "21";
  const finalMessage = settings["final_message"] || "Je t'aime de tout mon cœur. ❤️";

  return (
    <div className="w-full max-w-lg px-4 z-10 flex flex-col justify-center items-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
        className="w-full rounded-3xl bg-white/5 border border-romantic-pink/30 backdrop-blur-xl p-8 shadow-[0_12px_40px_rgba(255,117,140,0.15)] text-center flex flex-col items-center"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6 text-romantic-pink"
        >
          <Heart className="w-16 h-16 fill-current drop-shadow-[0_0_15px_rgba(255,117,140,0.5)]" />
        </motion.div>

        <h2 className="font-romantic text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-romantic-pink to-romantic-gold bg-clip-text text-transparent mb-2">
          Joyeux {age} ans !
        </h2>

        <h3 className="font-serif italic text-2xl md:text-3xl text-white/90 mb-8">
          💓 {name} 💓
        </h3>

        <div className="w-full rounded-2xl bg-white/3 border border-white/5 p-6 md:p-8 font-serif leading-relaxed text-center">
          <p className="text-xl md:text-2xl text-romantic-pink font-romantic mb-4">
            Joyeux Anniversaire !
          </p>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light whitespace-pre-line">
            {finalMessage}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
