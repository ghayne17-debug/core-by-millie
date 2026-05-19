# Core By Millie — Technical Guide
**For:** Greg (Site Owner / Developer)  
**Last updated:** May 2026

---

## Overview

Core By Millie is a subscription-based Pilates programming platform. This document covers all the services, accounts, and processes needed to keep it running.

---

## Services & Accounts

### 1. Supabase — Database & Authentication
**What it does:** Stores all data (users, content, subscriptions) and handles login/signup.  
**Account:** supabase.com — logged in via GitHub  
**Project name:** CoreByMillie  
**Project ID:** gwkabmlozjmqcionhwdu  
**Plan:** Free tier (upgrades to $25 USD/month when live traffic is consistent)  
**Important:** Free projects pause after 1 week of inactivity. Log in to supabase.com and click "Restore" to wake it up. No data is lost.

**Dashboard URL:** https://supabase.com/dashboard/project/gwkabmlozjmqcionhwdu

---

### 2. Stripe — Payments
**What it does:** Processes all subscription payments and manages billing.  
**Account:** stripe.com  
**Mode:** Currently in Sandbox (test mode). Switch to Live when ready to accept real payments.  
**Plans configured:**
| Plan | Price | Stripe Price ID |
|---|---|---|
| Instructor Monthly | $49 AUD/month | See .env.local |
| Studio Small | $149 AUD/month | See .env.local |
| Studio Medium | $299 AUD/month | See .env.local |
| Home Consumer | $29 AUD/month | See .env.local |

**To go live:** In Stripe dashboard, switch from Test to Live mode, create the same 4 products again, copy the new live Price IDs, and update the environment variables in Vercel.

#### Stripe Webhook (configured 2026-05-19)

The webhook tells your site when a payment succeeds so the member gets access. Without it, members could pay but never reach the portal.

**Current webhook endpoint (test mode):**  
`https://core-by-millie.vercel.app/api/stripe/webhook`

**Events it listens for:**
- `checkout.session.completed` — grants access after successful payment
- `customer.subscription.updated` — handles plan changes / renewals
- `customer.subscription.deleted` — removes access on cancellation

**What happens when someone pays:**
1. Stripe fires `checkout.session.completed` to the webhook URL
2. Your site sets `subscription_status = active` and `membership_tier = <plan>` in the `profiles` table
3. The portal checks those fields and lets the member in

**To re-configure for a new domain (when going live):**
1. Stripe dashboard → Developers → Webhooks → Add destination
2. New endpoint URL: `https://yournewdomain.com/api/stripe/webhook`
3. Select the same 3 events above
4. Copy the new `whsec_...` signing secret
5. Update `STRIPE_WEBHOOK_SECRET` in Vercel Environment Variables → Redeploy

**Manual fix if webhook fails (rare):**  
If a member paid but has no access, go to Supabase → Table Editor → `profiles`, find their row, and manually set `membership_tier` and `subscription_status = active`.

---

### 3. Vercel — Website Hosting
**What it does:** Hosts and serves the website.  
**Account:** vercel.com — logged in via GitHub  
**Live URL:** https://core-by-millie.vercel.app  
**Plan:** Free (Hobby tier — sufficient for launch)  
**Auto-deploys:** Every time you push code to GitHub, Vercel automatically rebuilds and redeploys the site. No manual action needed.

---

### 4. GitHub — Code Repository
**What it does:** Stores the website code and triggers Vercel deployments.  
**Account:** github.com — ghayne17-debug  
**Repository:** https://github.com/ghayne17-debug/core-by-millie  
**Branch:** main

---

### 5. Bunny Stream — Video Hosting
**What it does:** Hosts and streams Amelia's video content securely.  
**Account:** bunny.net — Amelia's account  
**Plan:** Pay per use (~$1–3 AUD/month to start)  
**Security:** Videos are domain-locked — they only play on the Core By Millie website, not shareable externally.

---

