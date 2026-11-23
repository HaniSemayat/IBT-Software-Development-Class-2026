# Day 58 — Validation & Error Handling

**Module:** Backend Development with ASP.NET Core  
**Project:** AddisEats API  
**Topic:** Validation, business rules, Result pattern, ProblemDetails, and exception middleware

---

## Learning objectives

- Apply validation at the correct API layer.
- Validate Ethiopian mobile numbers using a custom DataAnnotation.
- Validate ETB monetary amounts.
- Implement cross-property validation with `IValidatableObject`.
- Return expected business failures through `Result<T>` and `Error`.
- Calculate order prices on the server rather than trusting client totals.
- Handle unexpected exceptions centrally with middleware.
- Return consistent ProblemDetails responses with error codes and trace IDs.

## Exercise 1 — DTO validation

The order request uses DataAnnotations to validate incoming data before the controller executes business logic.

The request validates:

| Field | Validation |
|---|---|
| RestaurantId | Required and greater than zero |
| Area | Required, length 2–60, and a recognized delivery area |
| Phone | Required and valid Ethiopian mobile format |
| Items | Required and at least one order line |
| MenuItemId | Must be positive |
| Qty | Between 1 and 50 |
| Notes | Optional, maximum 300 characters |

The API uses custom validation messages so clients receive understandable feedback.

Validation occurs before the order service is called. Invalid model state is converted into HTTP 400 ProblemDetails with code `VALIDATION_FAILED`.

## Exercise 2 — Ethiopian mobile validation

The custom `EthiopianMobileAttribute` accepts the following formats:

- `09xxxxxxxx`
- `07xxxxxxxx`
- `+2519xxxxxxxx`
- `+2517xxxxxxxx`

The validation pattern is:

```regex
^(?:\+251|0)(?:9|7)\d{8}$
```

### Valid test cases

| Number | Expected |
|---|---|
| `0912345678` | Valid |
| `0712345678` | Valid |
| `+251912345678` | Valid |
| `+251712345678` | Valid |

### Invalid test cases

| Number | Expected |
|---|---|
| `12345` | Invalid |
| `0812345678` | Invalid |
| `+251812345678` | Invalid |
| `091234567` | Invalid |

The custom attribute returns the message:

`Enter a valid Ethiopian mobile number.`

## Exercise 3 — ETB amount validation

`EtbAmountAttribute` validates monetary values. A valid amount must:

1. Be a decimal value.
2. Be greater than zero.
3. Have no more than two decimal places.

Examples:

| Amount | Expected |
|---:|---|
| 480.50 | Valid |
| 480.505 | Invalid |
| 0 | Invalid |
| -10.00 | Invalid |

The attribute is applied to server-held monetary properties such as menu item prices and restaurant delivery fees.

A simple validation example:

```csharp
using System.ComponentModel.DataAnnotations;

public class PaymentExample
{
    [EtbAmount]
    public decimal Amount { get; set; }
}

var valid = new PaymentExample { Amount = 480.50m };
var invalid = new PaymentExample { Amount = 480.505m };

bool IsValid(object model)
{
    var context = new ValidationContext(model);
    var errors = new List<ValidationResult>();

    return Validator.TryValidateObject(
        model,
        context,
        errors,
        validateAllProperties: true
    );
}

Console.WriteLine(IsValid(valid));   // True
Console.WriteLine(IsValid(invalid)); // False
```

The service validates server-held prices before using them in order calculations.

## Exercise 4 — Cross-property validation

`CreateOrderRequest` implements `IValidatableObject`.

The scheduling rule is:

- If `IsScheduled` is true, `ScheduledFor` must be supplied.
- If `IsScheduled` is false, `ScheduledFor` must not be supplied.

A normal property-level validation attribute cannot conveniently enforce this rule because the validation depends on the value of another property.

`IValidatableObject.Validate()` receives the complete object and can inspect multiple properties together.

## Exercise 5 — Result pattern and business errors

The API uses:

- `Error`: contains an error code, message, and HTTP status.
- `Result<T>`: represents either a successful value or an expected business failure.

This avoids using exceptions for normal business outcomes.

Examples of business error mappings:

