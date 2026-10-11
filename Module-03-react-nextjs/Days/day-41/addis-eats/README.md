# Day 41 — Data Fetching with SWR

## Addis Eats — Next.js

Day 41 builds on the Addis Eats Next.js application from Day 40 by introducing **SWR for browser-driven data fetching**.

The focus is on knowing when to keep data fetching on the server and when a client-side data-fetching library provides a better experience through caching, revalidation, polling, debouncing, and pagination.

---

## What We Built

Day 41 adds:

* SWR
* Shared fetcher
* Server-rendered initial order data
* Client-side order status updates
* Automatic order-status polling
* Debounced menu search
* Paginated dish results
* `keepPreviousData`
* SWR caching and revalidation
* Network-tab verification
* Data-fetching documentation

---

# Why SWR?

A simple `useEffect` + `fetch` implementation can work, but it does not provide features such as:

* caching
* request deduplication
* revalidation
* shared request state
* polling
* stale-while-revalidate behavior

SWR provides these features while keeping the data-fetching API simple.

---

# Shared Fetcher

The project uses a shared fetcher:

```text
lib/fetcher.js
```

```js
export default async function fetcher(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}
```

All SWR requests use this fetcher.

---

# Order Status

## Server-Rendered Initial Data

The order page first loads the order on the server:

```text
app/orders/[id]/page.js
```

The Server Component gets the order and passes it to the client:

```text
Server Component
       ↓
getOrder()
       ↓
OrderStatus
```

This gives the page useful data immediately.

---

## SWR Order Status

The client component is:

```text
app/orders/[id]/OrderStatus.jsx
```

It uses:

```js
useSWR(`/api/orders/${id}`, fetcher, {
  fallbackData: initial,
  refreshInterval: 5000,
})
```

### `fallbackData`

The server-rendered order is used as the initial SWR data.

The user does not have to wait for the first browser request before seeing the order.

### `refreshInterval`

The order is automatically checked every 5 seconds.

This allows the UI to detect status changes without manually refreshing the page.

---

# Order API

Day 41 adds:

```text
GET /api/orders/[id]
```

Example:

```text
GET /api/orders/1
```

Successful response:

```text
200 OK
```

Unknown order:

```text
404 Not Found
```

Example error:

```json
{
  "error": "Order not found"
}
```

---

# Menu Search

The menu now supports browser-driven search using SWR.

The search component is:

```text
app/menu/SearchBox.jsx
```

The API supports a search query:

```text
GET /api/dishes?q=doro
```

The search waits **300ms after typing stops** before making a request.

This prevents unnecessary requests for every individual keystroke.

Example:

```text
User types:

d → do → dor → doro

        ↓
   wait 300ms

        ↓
GET /api/dishes?q=doro
```

---

# Pagination

The menu API also supports pagination.

Each request contains a page number:

```text
/api/dishes?q=&page=1
/api/dishes?q=&page=2
/api/dishes?q=&page=3
```

The API returns:

```json
{
  "dishes": [],
  "page": 1,
  "totalPages": 3
}
```

The menu displays three dishes per page.

Pagination is handled by client state, so the browser remains on:

```text
/menu
```

while SWR requests different API pages.

---

# `keepPreviousData`

SWR uses:

```js
keepPreviousData: true
```

When the user changes pages, the previous results remain visible while the next page is loading.

This prevents the interface from briefly becoming empty between pages.

---

# Query Keys

SWR identifies cached data using its request key.

## Order

```text
/api/orders/${id}
```

The order ID identifies the specific order.

For example:

```text
/api/orders/1
/api/orders/2
```

represent different cached resources.

## Menu

```text
/api/dishes?q=${term}&page=${page}
```

The search term and page are both part of the key.

Examples:

```text
/api/dishes?q=&page=1
/api/dishes?q=&page=2
/api/dishes?q=doro&page=1
```

Therefore, different searches and pages receive separate SWR cache entries.

---

# Server vs Client Data Fetching

The project follows this rule:

> If the server can fetch the data, prefer a Server Component. If the browser needs repeated or interactive fetching, use SWR.

### Server

Used for:

* initial order data
* normal server-rendered page data
* data that does not require browser interaction

### Client + SWR

Used for:

* order-status polling
* debounced search
* pagination
* browser-driven updates

---

# SWR vs TanStack Query

TanStack Query provides concepts such as:

```text
staleTime
gcTime
queryKey
queryFn
```

This project uses SWR instead.

SWR provides caching and revalidation through options such as:

```text
refreshInterval
keepPreviousData
dedupingInterval
revalidateOnFocus
```

For this project, SWR was chosen because the client-side requirements are relatively focused:

* polling
* search
* pagination

---

# Network Verification

The browser Network tab was used to verify the requests.

### Order polling

```text
GET /api/orders/1
GET /api/orders/1
GET /api/orders/1
...
```

The requests repeat approximately every 5 seconds.

### Pagination

```text
GET /api/dishes?q=&page=1
GET /api/dishes?q=&page=2
GET /api/dishes?q=&page=3
```

The browser remains on:

```text
/menu
```

while the API page changes.

### Search

Example:

```text
GET /api/dishes?q=doro&page=1
```

---

# Project Structure

```text
addis-eats/
├── app/
│   ├── api/
│   │   ├── dishes/
│   │   │   ├── [id]/
│   │   │   │   └── route.js
│   │   │   └── route.js
│   │   └── orders/
│   │       ├── [id]/
│   │       │   └── route.js
│   │       └── route.js
│   │
│   ├── orders/
│   │   └── [id]/
│   │       ├── OrderStatus.jsx
│   │       └── page.js
│   │
│   ├── menu/
│   │   ├── [id]/
│   │   │   └── page.js
│   │   ├── CategoryBar.jsx
│   │   ├── SearchBox.jsx
│   │   ├── DishList.jsx
│   │   ├── FilterShell.jsx
│   │   ├── MenuCounter.jsx
│   │   ├── error.js
│   │   ├── layout.js
│   │   ├── loading.js
│   │   └── page.js
│   │
│   ├── cart/
│   │   └── page.js
│   ├── checkout/
│   │   ├── CheckoutForm.jsx
│   │   └── page.js
│   │
│   ├── actions.js
│   ├── not-found.js
│   ├── page.js
│   ├── layout.js
│   └── Providers.jsx
│
├── lib/
│   ├── dishes.js
│   ├── fetcher.js
│   ├── orders.js
│   └── schema.js
│
├── BOUNDARY.md
├── DATA.md
├── STRATEGY.md
└── README.md
```

---

# Production Verification

The project was verified with:

```bash
npm run build
```

The production build completed successfully.

---

# Day 41 Verification Checklist

* [x] Install SWR
* [x] Create shared SWR fetcher
* [x] Add order lookup API
* [x] Server-render initial order data
* [x] Use `fallbackData`
* [x] Add order-status polling
* [x] Verify polling in Network tab
* [x] Add debounced menu search
* [x] Add paginated dish API
* [x] Add client-side pagination
* [x] Use `keepPreviousData`
* [x] Verify pagination requests
* [x] Document query keys and caching decisions
* [x] Compare SWR with TanStack Query
* [x] Production build passes

---

# Key Lesson

The main lesson from Day 41 is not simply how to use SWR.

It is learning to choose **where data fetching belongs**.

```text
Can the server fetch it?
        │
       Yes
        ↓
Server Component

Does the browser need
repeated or interactive data?
        │
       Yes
        ↓
Client Component + SWR
```

The goal is not to put SWR everywhere.

The goal is to use client-side data fetching when the browser actually benefits from it.