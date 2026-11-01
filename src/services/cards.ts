import { doc, getDoc, setDoc, serverTimestamp, updateDoc, increment } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
import { CreateCardInput, GreetingCard } from '../types/card';
import { DEMO_CARDS } from '../data/constants';

const LOCAL_STORAGE_CARDS_KEY = 'happy_cappy_saved_cards_v1';

/**
 * Generates a cryptographically strong, hard-to-guess unique ID (e.g. hc-9xk4b2m81q).
 * Ensures privacy so card URLs cannot be guessed or sequentially enumerated.
 */
export function generateSecureCardId(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  let result = 'hc-';
  for (let i = 0; i < array.length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

/**
 * Validates card input bounds to prevent abuse and ensure high quality text.
 */
export function validateCardInput(input: CreateCardInput): { isValid: boolean; error?: string } {
  if (!input.receiverName || input.receiverName.trim().length === 0) {
    return { isValid: false, error: "Please enter the receiver's name." };
  }
  if (input.receiverName.trim().length > 60) {
    return { isValid: false, error: "Receiver's name must be under 60 characters." };
  }
  if (input.senderName && input.senderName.trim().length > 60) {
    return { isValid: false, error: "Sender's name must be under 60 characters." };
  }
  if (!input.message || input.message.trim().length === 0) {
    return { isValid: false, error: "Please write a personal message for your card." };
  }
  if (input.message.trim().length > 1500) {
    return { isValid: false, error: "Card message must be under 1,500 characters." };
  }
  if (!input.occasion) {
    return { isValid: false, error: "Please select an occasion." };
  }
  if (!input.theme) {
    return { isValid: false, error: "Please select a card design theme." };
  }
  return { isValid: true };
}

/**
 * Helper to manage local storage cache of cards.
 * Ensures the app works smoothly in local testing, offline, or while waiting for Firebase configuration.
 */
function getLocalCardsMap(): Record<string, GreetingCard> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CARDS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalCard(card: GreetingCard): void {
  try {
    const map = getLocalCardsMap();
    map[card.id] = card;
    localStorage.setItem(LOCAL_STORAGE_CARDS_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn('Could not save to localStorage:', err);
  }
}

/**
 * Saves a new greeting card.
 * If Firebase is configured with real credentials, saves directly to Firestore.
 * Always saves a local copy so users can test immediately.
 */
export async function createCard(
  input: CreateCardInput
): Promise<{ card: GreetingCard; shareUrl: string; usedFirebase: boolean }> {
  const validation = validateCardInput(input);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid card information.');
  }

  const id = generateSecureCardId();
  const now = Date.now();

  const newCard: GreetingCard = {
    id,
    occasion: input.occasion,
    receiverName: input.receiverName.trim(),
    senderName: input.senderName?.trim() || '',
    message: input.message.trim(),
    theme: input.theme,
    createdAt: now,
    openedCount: 0,
  };

  let savedToFirebase = false;

  if (isFirebaseConfigured() && db) {
    try {
      const cardDocRef = doc(db, 'cards', id);
      await setDoc(cardDocRef, {
        id,
        occasion: newCard.occasion,
        receiverName: newCard.receiverName,
        senderName: newCard.senderName || null,
        message: newCard.message,
        theme: newCard.theme,
        createdAt: serverTimestamp(),
        openedCount: 0,
      });
      savedToFirebase = true;
    } catch (err: any) {
      console.error('Firestore save failed:', err);
      // We do not disguise failures if real Firebase was attempted
      throw new Error(
        `Failed to save card to Firebase Firestore: ${err.message || 'Network or permissions error'}. Please check your Firebase rules and connection.`
      );
    }
  }

  // Save to local cache as well so the sender and local tests work seamlessly
  saveLocalCard(newCard);

  // Construct hard-to-guess share URL (using standard path routing)
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/card/${id}`;

  return {
    card: newCard,
    shareUrl,
    usedFirebase: savedToFirebase,
  };
}

/**
 * Fetches a card by its unique ID.
 * Looks in Firestore first if connected; otherwise checks local storage cache or demo catalog.
 */
export async function getCardById(id: string): Promise<GreetingCard | null> {
  if (!id || typeof id !== 'string') return null;

  // Check demo cards first if ID matches
  if (DEMO_CARDS[id]) {
    return DEMO_CARDS[id];
  }

  // 1. Try Firestore if configured
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'cards', id);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        const card: GreetingCard = {
          id: snapshot.id,
          occasion: data.occasion,
          receiverName: String(data.receiverName || ''),
          senderName: data.senderName ? String(data.senderName) : '',
          message: String(data.message || ''),
          theme: data.theme || 'rose_blush',
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
          openedCount: data.openedCount || 0,
        };

        // Increment open count non-blockingly
        try {
          updateDoc(docRef, { openedCount: increment(1) }).catch(() => {});
        } catch {
          // ignore
        }

        return card;
      }
    } catch (err) {
      console.warn('Error fetching card from Firestore, checking local storage:', err);
    }
  }

  // 2. Check local storage fallback
  const localMap = getLocalCardsMap();
  if (localMap[id]) {
    return localMap[id];
  }

  return null;
}
