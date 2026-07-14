# Broadexa

The home of broadcast design — B2B marketplace for real-time broadcast assets.

## Quick start (for the developer / Claude Code)
1. `npm install`
2. Copy `.env.example` → `.env`, fill `DATABASE_URI` (Supabase transaction pooler) and `PAYLOAD_SECRET`
3. `npx payload generate:importmap`
4. `npm run dev` → http://localhost:3000 (site) and http://localhost:3000/admin (your control panel)
5. First visit to /admin creates the first user — make yourself Admin.

## For Ahsen (non-technical owner)
Your control panel lives at `/admin`. From there you manage: assets, designers & badges,
orders, projects & bids, blog posts, jobs, award entries — and under **Site Settings**,
the switches that show/hide every public section of the site. Everything ships hidden.

See CLAUDE.md for the full build plan and locked decisions.
