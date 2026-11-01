export type OccasionType =
  | 'birthday'
  | 'love'
  | 'anniversary'
  | 'congratulations'
  | 'sorry'
  | 'thank_you'
  | 'friendship'
  | 'good_luck'
  | 'just_because';

export type ThemeId =
  | 'rose_blush'
  | 'golden_sparkle'
  | 'lavender_dream'
  | 'confetti_pop'
  | 'mint_sunshine'
  | 'midnight_magic';

export interface OccasionInfo {
  id: OccasionType;
  label: string;
  icon: string;
  emoji: string;
  description: string;
  sampleMessage: string;
  tagline: string;
  particleType: 'confetti' | 'hearts' | 'sparkles' | 'stars';
}

export interface CardTheme {
  id: ThemeId;
  name: string;
  accentColor: string;
  bgGradient: string;
  cardBg: string;
  borderStyle: string;
  textColor: string;
  messageStyle: string;
  emojiDeco: string[];
  envelopeColor: string;
  envelopeFlap: string;
  glowColor: string;
}

export interface GreetingCard {
  id: string;
  occasion: OccasionType;
  receiverName: string;
  senderName?: string;
  message: string;
  theme: ThemeId;
  createdAt: number;
  openedCount?: number;
}

export interface CreateCardInput {
  occasion: OccasionType;
  receiverName: string;
  senderName?: string;
  message: string;
  theme: ThemeId;
}
