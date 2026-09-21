# Unfazed — Major Project (Web Development)

A working MERN implementation of the project brief: a SaaS practice-management
platform for therapists, covering all 7 modules (auth/profile, scheduling,
client CRM, payments, clinical notes, chat/notifications, entitlements +
analytics).

## What's included

- `unfazed-backend/` — Node.js + Express + MongoDB (Mongoose) API, Socket.io
  for chat, Razorpay integration (test mode), PDF invoices, and the centralized
  Entitlement Service described in the brief.
- `unfazed-frontend/` — React (Vite) app with the Therapist Dashboard and
  public Client Portal, Tailwind CSS, Recharts for analytics.

Everything follows the folder structure and architecture in the project PDF,
including: config-driven subscription tiers (`SubscriptionTierConfig`), a
single `entitlementService.canAccess(therapistId, featureKey)` function that
every gated route goes through, hard-filtered private/shared clinical notes
at the query level, and a stubbed WhatsApp layer alongside real email
notifications.

## Run it locally

### 1. Prerequisites
- Node.js v18+
- A free MongoDB Atlas cluster (or local MongoDB)
- A free Razorpay test account (for payments)

### 2. Backend
```
cd unfazed-backend
npm install
cp .env.example .env
# edit .env: MONGO_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
npm run seed     # creates a demo therapist (dr.sharma@example.com / password123)
npm run dev      # http://localhost:5000
```

### 3. Frontend
```
cd unfazed-frontend
npm install
cp .env.example .env
# edit .env if your API isn't on localhost:5000
npm run dev      # http://localhost:5173
```

Visit `http://localhost:5173/login`, sign in with the seeded account, and the
branded public page is at `http://localhost:5173/<slug>` (printed by the seed
script, e.g. `dr-sharma`).

## Deployment (matches the brief's suggested stack)

**Database — MongoDB Atlas**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Database Access → add a user with a password.
3. Network Access → allow access from anywhere (0.0.0.0/0) for simplicity,
   or your hosting provider's IP range.
4. Copy the connection string → this is your `MONGO_URI`.

**Backend — Render or Railway**
1. Push `unfazed-backend/` to a GitHub repo (its own repo, or a subfolder —
   both platforms let you set a root directory).
2. Render: New → Web Service → connect the repo → root directory
   `unfazed-backend` → build command `npm install` → start command
   `npm start`.
   Railway: New Project → Deploy from GitHub → same settings.
3. Add environment variables from `.env.example` in the platform's dashboard
   (never commit `.env`). Set `CLIENT_ORIGIN` to your deployed frontend URL.
4. Once live, note the backend URL (e.g. `https://unfazed-api.onrender.com`).
5. In Razorpay's dashboard, add a webhook pointing to
   `https://<your-backend-url>/api/payments/webhook`, subscribed to
   `payment.captured`, and set `RAZORPAY_WEBHOOK_SECRET` to match.

**Frontend — Vercel**
1. Push `unfazed-frontend/` to a GitHub repo.
2. Vercel → New Project → import the repo → framework preset "Vite".
3. Add environment variables: `VITE_API_BASE_URL` = `https://<backend-url>/api`,
   `VITE_SOCKET_URL` = `https://<backend-url>`, `VITE_RAZORPAY_KEY_ID`.
4. Deploy. Vercel gives you a URL like `https://unfazed.vercel.app`.
5. Go back to your backend's env vars and set `CLIENT_ORIGIN` to this URL,
   then redeploy the backend so CORS allows it.

**Order to deploy in:** Atlas first (you need the connection string), then
backend (you need its URL for the frontend's env vars and for the Razorpay
webhook), then frontend last.

## Notes on scope / what's simplified vs. the full brief

- Client-portal routes (`/notes/client-portal/:id`, `ClientPortal.jsx`) are
  reachable with just a client's Mongo ID in the URL for this scaffold. Before
  using this for real clients, add a signed, expiring access token per client
  (e.g. a JWT minted at booking time) so the portal isn't guessable.
- WhatsApp notifications are stubbed (logged/queued) per the brief, since real
  WhatsApp Business API access requires business approval — swap
  `notificationService.queueWhatsApp` for a real provider when you have one.
- Cloud storage (AWS S3) isn't wired in; invoices currently save to local disk
  under `/invoices` and are served statically. For production, upload the
  PDF buffer to S3 in `invoiceService.js` and store the S3 URL instead.
- The `useEntitlement` hook on the frontend mirrors the tier caps only to
  show/hide UI quickly — the backend `entitlementService` is the real
  enforcement point, so it can't be bypassed from the client.

## Suggested build order (matches the brief's Module 1–7 sequencing)

Work through `git log`-worthy commits in this order even though the code
already exists end-to-end: Module 1 (auth/profile) → Module 2 (scheduling)
→ Module 3 (CRM/intake) → Module 4 (payments) → Module 5 (notes) →
Module 6 (chat/notifications) → Module 7 (entitlements/analytics). This
mirrors the dependency chain the brief calls out and gives you a commit
history a reviewer can follow module by module.
