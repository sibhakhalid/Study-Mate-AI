# StudyMate AI — Backend

Production-ready Express API for StudyMate AI. Auth is Firebase (client-side
sign-in, server-side token verification); data lives in MongoDB via Mongoose;
AI features (flashcard generation, quiz generation, AI Tutor chat) run
through a single Gemini service layer.

## Stack

- **Runtime**: Node.js (ESM), Express 4
- **Database**: MongoDB + Mongoose
- **Auth**: Firebase Authentication (Admin SDK verifies ID tokens; the
  frontend talks to Firebase directly for sign-up/sign-in/password reset —
  this API never sees a password)
- **AI**: Google Gemini (`@google/generative-ai`), structured JSON output mode
- **Validation**: Zod
- **Security**: helmet, cors, express-rate-limit, express-mongo-sanitize

## Setup

1. `cd backend && npm install`
2. Copy `.env.example` to `.env` and fill in every value:
   - **MongoDB**: an Atlas connection string (or local `mongodb://localhost:27017/studymate`)
   - **Firebase**: Firebase Console → Project Settings → Service Accounts →
     Generate new private key. Copy `project_id`, `client_email`, and
     `private_key` from the downloaded JSON into the matching env vars
     (keep the `\n` sequences in the private key literal, as shown in
     `.env.example` — the app un-escapes them at startup).
   - **Gemini**: an API key from [Google AI Studio](https://aistudio.google.com/apikey).
3. `npm run dev` — starts the API on `PORT` (default `5000`) with hot reload
   via Node's built-in `--watch`.

## Architecture

```
src/
  config/       env validation, MongoDB connection, Firebase Admin init
  middleware/   auth verification, user provisioning, validation, rate limits, errors
  models/       Mongoose schemas (User, Note, Deck/Card, QuizAttempt, PlannerTask/StudyGoal, TutorConversation)
  services/     ALL business logic and Mongoose queries — one file per feature
  controllers/  thin HTTP layer — parse req, call a service function, wrap the result in ApiResponse
  routes/       one router per feature, mounted under /api/v1
  validators/   Zod schemas per feature, including pagination params on list endpoints
  utils/        ApiError, ApiResponse, asyncHandler, logger, pagination
  app.js        Express app assembly (middleware + route mounting)
  server.js     entrypoint — connects DB, starts listening, graceful shutdown
```

### Service layer

Every feature (`notesService.js`, `flashcardsService.js`, `quizService.js`,
`plannerService.js`, `userService.js`, `tutorChatService.js`,
`progressService.js`) owns its Mongoose queries and business rules.
Controllers never touch a model directly — they parse the request, call a
service function with `(userId, ...args)`, and hand the result to
`ApiResponse`. This keeps ownership checks (`user: userId` on every query)
in exactly one place per feature instead of repeated across every route
handler, and means the same service function could be called from a future
CLI script, cron job, or test suite without going through HTTP at all.

`geminiService.js` is the one exception that isn't feature-scoped — it's
the single module that talks to the AI, called *by* the notes/quiz/tutor
services rather than replacing them.

### Pagination

`GET /notes`, `GET /flashcards/decks`, `GET /quiz/attempts`, and
`GET /tutor-chat/conversations` accept `?page=&limit=` (default 20, max
100) and respond with a `pagination: { page, limit, total, totalPages }`
block alongside `data`. This matters once a student has been using the app
for months — a `Note.find({ user })` with no bound will happily try to
serialize a thousand documents into one response otherwise.
`GET /planner/tasks` is deliberately left unpaginated since it's always
called with a date range (a calendar view), which is naturally bounded.

Tutor chat conversation *lists* omit each conversation's `messages` array
(titles only) for the same reason — fetch a single conversation via
`GET /tutor-chat/conversations/:id` to get its full transcript.

### Auth flow

1. Frontend signs the user in/up directly against Firebase (email/password
   or Google) using the Firebase client SDK — unchanged from how
   `authService.js` already anticipated this.
2. Every subsequent API request sends `Authorization: Bearer <Firebase ID token>`.
3. `requireAuth` middleware verifies that token with the Firebase Admin SDK.
4. `attachUser` middleware then finds-or-creates a matching MongoDB `User`
   document (just-in-time provisioning) — no separate "register with our
   backend" step is needed after Firebase sign-up.

### Why Progress has no database table

Progress is entirely derived by aggregating real Notes/Quiz/Flashcard/Planner
data at request time (`services/progressService.js`) rather than being
stored redundantly — so the numbers can never drift from what's actually in
the other collections. This mirrors a design decision already made in the
frontend's mock `progressService.js`.

### API conventions

- All routes are versioned under `/api/v1`.
- Every response follows `{ success, data, message }` (`ApiResponse`).
- Every error follows `{ success: false, message, details? }` (`errorHandler`).
- AI-backed routes (`/flashcards/decks/generate`, `/quiz/generate`,
  `/tutor-chat/conversations/:id/messages`) sit behind a tighter rate limit
  than the rest of the API, since each call costs real money.

## Connecting the frontend

The frontend's `src/services/httpClient.js` owns this contract and every
feature service calls `apiRequest()`. Set `VITE_API_BASE_URL` to
`http://localhost:5000/api/v1` locally or
`https://study-mate-ai-b41e.vercel.app/api/v1` in the Vercel project. Firebase's ID
token should be attached as the `Authorization` header on every call — the
cleanest place to do that is inside `httpClient.js` itself via
`firebase.auth().currentUser.getIdToken()`.
