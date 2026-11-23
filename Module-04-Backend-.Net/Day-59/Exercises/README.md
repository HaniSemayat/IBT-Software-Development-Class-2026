# Day 59 — Middleware Pipeline and Filters

## Learning Objectives

- Understand the ASP.NET Core middleware pipeline.
- Create convention-based middleware.
- Understand `Use`, `Run`, and `Map`.
- Understand middleware lifetimes and scoped dependencies.
- Apply MVC action filters.
- Understand authentication and authorization ordering.

---

## Exercise 1 — Correlation ID Middleware

**Goal:** Give every HTTP request a unique identifier that can be used to trace it through the application.

**Implementation:** `Middleware/CorrelationIdMiddleware.cs`

The middleware:

- Reads the incoming `X-Correlation-Id` header.
- Accepts a valid supplied ID.
- Generates a new ID when the header is missing or invalid.
- Assigns the ID to `HttpContext.TraceIdentifier`.
- Returns the ID in the response header.
- Adds the ID to the logging scope.

### Test Results

| Test | Actual Result | Status |
|---|---|---|
| Supplied `day59-test-123` | Returned `day59-test-123` | Passed |
| No incoming ID | Generated `72336a7279ae43f0ba42c0765dbb4196` | Passed |

Both requests returned HTTP 200.

---

## Exercise 2 — Request Timing Middleware

**Goal:** Measure how long each HTTP request takes.

**Implementation:** `Middleware/RequestTimingMiddleware.cs`

The middleware:

- Starts a stopwatch for each request.
- Registers an `OnCompleted` callback.
- Logs the HTTP method, request path, final response status, elapsed time, and correlation ID.
- Uses the Warning log level when execution exceeds 1,000 milliseconds.
- Uses the Information log level otherwise.

The completion callback is useful because the outer exception-handling middleware may change the final response status after downstream middleware finishes.

**Verification:** HTTP requests completed successfully. Server-side timing log evidence still needs to be inspected.

---

## Exercise 3 — Register Middleware in the Pipeline

The correlation ID and request timing middleware are registered in `Program.cs`.

The intended pipeline relationship is:

1. Exception handling
2. Correlation ID
3. Request timing
4. Routing and the remaining middleware
5. Endpoint execution

The correlation ID is established before downstream processing so that it can be used by later middleware and error responses.

Middleware registration order matters because each component can inspect, modify, or handle the request before passing it to the next component.

---

## Exercise 4 — API Key Middleware with `Map`

**Implementation:** `Middleware/ApiKeyMiddleware.cs`

The `/admin` branch requires an `X-Api-Key` request header.

**Demonstration API key:** `day59-demo-key`

### Test Results

| Request | Expected Status | Actual Status |
|---|---:|---:|
| `GET /admin` without an API key | 401 | 401 |
| `GET /admin` with a valid API key | 200 | 200 |

Successful response:

```text
Admin branch reached.
```

The middleware short-circuits the request when the API key is missing or invalid. The `Map` method creates a separate pipeline branch for `/admin`, rather than applying this API key requirement to every API endpoint.

**Security note:** The demonstration key is not a production secret. Production applications should use secure configuration or a secret manager.

---

## Exercise 5 — Scoped Dependencies and Middleware Lifetimes

Convention-based middleware is constructed once and reused across requests. Its constructor dependencies must therefore be safe for that lifetime.

A scoped service should not be injected into a conventional middleware constructor:

```csharp
public ExampleMiddleware(
    RequestDelegate next,
    ScopedRequestService service)
{
    _next = next;
    _service = service;
}
```

This can cause a scoped-service-from-root-provider exception when scope validation is enabled. Without validation, the service may be retained beyond its intended request scope.

### Correct Approach

Inject the scoped service into `InvokeAsync`:

```csharp
public async Task InvokeAsync(
    HttpContext context,
    ScopedRequestService service)
{
    // Use the request-scoped service here.
    await _next(context);
}
```

ASP.NET Core resolves the `InvokeAsync` parameter from the current request scope.

**Experiment status:** The correct lifetime pattern is documented. A separate runtime demonstration is still pending.

---

## Exercise 6 — Authentication and Authorization Ordering

Authentication identifies the caller and populates `HttpContext.User`.

Authorization evaluates whether the authenticated user is allowed to access the selected endpoint.

Therefore, authentication must run before authorization:

```csharp
app.UseAuthentication();
app.UseAuthorization();
```

If authorization runs before authentication, it evaluates the request before authentication middleware has populated the user. A request with otherwise valid credentials can consequently be rejected.

**Experiment status:** Pipeline ordering and its expected behavior are documented. A runtime comparison requires a configured authentication scheme and a protected endpoint, which are not yet configured in this capstone.

---

## Exercise 7 — MVC Audit Action Filter

**Implementation:** `Filters/AuditActionFilter.cs`

The filter implements `IActionFilter` and records:

- The controller action being executed.
- The action arguments.
- Whether the action completed with an exception.

### Why Use an Action Filter?

An action filter is appropriate because it can inspect MVC-specific information, including action metadata and bound action arguments.

Middleware operates at the HTTP request/response level and does not naturally provide the same MVC-specific context.

**Security note:** Avoid logging passwords, tokens, payment details, or other sensitive action arguments in production.

**Verification:** The filter is registered globally for controller actions. Actual server-side audit log evidence still needs to be inspected.

---

## Exercise 8 — Document the Middleware Pipeline

The capstone `Program.cs` contains the middleware pipeline configuration and comments explaining the order.

Important concepts:

- **Use:** Runs middleware that can perform work before and after calling the next component.
- **Run:** Registers terminal middleware that does not call another component.
- **Map:** Creates a separate pipeline branch for a matching path.
- **MapControllers:** Maps controller endpoints.
- **Middleware order:** Determines what each component can observe, modify, or handle.

The exception-handling middleware should be registered early so it can catch exceptions from downstream components.

The correlation ID middleware should run before request processing that needs the ID for tracing.

---

## Test Evidence Summary

| Feature | Evidence | Status |
|---|---|---|
| Incoming correlation ID | `day59-test-123` returned | Passed |
| Generated correlation ID | Generated ID returned | Passed |
| Admin API key rejection | HTTP 401 | Passed |
| Admin API key acceptance | HTTP 200 and branch response | Passed |
| Restaurants endpoint | HTTP 200 | Passed |
| Request timing log | Terminal inspection pending | Pending |
| Audit filter log | Terminal inspection pending | Pending |
| Scoped dependency experiment | Runtime demonstration pending | Pending |
| Authentication ordering experiment | Runtime demonstration pending | Pending |

---

## Capstone Project

The implementation for this lesson is located at:

`Module-04-Backend-.Net/Project/AddisEats.Api`

The capstone and exercises are maintained separately so that each can be committed independently.

## Conclusion

This lesson demonstrates how middleware components work together to process HTTP requests, how middleware order affects application behavior, how to handle request-scoped dependencies correctly, and how MVC action filters provide access to controller-specific execution details.ye