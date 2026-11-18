# Day 51 — Backend Fundamentals: Exercises

**Program:** CodeOps — Full Stack Software Development  
**Module:** 4 — Backend Track  
**Day:** 51  
**Track:** .NET / C#

---

## Exercise 1 — What Is a Server?

A server is a program that waits for requests and provides responses to other programs or users. Think of it like a restaurant: customers make requests, the restaurant receives them, processes their orders, and sends back what they requested. A server keeps running and listening for incoming requests instead of completing one task and immediately closing. It can provide services such as displaying restaurant menus, processing orders, or handling payments. Every request receives a response, allowing different applications to communicate and exchange information.

---

## Exercise 2 — Inspecting HTTP Requests

**Website/API inspected:** JSONPlaceholder — https://jsonplaceholder.typicode.com

I used the browser's Developer Tools Network tab to inspect HTTP requests and their responses.

| Request | Method | Full path | Expected status | Request body? |
|---|---|---|---:|---|
| Retrieve all posts | GET | `https://jsonplaceholder.typicode.com/posts` | 200 OK | No |
| Retrieve post 1 | GET | `https://jsonplaceholder.typicode.com/posts/1` | 200 OK | No |
| Create a post | POST | `https://jsonplaceholder.typicode.com/posts` | 201 Created | Yes |

**Observations:**

1. GET requests retrieve information from the server and do not require a request body.
2. POST requests send data to the server, usually in JSON format, to create a resource.
3. The HTTP status code indicates the outcome of each request.

**Evidence note:** These are the expected responses for the three JSONPlaceholder endpoints. The actual requests should be opened in the browser Network tab and checked before submission. Record any differences you observe.

---

## Exercise 3 — Understanding HTTP Headers

**Selected request:** GET `/posts/1`  
**Website/API:** JSONPlaceholder

### A. Request Headers

| Header | Purpose |
|---|---|
| Host | Identifies the server receiving the request. |
| Accept | Specifies the response formats the client can accept. |
| User-Agent | Identifies the browser or client making the request. |
| Accept-Language | Indicates the preferred language for the response. |

### B. Response Headers

| Header | Purpose |
|---|---|
| Content-Type | Indicates the format of the returned response body, such as JSON. |
| Content-Length | Indicates the size of the response body in bytes, when supplied. |
| Cache-Control | Provides instructions about caching the response. |
| Access-Control-Allow-Origin | Indicates which origins are allowed to access the resource through browser cross-origin requests, when supplied. |

**Observation:**

Headers provide metadata about HTTP requests and responses. They describe the communication, while the body contains the actual resource data.

**Evidence note:** Header names and values can vary depending on the browser, request and server. Verify the actual headers in the Network tab and replace any headers in this example that were not present in your selected request.

---

## Exercise 4 — Writing a Complete HTTP POST Request

**Scenario:** Create an order for two portions of menu item 7 at restaurant 14 in Bole, paid through TeleBirr.

### HTTP Request

```http
POST /api/v1/orders HTTP/1.1
Host: api.addiseats.et
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOi...

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

### Explanation

- **POST:** Requests the creation of a new order.
- **Path:** `/api/v1/orders` identifies the orders collection.
- **Host:** Identifies the API server.
- **Content-Type:** Specifies that the request body contains JSON.
- **Accept:** Indicates that the client expects a JSON response.
- **Authorization:** Sends the authentication token.
- **JSON body:** Contains the restaurant, delivery area, menu item, quantity and payment method.

**Expected successful response:** `201 Created`

---

## Exercise 5 — Choosing HTTP Status Codes

| Scenario | Correct status | Justification |
|---|---:|---|
| (a) A list of restaurants is returned. | **200 OK** | The request was successful and the restaurant collection was returned. |
| (b) An order is created. | **201 Created** | A new order resource was successfully created. |
| (c) An order is cancelled and nothing is returned. | **204 No Content** | The cancellation succeeded and there is no response body. |
| (d) The quantity field arrives as `"two"`. | **400 Bad Request** | The request contains an invalid value where a number is expected. |
| (e) The authentication token has expired. | **401 Unauthorized** | The client must provide valid authentication credentials. |
| (f) A courier attempts to edit a menu. | **403 Forbidden** | The courier is authenticated but does not have permission to edit menus. |
| (g) Someone requests order 99999, which does not exist. | **404 Not Found** | The requested order resource cannot be found. |
| (h) The application throws an unhandled exception. | **500 Internal Server Error** | An unexpected server-side error prevented the request from completing. |

### Important distinction: 401 vs 403

- **401 Unauthorized:** The server cannot authenticate the user because valid credentials are missing or invalid.
- **403 Forbidden:** The server knows who the user is, but that user does not have permission to perform the requested action.

---

## Exercise 6 — Exploring a Public API Contract

**Selected API:** JSONPlaceholder  
**Website:** https://jsonplaceholder.typicode.com

JSONPlaceholder is a free fake REST API used for testing and learning. It provides sample resources such as posts, comments, albums and users.

### Three things its API contract promises

**1. Resource retrieval through GET requests**

The API provides endpoints such as:

```http
GET /posts
GET /posts/1
```

These endpoints allow clients to retrieve a collection of posts or an individual post.

**2. Resource creation through POST requests**

The API supports:

```http
POST /posts
```

A client can submit a JSON body containing post information, such as a title, body and user ID. The API simulates creating a post and returns a successful creation response.

**3. A predictable JSON response structure**

The API returns post resources with fields such as:

```json
{
  "userId": 1,
  "id": 1,
  "title": "Sample post title",
  "body": "Sample post content"
}
```

This predictable structure makes it easier for clients to understand and process the returned data.

### One undocumented or important detail I would want to know

Before depending on this API in a real application, I would want to know whether data submitted through POST requests is permanently stored.

JSONPlaceholder simulates write operations, but changes are not actually persisted on its server. This means a newly created post cannot be relied upon as permanent data.

### Conclusion

An API contract defines the available endpoints, supported HTTP methods, request formats, response structures and expected behavior. Understanding these promises helps developers build reliable applications that communicate correctly with backend services.

---

## Final Summary

Through these exercises, I practiced:

- Understanding the client/server model.
- Identifying HTTP methods and request structures.
- Inspecting HTTP headers.
- Writing JSON-based POST requests.
- Selecting appropriate HTTP status codes.
- Understanding API contracts and REST principles.