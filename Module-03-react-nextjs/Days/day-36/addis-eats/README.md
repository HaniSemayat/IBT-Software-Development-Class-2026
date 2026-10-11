# Addis Eats — Next.js

This project is the Next.js version of the Addis Eats application built during Day 36 of the IBT CodeOps Advanced Digital Skills Training Program.

The main focus of this exercise is learning the Next.js App Router, file-based routing, dynamic routes, navigation, loading states, error boundaries, and not-found handling.

## Routes

| URL          | File                    | Purpose              |
| ------------ | ----------------------- | -------------------- |
| `/`          | `app/page.js`           | Home page            |
| `/menu`      | `app/menu/page.js`      | Menu page            |
| `/menu/[id]` | `app/menu/[id]/page.js` | Individual dish page |
| `/cart`      | `app/cart/page.js`      | Cart page            |
| `/checkout`  | `app/checkout/page.js`  | Checkout page        |

## Next.js Special Files

| File                  | Purpose                              |
| --------------------- | ------------------------------------ |
| `app/menu/loading.js` | Loading UI while the menu is loading |
| `app/menu/error.js`   | Error boundary for the menu route    |
| `app/not-found.js`    | Custom 404 page                      |

## Menu Components

The menu components are colocated inside `app/menu/`:

* `DishList.jsx` — displays the available dishes
* `CategoryBar.jsx` — displays the menu categories

These files do not create routes because only `page.js` files create publicly reachable routes in the App Router.

## Navigation

The project uses:

* `next/link` for normal navigation
* `useRouter` from `next/navigation` for programmatic navigation

## Dynamic Route

The route:

```text
/menu/[id]
```

uses the `id` value from the URL to find a dish.

For example:

```text
/menu/1
```

displays Doro Wot.

If a dish does not exist, `notFound()` displays the custom 404 page.

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

The project can be checked with:

```bash
npm run build
```

The production build successfully generates the required App Router routes.
