# Happy Cappy — Make Someone’s Day Special ❤️

> A personalized, interactive web greeting card platform where you create customized surprise cards and share them with loved ones using a private, hard-to-guess unique link.

Featuring the **hilarious escaping "NO" button** that dodges cursor and touch attempts, an interactive unsealing envelope, occasion-tailored confetti celebrations, and a seamless mobile, tablet, and desktop responsive design.

---

## ✨ Features

- **No Sign-Up or Login Needed**: Senders can create cards in under 60 seconds without email, phone, or password hurdles.
- **9 Rich Occasions**: Birthday, Love, Anniversary, Congratulations, Sorry, Thank You, Friendship, Good Luck, and Just Because.
- **6 Beautiful Themes**: Blushing Rose & Hearts, Golden Elegance, Lavender Sweet Dream, Pastel Party Pop, Mint & Sunshine, and Starlight Romance.
- **Cheeky Dodging "NO" Button**: When receivers try to tap or click "NO", it wiggles, slides, and escapes to safe random coordinates with funny quips ("Nope! 😜", "Can't catch me! 💨"). Works smoothly on both touchscreens (mobile/tablet) and mouse/trackpad (desktop).
- **Celebration Effects**: Confetti cannons, floating hearts, and gentle synthesized audio fanfares (zero external audio file dependencies).
- **Hard-to-Guess Links**: Random cryptographically generated document IDs (e.g. `hc-7f9a2k8d1e`) keep cards private — names and messages never appear in the URL.
- **Multi-Device Sync via Firebase Firestore**: Cards created on your phone or laptop can be opened by anyone anywhere on their phone or tablet.
- **Zero-Config Fallback Storage**: Runs out of the box with intelligent local caching so you can test, preview, and build immediately even before adding your Firebase keys.
- **Netlify-Ready**: Includes `netlify.toml` and `_redirects` for zero-setup SPA deployment with full direct link & page refresh support.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (version 18 or newer recommended)
- npm or yarn

### 2. Install Dependencies
In your terminal / VS Code command prompt:
```bash
npm install
```

### 3. Run Locally
```bash
npm run dev
```
Open your browser to `http://localhost:3000` (or the URL printed in your terminal).

---

## ⚡ Connecting Your Firebase Firestore

Cards are stored in Firebase Firestore so they can be opened across different devices.

### Step 1: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and give it a name (e.g., `happy-cappy-app`).
3. Under Project Overview, click the **Web icon (`</>`)** to register a web app.
4. Copy the `firebaseConfig` object values provided by Firebase.

### Step 2: Enable Firestore Database
1. In the Firebase console left menu, go to **Build > Firestore Database**.
2. Click **Create database** (choose your closest location).
3. Start in **Production mode** or **Test mode**.

### Step 3: Add Keys in VS Code
You can add your credentials in either of two ways:

#### Option A: In a `.env` file (Recommended)
Create a `.env` file in the root directory of your project:
```env
VITE_FIREBASE_API_KEY="AIzaSyYourActualApiKeyHere"
VITE_FIREBASE_AUTH_DOMAIN="happy-cappy-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="happy-cappy-app"
VITE_FIREBASE_STORAGE_BUCKET="happy-cappy-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef1234567890"
```

#### Option B: Directly in `src/firebase.ts`
Open `src/firebase.ts` and replace the placeholder strings inside `DEFAULT_FIREBASE_CONFIG`.

