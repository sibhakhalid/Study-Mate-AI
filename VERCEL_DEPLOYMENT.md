# Vercel Deployment

Deploy this repository as one Vercel project from the repository root. Vercel
serves the Vite output for the frontend and the Express API function from the
same domain.

## 1. Deploy MongoDB

Use MongoDB Atlas (a local `mongodb://localhost` URI cannot work on Vercel).
Create a database user, allow the Vercel connection (`0.0.0.0/0` for a quick
development deployment), and copy the Atlas connection string.

## 2. Configure the single Vercel project

Create one Vercel project from this repository with **Root Directory** set to
`.`. The root `api/index.js` imports the existing Express app from `backend/`.
The root `package.json` includes the backend runtime dependencies so Vercel's
single install can bundle the function.

Add these Production, Preview, and Development environment variables:

```text
NODE_ENV=production
API_VERSION=v1
MONGODB_URI=mongodb+srv://...
CLIENT_ORIGIN=https://study-mate-ai-b41e.vercel.app
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
https://study-mate-ai-b41e.vercel.app/health
```

The API is available at `https://study-mate-ai-b41e.vercel.app/api/v1`.
In the Vercel project, add this frontend environment variable for Production,
Preview, and Development, then redeploy:

```text
VITE_API_BASE_URL=https://study-mate-ai-b41e.vercel.app/api/v1
```

The frontend also falls back to the relative `/api/v1` base in production if
the variable is omitted. For local development, `.env` uses
`VITE_API_BASE_URL=http://localhost:5000/api/v1`.

Add these frontend Firebase environment variables for all environments:

```text
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=study-mate-ai-71284.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=study-mate-ai-71284
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

No separate backend URL is needed for the deployed frontend. Keep
`CLIENT_ORIGIN` set to the same Vercel frontend domain.

## 3. Firebase authorized domains

In Firebase Console, open Authentication > Settings > Authorized domains and
add `study-mate-ai-b41e.vercel.app`. Keep Email/Password
enabled under Sign-in providers.

## 4. Verify production

Check the health URL, open the frontend, sign up or log in, create a note, and
confirm the browser request goes to `/api/v1/notes` with an
`Authorization: Bearer ...` header. The API rewrite appears before the SPA
fallback in `vercel.json`, so `/api/*` is never rewritten to `index.html`.

## Commands

From the repository root:

```text
npm install
npm run dev
```

Deploy with:

```text
npx vercel --prod
```

Use Vercel's defaults for **Build Command** (`npm run build`), **Output
Directory** (`dist`), and **Install Command** (`npm install`).