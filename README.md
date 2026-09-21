# Freelancer OS — Business Management SaaS

**[Live demo](https://freelancer-os-gamma.vercel.app)** · **[Get it on Gumroad](https://muadme.gumroad.com/l/FreelancerOS)**

> A complete commercial-grade platform for freelancers and agencies to manage clients, projects, invoices, time tracking, proposals, and payments.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![License](https://img.shields.io/badge/license-proprietary-red)

---

## Overview

Freelancer OS is a full-stack SaaS application built for **freelancers** and **small agencies** who need to manage their entire business in one place — from landing a client to getting paid.

### Who it's for

- Freelance developers, designers, writers, consultants, photographers
- Solo or small agencies (1–10 people)
- Independent contractors who bill hourly or per-project

### What it solves

| Pain Point | How Freelancer OS Solves It |
|-----------|---------------------------|
| "Where did my time go?" | Built-in time tracker with timesheets |
| "Creating invoices is a pain" | One-click invoice from tracked time |
| "I have 12 clients and can't keep track" | Unified client + project dashboard |
| "Proposals take too long" | Reusable templates, fast proposal builder |
| "Am I actually profitable?" | Analytics + payments vs expenses tracking |
| "Getting paid is slow" | Payment tracking and status reminders |

---

## Features

### Core Modules

| Module | What it does |
|--------|-------------|
| **Dashboard** | KPI overview — revenue, active projects, pending invoices, upcoming deadlines |
| **Clients** | Contact management, notes, project history per client |
| **Projects** | Project boards with status, budget, deadlines |
| **Tasks** | Task list with assignments, due dates, priorities |
| **Time Tracking** | Start/stop timer, manual entries, timesheet export |
| **Invoices** | Auto-generate from time tracked, send, track paid/unpaid |
| **Proposals** | Build proposals, send, track viewed/accepted/rejected |
| **Contracts** | Contract templates, digital management |
| **Payments** | Log payments received, link to invoices |
| **Leads** | Prospect pipeline — new → contacted → qualified → won/lost |
| **Expenses** | Log business expenses, categorize, tax tracking |
| **Files** | Upload and organize client deliverables |
| **Messages** | Client communication thread inbox |
| **Analytics** | Revenue charts, project profitability, client breakdown |
| **Calendar** | Monthly view of task due dates and deadlines |
| **Automations** | Rule-based workflows (e.g., "when proposal accepted → create project") |
| **Templates** | Reusable proposal and contract templates |
| **Settings** | Profile, business info, billing preferences, security (2FA) |

### Design System

- **Light / Dark / System** theme switcher with localStorage persistence
- Luxury dark palette (layered charcoal surfaces — not flat black)
- Premium UI with Tailwind CSS + Radix UI primitives
- Lucide icons throughout
- Responsive design (mobile-friendly)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + React 18 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| UI Components | Radix UI + custom components |
| Database | Prisma ORM |
| Database (dev) | SQLite |
| Database (prod) | PostgreSQL |
| Auth | NextAuth.js (credentials) |
| Icons | Lucide React |
| Notifications | Sonner (toasts) |
| Forms | React Hook Form + Zod |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd complete-commercial-saas-product

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database URL and NextAuth secret

# 4. Initialize the database
npm run db:push
npm run db:seed    # Seeds demo data

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Login

```
Email:    demo@example.com
Password: demo123
```

### Build for Production

```bash
npm run build    # runs prisma generate, then next build
npm run start
```

Useful extras: `npm run db:studio` opens Prisma Studio to browse the database; `npm run lint` runs the Next.js linter.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Authenticated dashboard routes
│   ├── api/               # API routes
│   ├── login/             # Login page
│   └── register/          # Registration page
├── components/
│   ├── dashboard/          # Dashboard-specific (header, sidebar, command palette)
│   └── ui/                # Reusable UI components (button, input, card, etc.)
└── lib/
    └── utils.ts           # Utility functions (formatCurrency, formatDate, etc.)

prisma/
├── schema.prisma          # Database schema
└── seed.ts               # Demo data seeder
```

---

## Database Schema

### Core Entities

- **User** — authenticated user (the freelancer)
- **Client** — contacts and companies
- **Project** — work being done for a client
- **Task** — individual work items within a project
- **TimeEntry** — logged hours
- **Invoice** — billable documents sent to clients
- **Proposal** — pitches sent to win work
- **Contract** — agreed terms with a client
- **Payment** — money received
- **Lead** — prospective client
- **Expense** — money spent on the business
- **File** — uploaded documents
- **Message** — client communication
- **Automation** — workflow rules
- **Template** — reusable document templates

---

## API Routes

| Endpoint | Description |
|----------|-------------|
| `GET/POST /api/clients` | List or create clients |
| `GET/PUT/DELETE /api/clients/[id]` | Manage single client |
| `GET/POST /api/projects` | List or create projects |
| `GET/POST /api/tasks` | List or create tasks |
| `GET/POST /api/time` | Time entries |
| `GET/POST /api/invoices` | Invoice management |
| `GET/POST /api/proposals` | Proposal management |
| `GET/POST /api/payments` | Payment records |
| `GET/POST /api/leads` | Lead pipeline |
| `GET/POST /api/expenses` | Expense tracking |
| `GET/POST /api/files` | File uploads |
| `GET/POST /api/messages` | Client messages |
| `GET/POST /api/analytics` | Dashboard analytics |
| `GET/POST /api/activities` | Activity feed |
| `GET /api/notifications` | User notifications |
| `GET/PUT /api/users/me` | Current user profile |
| `GET/PUT /api/business` | Business settings |

---

## Environment Variables

```env
DATABASE_URL=              # SQLite: "file:./dev.db" or PostgreSQL URL
NEXTAUTH_SECRET=           # Random string for auth encryption
NEXTAUTH_URL=              # "http://localhost:3000"
```

---

## Customization

### Branding

Update these to match your business:

1. **Business name** — Settings → Business
2. **Logo** — `src/app/layout.tsx` (SVG icon in metadata)
3. **Theme colors** — `src/app/globals.css` (CSS custom properties)
4. **Default tax rate / currency** — Settings → Business

### Adding New Features

The component architecture makes it easy to extend:

```
src/components/ui/     → Add new base components here
src/app/(dashboard)/   → Add new pages here
prisma/schema.prisma   → Add new database models
```

---

## License

Proprietary — All rights reserved.

---

Built with Next.js, TypeScript, and Prisma.