### Step 4: Apply Firestore Security Rules
Go to **Firestore Database > Rules** in the Firebase Console, replace the contents with the rules from `firestore.rules`, and click **Publish**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{cardId} {
      allow get: if true;
      allow list: if false;
      allow create: if request.resource.data.keys().hasAll(['id', 'occasion', 'receiverName', 'message', 'theme', 'createdAt'])
        && request.resource.data.receiverName is string
        && request.resource.data.receiverName.size() > 0
        && request.resource.data.receiverName.size() <= 60
        && request.resource.data.message is string
        && request.resource.data.message.size() > 0
        && request.resource.data.message.size() <= 1500
        && request.resource.data.occasion in ['birthday', 'love', 'anniversary', 'congratulations', 'sorry', 'thank_you', 'friendship', 'good_luck', 'just_because']
        && request.resource.data.theme in ['rose_blush', 'golden_sparkle', 'lavender_dream', 'confetti_pop', 'mint_sunshine', 'midnight_magic'];
      allow update, delete: if false;
    }
  }
}
```

---

## 🌐 Deploying to Netlify

Happy Cappy is pre-configured for instant Netlify hosting.

### Option 1: Git Integration (Continuous Deployment)
1. Push this project to GitHub or GitLab.
2. Log into [Netlify](https://app.netlify.com/) and click **Add new site > Import an existing project**.
3. Select your repository.
4. Netlify will automatically detect `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Under **Site configuration > Environment variables**, add your `VITE_FIREBASE_*` variables.
6. Click **Deploy Site**!

### Option 2: Manual Drag & Drop
1. Run `npm run build` locally.
2. Drag the generated `dist/` folder into the Netlify Drop dashboard.

*Note: The included `netlify.toml` and `public/_redirects` guarantee that direct links such as `https://yoursite.netlify.app/card/hc-xyz123` work seamlessly without 404 errors on refresh.*

---

## 📱 Testing a Shared Card on Another Device

1. Create a card in Happy Cappy on your laptop or phone.
2. Copy the generated link or use the WhatsApp / SMS share button.
3. Open the link on another device (e.g., your smartphone).
4. Watch the surprise screen appear:
   - Try to tap the "NO" button and see it slip away across the screen!
   - Tap "YES, OPEN IT ❤️" to watch the envelope unseal, confetti pop, and your heartfelt greeting unfold.

---

## 🛡️ Security & Abuse Prevention

Because this version allows senders to create cards without signing in, several security measures are enforced:
- **No Private URLs**: Sensitive details (message, recipient name) are never encoded in the URL; only an unguessable 12-character random ID is used.
- **Strict Input Validation**: Recipient names are capped at 60 characters and messages at 1,500 characters to prevent spam or malicious database bloating.
- **No HTML Injection**: All user input is rendered safely as pure text.
- **No Public List Queries**: Attackers cannot crawl or list the `/cards` collection.
- **Immutable Cards**: Once created, cards cannot be modified or deleted publicly.
- **Recommended for High Volume**: When scaling, enable [Firebase App Check](https://firebase.google.com/docs/app-check) to prevent automated bots from creating cards.

---

## 📂 Project Structure

```
├── firestore.rules          # Firestore Security Rules
├── netlify.toml             # Netlify build and redirect configuration
├── public/
│   └── _redirects           # SPA routing fallback for static hosts
├── src/
│   ├── components/
│   │   ├── CardCreator.tsx          # Card creation wizard & live preview
│   │   ├── CardDisplay.tsx          # Theme-tailored greeting card component
│   │   ├── CardShareModal.tsx       # Share modal with copy & social shortcuts
│   │   ├── DodgingNoButton.tsx      # The mischievous escaping button
│   │   ├── FirebaseSetupModal.tsx   # Interactive setup guide & rules viewer
│   │   ├── Footer.tsx               # Footer with links & security notices
│   │   ├── HomePage.tsx             # Landing hero, occasions & playground
│   │   ├── Navbar.tsx               # Header with sound toggle & CTAs
│   │   └── SurpriseCardOpener.tsx   # Receiver surprise & card reveal sequence
│   ├── data/
│   │   └── constants.ts             # Occasions, themes, escape quips, demos
│   ├── services/
│   │   └── cards.ts                 # Firestore DB service with local fallback
│   ├── types/
│   │   └── card.ts                  # TypeScript definitions
│   ├── utils/
│   │   ├── audio.ts                 # Web Audio API synthesized sound effects
│   │   └── confetti.ts              # Occasion-tailored confetti effects
│   ├── App.tsx                      # Main app router & layout
│   ├── firebase.ts                  # Firebase initialization & configuration
│   ├── index.css                    # Tailwind CSS & custom animations
│   └── main.tsx                     # React entry point
└── package.json
```
