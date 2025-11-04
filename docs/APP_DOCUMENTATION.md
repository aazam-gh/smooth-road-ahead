# Qatar Insurance Lifestyle — Product & Technical Documentation

Your personal lifestyle companion for discovering, planning, and enjoying life in Qatar, with integrated assistance for insurance profiles.


## Executive summary

Qatar Insurance Lifestyle (QIC Lifestyle) is a mobile‑first web app that helps residents in Qatar discover relevant events and offers, plan their day, and manage essential insurance profiles. It combines:

- Personalized lifestyle recommendations (Discover, For You)
- Daily planning tools (check‑ins, today’s action, plans)
- An AI assistant (text and optional voice) for family activities, weekend trips, and insurance questions
- Simple insurance profile management (vehicle, health, home)
- Bilingual UX (Arabic/English) with RTL support

All features run in the browser with local-first storage; selected AI capabilities use Google Gemini if an API key is configured.


## Who this is for

- Qatar residents and families looking for curated, local experiences and deals
- Users who want a lightweight planner with quick actions and daily engagement
- QIC members who want a single place to store basic insurance profile details and receive relevant reminders


## Core value proposition

- Save time finding things to do and deals to claim
- Stay organized with daily plans, check‑ins and reminders
- Get quick, practical guidance from an AI assistant
- Keep your vehicle/health/home insurance details handy and get timely nudges


## Primary user flows

Below are the key end‑to‑end flows a new user follows.

### 1) Welcome → Onboarding → Dashboard
- Landing at `/` shows the Welcome screen with language toggle and two CTAs.
- “Get Started” → `/onboarding` (multi‑step signup):
  - Step 1: Name, email (+ optional social sign‑in placeholders)
  - Step 2: Phone
  - Step 3: Work context (job title, work address)
  - Step 4: Food preferences
  - Step 5: Activity preferences
  - On submit, a `userProfile` is stored in localStorage and the user is routed to `/ndashboard`.
- Dashboard (`/ndashboard`):
  - Welcome header, date, quick weather and traffic cards
  - Today’s Plans (add/edit/remove simple entries)
  - Make Your Plans (contextual suggestions based on preferences)
  - Personalized Offers (open Offer modal, claim state per offer in‑memory)
  - Daily Check‑in widget and simple activity stats
  - Quick Actions

Alternative dashboard (`/dashboard`) also exists and showcases “For You” section + daily widgets.

### 2) Discover short‑video feed
- Route: `/discover`
- Infinite‑style vertical short videos (mock data) with like/save/share actions.
- Likes and Saves persist locally and influence future “For You” picks on the dashboard.

### 3) Chat assistant (text + optional voice)
- Route: `/chat`
- Use cases: Family Activities Planner, Travel Optimization, Insurance Assistant.
- Text chat streams responses; voice chat can be started from the mic button.
- “Find Nearby Garages” uses geolocation and Gemini Maps grounding (if key present) to list nearby workshops and simulate booking.

### 4) Insurance and profiles
- Route: `/vehicle-profile`
- Tabs: Vehicle, Health, Home
- Simple profiles with editable fields stored in component state (extendable to persist later).
- Vehicle health and upcoming maintenance are visual summaries; the codebase includes an AI‑assisted PRR scoring service that can be wired into this view.

### 5) Account & settings
- Route: `/account`
- Profile card, language switching, and a menu for preferences and notifications.


## Features in depth

### Personalization and “For You”
- Data source: `src/lib/discoverData.ts` (mock content: events, offers, tips, reminders, AI notices)
- Signals used: Likes and Saves from `/discover`, plus category affinity and recency
- Storage keys:
  - `discoverLiked`: string[] of item IDs
  - `discoverSaved`: string[] of item IDs
  - Daily cache key: `forYouCache_YYYY-MM-DD`

### Daily engagement
- Daily Check‑in (`src/components/DailyCheckin.tsx`)
  - Tracks streaks with `dailyCheckins` (localStorage)
- Today’s Action (`src/components/DailyActionCard.tsx`)
  - Rotates a contextual tip/offer
  - Keys used: `dailyActionDone_YYYY-MM-DD`, `dailyReminders`

### Offers and claims
- Offers in the new dashboard open a rich `OfferModal` with images, ratings, terms, pricing, and claim state (kept in UI state; easily extended to persist).

### AI assistant and voice
- Text chat streams from Gemini (model: `gemini-2.5-flash`). If no API key is configured, a helpful demo stream is returned.
- Voice uses Google GenAI Live API (model: `gemini-2.5-flash-native-audio-preview-09-2025`). It opens a live session, captures mic audio at 16kHz PCM, and receives transcripts + audio responses. Without an API key, the UI gracefully explains limitations.
- Grounded search for garages uses Gemini’s Maps tool when available, falling back to generic guidance.
- Configuration: `VITE_GEMINI_API_KEY` in `.env` (see Setup).

### Insurance profiles and PRR scoring
- Vehicle, Health, Home profiles allow simple data entry and reminders UI.
- `calculatePrrScore(vehicle, environment)` in `src/lib/geminiService.ts`:
  - Combines rules (e.g., sandstorms, heat days, oil change intervals) with optional Gemini analysis
  - Returns: PRR score, overall assessment, and prioritized recommendations
  - Works in demo‑mode without an API key using deterministic fallbacks

