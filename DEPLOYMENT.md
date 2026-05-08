# Deploy SWE Repository to Firebase Hosting

This project is already set up to use Firebase Firestore and Firebase Auth with environment variables.

## Free deployment path
1. Install Firebase CLI:
   - `npm install -g firebase-tools`
2. Log in:
   - `firebase login`
3. Create a free Firebase project at https://console.firebase.google.com/
4. In this repo, configure Firebase:
   - Replace `your-firebase-project-id` in `.firebaserc`
   - Copy `.env.local.example` to `.env.local`
   - Fill in the Firebase config values from your Firebase project settings
5. Enable services in Firebase Console:
   - Authentication → Sign-in method → Email/Password
   - Firestore Database → Create database in production or test mode
6. Deploy:
   - `npm install`
   - `npm run build`
   - `npx firebase deploy`

## Notes
- Firebase free tier (Spark) supports Hosting, Firestore, and Auth.
- This app already checks `process.env.REACT_APP_FIREBASE_*` values in `src/firebase.js`.
- `.env.local` is ignored by git so your API keys stay private.