| Code | HTTP status | Meaning |
|---|---:|---|
| RESTAURANT_NOT_FOUND | 404 | Restaurant does not exist |
| RESTAURANT_CLOSED | 409 | Restaurant cannot accept orders |
| MENU_ITEM_NOT_FOUND | 404 | Menu item does not exist |
| MENU_ITEM_NOT_IN_RESTAURANT | 422 | Menu item belongs to another restaurant |
| TOO_MANY_OPEN_ORDERS | 409 | Phone number already has five open orders |
| ORDER_NOT_FOUND | 404 | Requested order does not exist |
| ORDER_ALREADY_DELIVERED | 409 | Delivered order cannot be cancelled |

Services return results. Controllers translate failed results into HTTP ProblemDetails responses.

## Exercise 6 — Server-side order totals

The client sends:

- Restaurant ID
- Delivery area
- Phone number
- Menu item IDs
- Quantities
- Optional notes and scheduling details

The client does **not** send `subtotalEtb`, `deliveryFeeEtb`, or `totalEtb`.

The server obtains menu prices and restaurant delivery fees from its own data, validates those values, and calculates:

```text
Line total = Unit price × Quantity

Subtotal = Sum of all line totals

Total = Subtotal + Delivery fee
```

The API uses strict JSON deserialization with unmapped-member rejection. Therefore, an unknown client property such as `totalEtb` is rejected rather than silently ignored.

### Actual HTTP test

A request containing `totalEtb: 1` returned:

- HTTP 400
- Error code `VALIDATION_FAILED`
- JSON error identifying the unknown `totalEtb` property

A normal request for two units of menu item 1 returned HTTP 201.

Actual server calculation:

| Calculation | Amount |
|---|---:|
| Menu item price | 180 ETB |
| Quantity | 2 |
| Subtotal | 360 ETB |
| Delivery fee | 45 ETB |
| **Total** | **405 ETB** |

The client cannot override these calculations.

## Exercise 7 — Global exception middleware

`ExceptionHandlingMiddleware` centralizes unexpected exception handling.

The middleware logs exceptions and returns consistent ProblemDetails responses. It includes a trace ID so an error can be investigated without exposing internal details.

Exception mappings:

| Exception | HTTP status | Error code |
|---|---:|---|
| ArgumentException | 400 | BAD_ARGUMENT |
| UnauthorizedAccessException | 403 | FORBIDDEN |
| NotFoundException | 404 | Resource-specific code |
| PaymentDeclinedException | 402 | PAYMENT_DECLINED |
| GatewayUnreachableException | 503 | UPSTREAM_DOWN |
| Unhandled exception | 500 | INTERNAL_ERROR |

The 500 response does not expose the exception message or stack trace.

The diagnostic exception endpoints used in the HTTP exercise are development-only and are not intended to be enabled in production.

## Exercise 8 — HTTP error catalogue verification

The following eight scenarios were exercised against the running API.

| Error code | Expected HTTP | Actual HTTP | Result |
|---|---:|---:|---|
| VALIDATION_FAILED | 400 | 400 | PASS |
| RESTAURANT_NOT_FOUND | 404 | 404 | PASS |
| RESTAURANT_CLOSED | 409 | 409 | PASS |
| MENU_ITEM_NOT_IN_RESTAURANT | 422 | 422 | PASS |
| TOO_MANY_OPEN_ORDERS | 409 | 409 | PASS |
| PAYMENT_DECLINED | 402 | 402 | PASS |
| UPSTREAM_DOWN | 503 | 503 | PASS |
| INTERNAL_ERROR | 500 | 500 | PASS |

### 1. VALIDATION_FAILED — HTTP 400

```json
{
  "type": "https://addiseats.et/errors/validation_failed",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "detail": "The request contains invalid or missing values.",
  "instance": "/api/v1/orders",
  "code": "VALIDATION_FAILED",
  "traceId": "0HNQ9HD8RP74B:00000001",
  "errors": {
    "Phone": [
      "Enter a valid Ethiopian mobile number."
    ],
    "Items[0].Qty": [
      "Each item quantity must be between 1 and 50."
    ]
  }
}
```

### 2. RESTAURANT_NOT_FOUND — HTTP 404

```json
{
  "type": "https://addiseats.et/errors/restaurant_not_found",
  "title": "RESTAURANT NOT FOUND",
  "status": 404,
  "detail": "Restaurant 999 was not found.",
  "instance": "/api/v1/orders",
  "code": "RESTAURANT_NOT_FOUND",
  "traceId": "0HNQ9HD8RP74B:00000002"
}
```

