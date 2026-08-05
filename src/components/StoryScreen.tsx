"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { usePagesWithMedia, getPagePhotoUrl } from "@/lib/queries";
import { type Page } from "@/lib/supabase";

// TypingText — runs ONCE, does NOT loop
function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const characters = Array.from(text);
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.022,
        delayChildren: delay,
        // No repeat — runs once
      },
    },
  };
  const childVariants = {
    hidden: { opacity: 0, y: 2 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.05 },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="inline"
    >
      {characters.map((char, i) =>
        char === "\n" ? (
          <br key={i} />
        ) : (
          <motion.span key={i} variants={childVariants} className="inline">
            {char}
          </motion.span>
        )
      )}
    </motion.span>
  );
}

// Template: Text Only
function TextOnlyTemplate({ page }: { page: Page }) {
  return (
    <div className="flex flex-col items-center text-center w-full gap-4">
      {page.title && (
        <h2 className="font-romantic text-4xl md:text-5xl text-romantic-pink drop-shadow-md leading-tight">
          {page.title}
        </h2>
      )}
      {page.subtitle && (
        <h3 className="font-serif italic text-lg md:text-xl text-white/80">{page.subtitle}</h3>
      )}
      {page.body && (
        <p className="text-base md:text-lg font-serif font-light leading-relaxed text-white/90">
          {page.typing_effect ? <TypingText text={page.body} /> : page.body}
        </p>
      )}
    </div>
  );
}

