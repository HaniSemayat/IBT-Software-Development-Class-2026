## Day 38 — Server & Client Components

### Component Boundaries

Day 38 moves client-side behavior to the smallest components that need it.

- `app/layout.js` — Server Component
- `app/Providers.jsx` — Client Component
- `app/menu/layout.js` — Server Component
- `app/menu/MenuCounter.jsx` — Client Component
- `app/menu/page.js` — Server Component
- `app/menu/CategoryBar.jsx` — Client Component
- `app/menu/FilterShell.jsx` — Client Component
- `app/menu/DishList.jsx` — Server Component
- `app/menu/error.js` — Client Component
- `app/menu/loading.js` — Server Component
- `app/menu/[id]/page.js` — Server Component
- `app/cart/page.js` — Server Component
- `app/checkout/page.js` — Dynamic Server Component

### Server / Client Rules

- Server Components are the default in the App Router.
- `"use client"` is used only where state, event handlers, or client behavior is required.
- `DishList` stays on the server because it only renders server-provided data.
- `MenuCounter` and `CategoryBar` use client-side state and event handlers.
- `FilterShell` demonstrates a Client Component receiving Server-rendered content through `children`.
- `Providers` creates a client boundary while `app/layout.js` remains a Server Component.
- No callback functions are passed from Server Components to Client Components.

### Rendering Strategies

| Route | Strategy | Reason |
|---|---|---|
| `/` | Static | Content does not depend on a request. |
| `/menu` | ISR | Menu data can be revalidated every hour. |
| `/menu/[id]` | Static / SSG | `generateStaticParams` prebuilds each dish route. |
| `/cart` | Server | No client-only behavior is required. |
| `/checkout` | Dynamic | The route reads request cookies. |

### Bundle Evidence

Next.js 16.3.6 with Turbopack did not display the legacy per-route `First Load JS` table during `next build`, so generated JavaScript chunks were measured instead.

| Build | JS Chunks | Total Generated JS |
|---|---:|---:|
| Day 38 baseline | 12 | 600,108 bytes |
| Day 38 final | 12 | 600,108 bytes |

The total generated chunk size remained the same. The purpose of the exercise was to move the `"use client"` boundary down to the smallest interactive components and keep server-rendered content on the server, rather than to guarantee a reduction in total generated JavaScript.

### Final Build Output

```text
Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ƒ /checkout
├ ○ /menu                      1h      1y
  ├ ● /menu/1
  ├ ● /menu/2
  ├ ● /menu/3
  └ ● [+6 more paths]

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand