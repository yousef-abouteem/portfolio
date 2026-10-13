# Yousef Abouteem — Portfolio

![Preview](https://yousef-abouteem.vercel.app/en/opengraph-image)

A multilingual personal portfolio (English, Arabic, Turkish) with a custom admin dashboard for managing all content — built with Next.js, Prisma and PostgreSQL.

**Live:** https://yousef-abouteem.vercel.app

## Features

- 🌍 Three languages (EN / AR / TR) with full right-to-left support for Arabic
- 🌓 Dark and light themes that follow the system preference
- 🔐 Admin dashboard protected with GitHub OAuth, restricted to a single admin account
- 📝 Manage projects, profile, skills and experience — every text field in three languages
- 🖼️ Image uploads sent directly from the browser to Vercel Blob
- ✅ Server-side validation with Zod on every write
- 🔎 Localized SEO metadata, hreflang alternates and generated Open Graph images

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript |
| Styling | Tailwind CSS v4, next-themes |
| Internationalization | next-intl |
| Database | PostgreSQL on Neon, Prisma ORM 7 |
| Authentication | Better Auth with GitHub OAuth |
| File storage | Vercel Blob |
| Validation | Zod |
| Hosting | Vercel |

## Architecture highlights

- **Translations in the database.** Each content model has a translation table with a unique `(id, locale)` pair, so content in a new language needs no schema change.
- **Server-side authorization.** Every Server Action calls `requireAdmin()` before touching data, and a database hook rejects sign-ups from any email other than the admin's.
- **Direct-to-storage uploads.** The server only issues short-lived upload tokens after verifying the admin session, so files never pass through the serverless function.
- **One layout for LTR and RTL.** Components use logical CSS properties (`ms-`, `ps-`, `start-`), so the same markup works in every language direction.

## Getting started

```bash
git clone https://github.com/yousef-abouteem/portfolio.git
cd portfolio
npm install
cp .env.example .env   # then fill in the values
npx prisma migrate dev
npx prisma db seed
npx tsx prisma/seed-about.ts
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/
    [locale]/      Public site (EN / AR / TR)
    admin/         Admin dashboard
    api/           Auth and upload routes
  components/      UI components
  i18n/            next-intl routing and configuration
  lib/             Prisma client, auth and validation schemas
messages/          UI translations
prisma/            Schema, migrations and seed scripts
```

## Author

**Yousef Abouteem** — Software Engineer & Frontend Developer
[LinkedIn](https://www.linkedin.com/in/yousefabouteem/) · [Email](mailto:yousefabouteem@gmail.com)
