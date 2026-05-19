# Core By Millie — Setup Guide

## Accounts to create (do this first)

### 1. Supabase (free tier)
1. Go to supabase.com → New project → name it `core-by-millie`
2. Copy **Project URL** and **Anon key** → paste into `.env.local`
3. Copy **Service role key** → paste into `.env.local`
4. Go to SQL editor → paste the entire contents of `supabase/schema.sql` → Run
5. In Supabase dashboard → Authentication → URL Configuration → add your domain to allowed redirects

### 2. Stripe (free to start)
1. Create account at stripe.com
2. Dashboard → Developers → API keys → copy **Publishable** and **Secret** keys → `.env.local`
3. Create 4 products:
   - **Instructor Monthly** — $49 AUD/month → copy Price ID → `STRIPE_PRICE_INSTRUCTOR_MONTHLY`
   - **Studio Small** — $149 AUD/month → `STRIPE_PRICE_STUDIO_SMALL_MONTHLY`
   - **Studio Medium** — $299 AUD/month → `STRIPE_PRICE_STUDIO_MEDIUM_MONTHLY`
   - **Home Consumer** — $29 AUD/month → `STRIPE_PRICE_CONSUMER_MONTHLY`
4. Webhooks → Add endpoint → URL: `https://yourdomain.com/api/stripe/webhook`
   Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 3. Vimeo (Standard plan ~$50 AUD/month)
- Upload videos → set privacy to **"Hide from Vimeo / domain-only"**
- Copy the numeric video ID from the URL (e.g. `vimeo.com/123456789` → ID is `123456789`)
- Paste that ID when uploading content via the admin panel

### 4. Domain + Vercel (hosting)
1. Buy domain (e.g. `corébymillie.com.au` via Namecheap/Crazy Domains)
2. Deploy to Vercel: `npm i -g vercel && vercel` in the project folder
3. Add your environment variables in Vercel dashboard → Settings → Environment Variables

---

## Running locally

```bash
cd core-by-millie
npm run dev
```

Open http://localhost:3000

---

## Making Millie an admin

1. Millie signs up via `/auth/signup`
2. In Supabase dashboard → Table editor → `profiles` → find Millie's row → set `is_admin = true`
3. She can now access `/admin/upload` to add content

---

## File structure

```
src/
  app/
    page.tsx              ← Homepage
    about/                ← About page
    membership/           ← Pricing page
    contact/              ← Contact form
    auth/
      login/              ← Sign in
      signup/             ← Create account
    portal/
      instructor/         ← Instructor library (requires active subscription)
      client/             ← Home workout portal (consumer tier)
    admin/
      upload/             ← Content upload (admin only)
    api/
      stripe/
        checkout/         ← Redirects to Stripe checkout
        webhook/          ← Stripe webhook handler
    actions/
      auth.ts             ← Server actions: signIn, signUp, signOut
      content.ts          ← Server action: uploadContent
  lib/
    supabase/
      client.ts           ← Browser Supabase client
      server.ts           ← Server Supabase client
    stripe.ts             ← Stripe client + plan config
    dal.ts                ← Data access layer (auth checks)
    utils.ts              ← Helpers (cn, formatPrice)
proxy.ts                  ← Auth proxy (replaces middleware in Next.js 16)
supabase/schema.sql       ← Full database schema
```

---

## Phase 2 features (next)

- [ ] Email verification flow (`/auth/verify-email`)
- [ ] Saved favourites page (`/portal/instructor/favourites`)
- [ ] Progress tracking for consumer portal
- [ ] Subscription management page (cancel/upgrade via Stripe Customer Portal)
- [ ] Studio multi-seat invite flow
- [ ] Contact form email delivery (Resend or Postmark)
- [ ] SEO: sitemap.xml, robots.txt, og images
