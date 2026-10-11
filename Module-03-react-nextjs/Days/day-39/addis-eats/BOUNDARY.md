# Day 38 — Component Boundaries

## Component Boundary Map

| Component | Side | Why |
|---|---|---|
| `app/layout.js` | Server | Root layout renders the application shell and can remain server-rendered. |
| `app/Providers.jsx` | Client | Defines the client-side provider boundary for future shared client state. |
| `app/page.js` | Server | Static home page with no browser-only behavior. |
| `app/cart/page.js` | Server | Displays cart content without client-side interaction. |
| `app/checkout/page.js` | Server | Reads request cookies, so the route is dynamically rendered on the server. |
| `app/not-found.js` | Server | Renders the not-found UI without browser interaction. |
| `app/menu/layout.js` | Server | Provides the menu layout and navigation; interactive counter was moved into a separate client component. |
| `app/menu/MenuCounter.jsx` | Client | Uses `useState` and `onClick` for the counter. |
| `app/menu/page.js` | Server | Loads menu data on the server and composes the menu UI. |
| `app/menu/CategoryBar.jsx` | Client | Uses `useState` and `onClick` for the selected category. |
| `app/menu/FilterShell.jsx` | Client | Uses `useState` and `onClick` to show or hide its children. |
| `app/menu/DishList.jsx` | Server | Renders dish data and does not require browser APIs, state, or event handlers. |
| `app/menu/loading.js` | Server | Provides the menu loading UI. |
| `app/menu/error.js` | Client | Next.js error boundaries require client-side behavior and the `reset()` action. |
| `app/menu/[id]/page.js` | Server | Renders individual dishes and uses server-side route generation. |

## Boundary Rules Used

- Components are Server Components by default.
- `"use client"` is used only where browser interaction or client-side state is required.
- Client Components receive Server-rendered content through `children` where appropriate.
- Server Components do not pass callback functions to Client Components.
- `DishList` remains on the server because it only renders data.
- `MenuCounter`, `CategoryBar`, and `FilterShell` contain the interactive client behavior.
- `app/layout.js` remains a Server Component while rendering the client `Providers` boundary.

## Client Components

The project currently contains five `"use client"` entry points:

1. `app/Providers.jsx`
2. `app/menu/CategoryBar.jsx`
3. `app/menu/FilterShell.jsx`
4. `app/menu/MenuCounter.jsx`
5. `app/menu/error.js`

Each boundary has a specific client-side responsibility.
