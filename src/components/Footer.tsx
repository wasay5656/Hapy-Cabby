import React from 'react';
import { Heart, Sparkles, Shield, Github, Globe } from 'lucide-react';
import { OccasionType } from '../types/card';
import { OCCASIONS } from '../data/constants';

interface FooterProps {
  onSelectOccasion: (occ: OccasionType) => void;
  onCreateCard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectOccasion,
  onCreateCard,
}) => {
  return (
    <footer className="bg-white border-t border-rose-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-lg text-slate-800">Happy Cappy</span>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Make Someone’s Day Special ❤️ — An interactive web greeting platform where personalized cards are shared via private unique links, complete with playful animations and celebration surprises!
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                No login required
              </span>
              <span>•</span>
              <span>Mobile, Tablet & Desktop responsive</span>
            </div>
          </div>

          {/* Occasions Links */}
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-3">Popular Occasions</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-500">
              {(['birthday', 'love', 'anniversary', 'congratulations', 'friendship'] as OccasionType[]).map(
                (occKey) => (
                  <li key={occKey}>
                    <button
                      onClick={() => onSelectOccasion(occKey)}
                      className="hover:text-rose-600 transition-colors flex items-center gap-1.5"
                    >
                      <span>{OCCASIONS[occKey].emoji}</span>
                      <span>{OCCASIONS[occKey].label}</span>
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Why Happy Cappy */}
          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-3">Why Happy Cappy?</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-500">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                <span>Playful dodging NO button</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                <span>100% Free & No Account Needed</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Private & Unguessable Links</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={onCreateCard}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <span>→ Create a Surprise Card Now</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Happy Cappy. Crafted with love & smiles.</p>
          <p className="flex items-center gap-1">
            <span>Make Someone’s Day Special ❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
