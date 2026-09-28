# Addis Eats — Rendering Strategy

## Route Strategy

| Route              | Strategy                          | Reason                                                                                              |
| ------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------- |
| `/`                | Static                            | Landing content does not depend on request-specific data.                                           |
| `/menu`            | ISR — 1 hour                      | Menu data can become stale for a short period and does not need a request-time render.              |
| `/menu/[id]`       | Static via `generateStaticParams` | Dish IDs are known ahead of time, so known dish pages can be pre-rendered.                          |
| `/cart`            | Client Component                  | Cart quantities and the running ETB total are private to the current browser interaction.           |
| `/checkout`        | Dynamic                           | Checkout is explicitly configured for dynamic rendering because it is a request-specific operation. |
| `/api/dishes`      | Route Handler                     | Provides a public HTTP endpoint for menu data.                                                      |
| `/api/dishes/[id]` | Route Handler                     | Provides a public HTTP endpoint for one dish.                                                       |
| `/api/orders`      | Route Handler                     | Accepts external HTTP order submissions and validates them on the server.                           |

## Why Each Strategy?

### `/` — Static

The home page contains no request-specific data.

Next.js can prerender it during the production build.

### `/menu` — ISR

The menu uses:

```js
export const revalidate = 3600;
```

This allows the page to be regenerated after the one-hour revalidation period.

The menu data is fetched directly in the Server Component rather than calling the application's own API endpoint.

### `/menu/[id]` — Static

The dish detail page uses:

```js
export async function generateStaticParams() {
  return dishes.map((dish) => ({
    id: String(dish.id),
  }));
}
```

Known dish pages are therefore generated ahead of time.

Unknown dishes use `notFound()`.

### `/cart` — Client

The cart requires browser interaction:

* quantity changes
* adding/removing items
* calculating the running total

Therefore the cart page uses `"use client"` and React state.

The fact that the route appears as static in the production route table does not change the component boundary: the page contains Client Component behavior.

### `/checkout` — Dynamic

Checkout is a server-side mutation boundary.

The route is explicitly configured with:

```js
export const dynamic = "force-dynamic";
```

The form itself is a Client Component because it uses `useActionState`, while the page shell remains a Server Component.

## Data Movement

| Need                             | Approach                                  |
| -------------------------------- | ----------------------------------------- |
| Display menu in Server Component | Import server data directly               |
| Display one dish                 | Server Component + `generateStaticParams` |
| Interactive cart                 | Client Component state                    |
| Place order from checkout        | Server Action                             |
| Public menu API                  | Route Handler                             |
| External order submission        | Route Handler                             |
| Server validation                | `lib/schema.js`                           |
| Refresh after mutation           | `revalidatePath()`                        |

A Server Component does not call `/api/dishes` just to retrieve data from its own application. It imports the server-side data source directly.

## Server/Client Strategy

Server Components are the default.

Client Components are used only where browser-side interaction or React client state is required:

* `app/Providers.jsx`
* `app/menu/CategoryBar.jsx`
* `app/menu/FilterShell.jsx`
* `app/menu/MenuCounter.jsx`
* `app/menu/error.js`
* `app/checkout/CheckoutForm.jsx`
* `app/cart/page.js`

The root layout remains a Server Component.

## Loading and Error Boundaries

The menu contains:

```text
app/menu/loading.js
app/menu/error.js
```

`loading.js` provides a loading UI while menu content is being resolved.

`error.js` is a Client Component because Next.js error boundaries use the `reset()` function.

The root:

```text
app/not-found.js
```

provides the not-found UI.

## Production Verification

The project must be verified with:

```bash
npm run build
npm run start
```

The expected production route categories are:

```text
/             Static
/menu         Static with 1h revalidation
/menu/[id]    SSG
/cart         Client Component route
/checkout     Dynamic
/api/*        Route Handlers
```

## Summary

Day 40 deliberately uses different rendering strategies instead of forcing every page into the same model:

```text
Static
  ↓
ISR
  ↓
SSG
  ↓
Client Component
  ↓
Dynamic Server Rendering
  ↓
Route Handlers
  ↓
Server Actions
```

The strategy is chosen according to the data and interaction requirements of each route.
