# CryptoTax Pro - Crypto Tax Software Platform

## Overview
A professional-grade crypto tax software platform that helps users track wallet transactions across multiple blockchains, automatically classify them with an intent-aware system, and generate audit-ready tax reports. Built with a wallet-first, intent-aware approach.

## Current State
**MVP Complete with Real Blockchain Data & Telegram Notifications** - Core features implemented:
- User authentication via Replit Auth (OIDC with Google, GitHub, email support)
- Landing page for logged-out users with feature overview
- Dashboard with portfolio overview and recent transactions
- Wallet management (add/remove wallets) with real blockchain syncing
- Real transaction fetching via Alchemy API for EVM chains
- Transaction listing with filtering and classification
- Review page for classifying uncertain transactions
- Classification rules management
- Tax report generation (Form 8949, Schedule D, etc.)
- Telegram bot notifications for unrecognized transactions
- All data is private and scoped per user

## Required API Keys (Secrets)
- **ALCHEMY_API_KEY** - For fetching real transaction data from blockchains
  - Get free at https://www.alchemy.com
  - Supports: Ethereum, Polygon, Arbitrum, Optimism, Base
- **TELEGRAM_BOT_TOKEN** - For sending transaction notifications
  - Create via @BotFather on Telegram
  - Enables: Instant alerts, classify transactions via chat

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **Authentication**: Replit Auth (OpenID Connect)
- **Blockchain Data**: Alchemy API
- **Notifications**: Telegram Bot API

## Project Structure
```
client/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # shadcn components
│   │   ├── app-sidebar.tsx
│   │   ├── chain-badge.tsx
│   │   ├── classification-badge.tsx
│   │   ├── stat-card.tsx
│   │   ├── address-display.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── pages/           # Page components
│   │   ├── dashboard.tsx
│   │   ├── wallets.tsx
│   │   ├── transactions.tsx
│   │   ├── review.tsx
│   │   ├── rules.tsx
│   │   ├── reports.tsx
│   │   ├── settings.tsx     # Telegram integration settings
│   │   └── landing.tsx      # Landing page for logged-out users
│   ├── lib/             # Utilities
│   └── hooks/           # Custom hooks (includes use-auth.ts)
server/
├── index.ts             # Server entry point
├── routes.ts            # API routes (all protected with auth)
├── storage.ts           # Database storage layer (user-scoped queries)
├── db.ts                # Database connection
├── services/
│   ├── alchemy.ts       # Blockchain data fetching service
│   └── telegram.ts      # Telegram bot service
└── replit_integrations/auth/  # Replit Auth OIDC integration
shared/
└── schema.ts            # Data models & types
```

## Key Features

### Real Blockchain Syncing (via Alchemy)
- Supports: Ethereum, Polygon, Arbitrum, Optimism, Base
- Fetches real transaction history
- Detects transaction types (transfers, swaps, NFT mints, etc.)
- Flags unrecognized transactions for review

### Telegram Notifications
- Link your Telegram account via verification code
- Get instant alerts when new transactions need classification
- Reply directly in Telegram to classify (e.g., "swap", "income")
- Commands: `/status`, `/help`, `classify [txId] [type]`

### Supported Blockchains
- **Alchemy Sync**: Ethereum, Arbitrum, Optimism, Base, Polygon
- **Manual Entry**: Solana, Bitcoin, Avalanche, BSC

### Transaction Classifications
- Swap, LP Deposit/Withdraw, Stake/Unstake
- Borrow/Repay, Bridge, Airdrop, Vesting
- NFT Mint/Sale, Reward, Interest
- Income, Expense, Self-Transfer

### Tax Reports
- Form 8949 (Capital Gains)
- Schedule D (Summary)
- Income Report
- Staking Report
- Airdrop Report
- NFT Report

## API Endpoints

**Note:** All API endpoints (except auth and telegram webhook) require authentication.

### Authentication
- `GET /api/login` - Initiate login flow
- `GET /api/callback` - OAuth callback handler
- `GET /api/logout` - Log out user
- `GET /api/auth/user` - Get current user info

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

### Wallets
- `GET /api/wallets` - List all wallets
- `POST /api/wallets` - Add a wallet
- `DELETE /api/wallets/:id` - Remove a wallet
- `POST /api/wallets/:id/sync` - Sync transactions from blockchain (requires ALCHEMY_API_KEY)

### Transactions
- `GET /api/transactions` - List transactions (query: chain, classification, needsReview)
- `PATCH /api/transactions/:id/classify` - Classify a transaction

### Rules
- `GET /api/rules` - List classification rules
- `POST /api/rules` - Create a rule
- `PATCH /api/rules/:id` - Update a rule
- `DELETE /api/rules/:id` - Delete a rule

### Reports
- `GET /api/reports/summary?year=2024` - Report summary
- `GET /api/reports/:reportId?year=2024` - Download report

### Telegram Integration
- `GET /api/telegram/status` - Check Telegram link status
- `POST /api/telegram/link` - Generate verification code
- `DELETE /api/telegram/link` - Unlink Telegram account
- `POST /api/telegram/webhook` - Telegram webhook (no auth)

## User Preferences
- Dark mode enabled by default
- Professional financial theme with blue primary color
- JetBrains Mono font for addresses and code

## Database Schema
- `users` - User accounts (managed by Replit Auth)
- `sessions` - Session storage for authentication
- `wallets` - Wallet addresses with chain and entity type (userId scoped)
- `transactions` - On-chain transactions with classification
- `classification_rules` - User-defined classification rules (userId scoped)
- `tax_lots` - Cost basis tracking
- `disposals` - Realized gains/losses
- `settings` - User settings (userId scoped)
- `telegram_links` - Telegram account links for notifications (userId scoped)

## Recent Changes
- 2026-02-05: Real Blockchain Data & Telegram Notifications
  - Added Alchemy API integration for fetching real transaction data
  - Wallet sync now pulls actual transactions from EVM chains
  - Added Telegram bot service for notifications
  - Settings page for linking Telegram account
  - Telegram notifications when new transactions need review
  - Classify transactions directly from Telegram via inline buttons or replies
  
- 2026-01-30: User Authentication
  - Added Replit Auth (OIDC) for secure user authentication
  - Landing page for logged-out users with feature overview
  - All data is now user-scoped (private per user)
  - User menu with avatar and logout functionality
  - Protected all API routes with authentication middleware
  
- 2026-01-29: Initial MVP implementation
  - Complete frontend with 6 pages
  - Full API implementation
  - PostgreSQL database with seeded sample data
  - Dark/light theme support
  - Professional financial UI design

## Architecture Decisions
- Wallet-first approach: Track transactions by wallet address
- Intent-aware classification: Infer economic intent from transaction patterns
- Human-in-the-loop learning: User confirms uncertain classifications
- Cost basis lot tracking with FIFO/LIFO/HIFO support
- Graceful degradation: Features work without API keys (with prompts to configure)

## Development Notes
- Run `npm run dev` to start the development server
- Users create their own wallets after logging in (no sample data)
- Use `npm run db:push` to sync schema changes
- Add ALCHEMY_API_KEY secret to enable blockchain syncing
- Add TELEGRAM_BOT_TOKEN secret to enable notifications
- Set up Telegram webhook after deploying: POST to `/api/telegram/webhook`
