# Local Hero MVP

Production-ready MVP scaffold for a Web3 community platform where users complete local quests, get AI-verified impact, and earn HERO token rewards.

## Stack

- Next.js 14 App Router + TypeScript + Tailwind + PWA
- Once UI components for cards/badges/progress/leaderboards
- Privy auth (wallet + email/social + embedded wallet config)
- Prisma + PostgreSQL
- Redis rate limiting
- S3/R2 object storage uploads
- Mock-first 0G AI verifier and blockchain reward ledger adapters

## Implemented Features

- Landing page and route structure:
  - `/`, `/explore`, `/quests`, `/submit`, `/profile`, `/leaderboard`, `/ideas`, `/sponsor`, `/admin`
- Quest APIs:
  - `GET/POST /api/quests`
  - `GET/PATCH /api/quests/[id]`
  - `GET /api/quests/nearby`
- Submission + AI verification pipeline:
  - `POST /api/submissions`
  - `POST /api/verify`
- Rewards and ledger:
  - `POST /api/rewards/claim`
- Community ideas and votes:
  - `GET/POST /api/ideas`
  - `POST /api/ideas/[id]/vote`
- Leaderboards:
  - `GET/POST /api/leaderboard`
- Admin moderation APIs:
  - `/api/admin/quests`
  - `/api/admin/submissions`
  - `/api/admin/sponsors`
  - `/api/admin/users`

## Setup

1. Copy env file:
   ```bash
   cp .env.example .env.local
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Push schema:
   ```bash
   npm run db:push
   ```
5. Seed sample data:
   ```bash
   npm run db:seed
   ```
6. Run app:
   ```bash
   npm run dev
   ```

## CI

GitHub Actions runs on every push/PR to `main`:
- Prisma client generation
- ESLint
- Production build

Workflow file: `.github/workflows/ci.yml`

## Deploy to Vercel

Deploy directly from GitHub:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Laszlo23/local-hero-mvp)

`vercel.json` is included for consistent install/build commands.

## Security and Anti-Abuse

- Redis-backed API rate limiting
- SHA-256 duplicate image detection
- Basic anti-spam scoring
- AI verification gating before reward issuance
- Admin moderation endpoints for quests/submissions/sponsors/users

## Notes for Production

- Replace mock adapters in:
  - `lib/ai/zeroGVerifier.ts`
  - `lib/blockchain/rewardLedger.ts`
  - `lib/blockchain/heroToken.ts`
- Configure valid Privy app credentials in `.env.local`
- Provision managed Postgres, Redis, and S3/R2 buckets
- Deploy to Vercel with environment variables configured