### 3. RESTAURANT_CLOSED — HTTP 409

```json
{
  "type": "https://addiseats.et/errors/restaurant_closed",
  "title": "RESTAURANT CLOSED",
  "status": 409,
  "detail": "This restaurant is currently closed and cannot accept orders.",
  "instance": "/api/v1/orders",
  "code": "RESTAURANT_CLOSED",
  "traceId": "0HNQ9HD8RP74B:00000003"
}
```

### 4. MENU_ITEM_NOT_IN_RESTAURANT — HTTP 422

```json
{
  "type": "https://addiseats.et/errors/menu_item_not_in_restaurant",
  "title": "MENU ITEM NOT IN RESTAURANT",
  "status": 422,
  "detail": "Menu item 7 does not belong to restaurant 1.",
  "instance": "/api/v1/orders",
  "code": "MENU_ITEM_NOT_IN_RESTAURANT",
  "traceId": "0HNQ9HD8RP74B:00000004"
}
```

### 5. TOO_MANY_OPEN_ORDERS — HTTP 409

Five open orders were created for the same phone number. The sixth attempt was rejected.

```json
{
  "type": "https://addiseats.et/errors/too_many_open_orders",
  "title": "TOO MANY OPEN ORDERS",
  "status": 409,
  "detail": "This phone number already has five open orders.",
  "instance": "/api/v1/orders",
  "code": "TOO_MANY_OPEN_ORDERS",
  "traceId": "0HNQ9HD8RP74B:0000000A"
}
```

### 6. PAYMENT_DECLINED — HTTP 402

```json
{
  "type": "https://addiseats.et/errors/payment_declined",
  "title": "Payment declined",
  "status": 402,
  "detail": "The payment provider declined this payment.",
  "instance": "/api/v1/dev/errors/payment",
  "code": "PAYMENT_DECLINED",
  "traceId": "0HNQ9HI7H8KCM:00000001"
}
```

### 7. UPSTREAM_DOWN — HTTP 503

```json
{
  "type": "https://addiseats.et/errors/upstream_down",
  "title": "Service unavailable",
  "status": 503,
  "detail": "A required external service is temporarily unavailable.",
  "instance": "/api/v1/dev/errors/gateway",
  "code": "UPSTREAM_DOWN",
  "traceId": "0HNQ9HI7H8KCM:00000002"
}
```

### 8. INTERNAL_ERROR — HTTP 500

```json
{
  "type": "https://addiseats.et/errors/internal_error",
  "title": "Internal server error",
  "status": 500,
  "detail": "An unexpected error occurred. Contact support with the trace ID.",
  "instance": "/api/v1/dev/errors/unexpected",
  "code": "INTERNAL_ERROR",
  "traceId": "0HNQ9HI7H8KCM:00000003"
}
```

## Additional pricing verification

### Client-supplied total rejected

A request containing `totalEtb: 1` returned HTTP 400:

```json
{
  "type": "https://addiseats.et/errors/validation_failed",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "detail": "The request contains invalid or missing values.",
  "instance": "/api/v1/orders",
  "code": "VALIDATION_FAILED",
  "traceId": "0HNQ9HI7H8KCO:00000003",
  "errors": {
    "request": [
      "The request field is required."
    ],
    "$.totalEtb": [
      "The JSON property 'totalEtb' could not be mapped to any .NET member contained in type 'AddisEats.Api.Models.Dtos.CreateOrderRequest'."
    ]
  }
}
```

### Server-calculated total accepted

A normal order with two units returned HTTP 201:

```json
{
  "id": 3,
  "restaurantId": 1,
  "area": "Bole",
  "phone": "0912345679",
  "items": [
    {
      "menuItemId": 1,
      "name": "Special Firfir",
      "qty": 2,
      "unitPriceEtb": 180,
      "lineTotalEtb": 360
    }
  ],
  "subtotalEtb": 360,
  "deliveryFeeEtb": 45,
  "totalEtb": 405,
  "isScheduled": false,
  "status": "Placed"
}
```

## Conclusion

Day 58 demonstrates layered request validation, custom validation attributes, cross-field validation, predictable business failures, server-side price calculation, and centralized exception handling.

The eight main HTTP error scenarios returned their expected status codes and consistent error codes. The pricing tests also confirmed that client-supplied totals are rejected and valid totals are calculated by the server.
