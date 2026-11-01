import React, { useState, useRef } from 'react';
import { OccasionType } from '../types/card';
import { OCCASIONS, DEMO_CARDS } from '../data/constants';
import { DodgingNoButton } from './DodgingNoButton';
import { playClickPop } from '../utils/audio';
import {
  Heart,
  Sparkles,
  Send,
  Eye,
  Smile,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Flame,
  Gift
} from 'lucide-react';

interface HomePageProps {
  onStartCreate: (occasion?: OccasionType) => void;
  onOpenCard: (cardId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartCreate,
  onOpenCard,
}) => {
  const miniArenaRef = useRef<HTMLDivElement | null>(null);
  const miniYesBtnRef = useRef<HTMLButtonElement | null>(null);
  const [playCount, setPlayCount] = useState(0);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24">
        {/* Soft Pink Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-rose-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-pink-100/50 rounded-full blur-2xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Friendly Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 text-rose-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs border border-rose-200">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Make Someone’s Day Special ❤️</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            The Interactive Surprise Card{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600">
              They Won't Stop Smiling At.
            </span>
          </h1>

          {/* Short One-Sentence Explanation */}
          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Create a personalized surprise greeting card with playful animations and send it instantly with a unique link — no login needed!
          </p>

          {/* Primary Call to Action */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                playClickPop();
                onStartCreate('birthday');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-rose-400/30 transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Create Your Card</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                playClickPop();
                onOpenCard('demo-birthday');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/90 hover:bg-white text-slate-700 font-semibold text-sm sm:text-base border border-rose-200 shadow-sm transition hover:scale-102"
            >
              <Eye className="w-4 h-4 text-rose-500" />
              <span>See Demo Card</span>
            </button>
          </div>

          {/* Hero Feature Teaser: The Dodging Button Mini-Game */}
          <div className="mt-14 max-w-lg mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-lg border border-rose-100">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>Try The Mischievous "NO" Button Right Here</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mb-4">
              When your receiver opens their card, the NO button escapes whenever they try to tap it! Give it a test:
            </p>

            <div
              ref={miniArenaRef}
              className="relative w-full h-36 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center justify-center gap-4 p-4 overflow-hidden"
            >
              <button
                ref={miniYesBtnRef}
                onClick={() => {
                  playClickPop();
                  onOpenCard('demo-birthday');
                }}
                className="px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95 z-10"
              >
                YES, OPEN IT ❤️
              </button>

              <DodgingNoButton
                arenaRef={miniArenaRef}
                yesButtonRef={miniYesBtnRef}
                onDodgeAttempt={(c) => setPlayCount(c)}
              />
            </div>
            {playCount > 0 && (
              <p className="text-xs text-rose-600 font-medium mt-2">
                Dodged {playCount} times! Now imagine their reaction when they open your link 😂
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Occasion Choices Section */}
      <section className="py-12 bg-white/60 backdrop-blur-xs border-y border-rose-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">
              Choose an Occasion
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              Cards for Every Special Moment
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1 max-w-md mx-auto">
              Tap any occasion below to start designing your card right away.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(OCCASIONS) as OccasionType[]).map((occKey) => {
              const occ = OCCASIONS[occKey];
              return (
                <div
                  key={occKey}
                  onClick={() => {
                    playClickPop();
                    onStartCreate(occKey);
                  }}
                  className="group relative bg-white rounded-2xl p-5 border border-rose-100/80 hover:border-rose-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="text-3xl select-none group-hover:scale-110 transition-transform">
                      {occ.emoji}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 text-base group-hover:text-rose-600 transition-colors">
                          {occ.label}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {occ.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">
              Simple & Delightful
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              How Happy Cappy Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border border-rose-100 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 font-black text-xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">
                Personalize Your Card
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Choose an occasion, type their name, write your heartfelt message, and pick your favorite color theme.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border border-rose-100 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 font-black text-xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">
                Share The Unique Link
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Send the private link via WhatsApp, Instagram, SMS, or any chat. No apps to download for either of you!
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 text-center border border-rose-100 shadow-xs relative">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 font-black text-xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">
                They Enjoy The Surprise!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                They get tricked by the mischievous dodging NO button, unseal the card, and celebrate with confetti!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ready-to-Open Demo Examples */}
      <section className="py-12 bg-rose-50/50 border-t border-rose-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block mb-1">
                Try Live Examples
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                Experience Cards as a Receiver
              </h2>
            </div>
            <button
              onClick={() => {
                playClickPop();
                onStartCreate();
              }}
              className="text-sm font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
            >
              <span>Or make your own now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {Object.values(DEMO_CARDS).map((demo) => {
              const occ = OCCASIONS[demo.occasion];
              return (
                <div
                  key={demo.id}
                  onClick={() => {
                    playClickPop();
                    onOpenCard(demo.id);
                  }}
                  className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 font-semibold text-xs border border-rose-100">
                      {occ.emoji} {occ.label}
                    </span>
                    <span className="text-xs text-slate-400">Live Demo</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1 group-hover:text-rose-600 transition-colors">
                    For {demo.receiverName}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4">
                    "{demo.message}"
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-rose-500">
                    <span>Open Surprise Screen</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-rose-400/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-xl" />
            <h2 className="text-2xl sm:text-4xl font-black mb-3">
              Ready to brighten someone’s day?
            </h2>
            <p className="text-rose-100 text-sm sm:text-base max-w-lg mx-auto mb-6">
              It takes less than 60 seconds. Write a message, pick a theme, and send the link to someone special right now.
            </p>
            <button
              onClick={() => {
                playClickPop();
                onStartCreate('birthday');
              }}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-rose-600 font-extrabold text-base shadow-lg hover:bg-rose-50 transition-all hover:scale-105 active:scale-95"
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              <span>Create Your Card Now</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