// Template: Text + Photo (Polaroid)
function TextPhotoTemplate({ page }: { page: Page }) {
  const photoUrl = getPagePhotoUrl(page);
  const fallbackBg =
    "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23ffe3e8%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%228%22 fill=%22%23ff758c%22>Photo ici</text></svg>";

  return (
    <div className="flex flex-col items-center text-center w-full gap-2.5 sm:gap-3">
      {page.title && (
        <h2 className="font-romantic text-3xl sm:text-4xl md:text-5xl text-romantic-pink drop-shadow-md leading-tight">
          {page.title}
        </h2>
      )}
      {page.subtitle && (
        <h3 className="font-serif italic text-sm sm:text-base text-white/80">{page.subtitle}</h3>
      )}
      {/* Polaroid — spacious & beautifully proportioned */}
      <motion.div
        initial={{ rotate: -3, scale: 0.9, opacity: 0 }}
        animate={{ rotate: -3, scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white p-3 pb-5 rounded-xl shadow-2xl w-full max-w-[250px] sm:max-w-[280px] md:max-w-[310px] transform hover:scale-105 hover:rotate-0 transition-transform duration-300"
      >
        <div
          className="w-full h-[190px] sm:h-[220px] md:h-[250px] bg-cover bg-center rounded-md border border-slate-100"
          style={{ backgroundImage: `url('${photoUrl || fallbackBg}')` }}
        />
        {page.polaroid_caption && (
          <div className="font-romantic text-2xl md:text-3xl text-slate-800 mt-2.5 text-center truncate">
            {page.polaroid_caption}
          </div>
        )}
      </motion.div>
      {page.body && (
        <p className="text-sm sm:text-base font-serif font-light leading-relaxed text-white/90 max-w-sm">
          {page.typing_effect ? <TypingText text={page.body} delay={0.4} /> : page.body}
        </p>
      )}
    </div>
  );
}

// Template: Full Photo with text overlay
function FullPhotoTemplate({ page }: { page: Page }) {
  const photoUrl = getPagePhotoUrl(page);
  return (
    <div className="relative w-full min-h-[55vh] rounded-2xl overflow-hidden flex items-end">
      {photoUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${photoUrl}')` }}
        />
      )}
      {!photoUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-romantic-pink/20 to-purple-900/50 flex items-center justify-center">
          <Heart className="w-16 h-16 text-romantic-pink/30" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
      <div className="relative z-10 p-6 w-full text-center">
        {page.title && (
          <h2 className="font-romantic text-4xl text-white mb-3 drop-shadow-lg">{page.title}</h2>
        )}
        {page.body && (
          <p className="text-base font-serif font-light text-white/90 leading-relaxed">
            {page.typing_effect ? <TypingText text={page.body} /> : page.body}
          </p>
        )}
      </div>
    </div>
  );
}

// Template: Thank You — special heartfelt design
function ThankYouTemplate({ page }: { page: Page }) {
  return (
    <div className="flex flex-col items-center text-center w-full gap-5">
      {page.title && (
        <h2 className="font-romantic text-4xl md:text-5xl text-romantic-pink drop-shadow-md">
          {page.title}
        </h2>
      )}
      {page.body && (
        <p className="text-xl md:text-2xl font-serif italic font-light leading-relaxed text-white/90">
          {page.typing_effect ? <TypingText text={page.body} /> : page.body}
        </p>
      )}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        className="w-full max-w-xs rounded-2xl border border-romantic-pink/30 bg-romantic-pink/10 px-6 py-5 shadow-lg"
      >
        <p className="text-xl md:text-2xl text-romantic-pink font-serif font-semibold">
          <TypingText text="Te remercier d'être Toi !" delay={1} />
        </p>
      </motion.div>
      {/* Static hearts — no infinite pulse, just a gentle one-time pop */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.4 }}
        className="flex justify-center gap-3"
      >
        {["❤️", "💕", "❤️"].map((icon, i) => (
          <span key={i} className="text-xl">{icon}</span>
        ))}
      </motion.div>
    </div>
  );
}

function renderTemplate(page: Page) {
  switch (page.template) {
    case "text-photo": return <TextPhotoTemplate page={page} />;
    case "full-photo": return <FullPhotoTemplate page={page} />;
    case "thank-you": return <ThankYouTemplate page={page} />;
    default: return <TextOnlyTemplate page={page} />;
  }
}

interface StoryScreenProps {
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  onNextScreen: () => void;
}

export default function StoryScreen({
  currentSlide,
  setCurrentSlide,
  onNextScreen,
}: StoryScreenProps) {
  const { pages, loading } = usePagesWithMedia();
  const total = pages.length;

  const handleNext = () => {
    if (currentSlide < total - 1) setCurrentSlide(currentSlide + 1);
    else onNextScreen();
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const page = pages[currentSlide];

  return (
    <div className="w-full h-full flex flex-col justify-between items-center px-4 md:px-6 py-6 md:py-8 z-10">
      {/* Progress Bar */}
      <div className="w-full max-w-xl bg-white/10 h-1 rounded-full overflow-hidden mb-5">
        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: total > 0 ? `${((currentSlide + 1) / (total + 2)) * 100}%` : "0%",
          }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-romantic-pink to-romantic-rose"
        />
      </div>

      {/* Slide Card */}
      <div className="flex-1 w-full max-w-xl md:max-w-2xl lg:max-w-3xl flex justify-center items-center overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-white/50">
            <Heart className="w-10 h-10 text-romantic-pink fill-current animate-pulse" />
            <p className="text-sm font-serif">Chargement du message...</p>
          </div>
        ) : page ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={page.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="w-full max-h-[83vh] overflow-y-auto no-scrollbar rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 sm:p-7 md:p-9 shadow-2xl flex flex-col justify-center items-center text-center"
            >
              {renderTemplate(page)}
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>

      {/* Navigation */}
      <div className="w-full max-w-xl md:max-w-2xl flex justify-between items-center mt-5">
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="p-3.5 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md hover:bg-romantic-pink hover:border-transparent hover:scale-105 active:scale-95 disabled:opacity-20 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-xs md:text-sm font-medium px-4 py-2 bg-black/30 border border-white/5 rounded-full">
          {total > 0 ? `${currentSlide + 1} / ${total}` : "—"}
        </div>

        <button
          onClick={handleNext}
          className="p-3.5 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md hover:bg-romantic-pink hover:border-transparent hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
