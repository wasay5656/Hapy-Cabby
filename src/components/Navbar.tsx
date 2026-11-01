import React from 'react';
import { Heart, Volume2, VolumeX, Sparkles, Database, Plus } from 'lucide-react';
import { playClickPop } from '../utils/audio';

interface NavbarProps {
  onNavigateHome: () => void;
  onNavigateCreate: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateHome,
  onNavigateCreate,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-rose-100/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            playClickPop();
            onNavigateHome();
          }}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-md shadow-rose-300/50 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-lg sm:text-xl text-slate-800 tracking-tight">
                Happy Cappy
              </span>
              <span className="text-rose-500 text-sm">❤️</span>
            </div>
            <span className="hidden sm:block text-[11px] font-medium text-slate-600 -mt-0.5">
              Make Someone’s Day Special
            </span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              playClickPop();
              onToggleMute();
            }}
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            aria-label="Sound effects toggle"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-rose-50 transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-rose-500" />
                <span className="hidden md:inline">Sound On</span>
              </>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => {
              playClickPop();
              onNavigateCreate();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Card</span>
          </button>
        </div>
      </div>
    </header>
  );
};
