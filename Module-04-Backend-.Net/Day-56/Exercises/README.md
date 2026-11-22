# Day 56 - Routing & Controllers Exercises

**Track:** .NET (C#)
**Module:** 4 - Backend
**Week:** 12
**Project:** Addis Eats API

All exercises are implemented against the permanent Addis Eats capstone project.

Permanent project: [AddisEats.Api](../../Project/AddisEats.Api/)

---

## Exercise 1 - Route Constraints

Added `:int:min(1)` constraints to restaurant ID route segments.

Examples:

- `GET /api/v1/restaurants/{id:int:min(1)}`
- `GET /api/v1/restaurants/{id:int:min(1)}/menu`

A request using `/api/v1/restaurants/abc` does not match the integer route and returns 404 Not Found.

## Exercise 2 - Route Parameter Binding

Route parameters are bound by matching the name in the route template to the method parameter.

Example:

```csharp
[HttpGet("{id:int}")]
public ActionResult<RestaurantDto> GetOne(int restaurantId)
```

The route provides `id`, but the method expects `restaurantId`. Without matching names or explicit binding, the method parameter does not receive the intended route value.

This is not a compile-time error because both names are valid C# identifiers. The compiler does not know that the parameter was intended to bind to a particular route segment.

The correct implementation uses matching names.

## Exercise 3 - RestaurantQuery

Created a RestaurantQuery class with:

- Area
- MaxFeeEtb
- Page
- Limit

The query is bound using `[FromQuery]` and passed to the restaurant service as one object.

## Exercise 4 - Multi-Area Filtering

Added an Areas list to RestaurantQuery.

Repeated query keys are supported:

`?areas=Bole&areas=Piassa`

The service returns restaurants matching either area.

When no areas are provided, the area-list filter is not applied, so all otherwise matching restaurants remain available.

## Exercise 5 - Ambiguous Routes

Two route templates such as `{id}` and `{slug}` can both match the same URL shape.

ASP.NET Core cannot select one action and reports an AmbiguousMatchException when the conflicting endpoints are registered.

Two ways to fix the ambiguity:

**Fix 1 - Route constraint**

```csharp
[HttpGet("{id:int}")]
```

The route now only matches integer IDs.

**Fix 2 - Distinct literal route**

```csharp
[HttpGet("by-slug/{slug}")]
```

The literal `by-slug` segment separates the route from the ID endpoint.

The permanent controller uses constrained ID routes and avoids ambiguous templates.

