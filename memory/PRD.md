# BFG (Binary Fund Global) — Frontend Runtime PRD

## Original problem statement
Clone https://github.com/alifnewone7-create/bf-runn.git into /app and run the FRONTEND ONLY.
Backend runs on the user's own VPS at https://api.binaryfundglobal.com. The user deploys
backend changes themselves — the local backend must never be started here.

## Architecture
- Frontend: React (CRA + craco), Tailwind, phosphor-icons, socket.io-client — supervisor `frontend` on :3000
- API base: `REACT_APP_API_BASE=https://api.binaryfundglobal.com` (frontend/.env)
- Backend (repo copy, edited here, deployed by user to VPS): FastAPI + PostgreSQL (SQLAlchemy async)

## User personas
- Trader: buys a funded challenge, trades binaries on demo/basic/standard/premium accounts, tracks challenge rules
- Admin: existing admin portal (untouched)

## Implemented (June 2026)
- Repo cloned into /app, frontend deps installed, running; API pointed to VPS (`/api/health` OK)
- Shared `TerminalShell` chrome (logo, page-title pill, balance/Deposit/avatar, desktop left rail) used by
  Challenges, My Challenges and Profile pages — same structure as the trade terminal, `100dvh` with inner scroll
- Desktop rail: Trade, My Chal, Challenges, Profile, Help, Settings + Logout (no active indicator bar; fill icons)
- Shared `MobileNav` bottom bar (Chart, My Chal, Profile, Challenges, Logout) on trade / challenges / my-challenges / profile
- Challenges page: home-page `lux-card` gradient styling, own icons kept; mobile shows only the heading and a
  per-card "Details" toggle under Purchase
- Premium account badge colour changed to lavender #B266FF everywhere (trade header, shell header, account switcher)
- Per-account trade isolation: `/api/trade/open` & `/api/trade/history` accept `?account=`, orders scoped to that
  account's wallet, `account` field on trade payloads, socket events filtered by account, list wiped on switch
  (backend files edited: routes/trade_routes.py, routes/ws_routes.py — user deploys)
- New page `/my-challenges`: Running / Complete / Failed tabs (default Running), per-challenge card with live
  balance, Profit Target / Maximum Loss / Today Profit / Today Loss meters (floored at 0%) and days remaining.
  Backed by new `GET /api/challenges/mine` in routes/purchase_routes.py (NOT yet live on the VPS)

## Backlog
- P0: user deploys the edited backend files to the VPS and verifies per-account trades + /api/challenges/mine
- P1: challenge pass/fail automation (mark Challenge.status when target hit / limit breached)
- P1: real Deposit flow (currently a "coming soon" toast)
- P2: trade History screen for the removed mobile History slot; timezone-aware "today" window
