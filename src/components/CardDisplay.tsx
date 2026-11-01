import React from 'react';
import { GreetingCard, CardTheme, OccasionInfo } from '../types/card';
import { OCCASIONS, THEMES } from '../data/constants';
import { Heart, Sparkles, Share2, RotateCcw, PlusCircle } from 'lucide-react';

interface CardDisplayProps {
  card: GreetingCard;
  isInteractivePreview?: boolean;
  onReplay?: () => void;
  onCreateNew?: () => void;
  onShare?: () => void;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  isInteractivePreview = false,
  onReplay,
  onCreateNew,
  onShare,
}) => {
  const occasion: OccasionInfo = OCCASIONS[card.occasion] || OCCASIONS.just_because;
  const theme: CardTheme = THEMES[card.theme] || THEMES.rose_blush;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Decorative Outer Aura */}
      <div className="relative group">
        <div
          className="absolute -inset-1 rounded-3xl blur-xl opacity-40 transition duration-1000 group-hover:opacity-60"
          style={{ backgroundColor: theme.accentColor }}
        />

        {/* The Card Surface */}
        <div
          className={`relative rounded-3xl border ${theme.borderStyle} ${theme.cardBg} p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-md`}
        >
          {/* Subtle Background Pattern & Floating Emojis */}
          <div className="absolute top-3 right-4 flex gap-1 text-xl sm:text-2xl opacity-60 select-none pointer-events-none">
            {theme.emojiDeco.slice(0, 3).map((emoji, idx) => (
              <span
                key={idx}
                className="animate-float-slow"
                style={{ animationDelay: `${idx * 0.8}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>

          <div className="absolute bottom-3 left-4 flex gap-1 text-xl sm:text-2xl opacity-50 select-none pointer-events-none">
            {theme.emojiDeco.slice(2, 5).map((emoji, idx) => (
              <span
                key={idx}
                className="animate-float-slow"
                style={{ animationDelay: `${(idx + 1) * 0.6}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>

          {/* Occasion Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-xs mb-6 border border-white/60 bg-white/80 text-rose-700">
            <span>{occasion.emoji}</span>
            <span>{occasion.label}</span>
          </div>

          {/* Receiver Greeting */}
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest font-bold opacity-60 block mb-1">
              For
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 break-words">
              Dearest {card.receiverName} ✨
            </h2>
          </div>

          {/* Sincere Personal Message */}
          <div className="relative my-6 py-4 px-1 border-t border-b border-rose-200/50">
            <p className={`${theme.messageStyle} whitespace-pre-wrap leading-relaxed select-text`}>
              {card.message}
            </p>
          </div>

          {/* Sender Sign-off */}
          <div className="mt-6 flex flex-col items-end">
            <span className="text-xs uppercase tracking-widest font-semibold opacity-60">
              With all my heart,
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
              <span className="text-xl sm:text-2xl font-bold font-handwritten text-slate-800 break-words">
                {card.senderName ? card.senderName : 'Someone who cares deeply'}
              </span>
            </div>
          </div>

          {/* Card Timestamp Footnote */}
          <div className="mt-8 pt-4 border-t border-slate-200/40 flex items-center justify-between text-xs text-slate-700">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Happy Cappy Card
            </span>
            <span>
              {new Date(card.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Action Toolbar Below Card */}
      {!isInteractivePreview && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          {onReplay && (
            <button
              onClick={onReplay}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/90 hover:bg-white text-slate-700 font-semibold shadow-sm border border-rose-200 hover:border-rose-300 transition-all hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-rose-500" />
              Replay Surprise
            </button>
          )}

          {onShare && (
            <button
              onClick={onShare}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/90 hover:bg-white text-slate-700 font-semibold shadow-sm border border-rose-200 hover:border-rose-300 transition-all hover:scale-105 active:scale-95"
            >
              <Share2 className="w-4 h-4 text-rose-500" />
              Share Link
            </button>
          )}

          {onCreateNew && (
            <button
              onClick={onCreateNew}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold shadow-md hover:shadow-lg shadow-rose-400/30 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              Make Someone’s Day Too ❤️
            </button>
          )}
        </div>
      )}
    </div>
  );
};
