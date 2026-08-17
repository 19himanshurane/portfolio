# Himanshu Rane — Portfolio

Source for [the live site](https://19himanshurane.github.io/portfolio/), a personal portfolio built with React and Vite. Covers projects, professional experience, education, and contact details, with full English/German localization.

## Stack

- **React 19** + **React Router 7** — component structure, client-side routing
- **Vite** — dev server and build
- **Framer Motion** — page/section animations
- **Lenis** — smooth scrolling
- **Oxlint** — linting

No CSS framework — styling is hand-written per component/page (`*.css` files colocated with their `.jsx`).

## Project structure

```
src/
  components/   Reusable UI (Navbar, Footer, ProjectCard, icons, illustrations, ...)
  pages/        Route-level views (Home, Projects, About, Contact, Blog, BlogPost)
  data/         Site content (content.js — EN/DE copy, projects, experience) and blog posts
  context/      LanguageContext (EN/DE toggle)
  lib/          Third-party integration glue (Lenis)
  utils/        Small helpers (asset path resolution for GitHub Pages base path)
public/         Static assets served as-is (résumé PDF, headshot, favicon)
```

Site content — project descriptions, experience, education, skills — lives in `src/data/content.js` as plain JS objects with `en`/`de` keys, rather than hardcoded in JSX.

## Getting started

```bash
npm install
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm run lint       # run Oxlint
```

## Deployment

Pushes to `main` trigger `.github/workflows/*.yml`, which builds the site and publishes `dist/` to GitHub Pages via `peaceiris/actions-gh-pages`. The Vite `base` path is set to `/portfolio/` for production builds (see `vite.config.js`).
