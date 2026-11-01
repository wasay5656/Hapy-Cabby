/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { OccasionType, GreetingCard } from './types/card';
import { getCardById } from './services/cards';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { CardCreator } from './components/CardCreator';
import { SurpriseCardOpener } from './components/SurpriseCardOpener';
import { CardShareModal } from './components/CardShareModal';
import { setMuted, getIsMuted, playClickPop } from './utils/audio';
import { Loader2, HeartCrack, ArrowLeft, PlusCircle } from 'lucide-react';

type ViewMode = 'home' | 'create' | 'card';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('birthday');
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [loadedCard, setLoadedCard] = useState<GreetingCard | null>(null);
  const [isLoadingCard, setIsLoadingCard] = useState<boolean>(false);
  const [cardFetchError, setCardFetchError] = useState<string | null>(null);

  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(getIsMuted());
  const [shareModalCard, setShareModalCard] = useState<GreetingCard | null>(null);

  /**
   * Parse current URL to determine view & card ID.
   * Supports:
   * 1. Path routing: /card/:id
   * 2. Hash routing: #/card/:id or #/c/:id
   * 3. Query params: ?card=:id
   */
  const parseRoute = () => {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);

    // 1. Check Query params
    const queryCardId = searchParams.get('card') || searchParams.get('c');
    if (queryCardId) {
      loadCard(queryCardId);
      return;
    }

    // 2. Check Hash routing
    const hashMatch = hash.match(/#\/(?:card|c)\/([^/?]+)/);
    if (hashMatch && hashMatch[1]) {
      loadCard(hashMatch[1]);
      return;
    }
    if (hash === '#/create') {
      setCurrentView('create');
      return;
    }

    // 3. Check Path routing
    const pathMatch = pathname.match(/^\/(?:card|c)\/([^/?]+)/);
    if (pathMatch && pathMatch[1]) {
      loadCard(pathMatch[1]);
      return;
    }
    if (pathname === '/create') {
      setCurrentView('create');
      return;
    }

    // Default home
    setCurrentView('home');
    setLoadedCard(null);
  };

  useEffect(() => {
    parseRoute();

    const handlePopState = () => {
      parseRoute();
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const loadCard = async (id: string) => {
    setActiveCardId(id);
    setIsLoadingCard(true);
    setCardFetchError(null);
    setCurrentView('card');

    try {
      const card = await getCardById(id);
      if (card) {
        setLoadedCard(card);
      } else {
        setCardFetchError(
          "We couldn't find this card. The link might be incomplete, expired, or mistyped."
        );
      }
    } catch (err: any) {
      setCardFetchError(
        err.message || 'Error loading card. Please check your connection and try again.'
      );
    } finally {
      setIsLoadingCard(false);
    }
  };

  const navigateToHome = () => {
    window.history.pushState(null, '', '/');
    setCurrentView('home');
    setLoadedCard(null);
    setActiveCardId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCreate = (occasion?: OccasionType) => {
    if (occasion) {
      setSelectedOccasion(occasion);
    }
    window.history.pushState(null, '', '/create');
    setCurrentView('create');
    setLoadedCard(null);
    setActiveCardId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCard = (cardId: string) => {
    window.history.pushState(null, '', `/card/${cardId}`);
    loadCard(cardId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMute = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    setMuted(nextMuted);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-rose-50/70 via-pink-50/30 to-rose-50/50">
      {/* Top Navigation */}
      <Navbar
        onNavigateHome={navigateToHome}
        onNavigateCreate={() => navigateToCreate()}
        isMuted={isAudioMuted}
        onToggleMute={toggleMute}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <HomePage
            onStartCreate={navigateToCreate}
            onOpenCard={navigateToCard}
          />
        )}

        {currentView === 'create' && (
          <CardCreator
            initialOccasion={selectedOccasion}
            onNavigateHome={navigateToHome}
            onNavigateToCard={navigateToCard}
          />
        )}

        {currentView === 'card' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            {isLoadingCard ? (
              <div className="text-center py-24">
                <Loader2 className="w-10 h-10 text-rose-500 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">
                  Retrieving your special surprise...
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Getting the animations ready!
                </p>
              </div>
            ) : cardFetchError ? (
              <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-lg border border-rose-100 my-12">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartCrack className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">
                  Card Not Found
                </h2>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  {cardFetchError}
                </p>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => navigateToCreate()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md transition hover:scale-105 active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create a New Surprise Card</span>
                  </button>
                  <button
                    onClick={navigateToHome}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                  </button>
                </div>
              </div>
            ) : loadedCard ? (
              <SurpriseCardOpener
                card={loadedCard}
                onCreateNewCard={() => navigateToCreate()}
                onShareCard={() => setShareModalCard(loadedCard)}
              />
            ) : null}
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onSelectOccasion={(occ) => navigateToCreate(occ)}
        onCreateCard={() => navigateToCreate()}
      />

      {/* Share Modal Triggered from Card View */}
      {shareModalCard && (
        <CardShareModal
          card={shareModalCard}
          shareUrl={`${window.location.origin}/card/${shareModalCard.id}`}
          usedFirebase={false}
          onClose={() => setShareModalCard(null)}
          onPreviewAsReceiver={() => setShareModalCard(null)}
        />
      )}
    </div>
  );
}
