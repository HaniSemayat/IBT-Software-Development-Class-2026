# Addis Eats — REST API Endpoint Design

**Project:** Addis Eats  
**Program:** CodeOps — Full Stack Software Development  
**Module:** 4 — Backend Track  
**Day:** 51  
**API Version:** v1  
**Base URL:** `https://api.addiseats.et/api/v1`

---

## 1. Overview

Addis Eats is a food ordering platform that connects customers with restaurants. Customers can browse restaurants, explore menus, place orders and make payments. Restaurant owners can manage their menus, while authorized users can manage order statuses.

This document defines the REST API contract for Addis Eats, including endpoint paths, HTTP methods, purposes, successful response codes and likely failure response codes.

## 2. API Design Principles

The API follows these REST conventions:

- All endpoints use the `/api/v1` version prefix.
- Resource names are nouns rather than action-based paths.
- Collection names use plural nouns.
- Resource identifiers are included in the path.
- Filters and pagination parameters are included in the query string.
- JSON is used for request and response bodies.
- Appropriate HTTP status codes communicate the result of each request.
- Authentication is required for protected operations.

## 3. Endpoint Table

### A. Restaurants

| Method | Endpoint | Purpose | Success | Likely failure |
|---|---|---|---:|---:|
| GET | `/restaurants` | Retrieve a paginated list of restaurants, optionally filtered by area. | 200 | 400 |
| GET | `/restaurants/{id}` | Retrieve details of a specific restaurant. | 200 | 404 |
| POST | `/restaurants` | Register a new restaurant. | 201 | 400 |

Example filtering and pagination:

```http
GET /api/v1/restaurants?area=Bole&page=1&pageSize=20
```

### B. Menus

| Method | Endpoint | Purpose | Success | Likely failure |
|---|---|---|---:|---:|
| GET | `/restaurants/{id}/menu` | Retrieve the menu belonging to a specific restaurant. | 200 | 404 |
| POST | `/restaurants/{id}/menu/items` | Add a new menu item to a restaurant's menu. | 201 | 403 |
| PATCH | `/menu/items/{id}` | Update selected details of an existing menu item. | 200 | 404 |
| DELETE | `/menu/items/{id}` | Remove a menu item from the menu. | 204 | 403 |

Example filtering:

```http
GET /api/v1/restaurants/14/menu?category=tibs&page=1
```

### C. Orders

| Method | Endpoint | Purpose | Success | Likely failure |
|---|---|---|---:|---:|
| POST | `/orders` | Create a new food order for a restaurant. | 201 | 400 |
| GET | `/orders/{id}` | Retrieve details of a specific order. | 200 | 404 |
| GET | `/orders` | Retrieve the authenticated customer's orders. | 200 | 401 |
| PATCH | `/orders/{id}/status` | Update the status of an existing order. | 200 | 409 |
| DELETE | `/orders/{id}` | Cancel an order when its current status permits cancellation. | 204 | 409 |

Example order creation:

```http
POST /api/v1/orders
Content-Type: application/json

{
  "restaurantId": 14,
  "area": "Bole",
  "items": [
    {
      "menuItemId": 7,
      "qty": 2
    }
  ],
  "paymentMethod": "TeleBirr"
}
```

Example order status update:

```http
PATCH /api/v1/orders/91/status
Content-Type: application/json

{
  "status": "Preparing"
}
```

### D. Payments

| Method | Endpoint | Purpose | Success | Likely failure |
|---|---|---|---:|---:|
| POST | `/payments/telebirr` | Initiate a TeleBirr payment for an order. | 201 | 422 |
| GET | `/payments/{id}` | Retrieve the status and details of a payment. | 200 | 404 |

Example payment initiation:

```http
POST /api/v1/payments/telebirr
Content-Type: application/json

{
  "orderId": 91,
  "amountEtb": 530.50
}
```

### E. Authentication

| Method | Endpoint | Purpose | Success | Likely failure |
|---|---|---|---:|---:|
| POST | `/auth/register` | Register a new customer account. | 201 | 409 |
| POST | `/auth/login` | Authenticate a user and issue an access token. | 200 | 401 |
| POST | `/auth/logout` | End the current authenticated session. | 204 | 401 |

Example login request:

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "example-password"
}
```

---

## 4. Standard Response Formats

### Successful collection response

```json
{
  "data": [
    {
      "id": 14,
      "name": "Yod Abyssinia",
      "area": "Bole"
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 47
}
```

### Successful creation response

```json
{
  "id": 91,
  "status": "Placed",
  "totalEtb": 530.50
}
```

### Error response

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The request was invalid.",
    "details": [
      {
        "field": "qty",
        "issue": "must be 1 or greater"
      }
    ]
  }
}
```

The HTTP status code should match the outcome. Invalid client input must not be reported as an internal server error.

---

## 5. HTTP Status Code Conventions

| Status | Meaning | Example |
|---|---|---|
| 200 | OK | Successfully retrieving restaurant details. |
| 201 | Created | Successfully creating a new order. |
| 204 | No Content | Successfully cancelling an order without returning a body. |
| 400 | Bad Request | Malformed JSON or invalid request structure. |
| 401 | Unauthorized | Missing or expired authentication token. |
| 403 | Forbidden | Authenticated user lacks permission. |
| 404 | Not Found | Requested restaurant or order does not exist. |
| 409 | Conflict | Attempting to cancel an order that is already delivered. |
| 422 | Unprocessable Content | A semantically invalid payment amount. |
| 500 | Internal Server Error | Unexpected server-side failure. |
| 503 | Service Unavailable | Payment provider temporarily unavailable. |

---

## 6. Design Decisions

1. **Resource-oriented paths:** Endpoints use nouns such as `/restaurants`, `/orders` and `/payments`, rather than action names such as `/getOrders` or `/createOrder`.

2. **Plural collection names:** Collections use plural names to maintain consistency.

3. **Resource identifiers:** Individual resources are identified using path parameters, for example `/orders/91`.

4. **Query parameters:** Filtering and pagination use query parameters rather than additional action-based paths.

5. **Versioning:** All endpoints begin with `/api/v1` to allow future API changes without immediately breaking existing clients.

6. **Appropriate HTTP methods:** GET retrieves data, POST creates resources, PATCH modifies selected fields and DELETE removes or cancels resources.

7. **Authentication and authorization:** Protected operations require valid credentials and appropriate permissions.

8. **Consistent errors:** API errors use a predictable JSON structure and an appropriate HTTP status code.

---

## 7. Conclusion

This endpoint design establishes the initial REST API contract for Addis Eats. It defines how clients will communicate with the backend, how resources will be accessed and modified, and how successful and unsuccessful operations will be reported.

The design will guide the implementation of the Addis Eats backend throughout Module 4.

**Project:** Addis Eats REST API  
**Module:** 4 — Backend Track  
**Day:** 51 — Backend Fundamentals