### Internationalization (i18n)
- Full Arabic and English support via a lightweight context provider in `src/lib/i18n.tsx`
- RTL switching by setting `document.documentElement.dir = 'rtl'` when Arabic is active
- Toggle component: `LanguageToggle` (in header bars across pages)
- Storage: `language` in localStorage

### Analytics (local‑first)
- `src/lib/analytics.ts` records lightweight client events in `app_analytics_events` (localStorage)
- Keeps the last 500 events; logs to console in dev


## Information architecture and navigation

- Bottom navigation (always visible): Home `/ndashboard`, Chat `/chat`, Insurance `/vehicle-profile`, Discover `/discover`
- Top headers include language toggle and utility icons (notifications/settings)

Routes overview:
- `/` Welcome
- `/onboarding` Guided signup (5 steps)
- `/ndashboard` New dashboard (recommended home)
- `/dashboard` Alternate dashboard with “For You”
- `/discover` Short‑video feed
- `/chat` AI assistant (text + optional voice)
- `/vehicle-profile` Insurance & profiles (Vehicle, Health, Home tabs)
- `/account` Account & preferences
- `*` NotFound


## Data and state model

Local storage keys and meaning:
- `language`: current language code (`en` | `ar`)
- `userProfile`: onboarding result (name, contacts, work, preferences)
- `dailyCheckins`: string[] dates (YYYY‑MM‑DD)
- `dailyActionDone_YYYY-MM-DD`: stores the ID of the rotated action when completed
- `dailyReminders`: array of reminder entries with id/date
- `discoverLiked`: string[] of discover item IDs
- `discoverSaved`: string[] of discover item IDs
- `app_analytics_events`: recent event payloads for lightweight analytics

In‑memory state:
- Today’s plans (add/remove/sort)
- Claimed offers (per session)
- Chat messages and streaming state


## Technical architecture

- Frontend: React 18 + TypeScript, Vite
- UI: Tailwind CSS, shadcn/ui (Radix primitives)
- Routing: React Router DOM
- State/data: Local component state + localStorage; TanStack Query ready for future APIs
- Media: Short‑video feed with custom player controls; Offer images with `ImageWithFallback`
- AI/Voice: Google GenAI SDK (`@google/genai`) for text and live voice sessions
- i18n: Custom context and translation dictionaries (EN/AR)

Key modules:
- `src/pages/*`: route screens (Welcome, Onboarding, Dashboards, DiscoverFeed, Chat, VehicleProfile, Account)
- `src/components/*`: UI building blocks (DailyCheckin, DailyActionCard, OfferModal, BottomNav, etc.)
- `src/lib/geminiService.ts`: Gemini client, PRR scoring, chat streaming, maps grounding
- `src/lib/discoverData.ts`: mock feed data
- `src/lib/utils.ts`: helpers + check‑in streak utilities
- `src/lib/i18n.tsx`: internationalization
- `src/lib/analytics.ts`: local analytics store


## Accessibility and localization

- Arabic RTL layout supported globally
- Language toggle is keyboard accessible and labeled
- Buttons use clear contrast; icons paired with text labels where appropriate
- Video feed includes visible play/mute controls and progress indicators


## Error handling and resilience

- `ErrorBoundary` wraps the Discover feed
- AI services: graceful fallbacks without API key; chat streaming and maps grounding both handle network failures
- Voice session cleanup on stop/close or error
- Local storage operations are try/catch guarded


## Privacy and security

- No backend in this build; all data persists in browser storage only
- AI calls use a client‑side API key if configured; treat keys as sensitive and avoid committing them
- Geolocation prompts occur only on explicit action (“Find Nearby Garages”)


## Performance notes

- Vite + code‑splitting for fast dev reloads and production builds
- Minimal external dependencies; mock data keeps initial payload small
- Videos are streamed from public sample sources; production should use a CDN and adaptive formats


## Setup and configuration

Environment variables (.env):
- `VITE_GEMINI_API_KEY`: enables full AI chat, voice, and maps grounding

Local development:
- Node.js 18+
- Install deps, run dev server (see project README)

Optional testing checklist (manual):
- Toggle language EN/AR and verify RTL switch
- Complete onboarding; confirm you land on `/ndashboard`
- Add/Remove Today’s Plans; verify order by time
- Daily Check‑in increments streak and disables button for today
- Open offers; claim state appears in the modal
- Like/Save items in `/discover`; check that Dashboard “For You” reflects preferences
- Chat: send text prompts; verify streaming; try Family/Travel/Insurance quick actions
- Voice: start/stop session (requires mic permission + API key)
- Garages: click pin icon; allow location; verify grounded response or fallback text


## Known limitations and next steps

- Discover feed uses mock data; integrate a real content API
- Offer claims are session‑only; persist to user profile
- Insurance profile fields are not yet persisted; add storage or backend
- PRR scoring is available in the service layer but not fully wired to the UI
- Analytics are client‑only; add server ingestion if needed
- Add auth and real accounts


## Glossary

- PRR: Predictive Risk & Repair (vehicle health scoring)
- Grounding: Enhancing LLM responses with real‑world map data
- RTL: Right‑to‑Left typography/layout


## File map reference

- App entry: `src/main.tsx`, `src/App.tsx`
- Routing: defined in `src/App.tsx`
- Pages: `src/pages/`
- Components: `src/components/`
- Services & helpers: `src/lib/`
- Types: `types.ts`


## Contact and support

For product questions or implementation details, see the in‑app Help (planned) or contact the QIC dev team.
