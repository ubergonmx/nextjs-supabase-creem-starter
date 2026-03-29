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

### Run locally (demo, no `.env.local` needed)

```bash
git clone https://github.com/ubergonmx/nextjs-supabase-creem-starter.git
cd nextjs-supabase-creem-starter
npm install
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

### 1. Set up Supabase

1. Create a new [Supabase project](https://database.new)

<!-- TODO: remaining Supabase steps -->

### 2. Set up Creem

1. Create an account at [creem.io](https://www.creem.io) or, if you don't have an existing store, [create a new one](https://www.creem.io/dashboard/create)
2. Enable **Test Mode** in the bottom-left of the sidebar
3. Go to **Developers > API & Webhooks** in the left sidebar
4. On the **API Keys** tab, click **+ Create API Key**, name it anything (e.g. `next-supabase-creem-starter`), toggle **Full Access** on, click **Create Key**, and copy the key
5. Create three subscription products — go to **Commerce > Products** in the left sidebar, click **Create Product**. For each product:
   - **Section 1 (Product Details)**: Enter the product name and description
   - **Section 2 (Payment Details)**: Click the **Subscription** tab, set Currency to **USD**, enter the price, set Subscription interval to **Monthly**, Tax category to **Digital goods or services**
   - **Sections 3–6**: Skip (image, features, advanced options, and abandoned cart are all optional)
   - Click **Create Product**

   Create all three:

   | **Product name** | **Price** |
   | ---------------- | --------- |
   | Starter          |           |
   | Pro              |           |
   | Enterprise       |           |

6. After creating each product, copy its `prod_` ID (shown on the product detail page) into your `.env.local`

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your credentials:

| Variable                               | Where to find it                  |
| -------------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`        | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY`            | Supabase → Project Settings → API |
| `CREEM_API_KEY`                        | Creem → Developer → API Keys      |
| `CREEM_WEBHOOK_SECRET`                 | Creem → Developer → Webhooks      |
| `NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO`     | Creem → Products                  |
| `NEXT_PUBLIC_CREEM_PRODUCT_ID_CREDITS` | Creem → Products                  |

### 4. Set up the database

Run the migrations against your Supabase project:

```bash
# Using the Supabase CLI
supabase db push

# Or run each file manually in the Supabase SQL editor:
# supabase/migrations/001_profiles.sql
# supabase/migrations/002_subscriptions.sql
# supabase/migrations/003_credits.sql
```

### 5. Configure OAuth (optional)

Enable Google and GitHub providers in your Supabase dashboard under **Authentication → Providers**.

### 6. Verify everything

Before deploying, make sure everything passes:

```bash
npm run check        # lint + type-check
npm run test:coverage # run tests with coverage
npm run build        # production build
```

If all three pass, you're ready to deploy. 🚀

---

## Extras

### AI Skills

Skills that help you (and AI) build faster when adding features:

#### Creem

- Check the [original docs](https://docs.creem.io/code/sdks/ai-agents) or install the skill:
  ```bash
  npx skills add https://github.com/armitage-labs/creem-skills --skill creem
  ```

#### Supabase Query Tuning

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
