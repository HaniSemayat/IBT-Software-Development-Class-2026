# Addis Eats — Rendering Strategy

| Route | Strategy | Why |
|---|---|---|
| `/` | Static | The homepage content does not depend on each request. |
| `/menu` | ISR (1 hour) | Dishes change occasionally, so the page can be regenerated hourly. |
| `/menu/[id]` | Static via `generateStaticParams` | Dish IDs are known at build time, so dish pages can be prebuilt. |
| `/cart` | Client | Cart state is personal and belongs in the browser. |
| `/checkout` | Dynamic | The page reads the `session` cookie, which is request-specific. |
| `/orders/[id]` | Dynamic | An order belongs to a specific user and is request-specific. |

## Rendering Concepts Used

### Static
Pages are generated ahead of time and served as static content.

### ISR
The menu uses:

```js
export const revalidate = 3600;
```
This allows the static menu to be regenerated after the one-hour revalidation period.

### Dynamic Rendering

Checkout is forced to dynamic rendering because it reads a request cookie:
```js
const cookieStore = await cookies();
```

### generateStaticParams

Dish pages use generateStaticParams() to prebuild the known dish routes.

### Streaming

The menu page uses React Suspense so the category sidebar can render while the dish list is loading.