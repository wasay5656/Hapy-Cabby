import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GreetingCard, CardTheme, OccasionInfo } from '../types/card';
import { OCCASIONS, THEMES } from '../data/constants';
import { DodgingNoButton } from './DodgingNoButton';
import { CardDisplay } from './CardDisplay';
import { playOpenFanfare, playClickPop } from '../utils/audio';
import { fireCelebration } from '../utils/confetti';
import { Mail, Sparkles, Heart, Gift } from 'lucide-react';

interface SurpriseCardOpenerProps {
  card: GreetingCard;
  onCreateNewCard: () => void;
  onShareCard?: () => void;
}

export const SurpriseCardOpener: React.FC<SurpriseCardOpenerProps> = ({
  card,
  onCreateNewCard,
  onShareCard,
}) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [dodgeCount, setDodgeCount] = useState<number>(0);

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const yesBtnRef = useRef<HTMLButtonElement | null>(null);

  const occasion: OccasionInfo = OCCASIONS[card.occasion] || OCCASIONS.just_because;
  const theme: CardTheme = THEMES[card.theme] || THEMES.rose_blush;

  const handleOpenCard = () => {
    if (isOpening || isOpened) return;
    playClickPop();
    setIsOpening(true);

    // Play fanfare chime
    playOpenFanfare();

    // Fire theme-specific celebration confetti
    setTimeout(() => {
      fireCelebration(occasion.particleType);
    }, 450);

    // After animation finishes, show revealed card
    setTimeout(() => {
      setIsOpening(false);
      setIsOpened(true);
    }, 1100);
  };

  const handleReplay = () => {
    setIsOpened(false);
    setIsOpening(false);
    setDodgeCount(0);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 px-4 sm:px-6">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          // Surprise Teaser Screen
          <motion.div
            key="surprise-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4 }}
            ref={arenaRef}
            className="relative w-full max-w-lg min-h-[520px] sm:min-h-[560px] bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-xl border border-rose-100 flex flex-col items-center justify-between overflow-hidden"
          >
            {/* Background floating decor */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-pink-100/60 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-rose-100/60 rounded-full blur-2xl pointer-events-none" />

            {/* Top Receiver Banner */}
            <div className="text-center z-10 w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs sm:text-sm font-semibold mb-3 border border-rose-200/60">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                <span>Special Delivery for You</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Hey {card.receiverName}! ✨
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                {card.senderName ? (
                  <>
                    <strong className="text-rose-600 font-semibold">{card.senderName}</strong> sent you a personalized surprise!
                  </>
                ) : (
                  'Someone has prepared a special surprise for you!'
                )}
              </p>
            </div>

            {/* Interactive Envelope / Gift Graphic */}
            <div className="my-6 relative flex flex-col items-center justify-center z-10">
              <motion.div
                animate={
                  isOpening
                    ? {
                        scale: [1, 1.25, 0.9],
                        rotate: [0, -5, 5, 0],
                        y: [-10, -30, -50],
                        opacity: [1, 1, 0],
                      }
                    : {
                        y: [0, -8, 0],
                      }
                }
                transition={
                  isOpening
                    ? { duration: 1, ease: 'easeInOut' }
                    : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
                }
                className="relative cursor-pointer"
                onClick={handleOpenCard}
              >
                {/* Envelope Body */}
                <div className="w-36 h-28 sm:w-44 sm:h-32 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl shadow-xl shadow-rose-300/50 flex items-center justify-center border-2 border-rose-300/40 relative overflow-hidden group">
                  {/* Flap effect */}
                  <div className="absolute top-0 inset-x-0 h-14 bg-rose-600/40 clip-path-triangle" />
                  
                  {/* Heart Seal */}
                  <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                    <Heart className="w-7 h-7 fill-rose-500 animate-pulse" />
                  </div>

                  {/* Sparkle badge */}
                  <div className="absolute bottom-2 right-3 text-xs text-white/90 font-medium flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" />
                    <span>Open me</span>
                  </div>
                </div>

                {/* Pulsing ring aura */}
                <div className="absolute inset-0 -z-10 rounded-2xl bg-rose-400/20 blur-lg animate-ping opacity-75" />
              </motion.div>

              {/* The Question */}
              <div className="mt-6 text-center">
                <p className="text-lg sm:text-xl font-bold text-slate-800">
                  Do you want to open your card? 💌
                </p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Click below to reveal the message
                </p>
              </div>
            </div>

            {/* The Interactive Buttons Row */}
            <div className="w-full flex items-center justify-center gap-4 z-20 pt-2 pb-4">
              {/* YES BUTTON: Easy to tap, pulsing, confident */}
              <motion.button
                ref={yesBtnRef}
                onClick={handleOpenCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-7 py-3.5 sm:px-9 sm:py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 transition-all select-none flex items-center gap-2 animate-pulse-glow"
              >
                <span>YES, OPEN IT ❤️</span>
              </motion.button>

              {/* NO BUTTON: Mischievous dodging button! */}
              <DodgingNoButton
                arenaRef={arenaRef}
                yesButtonRef={yesBtnRef}
                onDodgeAttempt={(count) => setDodgeCount(count)}
              />
            </div>

            {/* Hint footnote */}
            <div className="text-center text-xs text-slate-400 z-10">
              {dodgeCount > 0 ? (
                <span className="text-rose-500 font-medium">
                  {dodgeCount >= 5
                    ? "Looks like you have no choice but to say YES! 💖"
                    : "Having trouble clicking No? It really wants you to open it! 😜"}
                </span>
              ) : (
                <span>Tip: Good luck trying to say no! 😉</span>
              )}
            </div>
          </motion.div>
        ) : (
          // Revealed Card View
          <motion.div
            key="revealed-card"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="w-full flex flex-col items-center"
          >
            <CardDisplay
              card={card}
              onReplay={handleReplay}
              onCreateNew={onCreateNewCard}
              onShare={onShareCard}
            />

            {/* Bottom Invitation Banner */}
            <div className="mt-12 text-center max-w-md mx-auto p-6 bg-white/80 rounded-2xl border border-rose-100 shadow-sm backdrop-blur-xs">
              <h3 className="font-bold text-slate-800 text-lg">
                Loved this surprise? ✨
              </h3>
              <p className="text-sm text-slate-500 mt-1 mb-4">
                You can create a free personalized surprise card for your friends, family, or partner in less than a minute!
              </p>
              <button
                onClick={onCreateNewCard}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-semibold text-sm shadow-sm transition hover:scale-105 active:scale-95"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Create a Card for Someone Else</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
