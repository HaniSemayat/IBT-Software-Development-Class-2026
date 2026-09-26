# Day 37 — Addis Eats

## Module 3: React & Next.js

This project continues the Addis Eats application from Day 36 and focuses on Next.js App Router layouts, rendering strategies, and streaming.

## What I Learned

- Root layouts
- Nested layouts
- Persistent layout state
- Static rendering
- Incremental Static Regeneration (ISR)
- Dynamic rendering
- `generateStaticParams`
- React `Suspense`
- Streaming
- Rendering strategy documentation

## Project Structure

```text
app/
├── layout.js
├── page.js
├── not-found.js
├── cart/
│   └── page.js
├── checkout/
│   └── page.js
└── menu/
    ├── layout.js
    ├── page.js
    ├── loading.js
    ├── error.js
    ├── CategoryBar.jsx
    ├── DishList.jsx
    └── [id]/
        └── page.js
```

## Layouts

The root app/layout.js provides the shared header and footer for the application.

The menu route has its own nested layout containing the category sidebar. A counter in the menu layout demonstrates that layout state survives navigation between /menu and /menu/[id].

## Rendering Strategies
- / — Static
- /menu — ISR with a 1-hour revalidation period
- /menu/[id] — Static pages generated with generateStaticParams
- /cart — Client-side state
- /checkout — Dynamic rendering because it reads the session cookie

See STRATEGY.md for the full route strategy.

## Streaming

The menu uses React Suspense to stream the dish list separately from the category sidebar.

This allows the sidebar to render while the dish list is loading.

## Running the Project

Install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```

Build the production application:
```bash
npm run build
```
## Build Output

The final npm run build output is included below.
```text
  Collecting page data using 3 workers in 8.✓ Collecting page data using 3 workers in 8.0s
✓ Generating static pages using 3 workers (15/15) in 2.0s
✓ Finalizing page optimization in 44ms

Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ƒ /checkout
├ ○ /menu                      1h      1y
└   /menu/[id]
  ├ ● /menu/1
  ├ ● /menu/2
  ├ ● /menu/3
  └ ● [+6 more paths]


○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

## Day 37 Requirements Completed
 - Root layout with HTML/body,
 - header and footer
 - Nested menu layout
 - Persistent menu layout state
 - Menu ISR with 1-hour revalidation
 - generateStaticParams
 - Dynamic checkout using cookies()
 - Suspense streaming
 - Rendering strategy documentation
