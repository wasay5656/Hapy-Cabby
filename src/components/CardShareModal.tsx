import React, { useState } from 'react';
import { GreetingCard } from '../types/card';
import { OCCASIONS } from '../data/constants';
import {
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
  Smartphone,
  Mail,
  Send,
  Sparkles,
  Heart,
  X
} from 'lucide-react';

interface CardShareModalProps {
  card: GreetingCard;
  shareUrl: string;
  usedFirebase: boolean;
  onClose: () => void;
  onPreviewAsReceiver: () => void;
}

export const CardShareModal: React.FC<CardShareModalProps> = ({
  card,
  shareUrl,
  usedFirebase,
  onClose,
  onPreviewAsReceiver,
}) => {
  const [copied, setCopied] = useState(false);
  const occasion = OCCASIONS[card.occasion] || OCCASIONS.just_because;

  const shareTitle = `A special surprise card for ${card.receiverName}! 💌`;
  const shareText = `Hey ${card.receiverName}, I made a special interactive surprise card for you on Happy Cappy! Tap to open:`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  // Direct messaging URLs
  const encodedText = encodeURIComponent(`${shareText} ${shareUrl}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const smsUrl = `sms:?body=${encodedText}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodedText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Sparkles className="w-7 h-7 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Your Card Is Ready to Send! 🎉
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Send this unique surprise link to <strong>{card.receiverName}</strong>. They will enjoy the playful NO button and unseal their personalized card!
          </p>
        </div>

        {/* Link Box */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 mb-6">
          <label className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1.5">
            Unique Surprise Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-white px-3 py-2 rounded-xl text-xs sm:text-sm font-mono text-slate-700 border border-rose-200 focus:outline-rose-400 select-all"
            />
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button
            onClick={handleNativeShare}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm shadow-md shadow-rose-300/40 transition hover:scale-102 active:scale-98"
          >
            <Share2 className="w-4 h-4" />
            <span>Share via Device</span>
          </button>

          <button
            onClick={onPreviewAsReceiver}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition hover:scale-102 active:scale-98"
          >
            <ExternalLink className="w-4 h-4 text-rose-500" />
            <span>Test-Open Card</span>
          </button>
        </div>

        {/* Quick Social / Messenger Shortcuts */}
        <div className="border-t border-slate-100 pt-5">
          <p className="text-xs font-semibold text-slate-400 text-center uppercase tracking-wider mb-3">
            Or share directly via
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition hover:scale-110 flex items-center justify-center"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-5 h-5 fill-emerald-500 text-white" />
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 transition hover:scale-110 flex items-center justify-center"
              title="Share on Telegram"
            >
              <Send className="w-5 h-5" />
            </a>

            <a
              href={smsUrl}
              className="p-3 rounded-full bg-purple-50 text-purple-600 hover:bg-purple-100 transition hover:scale-110 flex items-center justify-center"
              title="Share via SMS"
            >
              <Smartphone className="w-5 h-5" />
            </a>

            <a
              href={mailUrl}
              className="p-3 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 transition hover:scale-110 flex items-center justify-center"
              title="Share via Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Friendly status footnote */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-100 pt-3 flex items-center justify-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Your surprise card is saved and ready to share!</span>
        </div>
      </div>
    </div>
  );
};
