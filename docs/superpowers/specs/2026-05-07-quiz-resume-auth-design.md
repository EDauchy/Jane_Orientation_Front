# Quiz Resume & Auth Guard — Design Spec

**Date:** 2026-05-07
**Branch:** feature/dashboard-integration

---

## Context

The quiz store (`src/lib/quiz/store.ts`) already uses Zustand `persist` middleware, saving state to `localStorage` under key `orientation-assessment-v2`. The data is already saved — what's missing is:

1. A UI to detect and resume an in-progress session on the Landing page
2. An auth guard that prevents unauthenticated users from accessing quiz routes

---

## Feature 1 — Quiz Resume on Landing Page

### Where: `src/pages/quiz/Landing.tsx`

**State detection:**
- Read `state.audience`, `state.currentModuleIdx`, `state.completedAt` from `useAssessment`
- `hasSession = audience !== null && completedAt === null`
- Use `slugAt(audience, currentModuleIdx)` from `src/lib/quiz/flow/sequence.ts` to get the current module URL

**Button behavior when `hasSession = true` (authenticated):**
- Primary button label changes to **"Reprendre le quiz"** with a progress indicator (e.g. "Module 3/8")
- Clicking it navigates to `/quiz/assessment/${currentSlug}`
- The existing "Commencer" button also navigates to the current module (no reset)
- A small, discreet link **"Recommencer depuis le début"** appears below the buttons — it calls `resetSession()` from the store then navigates to `/quiz/qualify`

**Button behavior when `hasSession = false` (authenticated):**
- Existing behavior: "Commencer" → `/quiz/qualify`

---

## Feature 2 — Auth Guard

### Click guard on Landing page (`src/pages/quiz/Landing.tsx`)

- Add `useAuth` from `src/context/AuthContext.tsx`
- When `!user` and the user clicks any action button:
  - Open `LoginModal` (local `isLoginOpen` state, same pattern as `Header.tsx`)
  - Show a small hint above the buttons: *"Connecte-toi pour accéder au quiz"* (only visible when `!user`)
- `LoginModal` is already a standalone component that handles login + register

### Route protection (`src/App.tsx`)

Wrap these three routes with the existing `ProtectedRoute` component, which redirects to `/login` (but we redirect to `/quiz` instead so the Landing handles the modal):

```
/quiz/qualify
/quiz/assessment/:slug
/quiz/export
```

`/quiz` (Landing) stays **public** — it's the entry point where unauthenticated users land and can log in.

The `ProtectedRoute` currently redirects to `/login`. We need either:
- A new `QuizProtectedRoute` variant that redirects to `/quiz` instead of `/login`
- Or modify `ProtectedRoute` to accept a `redirectTo` prop

**Decision:** Add a `redirectTo` prop to `ProtectedRoute` (default `/login`, quiz routes pass `/quiz`).

---

## Data Flow

```
User visits /quiz
  └─ Not authenticated
       └─ Clicks button → LoginModal opens
  └─ Authenticated, no saved session
       └─ "Commencer" → /quiz/qualify (fresh start)
  └─ Authenticated, session in progress
       └─ "Reprendre" → /quiz/assessment/:currentSlug
       └─ "Recommencer" → resetSession() + /quiz/qualify

User visits /quiz/qualify or /quiz/assessment/:slug (direct URL)
  └─ Not authenticated → redirect to /quiz (Landing handles modal)
  └─ Authenticated → normal behavior
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/quiz/Landing.tsx` | Add auth check, resume logic, LoginModal |
| `src/App.tsx` | Wrap quiz sub-routes with `ProtectedRoute` (redirectTo="/quiz") |

## Files NOT modified

- `src/lib/quiz/store.ts` — already persists correctly
- `src/components/LoginModal.tsx` — used as-is
- `src/context/AuthContext.tsx` — used as-is
- `src/lib/quiz/flow/sequence.ts` — `slugAt` already exported
