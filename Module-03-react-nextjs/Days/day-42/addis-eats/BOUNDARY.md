# Server / Client Boundary

## Why this file exists

Day 42 adds authentication and authorization to Addis Eats.

The important idea is that **not everything should run in the browser**.

Server Components handle server-side work by default. Client Components are only used when the browser needs interaction, state, or event handlers.

For authentication, there is another important rule:

> A Client Component can start an action, but it must never be trusted to decide whether that action is allowed.

The server checks the session and permissions again.

---

## Server Components

Most of the application remains Server Components.

Examples include:

```text
app/page.js
app/layout.js
app/menu/page.js
app/menu/[id]/page.js
app/checkout/page.js
app/orders/page.js
app/orders/[id]/page.js
app/kitchen/page.js
app/signin/page.js
app/UserMenu.jsx
```

These components can safely use server-only functions such as:

```js
getSession()
```

They can also read server-side data directly without exposing that data or the session logic to the browser.

---

## Client Components

Client Components are used when the browser needs interaction or client-side state.

Current examples include:

```text
app/Providers.jsx
app/menu/CategoryBar.jsx
app/menu/FilterShell.jsx
app/menu/MenuCounter.jsx
app/menu/error.js
app/cart/page.js
app/checkout/CheckoutForm.jsx
app/orders/[id]/OrderStatus.js
app/signin/SignInForm.jsx
```

These components handle things such as:

* button clicks
* form interaction
* React state
* loading and pending states
* cart updates
* browser-side UI behavior

The `"use client"` directive is only added where it is actually needed.

---

## Server-Only Authentication Code

Authentication logic stays on the server.

Important server-side files include:

```text
lib/session.js
lib/users.js
lib/orders.js
app/actions.js
app/api/orders/route.js
app/api/orders/[id]/route.js
proxy.js
```

The session helper reads the `httpOnly` session cookie.

The browser cannot read that cookie with JavaScript.

The server uses the session to determine:

```text
Who is signed in?
What is their user ID?
What is their role?
```

---

## The Security Boundary

The Client Component is **not** the security boundary.

For example, a client could try to call an action without going through the normal UI.

That is why `cancelOrder()` does this on the server:

```text
1. Get the current session.
2. Reject the request if there is no session.
3. Find the requested order for that user.
4. Reject the request if the order does not belong to that user.
5. Only then perform the cancellation.
```

The same idea is used by the order API.

A user cannot become another user simply by changing an order ID in a request.

---

## Three Layers of Protection

Day 42 uses three different layers.

### 1. Proxy

`proxy.js` provides a fast redirect for protected routes.

Current matcher:

```js
export const config = {
  matcher: ["/checkout", "/orders/:path*"],
};
```

The proxy checks whether a session cookie exists.

If there is no session, the user is sent to:

```text
/signin?next=...
```

The proxy is useful for navigation, but it is **not the real security boundary**.

---

### 2. Page-Level Protection

Protected pages also check the session themselves.

For example:

```js
const session = await getSession();

if (!session) {
  redirect("/signin");
}
```

This means the page does not depend entirely on the proxy.

The staff kitchen also checks the user's role:

```js
if (session.role !== "staff") {
  // deny access
}
```

---

### 3. Server Action / Route Handler Protection

The final security check happens where the data is changed or returned.

For example:

```text
Server Action
    ↓
getSession()
    ↓
verify user
    ↓
verify ownership
    ↓
perform action
```

And for the API:

```text
Route Handler
    ↓
getSession()
    ↓
verify user
    ↓
verify ownership
    ↓
return data
```

This is the most important layer because it protects the actual operation.

---

## Authentication vs Authorization

These are different jobs.

### Authentication

Authentication answers:

> Who are you?

Addis Eats uses the session to identify the signed-in user.

### Authorization

Authorization answers:

> Are you allowed to do this?

For example:

```text
Customer → can access their own orders
Customer → cannot access another customer's order
Customer → cannot access the kitchen
Staff → can access the kitchen
```

Being signed in does not automatically mean a user can access everything.

---

## Session Data

The session contains only the information the server needs:

```js
{
  id,
  name,
  email,
  role
}
```

The session ID is stored in the browser as a cookie.

The actual session data remains in the server-side session store.

---

## Why the Client Does Not Get the Session Store

The session store contains authentication information.

It should never be sent to the browser.

Instead, the browser sends the session cookie with requests and the server looks up the corresponding session.

Conceptually:

```text
Browser
   │
   │ session cookie
   ↓
Server
   │
   │ session ID lookup
   ↓
Session Store
   │
   ↓
Current User
```

---

## `next` Redirect Safety

The sign-in page accepts a `next` parameter so users can return to the page they originally wanted.

Example:

```text
/signin?next=/checkout
```

After successful authentication, the user can return to:

```text
/checkout
```

However, external URLs are rejected.

For example:

```text
https://evil.com
```

and:

```text
//evil.com
```

are not accepted as redirect destinations.

If an unsafe value is supplied, the application redirects to:

```text
/
```

This prevents an open redirect.

---

## Important Rule

The most important boundary in Day 42 is not:

```text
Client vs Server
```

It is:

```text
Untrusted request
        ↓
Server authentication
        ↓
Server authorization
        ↓
Protected operation
```

The browser controls the UI.

The server controls access.
