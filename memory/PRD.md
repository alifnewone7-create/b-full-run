# BFG (Binary Fund Global) — Frontend Runtime PRD

## Original problem statement
Clone https://github.com/alifnewone7-create/bf-runn.git into /app and run the FRONTEND ONLY.
Backend runs on the user's own VPS at https://api.binaryfundglobal.com. The user deploys
backend changes themselves — the local backend must never be started here.
User language: Bengali/Banglish (respond in Banglish/Bengali).

## Architecture
- Frontend: React (CRA + craco), Tailwind, phosphor-icons, socket.io-client — supervisor `frontend` on :3000
- API base: `REACT_APP_API_BASE=https://api.binaryfundglobal.com` (frontend/.env)
- Backend (repo copy, edited here, deployed by user to VPS): FastAPI + PostgreSQL (SQLAlchemy async)

## User personas
- Trader: buys a funded challenge, trades binaries on demo/basic/standard/premium accounts, tracks challenge rules
- Admin: existing admin portal (untouched)

## Implemented (June 2026)
- Repo cloned into /app, frontend deps installed, running; API pointed to VPS (`/api/health` OK)
- Shared `TerminalShell` chrome used by Challenges, My Challenges and Profile pages
- Desktop rail: Trade, My Chal, Challenges, Profile, Help, Settings + Logout
- Shared `MobileNav` bottom bar (Chart, My Chal, Profile, Challenges, Logout)
- Challenges page: home-page `lux-card` gradient styling; mobile "Details" toggle
- Premium account badge colour changed to lavender #B266FF everywhere
- Per-account trade isolation via `?account=` (backend files edited: routes/trade_routes.py, ws_routes.py — user deploys)
- Page `/my-challenges`: Running / Complete / Failed tabs, per-challenge live balance, Profit Target /
  Maximum Loss / Daily Profit / Daily Loss meters, days remaining. Backed by `GET /api/challenges/mine`.
- **[Aug 25 2026] /my-challenges UI redesign** — fixed overlap bug (challenge title vs status pill colliding).
  New ChallengeBlock: full-width header with plan icon + truncating title (min-w-0 + truncate) on the left and
  a shrink-0 status pill anchored top-right; plan-accent top line on desktop cards; more visible progress bars
  (h-2 track + glow on fill) plus a time-remaining progress bar. Verified overlap-free on desktop 1920 AND
  mobile 390 (testing_agent iteration_4.json — frontend 100%).

## Backlog
- P0: user deploys the edited backend files to the VPS and verifies per-account trades + /api/challenges/mine
- P1: challenge pass/fail automation (mark Challenge.status when target hit / limit breached)
- P1: real Deposit flow (currently a "coming soon" toast) — Binance Pay top-up
- P1: Payout certificate — shareable card when a challenge is completed
- P2: trade History screen for the removed mobile History slot; timezone-aware "today" window

## Notes for next agent
- Screenshot tool forces desktop width (1920). Use testing_agent for mobile (390px) verification.
- Trader test login: alifdesktop@gmail.com / 12345678 (see /app/memory/test_credentials.md).
- Do not start the local backend; it lives on the user's VPS.
