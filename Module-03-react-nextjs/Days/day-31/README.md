# Addis Eats - Week 1 React Project

Addis Eats is a React food ordering application built throughout Week 1 of my Software Development training.

The project brings together the React concepts learned from Days 26–31: components, props, state, events, data fetching, Context, reducers, custom hooks, memoization, routing, query parameters, dynamic routes, and protected routes.

## Features

* Reusable React components
* Props and PropTypes
* Category filtering
* Shareable category filters using URL query parameters
* Menu loading from a local JSON data source
* Loading and error states
* Empty category state
* AbortController request cancellation
* Dynamic dish detail pages
* Add dishes to cart
* Remove dishes from cart
* Clear cart
* Shared cart state using Context
* Cart reducer for add, remove, and clear actions
* Cart item count in the header
* Cart preserved while navigating between routes
* Protected checkout page
* Login authentication flow
* Redirect back to the requested page after signing in
* Authentication preserved across browser refreshes using localStorage
* 404 not-found page
* Active navigation highlighting with NavLink
* Controlled delivery form
* Ethiopian TeleBirr phone number validation
* Memoised Context provider value
* Memoised filtered dish list
* Responsive layout

## Routes

| Path        | Screen      | Purpose                            |
| ----------- | ----------- | ---------------------------------- |
| `/`         | Home        | Landing page with today's specials |
| `/menu`     | Menu        | Full menu with category filtering  |
| `/menu/:id` | Dish Detail | Individual dish information        |
| `/cart`     | Cart        | Current order and total in ETB     |
| `/checkout` | Checkout    | Protected order page               |
| `/login`    | Login       | Sign-in screen                     |
| `*`         | Not Found   | Handles unknown routes             |

## Routing

Day 31 introduced React Router and split the application into multiple screens.

The application uses:

* `BrowserRouter`
* Nested routes
* `Route`
* `Link`
* `NavLink`
* `Outlet`
* `useParams`
* `useSearchParams`
* `Navigate`
* `useLocation`
* `useNavigate`

The main layout remains mounted while the content inside the `Outlet` changes between routes.

## Category Query Parameters

The menu category is stored in the URL using a query parameter.

For example:

```text
/menu?category=Ethiopian
```

This makes filtered menu pages shareable and allows the selected category to remain in the URL.

## Dynamic Dish Routes

Each dish has its own dynamic route:

```text
/menu/:id
```

For example:

```text
/menu/1
```

`DishDetail.jsx` uses `useParams()` to read the dish ID and display the matching dish.

If the ID does not exist, the application displays a "Dish not found" message.

## Cart Context

The cart is managed using React Context and a reducer.

```text
cart/
├── CartContext.jsx
├── CartProvider.jsx
└── cartReducer.js
```

The cart reducer handles:

* `add`
* `remove`
* `clear`

The `CartProvider` is mounted above the router so the cart remains available while navigating between routes.

## Authentication

The checkout route is protected using `RequireAuth`.

If a user who is not signed in tries to access:

```text
/checkout
```

they are redirected to:

```text
/login
```

The original destination is remembered, so after signing in the user is returned to the requested page.

Authentication is stored in `localStorage`, allowing the signed-in state to remain after refreshing the browser.

## Custom Hook

`useFetch` contains reusable data-fetching logic and provides:

* `data`
* `loading`
* `error`

It also uses `AbortController` to cancel requests when necessary.

## Memoization

`useMemo` is used to:

* Memoise the Context provider value
* Memoise the filtered dish list

## Project Structure

```text
src/
├── App.jsx
├── Layout.jsx
├── Home.jsx
├── Menu.jsx
├── DishDetail.jsx
├── Cart.jsx
├── Checkout.jsx
├── Login.jsx
├── NotFound.jsx
├── CartBadge.jsx
├── CategoryBar.jsx
├── Dish.jsx
├── DishList.jsx
├── Card.jsx
├── OrderForm.jsx
├── index.css
├── main.jsx
│
├── auth/
│   ├── AuthContext.jsx
│   └── RequireAuth.jsx
│
├── cart/
│   ├── CartContext.jsx
│   ├── CartProvider.jsx
│   └── cartReducer.js
│
└── hooks/
    └── useFetch.js

public/
└── dishes.json
```

## Technologies

* React
* React Router
* JavaScript
* HTML
* CSS
* Vite
* Git
* GitHub

## Week 1 Summary

* Day 26 — React components
* Day 27 — Props and reusable components
* Day 28 — State, events, and controlled forms
* Day 29 — Data fetching, loading/error states, request cancellation, and refs
* Day 30 — Custom hooks, Context, reducers, and memoization
* Day 31 — React Router, nested routes, dynamic routes, query parameters, navigation, authentication guards, and protected screens
