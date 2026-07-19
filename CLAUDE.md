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
### Done
- Full Payload schema: Users, Media, AssetFiles, Assets, Engines, Categories, Genres, Orders,
  Projects, Bids, Posts, BlogCategories, Jobs, JobApplications, AwardEntries, Competitions,
  FaqItems, Messages, Reviews, Wishlists — plus the SiteSettings global (visibility switches,
  branding, homepage content incl. hero/category tiles/editor's picks/feature bands/blog row,
  sell page, footer, SEO, legal, commerce).
- Marketplace: /marketplace (search + engine/category/genre/price/verified/free filters),
  /marketplace/[slug] listing page, dense asset cards (ribbon, rating, deal pricing, verified
  badge, wishlist heart, compare), /compare side-by-side specs.
- Designer flow: signup, /sell, upload wizard, dashboard (assets/orders/projects/jobs/payouts).
- R2 storage wired (falls back to local disk until R2 env vars are set — see below).
- Stripe Connect: checkout (standard + exclusive buyout), multi-item cart (separate
  charges/transfers for multi-designer carts), invoice-request flow, webhooks, printable
  invoices/receipts.
- Services hub: post project, private bids (+public count), accept/decline.
- Messaging: scoped to a paid order or accepted bid only, contact-info sharing auto-blocked.
- Reviews: buyer-submitted (order-verified, admin-approved) + admin-authored seed/editorial
  reviews, average rating + list on listing and designer profile pages.
- Wishlists: per-user saved assets, live count synced onto each Asset.
- Designer public profiles, marketplace text search, forgot/reset password (needs an email
  adapter — see below), account settings, ToS acceptance at signup, sitemap.xml/robots.txt.
- Blog, Jobs (open posting + admin verification), Awards, Competitions, FAQ pages.
- Homepage: animated split hero (HUD mockup, floating gradient blobs/wave), engine strip,
  how-it-works, category tiles, featured/free tabs, editor's picks row, alternating feature
  bands (on a dark ink section), verified explainer, competitions teaser, stats (count-up),
  blog row, testimonials, dual buy/sell CTA — every section is CMS-editable and reorderable
  via one drag-to-reorder field in SiteSettings.
- List-page spacing/layout polish (marketplace/blog/jobs/services/awards/competitions).
- Deployed to Netlify (broadexa.netlify.app), gated behind all-OFF SiteSettings visibility
  switches. Migrations self-apply on first successful production DB connect (`prodMigrations`).
- Usernames (unique handles) on every account — used for profile URLs and project invites,
  since studio/display names can collide. Full designer "CV" profile at /designer/[username]
  (photo, profession, experience, skills, portfolio link, live-computed stats: assets published/
  sold, projects delivered, rating) with an "Invite to a project" flow. Lighter /buyer/[username]
  profile (no purchase history/spend shown — privacy). Project owners can invite a specific
  designer to bid by username from their project page, and messaging now opens as soon as a bid
  is submitted (not just after acceptance) so price/timeline can be negotiated beforehand.
- Google + LinkedIn sign-in wired end-to-end (OAuth code flow, bridges into Payload's own
  session/JWT mechanism) — inactive until credentials are set, see gap below.
- Homepage/UI polish pass: hover states + focus rings everywhere, looping hero background
  animation, bigger/numbered "How it works" cards, infinite dark engine-name marquee, unified
  gradient buttons (no stray black CTAs), dashboard nav reworked (profile dropdown top-right
  with account settings/sign out, Home link added), /sell buttons route signed-in designers
  straight to the upload page instead of back to signup.

### Known gaps
1. **Cloudflare R2 not configured** — `.env` has the R2 vars commented out, so Media/AssetFiles
   uploads fall back to local disk (won't persist on Netlify's serverless filesystem). Sample
   catalog content was seeded without gallery photos for this reason — cards show a styled
   gradient + icon placeholder until real images are uploaded. Set the four `R2_*` vars to fix.
2. **No email adapter (Resend) configured** — forgot/reset-password tokens currently only log
   to the server console instead of emailing the user. Wire up Resend to make that flow work.
3. **Sample content needs seeding once, per environment** — visit `/api/admin/seed-sample-content`
   while signed in as admin (safe to reload; skips anything that already exists). This sandbox
   can't reach the production DB directly, so it couldn't be run automatically — do this once
   after the next deploy.
4. Stripe Connect and R2 are both still using placeholder/commented env vars in `.env.example` —
   confirm real keys are set in Netlify's environment before flipping any SiteSettings visibility
   switch on for real users.
5. **Google/LinkedIn sign-in needs real OAuth credentials** — not something that can be created
   from here. In Google Cloud Console, create an OAuth client ID (type: Web application) and add
   redirect URI `{your domain}/api/auth/google/callback`; set `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`.
   For LinkedIn, add the "Sign In with LinkedIn using OpenID Connect" product in the LinkedIn
   Developer Portal, redirect URI `{your domain}/api/auth/linkedin/callback`, then set
   `LINKEDIN_CLIENT_ID`/`LINKEDIN_CLIENT_SECRET`. Buttons stay hidden on login/signup until each
   pair is set — untested end-to-end since this sandbox can't complete a live OAuth round trip;
   flag it if signing in doesn't work after setting the credentials.

## Design reference
- UI mock: broadexa-ui-v2.html (3 screens: home, marketplace, listing) — match it.
- Logo: user supplies final file (gradient B with play + waves). Placeholder = BROADEXA wordmark.

## Founder context (IMPORTANT)
- Zero coding experience. Payload admin = his control panel. Keep admin UX simple, label fields clearly.
- Everything stays private until a co-founder joins as public face. No public deploys without asking.
