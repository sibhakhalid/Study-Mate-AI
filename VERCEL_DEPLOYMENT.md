# Vercel Deployment

Deploy this repository as two Vercel projects. The frontend and API must have
different project roots because the API has its own dependencies and runs as a
Vercel Function.

## 1. Deploy MongoDB

Use MongoDB Atlas (a local `mongodb://localhost` URI cannot work on Vercel).
Create a database user, allow the Vercel connection (`0.0.0.0/0` for a quick
development deployment), and copy the Atlas connection string.

## 2. Deploy the backend

Create a Vercel project from this repository with **Root Directory** set to
`backend`. The existing `backend/api/index.js` is detected automatically.

Add these Production, Preview, and Development environment variables:

```text
NODE_ENV=production
API_VERSION=v1
MONGODB_URI=mongodb+srv://...
CLIENT_ORIGIN=https://YOUR-FRONTEND.vercel.app
FIREBASE_PROJECT_ID=study-mate-ai-71284
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.1-flash-lite
GEMINI_MAX_OUTPUT_TOKENS=2048
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
AI_RATE_LIMIT_WINDOW_MS=60000
AI_RATE_LIMIT_MAX=15
```

Do not upload `.env` or a Firebase JSON key. Paste the private key as one
environment-variable value with literal `\n` sequences. Deploy, then verify:

```text
https://YOUR-BACKEND.vercel.app/health
```

## 3. Deploy the frontend

Create a second Vercel project from the same repository with the root directory
left as `.`. Vercel detects Vite and uses `npm run build`; the included
`vercel.json` keeps React Router routes working on refresh.

Add these frontend environment variables for all environments:

```text
VITE_API_BASE_URL=https://YOUR-BACKEND.vercel.app/api/v1
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=study-mate-ai-71284.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=study-mate-ai-71284
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Redeploy the frontend after replacing `YOUR-BACKEND` with the real backend URL.
Then replace the backend `CLIENT_ORIGIN` value with the real frontend URL and
redeploy the backend once more.

## 4. Firebase authorized domains

In Firebase Console, open Authentication > Settings > Authorized domains and
add the frontend's `YOUR-FRONTEND.vercel.app` domain. Keep Email/Password
enabled under Sign-in providers.

## 5. Verify production

Check the health URL, open the frontend, sign up or log in, create a note, and
confirm the browser request goes to the backend Vercel URL with an
`Authorization: Bearer ...` header. Test logout/login again to confirm the
MongoDB data persists.