# SecondMe Mindful Journey

This is a standalone Vite + React version of the current `SecondMe` front-end refactor, prepared so it can be opened and edited in Replit.

## What this version already does

- Turns the old one-shot emotion form into a step-by-step mindful journey
- Uses guided prompts instead of a single submit form
- Pushes the user to reflect a bit more at each step
- Keeps the UI minimal, soft, and emotionally calm
- Saves journey entries locally in the browser with `localStorage`
- Shows previous entries in a lightweight "Journey archive"

## Main interaction flow

1. User chooses their current emotional state
2. User chooses where the feeling is showing up most clearly
3. User chooses what kind of support they need right now
4. User writes one short reflection line
5. App saves the journey and shows it in the archive

## Important implementation note

This folder is **not** the original monorepo setup anymore.  
To make it runnable on its own, the data layer was simplified:

- Removed dependency on missing workspace packages
- Replaced API-backed emotion logs with a local store in `src/lib/emotion-store.ts`

So this is best understood as a **Replit-friendly standalone preview build**, not the full original production architecture.

## Key files

- `src/pages/Home.tsx`: main page layout
- `src/components/EmotionCheckIn.tsx`: step-by-step guided journey
- `src/components/JourneyTimeline.tsx`: archive of saved entries
- `src/components/ContentCards.tsx`: calm supporting prompts
- `src/lib/emotion-store.ts`: local storage based persistence
- `src/index.css`: visual tone and theme

## Run in Replit

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## What is still not done

- No real AI model call yet
- No backend persistence yet
- No user account or cross-device sync
- No real personalized reasoning beyond the guided prompt logic

## Suggested next step

The clean next move is to replace the local prompt logic with a real AI response layer, while keeping the current step-by-step UX shell.