### 6. Supabase Storage — PDF Hosting
**What it does:** Stores downloadable PDF class plans.  
**Where:** Inside the existing Supabase project → Storage → pdfs bucket  
**Access:** Private — only authenticated members with active subscriptions can download files.

---

## Environment Variables

All secret keys are stored in two places:
- **Locally:** `C:\Users\gregh\core-by-millie\.env.local` (never commit this to GitHub)
- **Live site:** Vercel dashboard → Project → Settings → Environment Variables

If you ever need to update a key (e.g. switching Stripe to live mode):
1. Update it in Vercel Environment Variables
2. Go to Vercel → Deployments → Redeploy (to pick up the change)
3. Also update your local `.env.local` file

---

## How to Update the Website

### Making code changes
```powershell
cd C:\Users\gregh\core-by-millie
# Make your changes in VS Code
git add .
git commit -m "Description of what you changed"
git push
```
Vercel will automatically detect the push and redeploy within ~2 minutes.

### Running locally for testing
```powershell
cd C:\Users\gregh\core-by-millie
npm run dev
```
Open http://localhost:3020

### Checking for errors
- **Vercel dashboard** → your project → **Deployments** — shows build logs and errors
- **Supabase dashboard** → **Logs** — shows database errors

---

## Database Structure

All data lives in Supabase PostgreSQL. Key tables:

| Table | What it stores |
|---|---|
| `profiles` | All user accounts, membership tier, subscription status |
| `content` | All videos, PDFs, programs uploaded by Amelia |
| `favourites` | Content saved by members |
| `progress` | Workouts completed by consumer members |
| `studio_seats` | Multi-instructor access for studio plans |

### Viewing/editing data
Supabase dashboard → **Table Editor** → select a table

---

## Managing Members

### Making someone an admin
1. Supabase → Table Editor → `profiles`
2. Find their row → set `is_admin = true` → save

### Checking a member's subscription
1. Supabase → Table Editor → `profiles`
2. Find their row — check `membership_tier` and `subscription_status`

### Manually fixing a subscription issue
If a member paid but didn't get access (rare Stripe webhook failure):
1. Find them in `profiles`
2. Set `membership_tier` to the correct plan (e.g. `instructor_monthly`)
3. Set `subscription_status` to `active`

---

## Going Live Checklist

When ready to accept real payments and launch publicly:

- [ ] Buy domain (e.g. corébymillie.com.au) via Crazy Domains or Namecheap
- [ ] Add custom domain in Vercel → Project → Settings → Domains
- [ ] Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables to the real domain
- [ ] Switch Stripe from Sandbox to Live mode
- [ ] Create live Stripe products (same 4 plans) and update Price IDs in Vercel
- [ ] Set up Stripe webhook for the live domain → get new `STRIPE_WEBHOOK_SECRET` → update in Vercel
- [ ] Turn on email confirmation in Supabase → Authentication → Email confirmation
- [ ] Set up a proper email sender in Supabase (Resend.com — free tier available)
- [ ] Update Supabase allowed redirect URLs to include real domain
- [ ] Add real domain to Bunny Stream allowed referrers
- [ ] Redeploy Vercel after all environment variable changes

---

## Monthly Costs (at launch)

| Service | Cost |
|---|---|
| Vercel | Free |
| Supabase | Free (upgrade to $25 USD/month when active) |
| Stripe | 1.75% + 30¢ per transaction (no monthly fee) |
| Bunny Stream | ~$1–5 AUD/month depending on video views |
| Domain | ~$20–30 AUD/year |
| **Total** | **~$5–10 AUD/month + Stripe fees** |

---

## Support & Help

- **Next.js docs:** https://nextjs.org/docs
- **Supabase docs:** https://supabase.com/docs
- **Stripe docs:** https://stripe.com/docs
- **Vercel docs:** https://vercel.com/docs
- **Bunny Stream docs:** https://docs.bunny.net/docs/stream-getting-started
