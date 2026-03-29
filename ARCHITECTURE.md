# Architecture

This project uses a **feature-based architecture** — business logic is co-located by domain, not scattered across technical layers.

## Directory Structure

```
src/
├── app/                                # Thin routing layer ONLY — no logic here
│   ├── (marketing)/                    # Public marketing pages (Header + Footer shared)
│   │   ├── layout.tsx                  # Header, CallToAction, FooterSection wrapper
│   │   ├── page.tsx                    # Landing page: HeroSection + FeaturesSection + Demo
│   │   └── pricing/
│   │       └── page.tsx               # Pricing page: PricingSection + FaqsSection
│   ├── (auth)/
│   │   ├── login/page.tsx              # renders <LoginForm /> from features/auth
│   │   ├── signup/page.tsx
│   │   └── callback/route.ts          # OAuth callback handler
│   ├── (dashboard)/
│   │   ├── layout.tsx                  # dashboard shell (sidebar, nav)
│   │   ├── page.tsx                    # renders <DashboardHome />
│   │   ├── settings/page.tsx
│   │   └── credits/page.tsx
│   └── api/
│       └── webhooks/
│           └── creem/route.ts         # thin — delegates to features/billing/webhooks
│
├── features/                           # All business logic lives here
│   │
│   ├── landing/
│   │   └── components/
│   │       ├── hero-section.tsx        # Animated hero with CTA buttons
│   │       ├── features-section.tsx    # Feature cards grid (id="features")
│   │       ├── call-to-action.tsx      # Bottom CTA section
│   │       └── footer-section.tsx      # Footer with nav links + GitHub link
│   │
│   ├── auth/
│   │   ├── components/
│   │   │   ├── login-form.tsx
│   │   │   ├── signup-form.tsx
│   │   │   └── oauth-buttons.tsx
│   │   ├── actions/
│   │   │   ├── login.ts               # server actions
│   │   │   ├── signup.ts
│   │   │   └── logout.ts
│   │   ├── hooks/
│   │   │   └── use-user.ts
│   │   └── types.ts
│   │
│   ├── billing/
│   │   ├── components/
│   │   │   ├── pricing-section.tsx    # Three-tier pricing cards
│   │   │   ├── faqs-section.tsx       # Accordion FAQ section
│   │   │   ├── subscription-card.tsx  # status, renewal date
│   │   │   ├── cancel-dialog.tsx      # confirmation modal
│   │   │   └── upgrade-dialog.tsx     # proration preview
│   │   ├── actions/
│   │   │   ├── create-checkout.ts
│   │   │   ├── cancel-subscription.ts
│   │   │   ├── upgrade-subscription.ts
│   │   │   └── get-portal-url.ts      # Creem customer portal
│   │   ├── webhooks/
│   │   │   ├── dispatcher.ts          # routes events to handlers
│   │   │   └── handlers/
│   │   │       ├── checkout-completed.ts
│   │   │       ├── subscription-created.ts
│   │   │       ├── subscription-updated.ts
│   │   │       └── subscription-canceled.ts
│   │   ├── hooks/
│   │   │   └── use-subscription.ts
│   │   └── types.ts
│   │
│   ├── credits/
│   │   ├── components/
│   │   │   ├── credits-card.tsx       # balance + quick actions
│   │   │   └── transaction-list.tsx   # paginated ledger
│   │   ├── actions/
│   │   │   ├── get-balance.ts
│   │   │   ├── spend-credits.ts       # atomic, race-condition safe
│   │   │   ├── purchase-credits.ts    # one-time Creem checkout
│   │   │   └── topup-credits.ts       # called from webhook on renewal
│   │   ├── hooks/
│   │   │   └── use-credits.ts
│   │   └── types.ts
│   │
│   └── dashboard/
│       ├── components/
│       │   ├── sidebar.tsx
│       │   ├── dashboard-header.tsx
│       │   └── stats-card.tsx
│       └── types.ts
│
├── components/                         # Truly shared, feature-agnostic UI
│   ├── header.tsx                      # Sticky nav with useScroll behavior
│   ├── logo.tsx                        # CreemKit logo (theme-aware)
│   ├── mobile-nav.tsx                  # Mobile menu with portal
│   ├── demo.tsx                        # UI demo showcase
│   └── ui/                             # shadcn/ui primitives (button, card, accordion...)
│
├── lib/                                # Shared infrastructure (no business logic)
│   ├── supabase/
│   │   ├── client.ts                  # browser client
│   │   ├── server.ts                  # SSR client
│   │   └── admin.ts                   # service role (webhooks only)
│   ├── creem/
│   │   └── client.ts                  # SDK init, test/prod auto-detect
│   └── utils.ts                        # cn(), formatters, etc.
│
├── hooks/                              # Shared hooks (non-feature-specific)
│   └── use-scroll.ts                   # Scroll position hook for sticky header
│
└── middleware.ts                       # Route protection (auth + subscription gates)

supabase/
└── migrations/
    ├── 001_profiles.sql               # profiles + auth trigger
    ├── 002_subscriptions.sql          # Creem subscription tracking
    └── 003_credits.sql                # wallet + ledger

tests/                                 # App-level and cross-feature test suites
├── integration/                       # Multi-feature contracts (auth + billing + credits)
└── e2e/                               # Playwright user journeys across route groups
```

## Testing Strategy

Use a hybrid testing layout so ownership is clear and suites scale with the codebase.

- Colocate unit and component tests with the feature they validate (`src/features/**`) and with shared UI in `src/components/**`.
- Keep cross-feature integration tests in `tests/integration/` when behavior spans multiple domains.
- Keep end-to-end tests in `tests/e2e/` to validate full user journeys at the app boundary.

### Example Test Paths

- `src/features/auth/components/login-form.test.tsx`
- `src/features/billing/actions/create-checkout.test.ts`
- `tests/integration/subscription-lifecycle.test.ts`
- `tests/e2e/signup-to-upgrade.spec.ts`

## Principles

| Rule                             | How it's applied                                                              |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `app/` = routing only            | Pages import and render feature components — no business logic in route files |
| Features are self-contained      | `billing/` has its own components, actions, hooks, types, and webhooks        |
| `lib/` = zero business logic     | Only infrastructure clients (Supabase, Creem SDK)                             |
| `components/ui/` = shadcn only   | No feature logic leaks into shared UI primitives                              |
| Webhooks co-located with billing | `features/billing/webhooks/` not `app/api/webhooks/`                          |
| Tests follow feature boundaries  | Unit/component tests are colocated; integration + e2e tests live in `tests/` |

## Why Feature-Based?

|                       | Layer-Based                               | Feature-Based                   |
| --------------------- | ----------------------------------------- | ------------------------------- |
| Find all billing code | Hunt across `api/`, `components/`, `lib/` | One folder: `features/billing/` |
| Add a new feature     | Touch 3+ directories                      | Add one `features/X/` folder    |
| Delete a feature      | Risky — scattered files                   | Delete one folder               |
| Onboarding a new dev  | High cognitive load                       | Self-documenting                |
