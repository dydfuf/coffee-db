# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coffee DB is a Korean-language Next.js 15 web application for browsing and managing coffee bean information. It uses Supabase (PostgreSQL) for data/auth, OpenAI for AI-powered data extraction, and Cloudflare Images for image hosting.

## Commands

```bash
pnpm dev          # Start dev server with Turbopack (http://localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint (next/core-web-vitals + next/typescript)
pnpm type-gen     # Regenerate Supabase database types into database-generated.types.ts
```

No test framework is configured. There are no automated tests.

## Architecture

**Framework**: Next.js 15 App Router with React 19, TypeScript strict mode, Tailwind CSS, shadcn/ui components.

**Routing structure** (`app/`):

- `/coffee/list` — Coffee listing with filtering (nation, flavor notes)
- `/coffee/[id]` — Coffee detail page
- `/login` — Auth via Supabase (server actions in `actions.ts`)
- `/admin` — Admin dashboard, `/admin/crawler` — LLM web crawler UI
- `/api/chat` — AI data extraction endpoint (OpenAI `gpt-4o-mini` + `generateObject`)
- `/api/crawl` — LLM web crawler endpoint (fetches HTML, extracts coffee data via OpenAI)
- `/auth/confirm` — Email OTP verification

**Data flow**: Server components fetch directly from Supabase via `utils/api.ts`, pass data as props to client components. Client-side filter state is managed through URL search params (`useCoffeeFilters` hook).

**Database types**: Generated via `pnpm type-gen` into `database-generated.types.ts`, then merged/extended in `database.types.ts` using type-fest's `MergeDeep`. The main table is `coffee-info`.

**Middleware** (`middleware.ts`):

- Admin routes (`/admin/*`, `/api/crawl`) are protected by cookie-based access control (`ADMIN_COOKIE` / `ADMIN_COOKIE_VALUE` env vars)
- Other matched routes go through Supabase session validation (`utils/supabase/middleware.ts`), redirecting unauthenticated users to `/login`
- Matcher covers: `/coffee/suggestion`, `/api/:path*`, `/admin`, `/admin/:path*`

**Supabase client creation**:

- Server: `utils/supabase/server.ts` — async `createClient()` using `@supabase/ssr` with cookie handling
- Browser: `utils/supabase/client.ts` — `createBrowserClient()`
- Important: never add logic between `createServerClient()` and `supabase.auth.getUser()` in middleware

**Validation**: Zod schemas in `schema/` — `coffeeSchema` for database records, `coffeeCrawlSchema` for crawler extraction.

**Korean language support**: Uses `es-hangul` for Korean text decomposition and chosung (initial consonant) search in the command palette (`CommandMenu.tsx`). Coffee flavor notes have Korean/English mappings in `constants/coffee.ts`.

## Key Conventions

- Package manager is **pnpm**
- Path alias: `@/*` maps to the project root
- Server components by default; `"use client"` only when needed
- UI components live in `components/ui/` (shadcn/ui primitives); page-specific components in `app/*/_component/`
- API routes use Vercel AI SDK's `generateObject` with Zod schemas for structured AI output
- Dark mode via `next-themes` (class-based)
