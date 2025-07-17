# artloupe

AI-powered photo and artwork critique with dynamic layouts, color analysis, and template saving.

## Features

* AI-based image critique (cropping, color suggestions)
* Color treemaps + object detection
* Save/load/share page layouts and templates
* Drag & drop dynamic editor
* React + Next.js + Supabase + Hugging Face integration

## Getting Started

```bash
pnpm install
pnpm dev
```

## Architectural Principles

This project prioritizes a clean and scalable architecture to support rapid iteration *and* long-term maintainability. Key principles:

* **Separation of concerns**: We use dedicated packages for API route handlers, fetchers, and React Query hooks.
* **Monorepo structure**: Code is modular and shared across apps (`main`, `admin`, etc.) via internal packages.
* **Client/server boundaries**: External API calls and secret usage are isolated to server-only code.
* **React Query**: Centralized data fetching is abstracted into reusable hooks.
* **Composition over coupling**: Presentation components receive data via wrapper/provider components.

## Packages

* `api-handlers/`: Server-only route logic
* `api-fetchers/`: Shared fetch functions used by apps and hooks
* `react-query-hooks/`: React Query wrappers around fetchers
* `shared-types/`: TypeScript types used across all layers

## ADR Index

| ADR # | Topic                                        |
| ----- | -------------------------------------------- |
| 0001  | Use Next.js App Router over Pages Router     |
| 0002  | Use Supabase for storage/auth - TBD          |
| 0003  | Use Hugging Face for image analysis          |
| 0004  | Use React 19 (canary) instead of React 18    |
| 0005  | Replace CSS masonry with `react-masonry-css` |
| 0006  | Use localStorage for layout persistence MVP  |
