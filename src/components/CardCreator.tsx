import React, { useState } from 'react';
import { OccasionType, ThemeId, CreateCardInput, GreetingCard } from '../types/card';
import { OCCASIONS, THEMES } from '../data/constants';
import { createCard } from '../services/cards';
import { CardDisplay } from './CardDisplay';
import { CardShareModal } from './CardShareModal';
import { playClickPop } from '../utils/audio';
import {
  Sparkles,
  Heart,
  Eye,
  Edit3,
  Send,
  Loader2,
  AlertCircle,
  Lightbulb,
  Palette,
  User,
  MessageSquare
} from 'lucide-react';

interface CardCreatorProps {
  initialOccasion?: OccasionType;
  onNavigateHome: () => void;
  onNavigateToCard: (cardId: string) => void;
}

export const CardCreator: React.FC<CardCreatorProps> = ({
  initialOccasion = 'birthday',
  onNavigateHome,
  onNavigateToCard,
}) => {
  const [occasion, setOccasion] = useState<OccasionType>(initialOccasion);
  const [receiverName, setReceiverName] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [message, setMessage] = useState<string>(
    OCCASIONS[initialOccasion]?.sampleMessage || ''
  );
  const [theme, setTheme] = useState<ThemeId>('rose_blush');

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Success modal state
  const [shareData, setShareData] = useState<{
    card: GreetingCard;
    shareUrl: string;
    usedFirebase: boolean;
  } | null>(null);

  // When occasion changes, offer to replace message with sample if empty or default
  const handleSelectOccasion = (selected: OccasionType) => {
    playClickPop();
    setOccasion(selected);
    const currOcc = OCCASIONS[occasion];
    if (!message.trim() || (currOcc && message === currOcc.sampleMessage)) {
      setMessage(OCCASIONS[selected].sampleMessage);
    }
  };

  const handleUseSampleMessage = () => {
    playClickPop();
    setMessage(OCCASIONS[occasion].sampleMessage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!receiverName.trim()) {
      setErrorMessage("Please enter the receiver's name.");
      return;
    }
    if (!message.trim()) {
      setErrorMessage("Please write a warm message for your card.");
      return;
    }

    setIsSubmitting(true);
    playClickPop();

    try {
      const input: CreateCardInput = {
        occasion,
        receiverName: receiverName.trim(),
        senderName: senderName.trim() || undefined,
        message: message.trim(),
        theme,
      };

      const result = await createCard(input);
      setShareData(result);
    } catch (err: any) {
      console.error('Error creating card:', err);
      setErrorMessage(
        err.message || 'Something went wrong while creating your card. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Virtual card for live preview
  const previewCard: GreetingCard = {
    id: 'preview-card',
    occasion,
    receiverName: receiverName.trim() || 'Alex',
    senderName: senderName.trim() || 'Your Name',
    message:
      message.trim() ||
      'Your warm, heartfelt message will appear here with beautiful typography and cheerful styling.',
    theme,
    createdAt: Date.now(),
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Creator Top Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs sm:text-sm font-semibold mb-2">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>No sign-up or email required</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          Create Your Surprise Card
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto mt-1">
          Customize your greeting, pick an occasion & theme, and get a unique link to send in seconds!
        </p>
      </div>

      {/* Mode Switcher: Edit Form vs Live Preview */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-white p-1 rounded-full border border-rose-200 shadow-xs flex">
          <button
            type="button"
            onClick={() => {
              playClickPop();
              setActiveTab('edit');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === 'edit'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Customize Card</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickPop();
              setActiveTab('preview');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'preview' ? (
        <div className="py-4">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-wider font-semibold text-rose-500">
              Interactive Preview
            </span>
            <p className="text-sm text-slate-500">
              This is how your card will appear when {receiverName || 'they'} open it.
            </p>
          </div>
          <CardDisplay card={previewCard} isInteractivePreview={true} />
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setActiveTab('edit')}
              className="px-6 py-2.5 rounded-full bg-white border border-rose-300 text-rose-600 font-semibold text-sm hover:bg-rose-50 transition"
            >
              ← Back to Editing
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Choose Occasion */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-100">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h2 className="text-lg font-bold text-slate-800">
                Choose the Occasion
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {(Object.keys(OCCASIONS) as OccasionType[]).map((occKey) => {
                const occ = OCCASIONS[occKey];
                const isSelected = occasion === occKey;
                return (
                  <button
                    key={occKey}
                    type="button"
                    onClick={() => handleSelectOccasion(occKey)}
                    className={`flex items-center gap-2.5 p-3 sm:p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-400/20 shadow-xs'
                        : 'border-slate-200/90 hover:border-rose-200 bg-slate-50/50 hover:bg-white'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl select-none">{occ.emoji}</span>
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm text-slate-800 truncate">
                        {occ.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Receiver & Sender Names */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-100">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h2 className="text-lg font-bold text-slate-800">
                Who is this card for?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="receiverName"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Receiver's Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="receiverName"
                    type="text"
                    required
                    maxLength={60}
                    placeholder="e.g., Sarah, Grandma, Mom, Bestie..."
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm text-slate-800 font-medium placeholder:text-slate-400"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Shown on the surprise screen and greeting card.
                </p>
              </div>

              <div>
                <label
                  htmlFor="senderName"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Your Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Heart className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="senderName"
                    type="text"
                    maxLength={60}
                    placeholder="e.g., Alex, Your Secret Admirer..."
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm text-slate-800 font-medium placeholder:text-slate-400"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Leave blank if you want to stay anonymous.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3: Personal Message */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <h2 className="text-lg font-bold text-slate-800">
                  Write Your Personal Message
                </h2>
              </div>

              <button
                type="button"
                onClick={handleUseSampleMessage}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Use sample template</span>
              </button>
            </div>

            <div className="relative">
              <textarea
                required
                rows={5}
                maxLength={1500}
                placeholder="Write your heartfelt message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent text-sm sm:text-base text-slate-800 leading-relaxed placeholder:text-slate-400 resize-y"
              />
              <div className="flex justify-between items-center text-xs text-slate-400 mt-1 px-1">
                <span>Tip: Add emojis or line breaks for extra warmth!</span>
                <span>{message.length} / 1500</span>
              </div>
            </div>
          </div>

          {/* Step 4: Choose Design Theme */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-rose-100">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h2 className="text-lg font-bold text-slate-800">
                Choose Card Theme
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
                const t = THEMES[themeKey];
                const isSelected = theme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => {
                      playClickPop();
                      setTheme(themeKey);
                    }}
                    className={`relative p-3.5 rounded-2xl border text-left transition-all overflow-hidden ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-400/30 shadow-md scale-102'
                        : 'border-slate-200 hover:border-rose-300 opacity-90 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-1 text-sm">
                        {t.emojiDeco.slice(0, 3).map((e, idx) => (
                          <span key={idx}>{e}</span>
                        ))}
                      </div>
                      <span
                        className="w-4 h-4 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: t.accentColor }}
                      />
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {t.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
              <div>
                <p className="font-semibold">Unable to create card</p>
                <p className="text-rose-600 text-xs mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Submission Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-base shadow-lg shadow-rose-400/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Your Surprise...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Create & Get Share Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
            >
              Preview First
            </button>
          </div>
        </form>
      )}

      {/* Share Modal upon Creation Success */}
      {shareData && (
        <CardShareModal
          card={shareData.card}
          shareUrl={shareData.shareUrl}
          usedFirebase={shareData.usedFirebase}
          onClose={() => setShareData(null)}
          onPreviewAsReceiver={() => {
            setShareData(null);
            onNavigateToCard(shareData.card.id);
          }}
        />
      )}
    </div>
  );
};
