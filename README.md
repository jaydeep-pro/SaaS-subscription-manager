# SaaS Subscription Manager

A production-grade SaaS dashboard frontend built with **Next.js 14**, **TypeScript**, **shadcn/ui**, and **TanStack Query**. This project demonstrates real-world frontend system design with mock JSON APIs, real architecture patterns, and Stripe-like subscription flows.

**Status:** Long-term learning project | Phase-based development | Industry-ready code

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Mock API Specification](#mock-api-specification)
6. [File Structure](#file-structure)
7. [Core Features](#core-features)
8. [Development Phases](#development-phases)
9. [Key Design Decisions](#key-design-decisions)
10. [Getting Help](#getting-help)

---

## Quick Start

### Prerequisites
- Node.js 18+
- yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd saas-subscription-manager

# Install dependencies
yarn 

# Start json-server (mock backend) in one terminal
 yarn api

# Start development server in another terminal
 yarn dev
```

The app will be available at `http://localhost:3000`  
The mock API will run at `http://localhost:3001`

---

## Project Overview

### What We're Building
A customer-facing SaaS dashboard where users can:
- View available subscription plans
- Manage current subscription (upgrade, downgrade, cancel)
- View billing history and invoices
- Receive clear feedback on all actions

### Problem Statement
Demonstrates how to build a **production-grade frontend** that mirrors real-world SaaS applications (like Stripe, GitHub Pro, or Notion) using proper architecture, state management, and UX patterns.

### Learning Outcomes
By completing this project, you'll understand:
- **SaaS mental models** — how subscriptions, plans, and billing work
- **Frontend system design** — scalable architecture from day one
- **Data ownership** — server vs. client state responsibility
- **Real-world UX** — optimistic updates, error handling, loading states
- **Clean architecture** — separation of concerns, feature-based folders

---

## Tech Stack

### Core Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | Modern React framework with SSR |
| **Language** | TypeScript (strict) | Type safety, better DX |
| **UI Library** | shadcn/ui | Accessible, customizable components |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Server State** | TanStack Query v5 | Data fetching, caching, sync |
| **Client State** | Zustand | Lightweight state management |
| **Mock Backend** | json-server | Local REST API for development |

### Supporting Libraries

| Package | Purpose |
|---------|---------|
| **Zod** | Runtime schema validation |
| **date-fns** | Date formatting and manipulation |
| **lucide-react** | Icon library (500+ icons) |
| **sonner** | Toast notifications |
| **clsx + tailwind-merge** | Conditional class merging |

### Why This Stack?

- **No Redux** — Zustand is simpler, sufficient for this scope
- **No overengineering** — Only tools we actually need
- **TanStack Query** — Industry standard for server state
- **shadcn/ui** — Composable, unstyled components
- **TypeScript strict mode** — Catches errors early

---

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────┐
│                   Next.js App Router                 │
│  (Landing → Pricing | Dashboard → Overview/Sub/Inv)  │
└──────────────────────┬──────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼─────┐  ┌─────▼────┐  ┌─────▼────┐
   │  Hooks   │  │  Zustand │  │  TanStack│
   │ (Custom) │  │  (Client) │  │  Query   │
   └────┬─────┘  └─────┬────┘  │(Server)  │
        │              │        └─────┬────┘
        └──────────────┼──────────────┘
                       │
              ┌────────▼────────┐
              │   API Wrapper   │
              │ (fetch/error)   │
              └────────┬────────┘
                       │
            ┌──────────▼──────────┐
            │  json-server (API)  │
            │  http://localhost   │
            │      :3001          │
            └─────────────────────┘
```

### Data Flow

**Server State (Plans, Subscription, Invoices)**
```
UI Component
    ↓
usePlans() hook (TanStack Query)
    ↓
API Wrapper (fetch)
    ↓
json-server
    ↓
Cache + Re-render
```

**Client State (Modal open, selectedPlan)**
```
UI Component
    ↓
useAppStore() (Zustand)
    ↓
Update state directly
    ↓
Instant re-render
```

### Folder Structure Rationale

```
src/
├── components/          # React components (UI + layout)
├── features/            # Feature-specific logic (domain-driven)
├── hooks/               # Custom React hooks (data fetching)
├── lib/                 # Utilities (api wrapper, query client)
├── store/               # Client state (Zustand)
├── schemas/             # Zod validation schemas
└── types/               # TypeScript types/interfaces
```

**Why feature-based?** Each feature folder (e.g., `subscription/`) can grow independently with its own components, hooks, and logic.

---

## Mock API Specification

### Base URL
```
http://localhost:3001
```

### Endpoints

#### GET `/plans`
Fetch all available subscription plans.

**Response:**
```json
[
  {
    "id": "starter",
    "name": "Starter",
    "price": 9,
    "interval": "month",
    "description": "Perfect for getting started",
    "features": [
      "Up to 5 projects",
      "Basic support",
      "Monthly reports"
    ]
  },
  {
    "id": "pro",
    "name": "Pro",
    "price": 29,
    "interval": "month",
    "description": "For growing teams",
    "features": [
      "Unlimited projects",
      "Priority support",
      "Advanced analytics"
    ]
  },
  {
    "id": "enterprise",
    "name": "Enterprise",
    "price": 99,
    "interval": "month",
    "description": "Custom solutions",
    "features": [
      "Everything in Pro",
      "Dedicated account manager",
      "Custom integrations"
    ]
  }
]
```

#### GET `/customers`
Fetch current user (mocked customer).

**Response:**
```json
{
  "id": "cus_001",
  "name": "Jaydeep Patel",
  "email": "jaydeep@example.com",
  "created": "2024-01-15"
}
```

#### GET `/subscriptions`
Fetch user's subscription.

**Response:**
```json
{
  "id": "sub_001",
  "customerId": "cus_001",
  "planId": "pro",
  "status": "active",
  "currentPeriodStart": "2024-12-01",
  "currentPeriodEnd": "2025-01-01",
  "canceledAt": null
}
```

**Status Values:** `active` | `trialing` | `past_due` | `canceled`

#### GET `/invoices`
Fetch user's billing history.

**Response:**
```json
[
  {
    "id": "inv_001",
    "customerId": "cus_001",
    "amount": 2900,
    "currency": "USD",
    "status": "paid",
    "date": "2024-12-01",
    "planId": "pro"
  },
  {
    "id": "inv_002",
    "customerId": "cus_001",
    "amount": 2900,
    "currency": "USD",
    "status": "paid",
    "date": "2024-11-01",
    "planId": "pro"
  }
]
```

**Status Values:** `paid` | `pending` | `failed`

#### POST `/subscriptions` (Simulated)
Upgrade or change plan. (Handled client-side with optimistic UI in Phase 4)

#### PATCH `/subscriptions/:id` (Simulated)
Cancel subscription. (Handled client-side in Phase 4)

---

## File Structure

```
saas-subscription-manager/
├── public/                          # Static assets
│
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx             # Landing page
│   │   │   └── pricing/
│   │   │       └── page.tsx         # Pricing page (Phase 2)
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx           # Dashboard layout (sidebar + topbar)
│   │   │   ├── page.tsx             # Overview/Dashboard (Phase 3)
│   │   │   ├── subscription/
│   │   │   │   └── page.tsx         # Subscription details (Phase 4)
│   │   │   ├── invoices/
│   │   │   │   └── page.tsx         # Invoice history (Phase 5)
│   │   │   └── account/
│   │   │       └── page.tsx         # Account settings (Phase 6)
│   │   │
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   └── [more...]
│   │   │
│   │   ├── layout/
│   │   │   ├── sidebar.tsx          # Main navigation sidebar
│   │   │   └── topbar.tsx           # Top navigation bar
│   │   │
│   │   ├── pricing/
│   │   │   ├── plan-card.tsx        # Single plan card
│   │   │   └── pricing-grid.tsx     # Grid of plans
│   │   │
│   │   ├── subscription/
│   │   │   ├── subscription-card.tsx
│   │   │   ├── upgrade-dialog.tsx
│   │   │   └── cancel-dialog.tsx
│   │   │
│   │   └── invoices/
│   │       └── invoice-table.tsx
│   │
│   ├── features/
│   │   ├── plans/
│   │   │   └── api.ts               # Plans API calls
│   │   │
│   │   ├── subscription/
│   │   │   └── api.ts               # Subscription API calls
│   │   │
│   │   ├── invoices/
│   │   │   └── api.ts               # Invoices API calls
│   │   │
│   │   └── customer/
│   │       └── api.ts               # Customer API calls
│   │
│   ├── hooks/
│   │   ├── usePlans.ts              # Fetch plans (TanStack Query)
│   │   ├── useSubscription.ts       # Fetch subscription (TanStack Query)
│   │   ├── useInvoices.ts           # Fetch invoices (TanStack Query)
│   │   └── useCustomer.ts           # Fetch customer (TanStack Query)
│   │
│   ├── lib/
│   │   ├── api.ts                   # Fetch wrapper + error handling
│   │   ├── queryClient.ts           # TanStack Query configuration
│   │   └── utils.ts                 # Helper functions
│   │
│   ├── store/
│   │   └── useAppStore.ts           # Zustand client state
│   │
│   ├── schemas/
│   │   ├── plan.schema.ts           # Zod validation for plans
│   │   ├── subscription.schema.ts   # Zod validation for subscriptions
│   │   ├── invoice.schema.ts        # Zod validation for invoices
│   │   └── customer.schema.ts       # Zod validation for customers
│   │
│   └── types/
│       ├── plan.ts                  # Plan TypeScript types
│       ├── subscription.ts          # Subscription types
│       ├── invoice.ts               # Invoice types
│       └── customer.ts              # Customer types
│
├── db.json                          # json-server mock database
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md                        # This file
```

---

## Core Features

### Phase 1: Setup ✅
- Initialize Next.js with TypeScript
- Configure shadcn/ui
- Setup json-server
- Configure TanStack Query + Zustand

### Phase 2: Pricing Page
**What:** Public pricing page showing all plans

**Components:**
- `PlanCard` — Individual plan display
- `PricingGrid` — Multiple plans in a grid

**Features:**
- Display plan name, price, features
- Highlight current plan
- CTA buttons (disabled for current plan)

**Data:** Read from `/plans` endpoint

### Phase 3: Dashboard Layout
**What:** Core dashboard structure

**Components:**
- `Sidebar` — Main navigation
- `Topbar` — Account menu, current user

**Navigation:**
- Overview
- Subscription
- Invoices
- Account

### Phase 4: Subscription Management
**What:** User's subscription details + actions

**Components:**
- `SubscriptionCard` — Current plan, status, renewal date
- `UpgradeDialog` — Modal to change plan
- `CancelDialog` — Confirmation to cancel

**Actions:**
- View current subscription
- Upgrade plan
- Downgrade plan
- Cancel subscription

**UX:**
- Optimistic updates
- Loading states
- Error toasts
- Success confirmations

### Phase 5: Invoice History
**What:** Billing history and download

**Components:**
- `InvoiceTable` — Sortable table of invoices
- `StatusBadge` — Paid/Pending/Failed indicator

**Features:**
- List invoices with date, amount, status
- Sort by date, amount, status
- Mock download button
- Filter by status

### Phase 6: Polish & Refactor
- Add loading skeletons
- Error boundaries
- Empty states
- Animation transitions
- Code cleanup + documentation

---

## Development Phases

### Execution Timeline

| Phase | What | Status | Est. Time |
|-------|------|--------|-----------|
| **Phase 1** | Setup + Config | Pending | 1 day |
| **Phase 2** | Pricing Page | Pending | 2 days |
| **Phase 3** | Dashboard Layout | Pending | 1 day |
| **Phase 4** | Subscriptions | Pending | 3 days |
| **Phase 5** | Invoices | Pending | 2 days |
| **Phase 6** | Polish + Docs | Pending | 2 days |

### How to Use Phases

1. Complete one phase at a time
2. Test thoroughly before moving to the next
3. Git commit after each phase
4. Update this README as you progress

### Git Workflow

```bash
# Feature branch per phase
git checkout -b phase/2-pricing

# Make commits
git commit -m "feat(pricing): add plan card component"

# After phase complete
git merge main
```

---

## Key Design Decisions

### 1. Why No Auth in v1?
We're focusing on subscription logic, not authentication. In Phase 1, we mock a logged-in user. Real auth can be added later.

### 2. Server vs. Client State

**Server State (TanStack Query)**
- Plans (public, cacheable)
- Subscription (user-specific)
- Invoices (user-specific)

**Client State (Zustand)**
- Modal open/close states
- Form inputs during submission
- Temporary optimistic updates

### 3. Feature-Based Folder Structure
Each feature (plans, subscription, invoices) is self-contained:
```
features/subscription/
├── api.ts          # Fetch calls
├── hooks.ts        # Custom hooks
├── types.ts        # TypeScript types
└── components/     # UI components
```

This scales better than flat structures.

### 4. Validation with Zod
All API responses are validated at runtime:
```typescript
const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});

// Type-safe + runtime validation
const plan = planSchema.parse(apiResponse);
```

### 5. Optimistic UI Pattern
When user upgrades plan:
1. Update UI immediately (optimistic)
2. Send request in background
3. If fails, revert UI + show error

Feels instant, but safe.

### 6. Error Handling Strategy

**API Layer:**
```typescript
if (!response.ok) {
  throw new Error(`API Error: ${response.status}`);
}
```

**Hook Layer:**
```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ["plans"],
  queryFn: () => api("/plans"),
});
```

**Component Layer:**
```typescript
if (error) return <div>Error: {error.message}</div>;
if (isLoading) return <Skeleton />;
```

---

## Getting Help

### Common Issues

**Q: json-server is not starting**
```bash
# Make sure it's installed
npm install -g json-server

# Run with config
json-server --watch db.json --port 3001
```

**Q: TypeScript errors in components**
```bash
# Check strict mode is enabled
# tsconfig.json: "strict": true

# Run type check
tsc --noEmit
```

**Q: TanStack Query cache not updating**
```bash
# Manual invalidation
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ["plans"] });
```

### Documentation References

- **Next.js App Router:** https://nextjs.org/docs/app
- **TanStack Query:** https://tanstack.com/query/latest
- **Zustand:** https://github.com/pmndrs/zustand
- **shadcn/ui:** https://ui.shadcn.com
- **Zod:** https://zod.dev

### Debugging Tips

1. **Browser DevTools** → Network tab (see API calls)
2. **TanStack Query DevTools** → Cache state visualization
3. **React DevTools** → Component hierarchy + state
4. **Console logging** → Strategic `console.log()` in hooks

---

## Project Goals

### Why Build This?

This project teaches you to think like a **Senior Developer**:

✅ **System Design** — Architecture before code  
✅ **Product Thinking** — User journey first  
✅ **Real-World Patterns** — How actual SaaS apps work  
✅ **Clean Code** — Scalable, maintainable structure  
✅ **UX Excellence** — Loading states, errors, feedback  
✅ **Type Safety** — TypeScript strict mode  

### What You'll Master

- SaaS subscription flows (Stripe-like)
- Frontend state management (server + client)
- API design and mocking
- Component composition in React
- Error handling and resilience
- Production-grade UX patterns

---

## Contributing & Iteration

This is an evolving project. As you complete phases:

1. Document learnings
2. Refactor before moving forward
3. Add comments for complex logic
4. Test thoroughly
5. Update this README

---

## License

MIT — Feel free to use this as a learning reference.

---

**Last Updated:** December 2024  
**Status:** Active Development  
**Maintainer:** Your Team

---

## Quick Command Reference

```bash
# Installation
npm install

# Development (both terminals)
npm run api              # Terminal 1: Start json-server
npm run dev              # Terminal 2: Start Next.js

# Utilities
npm run build            # Production build
npm run type-check       # Run TypeScript checker
npm run lint             # Run ESLint
npm test                 # Run tests (when added)

# Clean up
npm run clean            # Remove build artifacts
```

---

**Start with Phase 1. Build like a senior. Think like a product engineer.**