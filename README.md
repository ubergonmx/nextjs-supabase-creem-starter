# Next.js + Supabase + Creem Starter

[![CI](https://github.com/aaronpal/nextjs-supabase-creem-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/aaronpal/nextjs-supabase-creem-starter/actions/workflows/ci.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aaronpal/nextjs-supabase-creem-starter)
![Status](https://img.shields.io/badge/status-work--in--progress-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

> 🚧 This project is actively under development.

Production-ready Next.js starter with Supabase auth and Creem payments pre-integrated.
Clone, configure, and start selling — no boilerplate to write.

## Tech Stack

- **Framework** — [Next.js](https://nextjs.org) (App Router, Server Components)
- **Auth & Database** — [Supabase](https://supabase.com)
- **Payments** — [Creem](https://creem.io)
- **Styling** — [Tailwind CSS](https://tailwindcss.com)
- **UI Components** — [shadcn/ui](https://ui.shadcn.com)
- **Language** — TypeScript (strict mode)

## Features

> Coming soon

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project
- A [Creem](https://creem.io) account with at least one product created

### 1. Clone the repo

```bash
git clone https://github.com/aaronpal/nextjs-supabase-creem-starter.git
cd nextjs-supabase-creem-starter
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your credentials:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `CREEM_API_KEY` | Creem → Developer → API Keys |
| `CREEM_WEBHOOK_SECRET` | Creem → Developer → Webhooks |
| `NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO` | Creem → Products |
| `NEXT_PUBLIC_CREEM_PRODUCT_ID_CREDITS` | Creem → Products |

### 3. Set up the database

Run the migrations in order against your Supabase project:

```bash
# Using the Supabase CLI
supabase db push

# Or run each file manually in the Supabase SQL editor:
# supabase/migrations/001_profiles.sql
# supabase/migrations/002_subscriptions.sql
# supabase/migrations/003_credits.sql
```

### 4. Configure OAuth (optional)

Enable Google and GitHub providers in your Supabase dashboard under
**Authentication → Providers**.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/aaronpal/nextjs-supabase-creem-starter)

Set the same environment variables from `.env.example` in your Vercel project settings.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
