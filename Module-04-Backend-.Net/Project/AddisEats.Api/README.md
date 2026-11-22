# Addis Eats API

Permanent capstone project for the IBT Software Development .NET (C#) Backend Track.

Built using ASP.NET Core Web API and .NET 8.

## Features

- Attribute-based routing
- Route constraints
- Restaurant search and filtering
- Multi-value area filtering
- Nullable maximum delivery fee filtering
- Pagination
- Typed API responses
- Orders GET, POST and PATCH endpoints
- CreatedAtAction and HTTP 201 responses
- Consistent paged collection responses
- camelCase JSON serialization
- Null property omission
- String enum serialization
- Dependency injection
- In-memory data stores
- CORS for the React frontend
- Swagger documentation

## Project Structure

```text
AddisEats.Api/
+-- Controllers/
¦   +-- RestaurantsController.cs
¦   +-- OrdersController.cs
+-- Data/
¦   +-- RestaurantStore.cs
¦   +-- MenuStore.cs
¦   +-- OrderStore.cs
+-- Models/
¦   +-- Restaurant.cs
¦   +-- MenuItem.cs
¦   +-- Order.cs
¦   +-- Queries/
¦   ¦   +-- RestaurantQuery.cs
¦   +-- Dtos/
¦       +-- RestaurantDto.cs
¦       +-- OrderDto.cs
¦       +-- PagedResult.cs
¦       +-- MappingExtensions.cs
+-- Services/
+-- Program.cs
+-- AddisEats.Api.http
+-- README.md
```

## Run the project

Requirements: .NET 8 SDK.

```bash
dotnet restore
dotnet run --no-launch-profile --urls http://localhost:5217
```

Swagger:

`http://localhost:5217/swagger`

## Route Table

| Method | Route | Constraints | Success | Failure |
|---|---|---|---|---|
| GET | `/api/v1/restaurants` | None | 200 | 400 for invalid query binding |
| GET | `/api/v1/restaurants/{id}` | `int`, `min(1)` | 200 | 404 |
| GET | `/api/v1/restaurants/{id}/menu` | `int`, `min(1)` | 200 | 404 |
| GET | `/api/v1/orders/{id}` | `int`, `min(1)` | 200 | 404 |
| POST | `/api/v1/orders` | Request body | 201 | 400 for invalid body binding |
| PATCH | `/api/v1/orders/{id}/status` | `int`, `min(1)` | 200 | 404 |

## Restaurant Query Parameters

The collection endpoint accepts a RestaurantQuery object using `[FromQuery]`.

| Parameter | Type | Default | Description |
|---|---|---|---|
| area | string? | null | Filter by one area |
| areas | List<string> | Empty list | Filter by multiple areas |
| maxFeeEtb | decimal? | null | Maximum delivery fee |
| page | int | 1 | Page number |
| limit | int | 20 | Results per page |

Examples:

`GET /api/v1/restaurants?area=Bole`

`GET /api/v1/restaurants?areas=Bole&areas=Piassa`

`GET /api/v1/restaurants?maxFeeEtb=45`

`GET /api/v1/restaurants?areas=Bole&areas=Piassa&page=1&limit=5`

Repeated `areas` query keys are bound to a list. When no areas are supplied, the list filter is not applied.

## Collection Response

Restaurant collections use the PagedResult envelope:

```json
{
  "data": [],
  "page": 1,
  "pageSize": 20,
  "total": 12
}
```

Results are ordered alphabetically before pagination.

## Restaurant Endpoints

### GET /api/v1/restaurants

Returns restaurants with optional filtering and pagination.

Success: `200 OK`.

### GET /api/v1/restaurants/{id}

Returns a single restaurant DTO.

Success: `200 OK`.

Failure: `404 Not Found` when the restaurant is not found or the route constraint fails.

### GET /api/v1/restaurants/{id}/menu

Returns menu items belonging to an existing restaurant.

Success: `200 OK`, including an empty array when the restaurant exists but has no menu items.

Failure: `404 Not Found` when the restaurant does not exist.

## Order Endpoints

### GET /api/v1/orders/{id}

Returns an order by ID.

Success: `200 OK`.

Failure: `404 Not Found`.

### POST /api/v1/orders

Creates an order.

Example request:

```json
{
  "restaurantId": 1,
  "area": "Bole",
  "qty": 2
}
```

Success: `201 Created`.

The response includes a Location header pointing to the new order resource using CreatedAtAction and nameof(GetOne).

### PATCH /api/v1/orders/{id}/status

Updates an existing order status.

Example request:

```json
{
  "status": "Preparing"
}
```

Success: `200 OK`.

Failure: `404 Not Found`.

## JSON Serialization

Program.cs explicitly configures:

- camelCase property naming
- omission of null properties
- enums serialized as strings

Example enum JSON value: `"Preparing"`.

## Route Constraints

All ID route segments use `:int:min(1)`.

Invalid paths such as `/api/v1/restaurants/abc` and `/api/v1/orders/0` do not match their routes and return 404.

Route constraints determine whether a URL can match an endpoint. They are not business-rule validation.

## Ambiguous Routes

Two routes such as `{id}` and `{slug}` have the same route shape and can produce an AmbiguousMatchException.

Two solutions:

1. Add a constraint, such as `{id:int}`.
2. Use a distinct literal segment, such as `by-slug/{slug}`.

The actual API uses constrained ID routes and distinct resource paths.

## CORS

The `frontend` policy allows:

`http://localhost:5173`

Any HTTP header and method are permitted from that origin.

## Data Storage

This capstone currently uses in-memory data stores. Data is reset when the application restarts.

Restaurant 12 intentionally has no menu items to demonstrate the difference between a missing restaurant and an existing restaurant with an empty menu.

The order store starts with order ID 1 for GET and PATCH demonstrations.

## Future Development

This is the permanent Addis Eats capstone project. Future backend track days will extend this same codebase.
