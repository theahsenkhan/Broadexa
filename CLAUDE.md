# BROADEXA — Project Brief & Session Handoff

**What this is:** B2B marketplace for broadcast-ready real-time assets (virtual sets, AR graphics,
show packages) for Viz Engine, Unreal, Zero Density, Pixotope, Aximmetry, Brainstorm, Chyron, Ross, Reality.
Slogan: "The home of broadcast design." Built SILENTLY (founder has employment conflict — nothing public).

## Locked decisions (do not re-litigate)
- Brand: Broadexa. Blue-violet gradient (#A24CC8 → #7E6BDB → #38B6FF) on white. Ink #14141A.
  Fonts: Montserrat (display), Inter (body), JetBrains Mono (labels/timecode).
- Commission: 20% assets, 20% custom projects. Designer keeps 80%. Designer sets own prices.
- Badge: "Verified" = seller supplied on-engine recording, admin checked it. NOT "we tested it".
- Listings without recording: publish allowed, but NO Verified badge. Admin reviews EVERY listing.
- Bids: private; bid COUNT public. Projects: account required to post.
- Buyers browse & see prices without account. Payouts monthly. Refunds case-by-case (written policy).
- Free assets section: yes. Founder seeds catalog under a studio name.
- Launch: build everything; page visibility controlled via SiteSettings global (all OFF by default).
- Stack: Next.js 15 + Payload 3 (admin/CMS) + Supabase Postgres + Cloudflare R2 (files, zero egress)
  + Cloudflare Stream (previews) + Stripe Connect (+ Invoicing) + Resend + Netlify.

## Status
### Done (Session 1)
- Project scaffold: package.json, next.config.mjs, tsconfig, .env.example
- Full schema as Payload collections: Users (roles+badges), Media, Assets (full listing
  requirements + verified/status workflow), Engines, Categories, Orders, Projects, Bids,
  Posts (blog), Jobs, AwardEntries
- SiteSettings global: page-visibility switches + commission settings
- Frontend: brand CSS, layout, homepage (reads SiteSettings + published assets)
- Payload admin routes wired ((payload) route group)

### NOT done yet — build order
1. `npm install` + first run + fix any Payload v3 API drift (importMap regenerates via
   `npx payload generate:importmap`). Create Supabase project "Broadexa", set DATABASE_URI.
2. Seed script: engines + categories from locked lists.
3. Marketplace pages: /marketplace (filters: engine, genre, price, verified), /marketplace/[slug]
   (listing page per locked UI: preview video, specs table, includes chips, buy box w/ 3 paths).
4. Designer flow: signup, /sell page (copy locked in chat), upload wizard, dashboard.
5. R2 direct uploads (multipart, resumable — Uppy/tus) + signed expiring download URLs.
6. Stripe Connect: checkout, exclusive buyout flow (escrow), invoice-request flow, webhooks.
7. Services hub: post project, private bids (+public count), milestones.
8. Blog, Jobs, Awards entry pages. FAQ page (copy locked in chat).
9. QA → deploy to Netlify (site stays behind visibility switches).

## Design reference
- UI mock: broadexa-ui-v2.html (3 screens: home, marketplace, listing) — match it.
- Logo: user supplies final file (gradient B with play + waves). Placeholder = BROADEXA wordmark.

## Founder context (IMPORTANT)
- Zero coding experience. Payload admin = his control panel. Keep admin UX simple, label fields clearly.
- Everything stays private until a co-founder joins as public face. No public deploys without asking.
