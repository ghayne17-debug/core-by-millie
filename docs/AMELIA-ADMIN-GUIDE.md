# Core By Millie — Admin & Content Guide
**For:** Amelia (Content Creator / Admin)  
**Last updated:** May 2026

---

## Getting Started

### Your admin account
Your account has been set up with full admin access. To sign in:

1. Go to **https://core-by-millie.vercel.app/auth/login**
2. Enter your email and password
3. Once logged in you'll see a **"+ Upload Content"** button in the top navigation bar — this only appears for admin accounts

---

## Before You Upload Videos — Bunny Stream Setup

All videos are hosted on **Bunny Stream** (bunny.net). You'll need to set this up once before uploading your first video.

### Create your Bunny Stream account
1. Go to **bunny.net** → sign up for an account
2. Once logged in, click **Stream** in the left sidebar
3. Click **Add Video Library** → name it "Core By Millie"
4. In the library settings → **Security** tab → add `core-by-millie.vercel.app` as an allowed domain
   - This means your videos can only be watched on the Core By Millie website — members cannot share links externally
5. Note down your **Library ID** — it's the number shown at the top of the library settings page (e.g. `123456`)

You'll need this Library ID every time you upload a video.

---

## Uploading a Video

### Step 1 — Upload to Bunny Stream
1. Log into bunny.net → **Stream** → your library
2. Click **Upload Video** → select your MP4 file
3. Wait for it to finish processing (you'll see a green tick when ready)
4. Click into the video → copy the **Video ID** (looks like `a1b2c3d4-5678-efgh-...`)

### Step 2 — Add to the website
1. Go to **https://core-by-millie.vercel.app/admin/upload**  
   (or click **"+ Upload Content"** in the navbar)
2. Fill in the form:

| Field | What to enter |
|---|---|
| **Title** | e.g. "30 Min Reformer Flow — Intermediate" |
| **Description** | Brief summary of what the class covers |
| **Modality** | Reformer / Mat / Barre / Sculpt / Strength / Mobility / Wellness |
| **Level** | Beginner / Intermediate / Advanced / All Levels |
| **Duration** | Length in minutes |
| **Bunny Library ID** | The number from your Bunny Stream library settings |
| **Bunny Video ID** | The ID copied from the video in Bunny Stream |
| **PDF URL** | Link to the class plan PDF (see PDF section below) |
| **Tags** | Comma-separated keywords e.g. `short spine, teaser, obliques` |
| **Access Tiers** | Which members can see this (see below) |
| **Publish immediately** | Tick this to make it live straight away |

3. Click **Upload Content**

---

## Access Tiers — Who Sees What

When uploading content, choose which membership plans can access it:

| Tier | Who it's for | Price |
|---|---|---|
| **Instructor** | Individual Pilates instructors | $49/month |
| **Studio Small** | Studios with up to 5 instructors | $149/month |
| **Studio Medium** | Studios with up to 15 instructors | $299/month |
| **Home Consumer** | Everyday clients doing home workouts | $29/month |

**Tips:**
- Instructor content (Reformer programs, cueing guides, class structures) → tick **Instructor, Studio Small, Studio Medium**
- Home workout content (mat flows, minimal equipment) → tick **Home Consumer**
- Some content can be available to all tiers — tick all four boxes

---

## Uploading PDFs (Class Plan Downloads)

PDFs are stored in Supabase Storage. Ask Greg to upload PDFs for you, or follow these steps:

1. Log into **supabase.com** → open the CoreByMillie project (Greg will give you access)
2. Go to **Storage** → **pdfs** bucket
3. Click **Upload file** → select your PDF
4. Once uploaded, click the file → click **Get URL** → copy the URL
5. Paste that URL into the **PDF URL** field in the upload form

---

## Content Organisation Tips

### Naming convention
Use a consistent format so members can easily search and filter:

```
[Duration] [Modality] [Focus] — [Level]
```

Examples:
- `30 Min Reformer Flow — Intermediate`
- `45 Min Mat Pilates Full Body — Beginner`
- `20 Min Barre Burn — All Levels`
- `15 Min Mobility & Stretch — All Levels`

### Tags to use consistently
Good tags make the search and filter work well for members:

- **Equipment:** `reformer`, `mat only`, `no equipment`, `light weights`, `resistance band`
- **Focus area:** `core`, `glutes`, `upper body`, `full body`, `obliques`, `back`
- **Style:** `flow`, `strength`, `stretch`, `cardio`, `low impact`
- **Special:** `postpartum safe`, `injury modification`, `quick class`, `music driven`

---

## Managing Published Content

### Editing content
Currently content can be managed directly in Supabase:
1. Supabase → **Table Editor** → `content` table
2. Find the row → click to edit
3. Make changes → save

### Unpublishing content
In the `content` table → find the row → set `is_published` to `false`

### Weekly release schedule
Based on your business plan, the recommended workflow is:

| Day | Task |
|---|---|
| Monday–Wednesday | Film and edit new content |
| Thursday | Upload videos to Bunny Stream |
| Friday | Add content to website via upload form (unpublished) |
| Sunday | Set `is_published = true` for the week's content |

---

## What Members See

### Instructor members (`/portal/instructor`)
- Full programming library
- Filter by modality, level, duration
- Watch videos embedded on the page
- Download PDF class plans
- Save favourites

### Home consumer members (`/portal/client`)
- Home workout library
- Weekly mat Pilates, barre, sculpt content
- Watch videos on the page

---

## Signing Members Up Manually

If you need to give someone access outside of the normal payment flow (e.g. a beta tester or free trial):

1. Ask them to sign up at `/auth/signup`
2. Greg logs into Supabase → `profiles` table → finds their row
3. Sets `membership_tier` to the correct plan and `subscription_status` to `active`

---

## Getting Help

For any technical issues with the website, contact **Greg**.

For Bunny Stream issues: **docs.bunny.net**  
For login issues: Try signing out and back in, or use the password reset link on the login page.
