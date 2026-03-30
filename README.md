# Next.js + Supabase + Creem Starter

<!-- TODO: Banner image -->

[![CI](https://github.com/ubergonmx/nextjs-supabase-creem-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/ubergonmx/nextjs-supabase-creem-starter/actions/workflows/ci.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ubergonmx/nextjs-supabase-creem-starter)
![Status](https://img.shields.io/badge/status-work--in--progress-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

The most comprehensive, production-ready Next.js starter with Supabase auth and Creem payments pre-integrated.
Clone, configure, and start selling — no boilerplate to write.

## Live Demo

> 🔗 **[nextjs-supabase-creem-starter.vercel.app](https://nextjs-supabase-creem-starter.vercel.app)** <!-- TODO: update URL -->

- Use Creem's test card: `4242 4242 4242 4242` (any future expiry, any CVC)
- Try with discount code: `CREEMSTARTER2026`

## Quick Start

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ubergonmx/nextjs-supabase-creem-starter)

### Run locally

```bash
git clone https://github.com/ubergonmx/nextjs-supabase-creem-starter.git
cd nextjs-supabase-creem-starter
npm install
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY at minimum
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Table of Contents

- [About](#about)
  - [Tech Stack](#tech-stack)
  - [Features](#features)
  - [Webhook Integrations](#webhook-integrations)
  - [Architecture](#architecture)
  - [Database Schema](#database-schema)
  - [Testing](#testing)
- [Setup](#setup)
  - [1. Set up Supabase](#1-set-up-supabase)
  - [2. Set up Creem](#2-set-up-creem)
  - [3. Configure environment variables](#3-configure-environment-variables)
  - [4. Set up the database](#4-set-up-the-database)
  - [5. Configure OAuth (optional)](#5-configure-oauth-optional)
  - [6. Verify everything](#6-verify-everything)
- [Extras](#extras)
  - [AI Skills](#ai-skills)
  - [Always Check](#always-check)
- [License](#license)

---

## About

### Tech Stack

- **Framework** — [Next.js](https://nextjs.org) (App Router, Server Components)
- **Auth & Database** — [Supabase](https://supabase.com)
- **Payments** — [Creem](https://creem.io)
- **Styling** — [Tailwind CSS](https://tailwindcss.com)
- **UI Components** — [shadcn/ui](https://ui.shadcn.com)
- **Language** — TypeScript (strict mode)

### Features

> Coming soon

### Webhook Integrations

> Coming soon

### Architecture

> Coming soon

### Database Schema

> Coming soon

### Testing

> Coming soon

---

## Setup

### 1. Set up the project
```bash
git clone https://github.com/ubergonmx/creemkit.git
```

```bash
cp .env.example .env.local
```

### 2. Set up Supabase

1. Create a new [Supabase project](https://database.new)
  BqKXZJN3QsvUUdpb
2. Set these values in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`: Copy this in **Project Overview** (should look like `https://urcryetpnmgoatkitnumxb.supabase.co`)
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`:  Copy this in **Project Overview** (open dropdown) or go to **Project Settings** (bottom of left sidebar) > **API Keys** > copy the key under **Publishable key** (starts with `sb_publishable_...`). If you're using legacy, copy `anon public` key (starts with `eyJ...`) in "Legacy anon, service_role API keys" tab.
  - `SUPABASE_SERVICE_ROLE_KEY`: Same page, copy the key under **Secret keys** (starts with `sb_secret_***`). If you're using legacy, copy `service_role` secret key.
3. Run the SQL migrations
  - Go to **SQL Editor** in the left sidebar (terminal icon)
  - Copy-paste and run each file in `supabase/migrations/` in order:
    - `001_profiles.sql`
    - `002_subscriptions.sql`
    - `003_credits.sql`
    - `004_webhook_events.sql`
  - If you prefer using the Supabase CLI, run `supabase db push` 
4. Setting up auth providers and redirect URL:
  - Go to **Authentication** (left sidebar, lock icon) > under **CONFIGURATION** , click **Sign In / Providers**
  - Under **Auth Providers**, enable sign in of the following:
    - **Google**: 
      - Enabling should show a right sidebar, copy **Callback URL (for OAuth)** (should look like `https://urcryetpnmgoatkitnumxb.supabase.co/auth/v1/callback`)
      - Create an OAuth app in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (setup Consent screen if you haven't already). During creation, under **Authorized redirect URIs**, click "+ Add URI" and paste the callback URL.
      - Click "Create", download JSON for backup and copy the client ID and secret into the Supabase sidebar, then save.
    - **GitHub**: 
      - Create an OAuth app in [GitHub Developer Settings](https://github.com/settings/developers) 
      - Copy-paste redirect URL from the Supabase sidebar (should look like `https://urcryetpnmgoatkitnumxb.supabase.co/auth/v1/callback`) into the GitHub app's **Authorization callback URL** field, then save.
      - After saving, copy the client ID and secret into the Supabase sidebar, then save.
  - On the same page, under **CONFIGURATION**, go to **URL Configuration**
  - Under **Redirect URLs**, click **Add URL**
  - Add: `http://localhost:3000/auth/callback`
  - (For production URL, see step 5 below)

### 3. Set up Creem

1. Create an account at [creem.io](https://www.creem.io) or, if you don't have an existing store, [create a new one](https://www.creem.io/dashboard/create)
2. Enable **Test Mode** in the bottom-left of the sidebar
3. Go to **Developers > API & Webhooks** in the left sidebar
4. On the **API Keys** tab, click **+ Create API Key**, name it anything (e.g. `creemkit`), toggle **Full Access** on, click **Create Key**, and copy the key
5. Create three subscription products — go to **Commerce > Products** in the left sidebar, click **Create Product**. For each product:
   - **Section 1 (Product Details)**: Enter the product name and description
   - **Section 2 (Payment Details)**: Click the **Subscription** tab, set Currency to **USD**, enter the price, set Subscription interval to **Monthly**, Tax category to **Software as a Service**
   - **Sections 3–6**: Skip (image, features, advanced options, and abandoned cart are all optional)
   - Click **Create Product**

   Create all three:

   | **Product name** | **Price** |
   | ---------------- | --------- |
   | Pro              |    19     |
   | Business         |    29     |

6. After creating each product, copy its `prod_` ID (shown on the product detail page) into your `.env.local`


### 4. Run locally

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000). 
Everything should work except for checkouts, which require webhooks to be set up. You can skip to #5 if you want to deploy to production.

#### Optional: Ngrok for local development with webhooks
1. Run `npx ngrok http 3000` to create a secure tunnel to your localhost
2. Copy the generated forwarding URL (should look like `https://abc123.ngrok-free.dev`) and do the following:
  - In `.env.local`, paste the URL to `NEXT_PUBLIC_APP_URL` 
  - In `nextjs.config.ts`, add the URL to the `allowedOrigins` array
  - In Supabase, go to **Authentication > URL Configuration**, set the URL in **Site URL** and add it to **Redirect URLs** 
  - In Creem, go to **Developers > API & Webhooks**, click the **Webhooks** tab, click **+ Create Webhook**, enter `<URL>/api/webhooks/creem` (e.g. `https://abc123.ngrok-free.dev/api/webhooks/creem`), select "All events", and create. Copy the generated secret and add it to `CREEM_WEBHOOK_SECRET` in your `.env.local`.
3. Instead of `http://localhost:3000`, use the ngrok URL (e.g. `https://abc123.ngrok-free.dev`) to test your app with webhooks locally.

### 5. Deploy to Vercel

1. Make sure your project is pushed to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and log in or register
3. Click **Add New...** > **Project**
4. Under **Import Git Repository**, select your repo and click **Import**
5. On the **New Project** setup page:
   - **Framework Preset** should automatically detect **Next.js** — no need to change it
   - **Root Directory** can stay as `./`
   - Expand the **Environment Variables** section
   - Enter each key-value pair from your `.env.local` file (key on the left, value on the right). You can skip `CREEM_WEBHOOK_SECRET` for now — this will be configured after the initial deployment
6. Click **Deploy** and wait for the build to complete
7. Once done, copy your production URL from the Vercel dashboard (e.g. `https://your-app.vercel.app`)

### 6. Verify everything

Before deploying, make sure everything passes:

```bash
npm run lint         # lint
npm run typecheck    # type-check
npm test             # run tests
npm run build        # production build
```

If all three pass, you're ready to deploy. 🚀

---

## Extras

### AI Skills

Skills that help you (and AI) build faster when adding features:

#### Supabase Best Practices (Query, RLS policies, etc.)

```bash
npx skills add https://github.com/sickn33/antigravity-awesome-skills --skill supabase-postgres-best-practices
```

#### Next.js + Supabase Best Practices

```bash
npx skills add https://github.com/sickn33/antigravity-awesome-skills --skill nextjs-supabase-auth
```

#### UI

Since this starter uses shadcn/ui, check out the [shadcn registry directory](https://ui.shadcn.com/docs/directory) for more UI components and blocks.

```bash
npx skills add raphaelsalaja/userinterface-wiki
npx skills add jakubkrehel/make-interfaces-feel-better
```

### Always Check

- **[vercel-doctor.com](https://vercel-doctor.com)** — if deploying to Vercel
- **[suparalph.vibeship.co](https://suparalph.vibeship.co/)** — scan for Supabase vulnerabilities

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
