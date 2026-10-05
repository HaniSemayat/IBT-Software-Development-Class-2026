# Data Fetching Strategy

## SWR

Day 41 uses SWR for browser-driven data that benefits from caching, revalidation, and repeated fetching.

The shared fetcher is:

```js
fetcher(url)
```

It checks the HTTP response and returns JSON.

---

## Order Status

The order status query uses:

```js
useSWR(`/api/orders/${id}`, fetcher, {
  fallbackData: initial,
  refreshInterval: 5000,
})
```

### Query Key

```text
/api/orders/${id}
```

The order ID identifies the resource, so each order gets its own SWR cache entry.

### `fallbackData`

The order is first loaded by the Server Component.

SWR uses that server-rendered data immediately while it fetches the latest version in the browser.

### `refreshInterval`

The order status is refreshed every 5 seconds because its status can change.

---

## Menu Search

The menu query uses:

```js
useSWR(
  `/api/dishes?q=${encodeURIComponent(debouncedTerm)}&page=${page}`,
  fetcher,
  {
    keepPreviousData: true,
  }
)
```

### Query Key

The URL contains both:

* search term
* page number

Therefore, different searches and pages receive separate SWR cache entries.

Examples:

```text
/api/dishes?q=&page=1
/api/dishes?q=&page=2
/api/dishes?q=doro&page=1
```

### Debouncing

The search waits 300ms after typing stops before making a request.

This prevents a request from being sent for every individual keystroke.

### `keepPreviousData`

When moving between pages, the previous results remain visible while the new page is loading.

This prevents the UI from flashing empty content.

---

## Pagination

The API returns:

```json
{
  "dishes": [],
  "page": 1,
  "totalPages": 3
}
```

The client changes the `page` state and SWR requests the corresponding page.

Pagination is client-side, so the browser remains on:

```text
/menu
```

while the API request changes:

```text
/api/dishes?q=&page=1
/api/dishes?q=&page=2
/api/dishes?q=&page=3
```

---

## TanStack Query Comparison

TanStack Query uses options such as:

```js
staleTime
gcTime
```

This project uses SWR instead, so `staleTime` is not configured directly.

SWR provides caching and revalidation through options such as:

```text
refreshInterval
keepPreviousData
dedupingInterval
revalidateOnFocus
```

SWR was chosen because the client-side requirements for Addis Eats are mainly:

* order-status polling
* debounced menu search
* pagination

---

## Server vs Client Fetching

The project follows this rule:

> If the server can fetch the data, prefer a Server Component. If the browser needs repeated or interactive fetching, use SWR.

Therefore:

* **Order page** → Server Component provides initial data.
* **Order status** → SWR handles browser polling.
* **Menu search** → SWR handles debounced browser requests.
* **Pagination** → SWR handles changing pages.

---

## Query Key Summary

| Query            | Key                                  | Purpose                         |
| ---------------- | ------------------------------------ | ------------------------------- |
| Order status     | `/api/orders/${id}`                  | Fetch one order                 |
| Menu search/page | `/api/dishes?q=${term}&page=${page}` | Fetch filtered and paged dishes |

---

## Caching Decisions

### Order Status

`refreshInterval: 5000` is used because order status may change.

### Menu Results

`keepPreviousData: true` keeps the previous results visible while the next page loads.

### Search

A 300ms debounce reduces unnecessary requests while the user is typing.

### Initial Order Data

`fallbackData` allows the client to start with data already rendered by the server instead of showing a loading state first.

---

## Network Verification

The browser Network tab was used to verify SWR requests.

Expected requests include:

```text
GET /api/orders/1
GET /api/dishes?q=&page=1
GET /api/dishes?q=&page=2
GET /api/dishes?q=&page=3
```

Order polling requests repeat every 5 seconds.

Pagination requests change the `page` query parameter while the browser remains on `/menu`.
