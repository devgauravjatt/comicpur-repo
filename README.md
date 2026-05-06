# Comicpur Monorepo

A full-stack monorepo for Comicpur, featuring a high-performance backend and a mobile-first frontend.

## 🚀 Project Overview

Comicpur is a platform for comics, built with a focus on speed, mobile experience, and modern developer experience. It uses a monorepo structure managed by **pnpm workspaces**.

## 🏗️ Project Structure

- **`apps/web`**: The frontend application built with **Next.js 16 (experimental)**, **Tailwind CSS 4**, and **Shadcn UI**.
- **`apps/api`**: The backend API built with **Hono**, **Drizzle ORM**, and **Neon (PostgreSQL)**.

## 🛠️ Tech Stack

### Frontend (`apps/web`)

- **Framework**: Next.js 16 (Experimental)
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI (Radix UI)
- **State Management**: Zustand
- **Icons**: Lucide React & React Icons
- **Formatting/Linting**: Oxc (oxfmt, oxlint)

### Backend (`apps/api`)

- **Framework**: Hono
- **ORM**: Drizzle ORM
- **Database**: Neon (PostgreSQL)
- **Validation**: Zod
- **Building**: tsdown
- **Formatting/Linting**: Biome

### Tooling

- **Package Manager**: pnpm
- **Git Hooks**: Husky & lint-staged
- **Types**: TypeScript

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18)
- [pnpm](https://pnpm.io/) (>= 10)

### Installation

```bash
pnpm install
```

### Development

Run both the API and Web apps in development mode:

```bash
pnpm dev
```

### Build

Build all applications:

```bash
pnpm build
```

## 📱 Development Guidelines

### Mobile-First Priority

As specified in [AGENTS.md](apps/web/AGENTS.md), the primary target for Comicpur is mobile users. Always design and implement UI components with a mobile-first approach.

### Framework Behavior

The project uses an experimental version of Next.js. Avoid assuming default behaviors and always verify framework implementation against the project's specific setup.

### Linting and Formatting

- **API**: Uses [Biome](https://biomejs.dev/) for linting and formatting.
- **Web**: Uses [Oxc](https://oxc.rs/) for extremely fast linting and formatting.

To format the entire project:

```bash
pnpm format
```

## 🔐 Environment Variables

Both `apps/api` and `apps/web` require environment variables. Refer to the respective `example.env` files in each directory:

- `apps/api/example.env`
- `apps/web/example.env`

---

Built with ❤️ for Comicpur.
