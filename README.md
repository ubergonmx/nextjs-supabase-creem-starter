<!-- Banner slot (add your image when ready) -->
<!--
![CreemKit Banner](./public/landing/banner.png)
-->

# CreemKit - Next.js + Supabase + Creem Starter

[![CI](https://github.com/ubergonmx/creemkit/actions/workflows/ci.yml/badge.svg)](https://github.com/ubergonmx/creemkit/actions/workflows/ci.yml)
![Status](https://img.shields.io/badge/status-work--in--progress-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

The most comprehensive, production-ready Next.js starter with Supabase auth and Creem payments pre-integrated.
Clone, configure, and start selling — no boilerplate to write.

## Live Demo

> 🔗 **[creemkit.vercel.app](https://creemkit.vercel.app)** <!-- TODO: update URL -->

- Use Creem's test card: `4242 4242 4242 4242` (any future expiry, any CVC)
- Try with discount code: `CREEMKIT2026`

## Quick Start

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ubergonmx/creemkit)

### Run locally

```bash
git clone https://github.com/ubergonmx/creemkit.git
cd creemkit
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
  - [Developer Tips](#developer-tips)
  - [Database Schema](#database-schema)
  - [Testing](#testing)
- [Setup](#setup)
  - [1. Set up the project](#1-set-up-the-project)
  - [2. Set up Supabase](#2-set-up-supabase)
  - [3. Set up Creem](#3-set-up-creem)
  - [4. Run locally](#4-run-locally)
  - [5. Deploy to Vercel](#5-deploy-to-vercel)
  - [6. Post-Deployment Setup](#6-post-deployment-setup)
  - [7. Verify Everything](#7-verify-everything)
- [Extras](#extras)
  - [AI Skills](#ai-skills)
  - [Always Check](#always-check)
- [Contributing](#contributing)
- [License](#license)

---

## About

### Tech Stack

- **Framework** — [Next.js](https://nextjs.org) (App Router, Server Components)
- **Auth & Database** — [Supabase](https://supabase.com)
- **Payments** — [Creem](https://creem.io)
- **Styling** — [Tailwind CSS](https://tailwindcss.com)
- **UI Components** — [shadcn/ui](https://ui.shadcn.com) (Base UI)
- **Icons** - [Tabler icons](https://tabler.io/icons)
- **Language** — TypeScript (strict mode)
- **Deployment** - [Vercel](https://vercel.com)

### Features

- Next.js 16 App Router + Server Components foundation
- Supabase auth (email/password + Google + GitHub OAuth)
- Route protection using Next.js `proxy.ts` middleware pattern
- Creem checkout flow for Starter / Pro / Business plans
- Subscription management: upgrade, downgrade, cancel at period end, resume
- Creem customer portal access for self-service billing
- Credits wallet system with transaction history
- Atomic credit operations via Postgres RPCs (`spend_credits`, `add_credits`, `deduct_credits`)
- Strict TypeScript, Oxlint, Oxfmt, and CI checks
- Production-safe webhook processing with idempotency logging

### Webhook Integrations

Webhook endpoint: `POST /api/webhooks/creem`

Implemented events:

- `checkout.completed`
- `subscription.active`
- `subscription.paid`
- `subscription.past_due`
- `subscription.unpaid`
- `subscription.trialing`
- `subscription.canceled`
- `subscription.expired`
- `subscription.paused`
- `subscription.update`
- `refund.created`

Security and reliability:

- Signature verification via `CREEM_WEBHOOK_SECRET`
- Idempotency via `webhook_events` table (duplicate event protection)
- Subscription and credits sync against Supabase using service role client

### Architecture

The app uses a **feature-based structure** with a thin App Router layer.

```text
src/app/
  (marketing)/page.tsx, pricing/page.tsx
  (auth)/login/page.tsx, signup/page.tsx, auth/callback/route.ts
  (dashboard)/dashboard/
    page.tsx
    billing/page.tsx
    credits/page.tsx
    feature-1/page.tsx
    feature-2/page.tsx
    settings/account/page.tsx
    settings/billing/page.tsx
  api/webhooks/creem/route.ts

src/features/
  auth/          # schemas, actions, hooks, login/signup/settings UI
  billing/       # checkout/subscription/portal actions, webhook handlers, billing UI
  credits/       # wallet actions, schema, balance/history UI
  summarizer/    # real feature using credit spend
  pro-showcase/  # paid-gated analytics showcase
  dashboard/     # shell/navigation components
  landing/       # marketing sections

src/lib/
  supabase/{client,server,admin,middleware}.ts
  creem/client.ts
  utils.ts, errors.ts

src/proxy.ts     # Next.js 16 proxy entry point
```

Key design rules:

- Keep business logic inside `src/features/*`; keep `src/app/*` route files thin.
- Use Server Actions for app mutations; reserve API routes for external callbacks only.
- Keep Supabase and Creem clients in `src/lib/*` as shared infrastructure.

### Developer Tips

#### Server Actions

- Prefer Server Actions for user-triggered mutations; keep API routes for inbound external events.
- After non-redirect mutations, use both `revalidatePath()` and `refresh()` so cache and UI stay in sync.
- For redirect flows (login, checkout, portal), use `redirect()` and skip explicit refresh logic.
- In client components, call actions inside `startTransition` and surface pending/error states.

#### Supabase Clients

- Use `createClient` (`src/lib/supabase/server.ts`) for user-scoped reads with RLS enforced.
- Use `createAdminClient` (`src/lib/supabase/admin.ts`) for trusted server-side writes (webhooks/subscription mutations).
- RLS-blocked writes can fail silently; always check query responses/errors on write paths.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

### Database Schema

Migrations live in `supabase/migrations/`:

- `001_profiles.sql`
  - `profiles` table
  - trigger to sync new `auth.users` rows
  - `creem_customer_id` support
- `002_subscriptions.sql`
  - `subscriptions` table for Creem subscription state
  - status tracking, indexes, and RLS policies
- `003_credits.sql`
  - `credits` wallet table
  - `credit_transactions` ledger table
  - atomic SQL RPCs for spend/add/deduct operations
- `004_webhook_events.sql`
  - webhook idempotency table to prevent duplicate processing

RLS is enabled across core user-facing tables.

### Testing

Current test coverage includes:

- Webhook handler behavior and event mapping
- Credits spending action behavior
- Billing plan helper/type behavior
- Creem client helper behavior
- Protected route middleware/proxy behavior

Run checks locally:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

---

## Setup

### 1. Set up the project

```bash
git clone https://github.com/ubergonmx/creemkit.git
cd creemkit
npm install
cp .env.example .env.local
```

### 2. Set up Supabase

1. Create a new [Supabase project](https://database.new)
2. Set these values in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`: Copy this in **Project Overview** (should look like `https://urcryetpnmgoatkitnumxb.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Copy this in **Project Overview** (open dropdown) or go to **Project Settings** (bottom of left sidebar) > **API Keys** > copy the key under **Publishable key** (starts with `sb_publishable_...`). If you're using legacy, copy `anon public` key (starts with `eyJ...`) in "Legacy anon, service_role API keys" tab.
- `SUPABASE_SERVICE_ROLE_KEY`: Same page, copy the key under **Secret keys** (starts with `sb_secret_***`). If you're using legacy, copy `service_role` secret key.
- `NEXT_ALLOWED_DEV_ORIGINS` (optional): Comma-separated origins/hostnames for Next.js `allowedDevOrigins` in development. Leave empty unless you access the dev server from a non-default origin (e.g. ngrok).

3. Run the SQL migrations

- Go to **SQL Editor** in the left sidebar (terminal icon)
- Copy-paste and run each file in `supabase/migrations/` in order:
  - `001_profiles.sql`
  - `002_subscriptions.sql`
  - `003_credits.sql`
  - `004_webhook_events.sql`
  - `005_security_hardening.sql
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
5. Set the copied key in `.env.local`:

- `CREEM_API_KEY=<your_test_api_key>`

6. Create three subscription products — go to **Commerce > Products** in the left sidebar, click **Create Product**. For each product:
   - **Section 1 (Product Details)**: Enter the product name and description
   - **Section 2 (Payment Details)**: Click the **Subscription** tab, set Currency to **USD**, enter the price, set Subscription interval to **Monthly**, Tax category to **Software as a Service**
   - **Sections 3–6**: Skip (image, features, advanced options, and abandoned cart are all optional)
   - Click **Create Product**

   Create all three:

   | **Product name** | **Price** |
   | ---------------- | --------- |
   | Starter          | 9         |
   | Pro              | 19        |
   | Business         | 99        |

7. After creating each product, copy its `prod_` ID (shown on the product detail page) into your `.env.local`

8. (Optional) Override API environment:

- Template default (local + deployed): `https://test-api.creem.io`.
- You do **not** need to set `CREEM_API_BASE_URL` for template test-mode setup.
- To switch to live mode later, set `CREEM_API_BASE_URL=https://api.creem.io`.
- Test keys only work with `test-api.creem.io`; production keys only work with `api.creem.io`

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
- In `.env.local`, set `NEXT_ALLOWED_DEV_ORIGINS=abc123.ngrok-free.dev` (or the full origin), and comma-separate values if you use multiple custom dev origins
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
- Make sure `CREEM_API_KEY` is included in Vercel environment variables (Production target)
- For test-mode template usage, leave `CREEM_API_BASE_URL` empty (do not add it)

6. Click **Deploy** and wait for the build to complete
7. Once done, copy your production URL from the Vercel dashboard (e.g. `https://your-app.vercel.app`)

### 6. Post-Deployment Setup

Once you have your production URL, connect the remaining services:

1. **Supabase Auth URLs**: Navigate to **Supabase > Authentication > URL Configuration**:
   - Set **Site URL** to `https://your-app.vercel.app`
   - Under **Redirect URLs**, add `https://your-app.vercel.app/auth/callback`
2. **App URL env var**: In Vercel, go to **Settings > Environment Variables** and update `NEXT_PUBLIC_APP_URL` to your production URL
3. **Creem webhook**: In your Creem dashboard, go to **Developers > API & Webhooks**, open the **Webhooks** tab, and click **+ New**:
   - **Name**: anything descriptive (e.g. `production`)
   - **URL**: `https://your-app.vercel.app/api/webhooks/creem`
   - **Events**: click **Select All**
   - Click **Save** and copy the generated webhook secret
4. **Add webhook secret**: Back in Vercel **Settings > Environment Variables**, add `CREEM_WEBHOOK_SECRET` with the value from the previous step
5. **Redeploy**: Go to **Deployments**, click the three dots on the latest deployment, and hit **Redeploy** to apply the new environment variables

6. **Troubleshoot checkout 403/forbidden**:

- Ensure `CREEM_API_KEY` matches the API environment (`CREEM_API_BASE_URL` or template default `https://test-api.creem.io`)
- Ensure `NEXT_PUBLIC_CREEM_PRODUCT_ID_*` values are from the same Creem store/mode as the API key

### 7. Verify Everything

Before deploying (or after major config changes), make sure everything passes:

```bash
npm run lint         # lint
npm run typecheck    # type-check
npm test             # run tests
npm run build        # production build
```

If all checks pass, you're ready to ship.

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
